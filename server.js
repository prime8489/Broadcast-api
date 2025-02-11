const express = require("express");
const fs = require("fs");
const axios = require("axios"); // Telegram API के लिए

const app = express();
app.use(express.json());

const BROADCAST_FILE = "broadcast.json";
const BOT_TOKEN = "7909700744:AAFW9vb74CcR4ppzlwHfFSmloWjE4SfVEUI"; // ✅ अपना बॉट टोकन डालें
const CHAT_ID = "5708790879"; // ✅ यहां अपना Telegram Chat ID डालें

// ✅ Default Route (Fix for "Cannot GET /")
app.get("/", (req, res) => {
    res.send("✅ Broadcast API is running successfully!");
});

// ✅ Save & Send Broadcast Message API
app.post("/save-broadcast", async (req, res) => {
    const { message } = req.body;
    if (!message) {
        return res.status(400).json({ error: "Message is required" });
    }

    // मैसेज को लोकल JSON फाइल में सेव करें
    fs.writeFileSync(BROADCAST_FILE, JSON.stringify({ message }));

    // ✅ Telegram Bot के जरिए मैसेज भेजें
    try {
        await axios.post(`https://api.telegram.org/bot${BOT_TOKEN}/sendMessage`, {
            chat_id: CHAT_ID, // ✅ अपने चैट ID के साथ रिप्लेस करें
            text: `📢 *Broadcast Message:* \n\n${message}`,
            parse_mode: "Markdown"
        });

        res.json({ success: true, message: "✅ Broadcast saved & sent successfully!" });
    } catch (error) {
        res.status(500).json({ error: "❌ Failed to send message to Telegram." });
    }
});

// ✅ Get Last Broadcast Message API
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
