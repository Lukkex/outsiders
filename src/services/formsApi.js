import { fetchFormSubmissions } from './apiConfig'; // Import API calls from apiConfig.js

// Fetch submitted forms from DynamoDB via GraphQL API
export async function getSubmittedForms() {
    try {
        return await fetchFormSubmissions(); // Call the GraphQL function
    } catch (error) {
        console.error("Error fetching submitted forms:", error);
        return [];
    }
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
