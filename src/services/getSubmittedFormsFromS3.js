import { list } from 'aws-amplify/storage';

export async function getSubmittedFormsFromS3() {
  const allForms = [];

  const users = await list('uploads/', { level: 'public' });
  for (const user of users.results) {
    if (user.key.endsWith('/')) {
      const email = user.key.split('/')[1];
      const dates = await list(`uploads/${email}/`, { level: 'public' });

      for (const dateFolder of dates.results) {
        if (dateFolder.key.endsWith('/')) {
          const date = dateFolder.key.split('/')[2];
          const files = await list(dateFolder.key, { level: 'public' });

          for (const file of files.results) {
            allForms.push({
              email,
              submittedAt: new Date(date.replace(/_/g, '-')),
              fileName: file.key.split('/').pop(),
              s3Key: file.key
            });
          }
        }
      }
    }
  }

  return allForms;
}
