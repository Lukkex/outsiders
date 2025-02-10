export async function submitForm(selectedPrison, formData) {
    try {
        const response = await fetch("http://localhost:5001/api/fillForm", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                AccountID: "test123",
                formData: { prison: selectedPrison, ...formData },
            }),
        });
        return await response.json();
    } catch (error) {
        console.error("Error submitting form:", error);
        return { success: false };
    }
}
