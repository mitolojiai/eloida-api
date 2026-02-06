import express from "express";
import cors from "cors";
import nodemailer from "nodemailer";

const app = express();

/* ======================
   Middleware
====================== */
app.use(
  cors({
    origin: "*",
    methods: ["GET", "POST", "OPTIONS"],
    allowedHeaders: ["Content-Type"],
  })
);

app.use(express.json({ limit: "1mb" }));

/* ======================
   Health check
====================== */
app.get("/", (_req, res) => {
  res.json({
    ok: true,
    service: "eloida-api",
    timestamp: new Date().toISOString(),
  });
});

/* ======================
   Lead endpoint
====================== */
app.post("/lead", async (req, res) => {
  try {
    const {
      name,
      email,
      company,
      phone,
      message,
      source,
      page,
    } = req.body || {};

    if (!email || !String(email).includes("@")) {
      return res.status(400).json({
        ok: false,
        error: "Valid email required",
      });
    }

    const transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port: Number(process.env.SMTP_PORT || 587),
      secure: false,
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
      },
    });

    const to = process.env.LEAD_TO || "connect@eloida.io";
    const from = process.env.MAIL_FROM || process.env.SMTP_USER;

    await transporter.sendMail({
      from: `Eloida <${from}>`,
      to,
      subject: "New Lead — Eloida",
      text: `New lead received

Name: ${name || "-"}
Email: ${email}
Company: ${company || "-"}
Phone: ${phone || "-"}
Message: ${message || "-"}
Source: ${source || "website"}
Page: ${page || "/"}
Time: ${new Date().toISOString()}
`,
    });

    return res.json({ ok: true });
  } catch (err) {
    console.error("Lead error:", err);
    return res.status(500).json({
      ok: false,
      error: "Server error",
    });
  }
});

/* ======================
   Server start
====================== */
const port = process.env.PORT || 3000;

app.listen(port, () => {
  console.log(`eloida-api running on port ${port}`);
});
