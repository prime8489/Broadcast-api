const express = require("express");
const axios = require("axios");

const app = express();
app.use(express.json());

const BOT_TOKEN = "7909700744:AAFW9vb74CcR4ppzlwHfFSmloWjE4SfVEUI"; // Replace with your bot's token

app.post("/broadcast", async (req, res) => {
    const { message, users } = req.body;
    if (!message || !Array.isArray(users)) {
        return res.status(400).json({ error: "Invalid request format" });
    }

    let sentCount = 0;
    for (const user of users) {
        try {
            await axios.post(`https://api.telegram.org/bot${BOT_TOKEN}/sendMessage`, {
                chat_id: user,
                text: message
            });
            sentCount++;
        } catch (error) {
            console.error(`Failed to send message to ${user}:`, error.message);
        }
    }

    res.json({ success: true, sent: sentCount, total: users.length });
});

app.listen(3000, () => console.log("Broadcast API running on port 3000"));
