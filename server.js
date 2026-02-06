import express from "express";
import cors from "cors";
import nodemailer from "nodemailer";

const app = express();

/* ---------- Middleware ---------- */
app.use(
  cors({
    origin: "*",
    methods: ["GET", "POST", "OPTIONS"],
    allowedHeaders: ["Content-Type"],
  })
);

app.use(express.json({ limit: "1mb" }));

/* ---------- Health check ---------- */
app.get("/", (_req, res) => {
  res.json({ ok: true, service: "eloida-api" });
});

/* ---------- Lead endpoint ---------- */
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
