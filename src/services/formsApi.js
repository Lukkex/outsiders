import API_BASE_URL from "./apiConfig";

export async function getSubmittedForms() {
    try {
        const response = await fetch(`${API_BASE_URL}/api/forms`);
        if (!response.ok) throw new Error("Failed to fetch forms");
        return await response.json();
    } catch (error) {
        console.error("Error fetching submitted forms:", error);
        return [];
    }
}

export async function filterSubmittedForms(prison, player) {
    try {
        const allForms = await getSubmittedForms();
        let filteredForms = allForms;

        if (prison) {
            filteredForms = filteredForms.filter(form => form.prison === prison);
        }
        if (player) {
            filteredForms = filteredForms.filter(form => form.player.toLowerCase().includes(player.toLowerCase()));
        }

        return filteredForms;
    } catch (error) {
        console.error("Error filtering forms:", error);
        return [];
    }
}
