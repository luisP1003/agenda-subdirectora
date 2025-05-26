import { useState, useEffect } from "react";
import {
  Container,
  Box,
  Typography,
  Drawer,
  List,
  ListItem,
  ListItemText,
  Grid,
  Card,
  CardContent,
  IconButton,
  Divider,
  AppBar,
  Toolbar,
  Button,
  Avatar,
  Checkbox,
  Chip,
} from "@mui/material";
import {
  Dashboard as DashboardIcon,
  Assignment as AssignmentIcon,
  Person as PersonIcon,
  Menu as MenuIcon,
  Logout as LogoutIcon,
  CalendarToday as CalendarTodayIcon,
  Event as EventIcon,
} from "@mui/icons-material";
import { Link, useNavigate } from "react-router-dom";
import { PieChart, Pie, Cell, Tooltip, Legend } from "recharts";
import axios from "axios";

const Dashboard = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const [tasks, setTasks] = useState([]);
  const [events, setEvents] = useState([]);
  const [user, setUser] = useState({ nombre: "", avatar: "" });
  const [currentTime, setCurrentTime] = useState("");
  const [phraseIndex, setPhraseIndex] = useState(0);
  const navigate = useNavigate();

  const phrases = [
    "¡Bienvenido de nuevo!",
    "¡Hoy es un gran día para ser productivo!",
    "¡Sigue alcanzando tus metas!",
    "¡Organiza tu día con éxito!",
  ];

  const getAuthHeaders = () => {
    const token = localStorage.getItem("token");
    return { Authorization: `Bearer ${token}` };
  };

  const fetchTasks = async () => {
    try {
      const response = await axios.get("http://localhost:5000/api/tasks", {
        headers: getAuthHeaders(),
      });
      const today = new Date().toLocaleDateString("sv-SE");
      const filtered = response.data
        .map((task) => {
          if (task.due_date) {
            const dateObj = new Date(task.due_date);
            const localDate = dateObj.toISOString().slice(0, 10);
            const localTime = dateObj.toTimeString().slice(0, 5);
            return { ...task, date: localDate, time: localTime };
          }
          return { ...task, date: "", time: "" };
        })
        .filter((task) => task.date === today);
      setTasks(filtered);
    } catch (error) {
      console.error("Error al obtener tareas:", error);
    }
  };

  const fetchEvents = async () => {
    try {
      const response = await axios.get("http://localhost:5000/api/eventos");
      const today = new Date().toLocaleDateString("sv-SE");
      const filtered = response.data.filter((event) => {
        const date = new Date(event.fecha).toISOString().slice(0, 10);
        return date === today;
      });
      setEvents(filtered);
    } catch (error) {
      console.error("Error al obtener eventos:", error);
    }
  };

  const fetchUser = async () => {
    try {
      const response = await axios.get("http://localhost:5000/api/user", {
        headers: getAuthHeaders(),
      });
      setUser(response.data);
    } catch (error) {
      console.error("Error al obtener usuario:", error);
    }
  };

  const handleToggleComplete = async (task) => {
    try {
      const combinedDateTime = `${task.date} ${task.time}`;
      await axios.put(
        `http://localhost:5000/api/tasks/${task.id}`,
        {
          title: task.title,
          description: task.description,
          due_date: combinedDateTime,
          completed: !task.completed,
        },
        {
          headers: getAuthHeaders(),
        }
      );
      fetchTasks();
    } catch (error) {
      console.error("Error al actualizar tarea:", error);
    }
  };

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      navigate("/login");
      return;
    }

    fetchTasks();
    fetchEvents();
    fetchUser();

    const timer = setInterval(() => {
      const now = new Date();
      let hours = now.getHours();
      let minutes = now.getMinutes();
      const ampm = hours >= 12 ? "PM" : "AM";
      hours = hours % 12 || 12;
      minutes = minutes < 10 ? "0" + minutes : minutes;
      setCurrentTime(`${hours}:${minutes} ${ampm}`);
    }, 1000);

    const phraseTimer = setInterval(() => {
      setPhraseIndex((prev) => (prev + 1) % phrases.length);
    }, 4000);

    return () => {
      clearInterval(timer);
      clearInterval(phraseTimer);
    };
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/login");
  };

  const totalTasks = tasks.length;
  const completedTasks = tasks.filter((task) => task.completed).length;
  const pendingTasks = totalTasks - completedTasks;
  const pieData = [
    { name: "Completadas", value: completedTasks },
    { name: "Pendientes", value: pendingTasks },
  ];
  const COLORS = ["#22C55E", "#EAB308"];

  return (
    <Box sx={{ display: "flex", minHeight: "100vh", backgroundColor: "#f0f2f5" }}>
      <AppBar position="fixed" sx={{ background: "#1E3A8A" }}>
        <Toolbar sx={{ display: "flex", justifyContent: "space-between" }}>
          <IconButton edge="start" color="inherit" onClick={() => setMenuOpen(true)} sx={{ display: { sm: "none" } }}>
            <MenuIcon />
          </IconButton>
          <Typography variant="h6" fontWeight="bold">Panel de Control</Typography>
          <Button variant="contained" color="error" startIcon={<LogoutIcon />} onClick={handleLogout}>
            Cerrar Sesión
          </Button>
        </Toolbar>
      </AppBar>

      <Drawer
        variant="permanent"
        sx={{
          width: 250,
          flexShrink: 0,
          "& .MuiDrawer-paper": {
            width: 250,
            boxSizing: "border-box",
            background: "linear-gradient(180deg, #1E3A8A, #3B82F6)",
            color: "#fff",
          },
        }}
      >
        <Box sx={{ p: 3, textAlign: "center" }}>
          <Typography variant="h6" fontWeight="bold">Panel de Control</Typography>
        </Box>
        <Divider sx={{ backgroundColor: "rgba(255,255,255,0.2)" }} />
        <List>
          <ListItem button component={Link} to="/dashboard">
            <DashboardIcon sx={{ mr: 2, color: "#fff" }} />
            <ListItemText primary="Dashboard" sx={{ color: "#fff" }} />
          </ListItem>
          <ListItem button component={Link} to="/tasks">
            <AssignmentIcon sx={{ mr: 2, color: "#fff" }} />
            <ListItemText primary="Tareas" sx={{ color: "#fff" }} />
          </ListItem>
          <ListItem button component={Link} to="/calendar">
            <CalendarTodayIcon sx={{ mr: 2, color: "#fff" }} />
            <ListItemText primary="Calendario" sx={{ color: "#fff" }} />
          </ListItem>
          <ListItem button component={Link} to="/events">
            <EventIcon sx={{ mr: 2, color: "#fff" }} />
            <ListItemText primary="Eventos" sx={{ color: "#fff" }} />
          </ListItem>
          <ListItem button component={Link} to="/profile">
            <PersonIcon sx={{ mr: 2, color: "#fff" }} />
            <ListItemText primary="Perfil" sx={{ color: "#fff" }} />
          </ListItem>
        </List>
      </Drawer>

      <Container sx={{ flexGrow: 1, p: 4, mt: 8 }}>
        <Box sx={{ display: "flex", alignItems: "center", mb: 3 }}>
          <Avatar
            src={user.avatar ? `http://localhost:5000${user.avatar}` : "https://i.pravatar.cc/150"}
            sx={{ width: 50, height: 50, mr: 2 }}
          />
          <Box>
            <Typography variant="h4" fontWeight="bold">{phrases[phraseIndex]}</Typography>
            <Typography variant="h6" color="textSecondary">{currentTime}</Typography>
          </Box>
        </Box>

        <Grid container spacing={3}>
          <Grid item xs={12} sm={6} md={4}>
            <Card sx={{ background: "linear-gradient(135deg, #2563EB, #1E40AF)", color: "white", borderRadius: 3 }}>
              <CardContent>
                <Typography variant="h6" fontWeight="bold">Resumen del Día</Typography>
                <Typography>📋 {tasks.length} tarea(s) y 📅 {events.length} evento(s)</Typography>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} sm={6} md={4}>
            <Card sx={{ background: "linear-gradient(135deg, #22C55E, #15803D)", color: "white", borderRadius: 3 }}>
              <CardContent>
                <Typography variant="h6" fontWeight="bold">Tareas Completadas</Typography>
                <Typography>✅ {completedTasks} tareas</Typography>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} sm={6} md={4}>
            <Card sx={{ background: "linear-gradient(135deg, #EAB308, #B45309)", color: "white", borderRadius: 3 }}>
              <CardContent>
                <Typography variant="h6" fontWeight="bold">Tareas Pendientes</Typography>
                <Typography>⌛ {pendingTasks} tareas</Typography>
              </CardContent>
            </Card>
          </Grid>
        </Grid>

        <Box sx={{ mt: 4, display: "flex", justifyContent: "center" }}>
          <PieChart width={300} height={300}>
            <Pie data={pieData} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={100} label>
              {pieData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
              ))}
            </Pie>
            <Tooltip />
            <Legend />
          </PieChart>
        </Box>

        <Typography variant="h5" fontWeight="bold" sx={{ mt: 5, mb: 2 }}>
          📋 Tareas para hoy
        </Typography>
        <Grid container spacing={2}>
          {tasks.length > 0 ? (
            tasks.map((task) => (
              <Grid item xs={12} sm={6} md={4} key={task.id}>
                <Card sx={{ background: "#ffffff", boxShadow: 5, borderRadius: 3, p: 2 }}>
                  <CardContent>
                    <Typography variant="h6" fontWeight="bold">{task.title}</Typography>
                    <Typography sx={{ mb: 1 }}>{task.description}</Typography>
                    <Typography variant="body2" color="textSecondary" sx={{ mb: 1 }}>
                      🕒 {task.date} {task.time}
                    </Typography>
                    <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                      <Chip label="Completada" color={task.completed ? "success" : "default"} />
                      <Checkbox
                        checked={task.completed}
                        onChange={() => handleToggleComplete(task)}
                        color="primary"
                      />
                    </Box>
                  </CardContent>
                </Card>
              </Grid>
            ))
          ) : (
            <Typography>No hay tareas programadas para hoy.</Typography>
          )}
        </Grid>
      </Container>
    </Box>
  );
};

export default Dashboard;
