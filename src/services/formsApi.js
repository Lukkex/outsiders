import { list } from '@aws-amplify/storage';

export async function getSubmittedFormsFromS3() {
  const allForms = [];

  try {
    const { items } = await list('uploads/', {
      level: 'public',
      pageSize: 1000,
    });

    console.log('📦 All S3 items:', items.map(i => i.key));

    for (const item of items) {
      const key = item.key;

      if (!key.endsWith('.pdf')) continue;
      if (!key.startsWith('uploads/')) continue;
      if (key.startsWith('uploads/formtemplates')) continue; // exclude templates

      const parts = key.split('/');

      // Match uploads/{email}/{date}/{filename}.pdf
      if (parts.length !== 4) continue;

      const [, email, date, fileName] = parts;

      allForms.push({
        email,
        submittedAt: new Date(date.replace(/_/g, '-')),
        fileName,
        formID: fileName.replace('.pdf', ''),
        s3Key: key,
        firstName: '',
        lastName: '',
        prison: '',
      });
    }

    console.log('✅ Final parsed forms:', allForms.map(f => f.s3Key));
    return allForms;
  } catch (err) {
    console.error('❌ Error fetching forms from S3:', err);
    return [];
  }
}
