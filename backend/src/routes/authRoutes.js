const express = require("express");
const router = express.Router();
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const prisma = require("../prismaClient");
const { JWT_SECRET } = require("../authMiddleware");

router.post("/login", async (req, res) => {
  try {
    const { username, password } = req.body;

    if (!username || !password) {
      return res.status(400).json({ error: "Username and password are required" });
    }

    const user = await prisma.user.findUnique({ where: { username } });
    if (!user) {
      return res.status(401).json({ error: "Invalid username or password" });
    }

    if (user.status !== "approved") {
      return res.status(403).json({ error: "Your account is still pending admin approval" });
    }

    const valid = await bcrypt.compare(password, user.password);
    if (!valid) {
      return res.status(401).json({ error: "Invalid username or password" });
    }

    const token = jwt.sign(
      { userId: user.id, username: user.username },
      JWT_SECRET,
      { expiresIn: "8h" }
    );

    res.json({ token, username: user.username });
  } catch (err) {
    console.error("Error during login:", err);
    res.status(500).json({ error: "Login failed" });
  }
});

router.post("/register", async (req, res) => {
  try {
    const { username, password } = req.body;

    if (!username || !password) {
      return res.status(400).json({ error: "Username and password are required" });
    }
    if (password.length < 6) {
      return res.status(400).json({ error: "Password must be at least 6 characters" });
    }

    const hashed = await bcrypt.hash(password, 10);

    await prisma.user.create({
      data: {
        username,
        password: hashed,
        status: "pending",
      },
    });

    res.status(201).json({ message: "Registration submitted. An existing admin must approve your account before you can log in." });
  } catch (err) {
    if (err.code === "P2002") {
      return res.status(409).json({ error: "That username is already taken" });
    }
    console.error("Error during registration:", err);
    res.status(500).json({ error: "Registration failed" });
  }
});

module.exports = router;
