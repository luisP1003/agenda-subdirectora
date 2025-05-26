import { useState } from "react";
import { Container, TextField, Button, Typography, Paper, Box, Snackbar, Alert } from "@mui/material";
import { Link, useNavigate } from "react-router-dom";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [snackbar, setSnackbar] = useState({ open: false, message: "", severity: "error" });
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    try {
      const response = await fetch("http://localhost:5000/api/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ correo: email, contrasena: password }),
      });
      const data = await response.json();
      if (response.ok) {
        // Guarda el token en localStorage y redirige
        localStorage.setItem("token", data.token);
        navigate("/dashboard");
      } else {
        setError(data.message || "Error al iniciar sesión");
        setSnackbar({ open: true, message: data.message || "Error al iniciar sesión", severity: "error" });
      }
    } catch (error) {
      console.error("Error en el login:", error);
      setError("Error en el servidor");
      setSnackbar({ open: true, message: "Error en el servidor", severity: "error" });
    }
  };

  return (
    <Box
      sx={{
        minHeight: "100vh",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        background: "linear-gradient(135deg,rgb(13, 73, 240),rgb(38, 237, 255))",
        animation: "gradientAnimation 10s ease infinite",
        width: "100%",
        padding: "1rem",
        "@keyframes gradientAnimation": {
          "0%": { backgroundPosition: "0% 50%" },
          "50%": { backgroundPosition: "100% 50%" },
          "100%": { backgroundPosition: "0% 50%" },
        },
      }}
    >
      <Container maxWidth="xs" sx={{ width: { xs: "90%", sm: "400px" } }}>
        <Paper
          elevation={8}
          sx={{
            padding: "2rem",
            borderRadius: "10px",
            textAlign: "center",
            width: "100%",
            transition: "transform 0.3s ease",
            "&:hover": { transform: "scale(1.02)" },
          }}
        >
          <Typography variant="h4" fontWeight="bold" gutterBottom sx={{ mb: 2, color: "#0047ab" }}>
            Iniciar Sesión
          </Typography>

          {error && (
            <Typography variant="body2" color="error" sx={{ mb: 2 }}>
              {error}
            </Typography>
          )}

          <form onSubmit={handleSubmit}>
            <TextField
              label="Email"
              type="email"
              variant="outlined"
              fullWidth
              margin="normal"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
            <TextField
              label="Contraseña"
              type="password"
              variant="outlined"
              fullWidth
              margin="normal"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
            <Button
              type="submit"
              variant="contained"
              sx={{
                backgroundColor: "#FFD700",
                color: "black",
                fontWeight: "bold",
                width: "100%",
                mt: 2,
                transition: "background-color 0.3s ease",
                "&:hover": { backgroundColor: "#FFC107" },
              }}
            >
              Iniciar Sesión
            </Button>
          </form>

          <Typography variant="body2" sx={{ mt: 2 }}>
            ¿No tienes una cuenta?{" "}
            <Link to="/register" style={{ color: "#1E3A8A", fontWeight: "bold", textDecoration: "none" }}>
              Regístrate
            </Link>
          </Typography>
        </Paper>
      </Container>

      <Snackbar
        open={snackbar.open}
        autoHideDuration={4000}
        onClose={() => setSnackbar({ ...snackbar, open: false })}
        anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
      >
        <Alert onClose={() => setSnackbar({ ...snackbar, open: false })} severity={snackbar.severity} sx={{ width: "100%" }}>
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default Login;

