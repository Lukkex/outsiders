const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const { DynamoDBClient, ScanCommand, PutItemCommand } = require("@aws-sdk/client-dynamodb");
const serverless = require("serverless-http");

dotenv.config();
const app = express();
app.use(cors());
app.use(express.json());

const dynamoDB = new DynamoDBClient({ region: process.env.AWS_REGION });
const tableName = process.env.DYNAMODB_FORMS_TABLE;

// Get all submitted forms
app.get("/api/forms", async (req, res) => {
    try {
        const command = new ScanCommand({ TableName: tableName });
        const data = await dynamoDB.send(command);
        res.json(data.Items.map(item => ({
            formID: item.formID.S,
            prison: item.prison.S,
            player: item.player.S,
            submittedAt: item.submittedAt.S,
        })));
    } catch (error) {
        res.status(500).json({ error: "Failed to fetch forms" });
    }
});

// Submit a new form
app.post("/api/submitForm", async (req, res) => {
    try {
        const { selectedPrison, name, age, reason } = req.body;
        if (!selectedPrison || !name || !age || !reason) {
            return res.status(400).json({ error: "All fields are required" });
        }

        const command = new PutItemCommand({
            TableName: tableName,
            Item: {
                formID: { S: Date.now().toString() },
                prison: { S: selectedPrison },
                player: { S: name },
                age: { N: age.toString() },
                reason: { S: reason },
                submittedAt: { S: new Date().toISOString() }
            }
        });

        await dynamoDB.send(command);
        res.json({ success: true });
    } catch (error) {
        res.status(500).json({ error: "Form submission failed" });
    }
});

// Export for AWS Lambda
module.exports.handler = serverless(app);

// Local server for development
if (process.env.NODE_ENV !== "production") {
    const PORT = process.env.PORT || 5000;
    app.listen(PORT, () => console.log(`✅ Server running on port ${PORT}`));
}
