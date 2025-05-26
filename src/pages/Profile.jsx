import React, { useState, useEffect } from "react";
import {
  Container,
  Card,
  CardContent,
  Avatar,
  Typography,
  Button,
  Box,
  TextField,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  IconButton,
  Snackbar,
  Alert,
} from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import PhotoCamera from "@mui/icons-material/PhotoCamera";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const Profile = () => {
  const [profile, setProfile] = useState({
    nombre: "",
    correo: "",
    rol: "",
    avatar: "",
  });
  const [formData, setFormData] = useState({
    nombre: "",
    correo: "",
    contrasena: "",
  });
  const [open, setOpen] = useState(false);
  const [snackbar, setSnackbar] = useState({ open: false, message: "", severity: "success" });
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) {
          setSnackbar({ open: true, message: "No hay token. Por favor inicia sesión.", severity: "error" });
          navigate("/login");
          return;
        }

        const response = await axios.get("http://localhost:5000/api/user", {
          headers: { Authorization: `Bearer ${token}` },
        });

        setProfile({
          nombre: response.data.nombre,
          correo: response.data.correo,
          rol: response.data.rol, // aunque ya no se usará visualmente
          avatar: response.data.avatar || "http://localhost:5000/uploads/default.png",
        });

        setFormData({
          nombre: response.data.nombre,
          correo: response.data.correo,
          contrasena: "",
        });
      } catch (error) {
        console.error("Error al obtener perfil:", error);
        setSnackbar({ open: true, message: "Error al cargar el perfil. Por favor inicia sesión.", severity: "error" });
        navigate("/login");
      }
    };
    fetchUserData();
  }, [navigate]);

  const handleOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    setFormData({ ...formData, contrasena: "" });
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleAvatarChange = async (e) => {
    if (e.target.files && e.target.files[0]) {
      const selectedFile = e.target.files[0];

      try {
        const token = localStorage.getItem("token");
        if (!token) {
          setSnackbar({ open: true, message: "No hay token. Por favor inicia sesión.", severity: "error" });
          navigate("/login");
          return;
        }

        const formDataToSend = new FormData();
        formDataToSend.append("avatar", selectedFile);
        formDataToSend.append("nombre", profile.nombre);
        formDataToSend.append("correo", profile.correo);

        const response = await axios.put("http://localhost:5000/api/user", formDataToSend, {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "multipart/form-data",
          },
        });

        setProfile({
          ...profile,
          avatar: response.data.user.avatar,
        });

        setSnackbar({ open: true, message: "Foto de perfil actualizada con éxito.", severity: "success" });
      } catch (error) {
        console.error("Error al actualizar foto de perfil:", error);
        setSnackbar({ open: true, message: "Error al actualizar la foto.", severity: "error" });
      }
    }
  };

  const handleSubmit = async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        setSnackbar({ open: true, message: "No hay token. Por favor inicia sesión.", severity: "error" });
        return;
      }

      const formDataToSend = {
        nombre: formData.nombre,
        correo: formData.correo,
        contrasena: formData.contrasena,
      };

      const response = await axios.put("http://localhost:5000/api/user", formDataToSend, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      setProfile({
        ...profile,
        nombre: response.data.user.nombre,
        correo: response.data.user.correo,
      });

      setSnackbar({ open: true, message: response.data.message, severity: "success" });
      handleClose();
    } catch (error) {
      console.error("Error al actualizar perfil:", error);
      setSnackbar({ open: true, message: "Error al actualizar el perfil.", severity: "error" });
    }
  };

  const handleCloseSnackbar = () => {
    setSnackbar({ ...snackbar, open: false });
  };

  return (
    <Container
      maxWidth="sm"
      sx={{
        mt: 4,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        background: "linear-gradient(to right, #1E3A8A, #3B82F6)",
        borderRadius: 3,
        p: 4,
        boxShadow: 3,
      }}
    >
      <Box sx={{ position: "relative" }}>
        <Avatar
          src={`http://localhost:5000${profile.avatar}`}
          sx={{ width: 120, height: 120, mb: 2, border: "4px solid white" }}
        />
        <IconButton
          color="primary"
          aria-label="subir foto"
          component="label"
          sx={{ position: "absolute", bottom: 0, right: 0 }}
        >
          <PhotoCamera />
          <input hidden accept="image/*" type="file" onChange={handleAvatarChange} />
        </IconButton>
      </Box>

      <Card sx={{ width: "100%", borderRadius: 3, boxShadow: 3, mb: 2 }}>
        <CardContent
          sx={{
            textAlign: "center",
            background: "rgba(255, 255, 255, 0.1)",
            backdropFilter: "blur(10px)",
          }}
        >
          <Typography variant="h5" fontWeight="bold">
            {profile.nombre}
          </Typography>
          <Typography variant="subtitle1" color="text.secondary">
            {profile.correo}
          </Typography>
          <Typography
            variant="body1"
            sx={{
              mt: 1,
              px: 2,
              py: 1,
              display: "inline-block",
              borderRadius: 2,
              backgroundColor: "#1E3A8A",
              color: "white",
            }}
          >
            Usuario
          </Typography>
        </CardContent>
      </Card>

      <Box mt={3}>
        <Button
          variant="contained"
          color="primary"
          startIcon={<EditIcon />}
          onClick={handleOpen}
          sx={{
            borderRadius: 3,
            px: 3,
            py: 1,
            fontWeight: "bold",
          }}
        >
          Editar Perfil
        </Button>
      </Box>

      <Dialog open={open} onClose={handleClose}>
        <DialogTitle>Editar Perfil</DialogTitle>
        <DialogContent>
          <TextField
            margin="dense"
            label="Nombre"
            fullWidth
            name="nombre"
            value={formData.nombre}
            onChange={handleChange}
          />
          <TextField
            margin="dense"
            label="Correo"
            fullWidth
            name="correo"
            type="email"
            value={formData.correo}
            onChange={handleChange}
          />
          <TextField
            margin="dense"
            label="Nueva Contraseña (Opcional)"
            fullWidth
            name="contrasena"
            type="password"
            value={formData.contrasena}
            onChange={handleChange}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose} color="secondary">
            Cancelar
          </Button>
          <Button onClick={handleSubmit} color="primary">
            Guardar
          </Button>
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

export default Profile;
