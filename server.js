require("dotenv").config();

const express = require("express");
const nodemailer = require("nodemailer");
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
const transporter = nodemailer.createTransport({
    host: "smtp.gmail.com",
    port: 465,
    secure: true,
    family: 4,
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
    }
});

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

        await transporter.sendMail({
            from: process.env.EMAIL_USER,
            to: process.env.EMAIL_USER,
            replyTo: email,
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
