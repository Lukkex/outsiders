import { list, getProperties } from '@aws-amplify/storage';

export async function getSubmittedFormsFromS3() {
  const allForms = [];

  try {
    console.log('📂 Listing all from public/uploads/ (recursive)');
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

    console.log('📄 Raw keys:', pdfItems.map(i => i.key));

    for (const item of pdfItems) {
      const parts = item.key.split('/');
      const email = parts[1];
      const date = parts[2];
      const filename = parts[3];

      let firstName = '';
      let lastName = '';
      let metadataEmail = email;

      try {
        const { metadata } = await getProperties({
          path: item.key,
          options: { accessLevel: 'public' },
        });
        console.log(`📬 Metadata for ${item.key}:`, metadata);

        firstName = metadata?.firstName || '';
        lastName = metadata?.lastName || '';
        metadataEmail = metadata?.email || email;
      } catch (err) {
        console.warn('⚠️ No metadata found for', item.key, err);
      }

      let formCode = '';
      const nameWithoutExtension = filename.replace('.pdf', '');
      const dashIndex = nameWithoutExtension.indexOf(' - ');
      if (dashIndex !== -1) {
        formCode = nameWithoutExtension.slice(0, dashIndex).trim();
      } else {
        formCode = nameWithoutExtension.split(' ')[0].trim();
      }

      // Special naming logic for Part A and B of CDCR 2301
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

export async function filterSubmittedForms(prison, player) {
  try {
    const allForms = await getSubmittedFormsFromS3();
    let filtered = allForms;

    if (prison) {
      filtered = filtered.filter(form => form.prison === prison);
    }

    if (player) {
      filtered = filtered.filter(form =>
        `${form.firstName} ${form.lastName}`.toLowerCase().includes(player.toLowerCase())
      );
    }

    return filtered;
  } catch (err) {
    console.error("Error filtering forms:", err);
    return [];
  }
}
