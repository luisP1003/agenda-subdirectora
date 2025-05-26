const express = require("express");
const router = express.Router();
const { getTasks, addTask, updateTask, deleteTask } = require("../controllers/tasksController");
const verifyToken = require("../middleware/authMiddleware"); // Importar middleware

// Obtener todas las tareas (protegida)
router.get("/tasks", verifyToken, getTasks);

// Agregar una nueva tarea (protegida)
router.post("/tasks", verifyToken, addTask);

// Actualizar una tarea (protegida)
router.put("/tasks/:id", verifyToken, updateTask);

// Eliminar una tarea (protegida)
router.delete("/tasks/:id", verifyToken, deleteTask);

module.exports = router;      
