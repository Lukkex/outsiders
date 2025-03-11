import API_BASE_URL from "./apiConfig";

export async function getUserList() {
    try {
        const response = await fetch(`${API_BASE_URL}/api/users`);
        if (!response.ok) throw new Error("Failed to fetch users");
        return await response.json();
    } catch (error) {
        console.error("Error fetching users:", error);
        return [];
    }
}

export async function getUser(user) {
    try {
        const response = await fetch(`${API_BASE_URL}/api/users/${user}`);
        if (!response.ok) throw new Error("Failed to fetch user");
        return await response.json();
    } catch (error) {
        console.error("Error fetching users:", error);
        return [];
    }
}