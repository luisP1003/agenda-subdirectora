const express = require("express");
const path = require("path");
const cors = require("cors");
require("dotenv").config();
const pool = require("./db");
const taskRoutes = require("./routes/tasksRoutes");
const authRoutes = require("./routes/authRoutes");
const eventsRoutes = require("./routes/eventsRoutes");
const app = express();
const PORT = process.env.PORT || 5000;

app.use("/uploads", express.static(path.join(__dirname, "uploads")));



// ✅ Middleware (aplicado antes de las rutas)
app.use(cors());
app.use(express.json());


// ✅ Rutas
app.use("/api/eventos", eventsRoutes);
app.use("/api", taskRoutes);
app.use("/api", authRoutes);

// Crear servidor HTTP para integrar Socket.IO
const http = require("http");
const server = http.createServer(app);

// Configurar Socket.IO
const { Server } = require("socket.io");
const io = new Server(server, {
  cors: {
    origin: "*", // Puedes restringirlo a tu frontend si deseas mayor seguridad
    methods: ["GET", "POST", "PUT", "DELETE"],
  },
});

// Manejo de conexiones de Socket.IO
io.on("connection", (socket) => {
  console.log("Nuevo cliente conectado:", socket.id);
  socket.on("disconnect", () => {
    console.log("Cliente desconectado:", socket.id);
  });
});

// Exportar io si lo necesitas en otros módulos
module.exports.io = io;

// Conexión a la base de datos
const connectDB = async () => {
  try {
    await pool.connect();
    console.log("📌 Conectado a PostgreSQL");
  } catch (error) {
    console.error("❌ Error al conectar con PostgreSQL:", error);
  }
};

// Iniciar servidor
server.listen(PORT, async () => {
  console.log(`🚀 Servidor corriendo en http://localhost:${PORT}`);
  await connectDB();
});
