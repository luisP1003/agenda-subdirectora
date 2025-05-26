import React, { useState } from "react";
import {
  Container,
  Typography,
  Switch,
  FormControlLabel,
  Button,
  Card,
  CardContent,
  Divider,
  Box,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  TextField,
  Grid,
} from "@mui/material";

const Settings = () => {
  const [notifications, setNotifications] = useState({
    email: false,
    app: false,
  });

  const [openPasswordDialog, setOpenPasswordDialog] = useState(false);
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  // Manejar cambio en notificaciones
  const handleNotificationChange = (event) => {
    setNotifications({ ...notifications, [event.target.name]: event.target.checked });
  };

  // Abrir y cerrar modal de cambiar contraseña
  const handleOpenPasswordDialog = () => {
    setOpenPasswordDialog(true);
  };

  const handleClosePasswordDialog = () => {
    setOpenPasswordDialog(false);
    setPassword("");
    setConfirmPassword("");
  };

  // Guardar nueva contraseña
  const handlePasswordChange = () => {
    if (password.length < 6) {
      alert("La contraseña debe tener al menos 6 caracteres ❌");
      return;
    }
    if (password !== confirmPassword) {
      alert("Las contraseñas no coinciden ❌");
      return;
    }
    alert("Contraseña actualizada con éxito ✅");
    handleClosePasswordDialog();
  };

  return (
    <Container maxWidth="md" sx={{ mt: 4 }}>
      <Card>
        <CardContent>
          <Typography variant="h5" gutterBottom>
            Configuración ⚙️
          </Typography>

          {/* Botón para cambiar contraseña */}
          <Divider sx={{ my: 2 }} />
          <Typography variant="h6">Seguridad 🔑</Typography>
          <Button variant="contained" color="primary" onClick={handleOpenPasswordDialog}>
            Cambiar Contraseña
          </Button>

          {/* Notificaciones */}
          <Divider sx={{ my: 2 }} />
          <Typography variant="h6">Notificaciones 🔔</Typography>
          <Box>
            <FormControlLabel
              control={
                <Switch
                  checked={notifications.email}
                  onChange={handleNotificationChange}
                  name="email"
                />
              }
              label="Activar notificaciones por correo"
            />
          </Box>
          <Box>
            <FormControlLabel
              control={
                <Switch checked={notifications.app} onChange={handleNotificationChange} name="app" />
              }
              label="Activar notificaciones en la app"
            />
          </Box>
        </CardContent>
      </Card>

      {/* Modal de cambio de contraseña */}
      <Dialog open={openPasswordDialog} onClose={handleClosePasswordDialog}>
        <DialogTitle>Cambiar Contraseña</DialogTitle>
        <DialogContent>
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <TextField
                label="Nueva contraseña"
                type="password"
                fullWidth
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                label="Confirmar contraseña"
                type="password"
                fullWidth
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
              />
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClosePasswordDialog} color="secondary">
            Cancelar
          </Button>
          <Button onClick={handlePasswordChange} variant="contained" color="primary">
            Guardar
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default Settings;
