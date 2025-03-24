import { list } from 'aws-amplify/storage';

export async function getSubmittedFormsFromS3() {
    const allForms = [];
  
    try {
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
                  formID: file.key.split('/').pop().replace('.pdf', ''),
                  s3Key: file.key,
                  firstName: '',
                  lastName: '',
                  prison: '',
                });
              }
            }
          }
        }
      }
    } catch (error) {
      console.error("Error fetching forms from S3:", error);
    }
  
    return allForms;
  }

// Filter submitted forms based on prison and player input
export async function filterSubmittedForms(prison, player) {
    try {
        const allForms = await getSubmittedForms(); // Fetch forms from API
        let filteredForms = allForms;

        if (prison) {
            filteredForms = filteredForms.filter(form => form.prisonLocation === prison);
        }
        if (player) {
            filteredForms = filteredForms.filter(form =>
                form.user.toLowerCase().includes(player.toLowerCase()) // Ensure case-insensitive search
            );
        }

        return filteredForms;
    } catch (error) {
        console.error("Error filtering forms:", error);
        return [];
    }
}
