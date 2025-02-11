const express = require("express");
const axios = require("axios");

const app = express();
app.use(express.json());

const BOT_TOKEN = "7909700744:AAFW9vb74CcR4ppzlwHfFSmloWjE4SfVEUI"; // ✅ अपना बॉट टोकन डालें

// ✅ Default Route
app.get("/", (req, res) => {
    res.send("✅ Broadcast API is running successfully!");
});

// ✅ Save & Broadcast Message to All Users
app.post("/save-broadcast", async (req, res) => {
    const { message, users } = req.body;
    if (!message || !users || !Array.isArray(users)) {
        return res.status(400).json({ error: "❌ Invalid data!" });
    }

    // ✅ सभी यूजर्स को Telegram Bot से मैसेज भेजें
    for (let userId of users) {
        try {
            await axios.post(`https://api.telegram.org/bot${BOT_TOKEN}/sendMessage`, {
                chat_id: userId,
                text: `📢 *Broadcast Message:*\n\n${message}`,
                parse_mode: "Markdown"
            });
        } catch (error) {
            console.log(`❌ Failed to send message to ${userId}`);
        }
    }

    res.json({ success: true, message: "✅ Broadcast sent to all users!" });
});

// ✅ Start Server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`🚀 Broadcast API running on port ${PORT}`);
});
