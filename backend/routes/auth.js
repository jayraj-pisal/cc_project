const router = require("express").Router();
const db = require("../db");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const ADMIN_CODE = "PICT123";

/* ================= REGISTER ================= */

router.post("/register", async (req, res) => {
  try {

    const { email, password, role } = req.body;

    const hash = await bcrypt.hash(password, 10);

    await db.query(
      "INSERT INTO users(email,password,role) VALUES(?,?,?)",
      [email, hash, role]
    );

    res.json({ msg: "User registered successfully" });

  } catch (err) {

    if (err.code === "ER_DUP_ENTRY") {
      return res.status(400).json({ msg: "Email already exists" });
    }

    console.log(err);
    res.status(500).json({ msg: "Registration error" });
  }
});


/* ================= LOGIN ================= */

router.post("/login", async (req, res) => {
  try {

    const { email, password, role, code } = req.body;

    const [rows] = await db.query(
      "SELECT * FROM users WHERE email=?",
      [email]
    );

    if (rows.length === 0) {
      return res.status(400).json({ msg: "User not found" });
    }

    const user = rows[0];

    const valid = await bcrypt.compare(password, user.password);

    if (!valid) {
      return res.status(400).json({ msg: "Wrong password" });
    }

    if (role !== user.role) {
      return res.status(403).json({ msg: "Invalid role selected" });
    }

    if (role === "Admin") {
      if (code !== ADMIN_CODE) {
        return res.status(403).json({ msg: "Invalid Admin Code" });
      }
    }

    const token = jwt.sign(
      { id: user.id, role: user.role },
      process.env.JWT_SECRET || "secret",
      { expiresIn: "1h" }
    );

    res.json({
      token,
      role: user.role,
      email: user.email
    });

  } catch (err) {

    console.log(err);
    res.status(500).json({ msg: "Login error" });

  }
});

module.exports = router;
