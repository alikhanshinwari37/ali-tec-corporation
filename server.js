require("dotenv").config();

const express = require("express");
const {Resend } = require("resend");
const path = require("path");

const app = express();
app.use((req, res, next) => {
    res.header("Access-Control-Allow-Origin", "https://alikhanshinwari37.github.io");
    res.header("Access-Control-Allow-Methods", "GET,POST,OPTIONS");
    res.header("Access-Control-Allow-Headers", "Content-Type");

    if (req.method === "OPTIONS") {
        return res.sendStatus(204);
    }

    next();
});

const PORT = process.env.PORT || 3000;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Website files serve karna
app.use(express.static(__dirname));

// Gmail transporter
const resend = new Resend(process.env.RESEND_API_KEY);

// Contact Form
app.post("/send-message", async (req, res) => {

    const { name, email, project, message } = req.body;

    if (!name || !email || !project || !message) {
        return res.status(400).json({
            success: false,
            message: "Please fill all fields."
        });
    }

    try {

            const { data, error } = await resend.emails.send({
            from: "Ali Tec Corporation<onboarding@resend.dev",
            to: process.env.EMAIL_USER,
            reply_to: email,
            subject: `New Project Inquiry - ${project}`,
            text: `
New message received from Ali Tec Corporation website.

Name: ${name}
Email: ${email}
Project: ${project}

Message:
${message}
            `
        });
        if (error) {
    console.error("Resend Error:", error);

    return res.status(500).json({
        success: false,
        message: "Unable to send message."
    });
}

        res.json({
            success: true,
            message: "Your message has been sent successfully!"
        });

    } catch (error) {

        console.error("Email Error:", error);

        res.status(500).json({
            success: false,
            message: "Unable to send message. Please try again."
        });
    }
});

app.listen(PORT, "0.0.0.0", () => {
    console.log(`Ali Tec Corporation running on port ${PORT}`);
});
