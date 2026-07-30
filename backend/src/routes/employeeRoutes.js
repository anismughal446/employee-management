const express = require("express");
const router = express.Router();
const prisma = require("../prismaClient");
const { requireAuth } = require("../authMiddleware");

router.get("/", async (req, res) => {
  try {
    const employees = await prisma.employee.findMany({
      orderBy: { id: "asc" },
    });
    res.json(employees);
  } catch (err) {
    console.error("Error fetching employees:", err);
    res.status(500).json({ error: "Failed to fetch employees" });
  }
});

router.get("/:id", async (req, res) => {
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
