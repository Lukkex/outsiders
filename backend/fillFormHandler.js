const express = require("express");
const cors = require("cors");

const app = express();
app.use(cors());
app.use(express.json());

app.post("/api/fillForm", (req, res) => {
    const { AccountID, formData } = req.body;
    if (!AccountID || !formData) {
        return res.status(400).json({ success: false, message: "Missing required fields." });
    }
    console.log("Received form submission:", req.body);
    res.json({ success: true, message: "Form submitted successfully!" });
});

const PORT = 5001;
app.listen(PORT, () => console.log(`Form submission mock server running on port ${PORT}`));
