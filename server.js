const express = require("express");
const axios = require("axios");

const app = express();
app.use(express.json());

const BOT_TOKEN = "8002339671:AAFh6rt5VQ-M4jzVR6yNpSzR68hYncRgh6Q"; // ✅ अपना बॉट टोकन डालें

// ✅ Default Route
app.get("/", (req, res) => {
    res.send("✅ Broadcast API is running successfully!");
});

// ✅ Save & Broadcast Message to All Users (With Image)
app.post("/save-broadcast", async (req, res) => {
    const { message, image, users } = req.body;
    if (!message || !users || !Array.isArray(users)) {
        return res.status(400).json({ error: "❌ Invalid data!" });
    }

    for (let userId of users) {
        try {
            if (image) {
                // ✅ अगर इमेज है, तो फोटो के साथ मैसेज भेजें
                await axios.post(`https://api.telegram.org/bot${BOT_TOKEN}/sendPhoto`, {
                    chat_id: userId,
                    photo: image, // ✅ इमेज URL
                    caption: `📢 *Broadcast Message:*\n\n${message}`,
                    parse_mode: "Markdown"
                });
            } else {
                // ✅ सिर्फ टेक्स्ट मैसेज भेजें
                await axios.post(`https://api.telegram.org/bot${BOT_TOKEN}/sendMessage`, {
                    chat_id: userId,
                    text: `📢 *Broadcast Message:*\n\n${message}`,
                    parse_mode: "Markdown"
                });
            }
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
