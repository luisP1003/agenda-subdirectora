import { useState, useEffect } from "react";
import {
  Container,
  Typography,
  Card,
  CardContent,
  Button,
  IconButton,
  Grid,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Checkbox,
  FormControlLabel,
  Box,
  Snackbar,
  Alert,
} from "@mui/material";
import {
  Edit,
  Delete,
  Add as AddIcon,
  Search,
  Print,
  PictureAsPdf,
  Download,
} from "@mui/icons-material";
import api from "../api";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

const Tasks = () => {
  const [tasks, setTasks] = useState([]);
  const [open, setOpen] = useState(false);
  const [newTask, setNewTask] = useState({
    title: "",
    description: "",
    date: "",
    time: "",
    completed: false,
  });
  const [editTask, setEditTask] = useState(null);
  const [searchText, setSearchText] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");
  const [sortOption, setSortOption] = useState("date");
  const [snackbar, setSnackbar] = useState({ open: false, message: "", severity: "success" });

  useEffect(() => {
    fetchTasks();
  }, []);

  const fetchTasks = async () => {
    try {
      const response = await api.get("/tasks");
      const transformed = response.data.map((task) => {
        if (task.due_date) {
          const dateObj = new Date(task.due_date);
          const localDate = dateObj.toISOString().slice(0, 10);
          const localTime = dateObj.toTimeString().slice(0, 5);
          return { ...task, date: localDate, time: localTime };
        }
        return { ...task, date: "", time: "" };
      });
      setTasks(transformed);
    } catch (error) {
      console.error("Error al obtener tareas:", error);
    }
  };

  const handleOpen = (task = null) => {
    setEditTask(task);
    setNewTask(
      task
        ? {
            title: task.title,
            description: task.description || "",
            date: task.date || "",
            time: task.time || "",
            completed: task.completed,
          }
        : { title: "", description: "", date: "", time: "", completed: false }
    );
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    setEditTask(null);
  };

  const handleChange = (e) => {
    setNewTask({ ...newTask, [e.target.name]: e.target.value });
  };

  const handleSave = async () => {
    try {
      const combinedDateTime = `${newTask.date} ${newTask.time}`;
      if (editTask) {
        await api.put(`/tasks/${editTask.id}`, {
          title: newTask.title,
          description: newTask.description,
          due_date: combinedDateTime,
          completed: newTask.completed,
        });
      } else {
        await api.post("/tasks", {
          title: newTask.title,
          description: newTask.description,
          due_date: combinedDateTime,
          completed: newTask.completed,
        });
      }
      showSnackbar(editTask ? "Tarea actualizada." : "Tarea agregada.", "success");
      fetchTasks();
      handleClose();
    } catch (error) {
      console.error("Error al guardar tarea:", error);
      showSnackbar("Error al guardar la tarea.", "error");
    }
  };

  const handleDelete = async (id) => {
    try {
      await api.delete(`/tasks/${id}`);
      setTasks((prev) => prev.filter((task) => task.id !== id));
      showSnackbar("Tarea eliminada.", "info");
    } catch (error) {
      console.error("Error al eliminar tarea:", error);
      showSnackbar("Error al eliminar la tarea.", "error");
    }
  };

  const handleToggleComplete = async (task) => {
    try {
      const combinedDateTime = `${task.date} ${task.time}`;
      await api.put(`/tasks/${task.id}`, {
        title: task.title,
        description: task.description,
        due_date: combinedDateTime,
        completed: !task.completed,
      });
      fetchTasks();
    } catch (error) {
      console.error("Error al actualizar tarea:", error);
    }
  };

  const showSnackbar = (message, severity = "success") => {
    setSnackbar({ open: true, message, severity });
  };

  const handleCloseSnackbar = () => {
    setSnackbar({ ...snackbar, open: false });
  };

  const filteredTasks = tasks
    .filter((task) =>
      task.title.toLowerCase().includes(searchText.toLowerCase()) ||
      (task.description?.toLowerCase().includes(searchText.toLowerCase()))
    )
    .filter((task) => {
      if (filterStatus === "all") return true;
      if (filterStatus === "pending") return !task.completed;
      if (filterStatus === "completed") return task.completed;
      return true;
    });

  const sortedTasks = [...filteredTasks].sort((a, b) => {
    if (sortOption === "title") return a.title.localeCompare(b.title);
    return new Date(a.due_date) - new Date(b.due_date);
  });

  const handlePrint = () => {
    const win = window.open("", "_blank");
    const html = `
      <html>
        <head><title>Impresión de Tareas</title>
        <style>
          body { font-family: Arial; padding: 20px; }
          h2 { color: #1E3A8A; }
          table { width: 100%; border-collapse: collapse; margin-top: 20px; }
          th, td { border: 1px solid #ccc; padding: 8px; }
          th { background: #f0f0f0; }
        </style>
        </head>
        <body>
          <h2>Listado de Tareas</h2>
          <table>
            <thead><tr><th>Título</th><th>Descripción</th><th>Fecha</th><th>Hora</th><th>Estado</th></tr></thead>
            <tbody>
              ${sortedTasks.map(task => `
                <tr>
                  <td>${task.title}</td>
                  <td>${task.description}</td>
                  <td>${task.date}</td>
                  <td>${task.time}</td>
                  <td>${task.completed ? "✔️" : "❌"}</td>
                </tr>
              `).join("")}
            </tbody>
          </table>
        </body>
      </html>
    `;
    win.document.write(html);
    win.document.close();
    win.print();
  };

  const handleExportCSV = () => {
    const csv = [
      ["Título", "Descripción", "Fecha", "Hora", "Estado"],
      ...sortedTasks.map(task => [
        task.title,
        task.description,
        task.date,
        task.time,
        task.completed ? "Completada" : "Pendiente"
      ]),
    ];
    const csvContent = "data:text/csv;charset=utf-8," + csv.map(e => e.join(",")).join("\n");
    const encoded = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encoded);
    link.setAttribute("download", "tareas.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleExportPDF = () => {
    const doc = new jsPDF();
    doc.text("Listado de Tareas", 14, 16);
    autoTable(doc, {
      startY: 20,
      head: [["Título", "Descripción", "Fecha", "Hora", "Estado"]],
      body: sortedTasks.map((task) => [
        task.title,
        task.description,
        task.date,
        task.time,
        task.completed ? "Completada" : "Pendiente",
      ]),
    });
    doc.save("tareas.pdf");
  };

  return (
    <Container>
      <Typography variant="h4" align="center" gutterBottom>
        Gestión de Tareas y Eventos 📅
      </Typography>

      <Box display="flex" justifyContent="space-between" mb={2} flexWrap="wrap" gap={2}>
        <Button variant="contained" onClick={() => handleOpen()} startIcon={<AddIcon />}>
          Agregar Tarea
        </Button>
        <Box display="flex" gap={1}>
          <Button variant="outlined" onClick={handleExportCSV} startIcon={<Download />}>
            Exportar CSV
          </Button>
          <Button variant="outlined" onClick={handleExportPDF} startIcon={<PictureAsPdf />}>
            Exportar PDF
          </Button>
          <Button variant="outlined" onClick={handlePrint} startIcon={<Print />}>
            Imprimir
          </Button>
        </Box>
      </Box>

      <Box display="flex" gap={2} mb={2}>
        <TextField
          label="Buscar tarea"
          variant="outlined"
          fullWidth
          value={searchText}
          onChange={(e) => setSearchText(e.target.value)}
        />
        <FormControl>
          <InputLabel>Filtrar</InputLabel>
          <Select value={filterStatus} onChange={(e) => setFilterStatus(e.target.value)}>
            <MenuItem value="all">Todas</MenuItem>
            <MenuItem value="pending">Pendientes</MenuItem>
            <MenuItem value="completed">Completadas</MenuItem>
          </Select>
        </FormControl>
        <FormControl>
          <InputLabel>Ordenar</InputLabel>
          <Select value={sortOption} onChange={(e) => setSortOption(e.target.value)}>
            <MenuItem value="date">Por fecha</MenuItem>
            <MenuItem value="title">Por título</MenuItem>
          </Select>
        </FormControl>
      </Box>

      <Grid container spacing={2}>
        {sortedTasks.length > 0 ? (
          sortedTasks.map((task) => (
            <Grid item xs={12} sm={6} md={4} key={task.id}>
              <Card sx={{ minHeight: 200, display: "flex", flexDirection: "column", justifyContent: "space-between" }}>
                <CardContent>
                  <Typography variant="h6">{task.title}</Typography>
                  <Typography>{task.description}</Typography>
                  <Typography>📅 {task.date} ⏰ {task.time}</Typography>
                  <FormControlLabel
                    control={<Checkbox checked={task.completed} onChange={() => handleToggleComplete(task)} />}
                    label="Completada"
                  />
                  <Box display="flex" justifyContent="space-between">
                    <IconButton onClick={() => handleOpen(task)}><Edit /></IconButton>
                    <IconButton color="error" onClick={() => handleDelete(task.id)}><Delete /></IconButton>
                  </Box>
                </CardContent>
              </Card>
            </Grid>
          ))
        ) : (
          <Typography>No hay tareas.</Typography>
        )}
      </Grid>

      {/* Modal */}
      <Dialog open={open} onClose={handleClose} fullWidth maxWidth="sm">
        <DialogTitle>{editTask ? "Editar Tarea" : "Agregar Tarea"}</DialogTitle>
        <DialogContent>
          <TextField label="Título" fullWidth name="title" value={newTask.title} onChange={handleChange} sx={{ mb: 2 }} />
          <TextField label="Descripción" fullWidth name="description" value={newTask.description} onChange={handleChange} sx={{ mb: 2 }} />
          <TextField label="Fecha" type="date" fullWidth name="date" value={newTask.date} onChange={handleChange} sx={{ mb: 2 }} InputLabelProps={{ shrink: true }} />
          <TextField label="Hora" type="time" fullWidth name="time" value={newTask.time} onChange={handleChange} sx={{ mb: 2 }} InputLabelProps={{ shrink: true }} />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose} color="secondary">Cancelar</Button>
          <Button onClick={handleSave} color="primary">Guardar</Button>
        </DialogActions>
      </Dialog>

      <Snackbar open={snackbar.open} autoHideDuration={3000} onClose={handleCloseSnackbar}>
        <Alert onClose={handleCloseSnackbar} severity={snackbar.severity} sx={{ width: "100%" }}>
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Container>
  );
};

export default Tasks;
