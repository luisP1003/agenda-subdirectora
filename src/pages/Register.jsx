import { useState } from "react";
import { Box, Container, TextField, Button, Typography, Paper, Snackbar, Alert } from "@mui/material";
import { Link, useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as Yup from "yup";

// Esquema de validación con Yup
const validationSchema = Yup.object().shape({
  nombre: Yup.string().required("El nombre es requerido"),
  correo: Yup.string().required("El correo es requerido").email("Correo inválido"),
  contrasena: Yup.string().required("La contraseña es requerida").min(6, "La contraseña debe tener al menos 6 caracteres"),
  confirmPassword: Yup.string()
    .oneOf([Yup.ref("contrasena"), null], "Las contraseñas deben coincidir")
    .required("Confirma tu contraseña"),
});

const Register = () => {
  const navigate = useNavigate();
  const [snackbar, setSnackbar] = useState({ open: false, message: "", severity: "success" });

  // Configuración de react-hook-form
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(validationSchema),
  });

  const onSubmit = async (data) => {
    try {
      const response = await fetch("http://localhost:5000/api/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          nombre: data.nombre,
          correo: data.correo,
          contrasena: data.contrasena,
          rol: "Administrador",
        }),
      });
      const resData = await response.json();
      if (response.ok) {
        setSnackbar({ open: true, message: "Registro exitoso. Ahora puedes iniciar sesión.", severity: "success" });
        navigate("/login");
      } else {
        setSnackbar({ open: true, message: resData.message || "Error al registrar usuario.", severity: "error" });
      }
    } catch (error) {
      console.error("Error en el registro:", error);
      setSnackbar({ open: true, message: "Hubo un problema en el servidor.", severity: "error" });
    }
  };

  return (
    <Box
      sx={{
        minHeight: "100vh",
        width: "100vw",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        background: "linear-gradient(to right, #0047ab, #1e90ff)",
        padding: { xs: 2, md: 4 },
      }}
    >
      <Container maxWidth="xs">
        <Paper
          elevation={5}
          sx={{
            padding: { xs: 3, md: 4 },
            borderRadius: 3,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            backgroundColor: "white",
          }}
        >
          <Typography variant="h5" fontWeight="bold" textAlign="center" mb={3} color="#0047ab">
            Crear Cuenta
          </Typography>

          <form onSubmit={handleSubmit(onSubmit)} style={{ width: "100%" }}>
            <TextField
              fullWidth
              label="Nombre"
              margin="normal"
              {...register("nombre")}
              error={Boolean(errors.nombre)}
              helperText={errors.nombre?.message}
            />
            <TextField
              fullWidth
              label="Correo"
              type="email"
              margin="normal"
              {...register("correo")}
              error={Boolean(errors.correo)}
              helperText={errors.correo?.message}
            />
            <TextField
              fullWidth
              label="Contraseña"
              type="password"
              margin="normal"
              {...register("contrasena")}
              error={Boolean(errors.contrasena)}
              helperText={errors.contrasena?.message}
            />
            <TextField
              fullWidth
              label="Confirmar Contraseña"
              type="password"
              margin="normal"
              {...register("confirmPassword")}
              error={Boolean(errors.confirmPassword)}
              helperText={errors.confirmPassword?.message}
            />
            <Button
              fullWidth
              type="submit"
              variant="contained"
              sx={{
                mt: 2,
                backgroundColor: "#0047ab",
                "&:hover": { backgroundColor: "#003399" },
                textTransform: "uppercase",
                fontWeight: "bold",
              }}
            >
              Registrarse
            </Button>
          </form>

          <Typography textAlign="center" mt={2} fontSize="14px">
            ¿Ya tienes una cuenta?{" "}
            <Link to="/login" style={{ color: "#0047ab", fontWeight: "bold", textDecoration: "none" }}>
              Iniciar Sesión
            </Link>
          </Typography>
        </Paper>
      </Container>

      {/* Snackbar para mostrar notificaciones */}
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

export default Register;
