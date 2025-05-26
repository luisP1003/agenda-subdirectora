const express = require("express");
const router = express.Router();
const pool = require("../db");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const verifyToken = require("../middleware/authMiddleware");
const multer = require("multer");
const path = require("path");
const upload = require("../middleware/upload");  // 👈 Middleware para subir imágenes

// ==============================
// REGISTRO
// ==============================
router.post("/register", async (req, res) => {
  try {
    const { nombre, correo, contrasena } = req.body;
    const rol = "Usuario"; // 👈 Asignamos automáticamente el rol

    if (!nombre || !correo || !contrasena) {
      return res.status(400).json({ message: "Todos los campos son requeridos." });
    }

    const userExists = await pool.query("SELECT * FROM usuarios WHERE correo = $1", [correo]);
    if (userExists.rows.length > 0) {
      return res.status(400).json({ message: "El usuario ya existe" });
    }

    const hashedPassword = await bcrypt.hash(contrasena, 10);

    const newUser = await pool.query(
      "INSERT INTO usuarios (nombre, correo, contrasena, rol) VALUES ($1, $2, $3, $4) RETURNING id, nombre, correo, rol, creado_en",
      [nombre, correo, hashedPassword, rol]
    );

    res.status(201).json({ message: "Usuario registrado correctamente", user: newUser.rows[0] });
  } catch (error) {
    console.error("Error en el registro:", error);
    res.status(500).json({ message: "Error en el servidor" });
  }
});

// ==============================
// LOGIN
// ==============================
router.post("/login", async (req, res) => {
  try {
    const { correo, contrasena } = req.body;

    if (!correo || !contrasena) {
      return res.status(400).json({ message: "Correo y contraseña son requeridos" });
    }

    const user = await pool.query("SELECT * FROM usuarios WHERE correo = $1", [correo]);
    if (user.rows.length === 0) {
      return res.status(400).json({ message: "Usuario no encontrado" });
    }

    const validPassword = await bcrypt.compare(contrasena, user.rows[0].contrasena);
    if (!validPassword) {
      return res.status(400).json({ message: "Contraseña incorrecta" });
    }

    const token = jwt.sign(
      { id: user.rows[0].id, correo: user.rows[0].correo, rol: user.rows[0].rol },
      process.env.JWT_SECRET,
      { expiresIn: "1h" }
    );

    res.json({ message: "Inicio de sesión exitoso", token });
  } catch (error) {
    console.error("Error en el inicio de sesión:", error);
    res.status(500).json({ message: "Error en el servidor" });
  }
});

// ==============================
// OBTENER PERFIL
// ==============================
router.get("/user", verifyToken, async (req, res) => {
  try {
    const userId = req.user.id;
    const result = await pool.query(
      "SELECT id, nombre, correo, rol, avatar FROM usuarios WHERE id = $1",
      [userId]
    );
    if (result.rows.length === 0) {
      return res.status(404).json({ message: "Usuario no encontrado" });
    }
    res.json(result.rows[0]);
  } catch (error) {
    console.error("Error al obtener perfil:", error);
    res.status(500).json({ message: "Error en el servidor" });
  }
});

// ==============================
// ACTUALIZAR PERFIL (con imagen)
// ==============================
router.put("/user", verifyToken, upload.single("avatar"), async (req, res) => {
  try {
    const userId = req.user.id;
    const { nombre, correo, contrasena } = req.body;
    const avatarFile = req.file;

    let query = "UPDATE usuarios SET nombre=$1, correo=$2";
    let values = [nombre, correo];
    let index = 3;

    if (contrasena) {
      const hashedPassword = await bcrypt.hash(contrasena, 10);
      query += `, contrasena=$${index++}`;
      values.push(hashedPassword);
    }

    if (avatarFile) {
      const avatarPath = `/uploads/${avatarFile.filename}`;
      query += `, avatar=$${index++}`;
      values.push(avatarPath);
    }

    query += ` WHERE id=$${index} RETURNING id, nombre, correo, rol, avatar`;
    values.push(userId);

    const result = await pool.query(query, values);

    if (result.rows.length === 0) {
      return res.status(404).json({ message: "Usuario no encontrado" });
    }

    res.json({ message: "Perfil actualizado", user: result.rows[0] });
  } catch (error) {
    console.error("Error al actualizar perfil:", error);
    res.status(500).json({ message: "Error en el servidor" });
  }
});

module.exports = router;
