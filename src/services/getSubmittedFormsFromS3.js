import { list, getUrl } from '@aws-amplify/storage';

export async function getSubmittedFormsFromS3() {
  const allForms = [];

  try {
    console.log('Listing all from public/uploads/ (recursive)');
    let nextToken = null;
    let allItems = [];

    allItems = await list({
      path: `uploads`
    });

    console.log(allItems);

    const pdfItems = allItems.items.filter(
      item =>
        item.path.endsWith('.pdf')
    );

    console.log(pdfItems);
    console.log('Raw keys:', pdfItems.map(i => i.path));

    for (const item of pdfItems) {
      const parts = item.path.split('/');
      const email = parts[1];
      const date = parts[2];
      const filename = parts[3];

      const nameWithoutExtension = filename.replace('.pdf', '');

      let firstName = '';
      let lastName = '';
      let metadataEmail = email;

      try {
        const { url } = await getUrl({
          path: item.key,
          options: { accessLevel: 'public', expiresIn: 60 }
        });

        const headRes = await fetch(url, { method: 'HEAD' });

        firstName = headRes.headers.get('x-amz-meta-firstname') || '';
        lastName = headRes.headers.get('x-amz-meta-lastname') || '';
        metadataEmail = headRes.headers.get('x-amz-meta-email') || email;

        console.log(`Fetched metadata from HEAD:`, { firstName, lastName, metadataEmail });
      } catch (err) {
        console.warn('HEAD fetch failed for', item.key, err);git
      }

      //Metadata from s3 is protected and forbidden to touch, so I added names to the pdf name itself and parsed from there
      const nameMatch = nameWithoutExtension.match(/ - ([a-zA-Z0-9]+)_([a-zA-Z0-9]+)$/);
      if (nameMatch) {
        firstName = firstName || nameMatch[1];
        lastName = lastName || nameMatch[2];
      }

      let formCode = '';
      const dashIndex = nameWithoutExtension.indexOf(' - ');
      if (dashIndex !== -1) {
        formCode = nameWithoutExtension.slice(0, dashIndex).trim();
      } else {
        formCode = nameWithoutExtension.split(' ')[0].trim();
      }

      if (filename.includes('Part A')) formCode = 'CDCR 2301 (A)';
      if (filename.includes('Part B')) formCode = 'CDCR 2301 (B)';

      allForms.push({
        email: metadataEmail,
        submittedAt: new Date(item.lastModified),
        filename,
        formID: nameWithoutExtension,
        formCode,
        s3Key: item.key,
        firstName,
        lastName,
        prison: '',
      });
    }

    console.log('Final parsed forms:', allForms.map(f => ({
      filename: f.filename,
      firstName: f.firstName,
      lastName: f.lastName,
    })));

    return allForms;
  } catch (err) {
    console.error('Error fetching forms from S3:', err);
    return [];
  }
}
