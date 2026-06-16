import express from "express";
import cors from "cors";
import axios from "axios";
import nodemailer from "nodemailer";
import { MongoClient } from "mongodb";
import dotenv from "dotenv";

import authRoute from "./routes/auth.js";
import weatherRoute from "./routes/weather.js";
import recommendRoute from "./routes/recommend.js";
import diseaseRoute from "./routes/disease.js";
import cropGuideRouter from "./routes/cropguide.js";

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

const url = process.env.MONGO_URL;
const con = new MongoClient(url);

let db;

const API_KEY = process.env.YOUTUBE_API_KEY;

async function startServer() {
  try {
    await con.connect();
    console.log("✅ MongoDB connected");

    db = con.db("auth1"); 
    app.locals.db = db;

    app.listen(3000, () => {
      console.log("🚀 Server running on port 3000");
    });

  } catch (err) {
    console.error("❌ DB Connection Failed:", err.message);
  }
}

app.get("/api/videos", async (req, res) => {
  try {
    const { q = "farming", maxResults = 10, category } = req.query;

    const searchQuery =
      category && category !== "All" ? `${q} ${category}` : q;

    const url = `https://www.googleapis.com/youtube/v3/search?part=snippet&type=video&maxResults=${maxResults}&q=${searchQuery}&key=${API_KEY}`;

    const response = await axios.get(url);

    const mapped = response.data.items.map((item) => ({
      id: item.id.videoId,
      title: item.snippet.title,
      description: item.snippet.description,
      thumbnail: item.snippet.thumbnails.medium.url,
      author: item.snippet.channelTitle,
      duration: "N/A",
      category: category || "General",
    }));

    res.json(mapped);
  } catch (error) {
    console.error("Error fetching YouTube videos:", error.message);
    res.status(500).json({ error: "Failed to fetch videos" });
  }
});

app.post("/save", async (req, res) => {
  try {
    const db = req.app.locals.db; 
    const coll = db.collection("enquiry");
    const doc = {
      name: req.body.name,
      phone: req.body.phone,
      query: req.body.query,
      en_id: new Date().toString(),
    };
  
    await coll.insertOne(doc);

    let transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    let mailOptions = {
      from: process.env.EMAIL_USER,
      to: process.env.EMAIL_USER,
      subject: "Query From :" + req.body.name,
      text: "Phone :" + req.body.phone + " query :" + req.body.query,
    };

    await transporter.sendMail(mailOptions);

    res.status(200).json("Mail Sent");

  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Something went wrong" });
  }
});

app.use("/api/auth", authRoute);
app.use("/weather", weatherRoute);
app.use("/api/recommend", recommendRoute);
app.use("/api/disease", diseaseRoute);
app.use("/api/cropguide", cropGuideRouter);

startServer();