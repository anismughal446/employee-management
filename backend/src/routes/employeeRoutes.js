const express = require("express");
const router = express.Router();
const prisma = require("../prismaClient");
const { requireAuth } = require("../authMiddleware");
const jwt = require("jsonwebtoken");
const { JWT_SECRET } = require("../authMiddleware");

function checkAuthOptional(req, res, next) {
  const authHeader = req.headers.authorization;
  if (authHeader && authHeader.startsWith("Bearer ")) {
    try {
      const decoded = jwt.verify(authHeader.split(" ")[1], JWT_SECRET);
      req.user = decoded;
    } catch (err) {
      // invalid token - treat as unauthenticated, don't block
    }
  }
  next();
}

router.get("/", checkAuthOptional, async (req, res) => {
  try {
    const employees = await prisma.employee.findMany({
      where: { status: "approved" },
      orderBy: { id: "asc" },
    });

    if (!req.user) {
      const sanitized = employees.map(({ salary, ...rest }) => rest);
      return res.json(sanitized);
    }

    res.json(employees);
  } catch (err) {
    console.error("Error fetching employees:", err);
    res.status(500).json({ error: "Failed to fetch employees" });
  }
});

router.get("/:id", requireAuth, async (req, res) => {
  try {
    const employee = await prisma.employee.findUnique({
      where: { id: parseInt(req.params.id, 10) },
    });
    if (!employee) {
      return res.status(404).json({ error: "Employee not found" });
    }
    res.json(employee);
  } catch (err) {
    console.error("Error fetching employee:", err);
    res.status(500).json({ error: "Failed to fetch employee" });
  }
});

router.post("/request", async (req, res) => {
  try {
    const { name, email, position, department } = req.body;

    if (!name || !email || !position) {
      return res
        .status(400)
        .json({ error: "name, email, and position are required" });
    }

    const employee = await prisma.employee.create({
      data: {
        name,
        email,
        position,
        department: department || null,
        salary: null,
        status: "pending",
      },
    });
    res.status(201).json({ message: "Request submitted. An admin will review it shortly.", employee });
  } catch (err) {
    if (err.code === "P2002") {
      return res.status(409).json({ error: "An employee with this email already exists" });
    }
    console.error("Error submitting employee request:", err);
    res.status(500).json({ error: "Failed to submit request" });
  }
});

router.post("/", requireAuth, async (req, res) => {
  try {
    const { name, email, position, department, salary } = req.body;

    if (!name || !email || !position) {
      return res
        .status(400)
        .json({ error: "name, email, and position are required" });
    }

    const employee = await prisma.employee.create({
      data: {
        name,
        email,
        position,
        department: department || null,
        salary: salary !== undefined && salary !== "" ? parseFloat(salary) : null,
        status: "approved",
      },
    });
    res.status(201).json(employee);
  } catch (err) {
    if (err.code === "P2002") {
      return res.status(409).json({ error: "An employee with this email already exists" });
    }
    console.error("Error creating employee:", err);
    res.status(500).json({ error: "Failed to create employee" });
  }
});

router.patch("/:id/approve", requireAuth, async (req, res) => {
  try {
    const employee = await prisma.employee.update({
      where: { id: parseInt(req.params.id, 10) },
      data: { status: "approved" },
    });
    res.json(employee);
  } catch (err) {
    if (err.code === "P2025") {
      return res.status(404).json({ error: "Employee not found" });
    }
    console.error("Error approving employee:", err);
    res.status(500).json({ error: "Failed to approve employee" });
  }
});

router.put("/:id", requireAuth, async (req, res) => {
  try {
    const { name, email, position, department, salary } = req.body;

    const employee = await prisma.employee.update({
      where: { id: parseInt(req.params.id, 10) },
      data: {
        ...(name !== undefined && { name }),
        ...(email !== undefined && { email }),
        ...(position !== undefined && { position }),
        ...(department !== undefined && { department }),
        ...(salary !== undefined && { salary: salary === "" ? null : parseFloat(salary) }),
      },
    });
    res.json(employee);
  } catch (err) {
    if (err.code === "P2025") {
      return res.status(404).json({ error: "Employee not found" });
    }
    console.error("Error updating employee:", err);
    res.status(500).json({ error: "Failed to update employee" });
  }
});

router.delete("/:id", requireAuth, async (req, res) => {
  try {
    await prisma.employee.delete({
      where: { id: parseInt(req.params.id, 10) },
    });
    res.status(204).send();
  } catch (err) {
    if (err.code === "P2025") {
      return res.status(404).json({ error: "Employee not found" });
    }
    console.error("Error deleting employee:", err);
    res.status(500).json({ error: "Failed to delete employee" });
  }
});

module.exports = router;
