const express = require("express");
const fs = require("fs");
const axios = require("axios");

const app = express();
app.use(express.json());

const BROADCAST_FILE = "broadcast.json";
const BOT_TOKEN = "7909700744:AAFW9vb74CcR4ppzlwHfFSmloWjE4SfVEUI"; // ✅ अपना Bot Token डालें

// ✅ All Users List (यहां Bot.Business से सभी यूजर ID लाने होंगे)
const USERS = [5708790879, 123456789, 987654321]; // ✅ अपने सभी Users की List डालें

// ✅ Default Route
app.get("/", (req, res) => {
    res.send("✅ Broadcast API is running successfully!");
});

// ✅ Save & Broadcast Message to All Users
app.post("/save-broadcast", async (req, res) => {
    const { message } = req.body;
    if (!message) {
        return res.status(400).json({ error: "❌ Message is required!" });
    }

    // ✅ मैसेज को लोकल JSON फाइल में सेव करें
    fs.writeFileSync(BROADCAST_FILE, JSON.stringify({ message }));

    // ✅ सभी यूजर्स को Telegram Bot से मैसेज भेजें
    for (let userId of USERS) {
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

// ✅ Get Last Broadcast Message
app.get("/get-broadcast", (req, res) => {
    if (fs.existsSync(BROADCAST_FILE)) {
        const data = fs.readFileSync(BROADCAST_FILE);
        return res.json(JSON.parse(data));
    }
    res.json({ message: "❌ No broadcast message saved yet." });
});

// ✅ Start Server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`🚀 Broadcast API running on port ${PORT}`);
});
