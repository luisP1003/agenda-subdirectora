const pool = require("../db");
const { io } = require("../index"); // Importa la instancia de Socket.IO exportada en index.js

// 🔹 1️⃣ Obtener todas las tareas
const getTasks = async (req, res) => {
  try {
    const result = await pool.query("SELECT * FROM tasks ORDER BY id ASC");
    res.json(result.rows);
  } catch (error) {
    console.error("Error al obtener tareas:", error);
    res.status(500).json({ error: "Error al obtener tareas" });
  }
};

// 🔹 2️⃣ Agregar una nueva tarea
const addTask = async (req, res) => {
  try {
    const { title, description, due_date, completed } = req.body;
    const result = await pool.query(
      "INSERT INTO tasks (title, description, due_date, completed) VALUES ($1, $2, $3, $4) RETURNING *",
      [title, description, due_date, completed]
    );
    const newTask = result.rows[0];
    // Emitir un evento para notificar que se agregó una tarea
    if (io) {
      io.emit("tasksUpdated", newTask);
    }
    res.json(newTask);
  } catch (error) {
    console.error("Error al agregar tarea:", error);
    res.status(500).json({ error: "Error al agregar tarea" });
  }
};

// 🔹 3️⃣ Actualizar una tarea por ID
const updateTask = async (req, res) => {
  try {
    const { id } = req.params;
    const { title, description, due_date, completed } = req.body;
    const result = await pool.query(
      "UPDATE tasks SET title = $1, description = $2, due_date = $3, completed = $4 WHERE id = $5 RETURNING *",
      [title, description, due_date, completed, id]
    );
    if (result.rows.length === 0) {
      return res.status(404).json({ error: "Tarea no encontrada" });
    }
    const updatedTask = result.rows[0];
    // Emitir un evento para notificar que se actualizó la tarea
    if (io) {
      io.emit("tasksUpdated", updatedTask);
    }
    res.json(updatedTask);
  } catch (error) {
    console.error("Error al actualizar tarea:", error);
    res.status(500).json({ error: "Error al actualizar tarea" });
  }
};

// 🔹 4️⃣ Eliminar una tarea por ID
const deleteTask = async (req, res) => {
  try {
    const { id } = req.params;
    const result = await pool.query("DELETE FROM tasks WHERE id = $1 RETURNING *", [id]);
    if (result.rows.length === 0) {
      return res.status(404).json({ error: "Tarea no encontrada" });
    }
    // Emitir un evento indicando que se eliminó la tarea
    if (io) {
      io.emit("tasksUpdated", { deletedId: id });
    }
    res.json({ message: "Tarea eliminada correctamente" });
  } catch (error) {
    console.error("Error al eliminar tarea:", error);
    res.status(500).json({ error: "Error al eliminar tarea" });
  }
};

module.exports = { getTasks, addTask, updateTask, deleteTask };