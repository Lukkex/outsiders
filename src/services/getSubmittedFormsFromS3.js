import { list, getUrl } from '@aws-amplify/storage';

export async function getSubmittedFormsFromS3() {
  const allForms = [];

  try {
    console.log('Listing all from public/uploads/ (recursive)');
    let nextToken = null;
    let allItems = [];

    do {
      const { items, nextToken: newToken } = await list('uploads/', {
        level: 'public',
        pageSize: 1000,
        nextToken,
      });

      allItems = allItems.concat(items);
      nextToken = newToken;
    } while (nextToken);

    const pdfItems = allItems.filter(
      item =>
        item.key.endsWith('.pdf') &&
        /^uploads\/[^/]+\/\d{4}_\d{2}_\d{2}\/[^/]+\.pdf$/.test(item.key)
    );

    console.log('Raw keys:', pdfItems.map(i => i.key));

    for (const item of pdfItems) {
      const parts = item.key.split('/');
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
        console.warn('HEAD fetch failed for', item.key, err);
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
