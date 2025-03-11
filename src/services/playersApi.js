import API_BASE_URL from "./apiConfig";

export async function getPlayersByPrison(prisonID) {
    try {
        const response = await fetch(`${API_BASE_URL}/api/players?prisonID=${prisonID}`);
        if (!response.ok) throw new Error("Failed to fetch players");
        return await response.json();
    } catch (error) {
        console.error("Error fetching players:", error);
        return [];
    }
}
