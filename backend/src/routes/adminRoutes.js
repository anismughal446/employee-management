const express = require("express");
const router = express.Router();
const prisma = require("../prismaClient");
const { requireAuth } = require("../authMiddleware");

router.use(requireAuth);

router.get("/pending-employees", async (req, res) => {
  try {
    const employees = await prisma.employee.findMany({
      where: { status: "pending" },
      orderBy: { id: "asc" },
    });
    res.json(employees);
  } catch (err) {
    console.error("Error fetching pending employees:", err);
    res.status(500).json({ error: "Failed to fetch pending employees" });
  }
});

router.get("/pending-users", async (req, res) => {
  try {
    const users = await prisma.user.findMany({
      where: { status: "pending" },
      select: { id: true, username: true, createdAt: true },
      orderBy: { id: "asc" },
    });
    res.json(users);
  } catch (err) {
    console.error("Error fetching pending users:", err);
    res.status(500).json({ error: "Failed to fetch pending users" });
  }
});

router.post("/users/:id/approve", async (req, res) => {
  try {
    const user = await prisma.user.update({
      where: { id: parseInt(req.params.id, 10) },
      data: { status: "approved" },
      select: { id: true, username: true, status: true },
    });
    res.json(user);
  } catch (err) {
    if (err.code === "P2025") {
      return res.status(404).json({ error: "User not found" });
    }
    console.error("Error approving user:", err);
    res.status(500).json({ error: "Failed to approve user" });
  }
});

router.delete("/users/:id/reject", async (req, res) => {
  try {
    await prisma.user.delete({
      where: { id: parseInt(req.params.id, 10) },
    });
    res.status(204).send();
  } catch (err) {
    if (err.code === "P2025") {
      return res.status(404).json({ error: "User not found" });
    }
    console.error("Error rejecting user:", err);
    res.status(500).json({ error: "Failed to reject user" });
  }
});

module.exports = router;
