import express from "express";
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import dotenv from "dotenv";
const router = express.Router();

dotenv.config();

router.post('/signup', async (req, res) => {
  const db = req.app.locals.db; 
  const coll = db.collection("user");

  const { username, email, city, password } = req.body;

  const userExist = await coll.findOne({ username });

  if (userExist) {
    return res.status(400).json({ error: "User Already Exists" });
  }

  const hashedpassword = await bcrypt.hash(password, 10);
  await coll.insertOne({ username, email, city, password: hashedpassword });

  res.json({ message: "SignUp Successful" });
});

    
router.post('/login', async (req, res) => {
  try {
    console.log("BODY:", req.body);
    console.log("DB:", req.app.locals.db);

    const db = req.app.locals.db;
    const coll = db.collection("user");

    const { username, password } = req.body;

    if (!username || !password) {
      return res.status(400).json({ message: "Username and Password are required" });
    }

    const userExist = await coll.findOne({ username });

    console.log("USER:", userExist);

    if (!userExist) {
      return res.status(404).json({ message: "User Not Found" });
    }

    const match = await bcrypt.compare(password, userExist.password);

    if (!match) {
      return res.status(401).json({ message: "Invalid Credentials" });
    }

    console.log("SECRET:", process.env.ACCESS_TOKEN_SECRET);

    const token = jwt.sign(
      { username },
      process.env.ACCESS_TOKEN_SECRET,
      { expiresIn: "1h" }
    );

    res.json({ message: "Login Successful", token });

  } catch (err) {
    console.error("LOGIN ERROR:", err);
    res.status(500).json({ error: err.message });
  }
});

    export default router;