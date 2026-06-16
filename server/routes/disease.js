import express from "express";
import axios from "axios";
import multer from "multer";
import FormData from "form-data";

const router = express.Router();
const FLASK_URL = "http://localhost:5000";

const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 5 * 1024 * 1024 }, 
  fileFilter: (req, file, cb) => {
    if (file.mimetype.startsWith("image/")) cb(null, true);
    else cb(new Error("Only image files are allowed"), false);
  }
});

router.post("/", upload.single("image"), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ success: false, error: "No image provided" });
    }

    const form = new FormData();
    form.append("image", req.file.buffer, {
      filename: req.file.originalname,
      contentType: req.file.mimetype,
    });

    const flaskResponse = await axios.post(`${FLASK_URL}/predict-disease`, form, {
      headers: form.getHeaders(),
      timeout: 30000, 
    });

    return res.json({ success: true, predictions: flaskResponse.data.predictions });

  } catch (error) {
    const errMsg = error.response?.data?.error || error.message;
    console.error("Disease detection error:", errMsg);
    return res.status(500).json({ success: false, error: errMsg });
  }
});

export default router;