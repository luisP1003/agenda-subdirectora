import React, { useState } from "react";
import {
  Container,
  Typography,
  Button,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
} from "@mui/material";

const AdminUsers = () => {
  // Estado para manejar la lista de usuarios
  const [users, setUsers] = useState([
    { id: 1, name: "Juan Pérez", email: "juan@example.com", role: "Administrador" },
    { id: 2, name: "María López", email: "maria@example.com", role: "Usuario" },
  ]);

  // Estado para manejar el modal de agregar/editar usuario
  const [open, setOpen] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [currentUser, setCurrentUser] = useState({ id: null, name: "", email: "", role: "" });

  // Función para abrir modal (agregar o editar)
  const handleOpen = (user = null) => {
    if (user) {
      setEditMode(true);
      setCurrentUser(user);
    } else {
      setEditMode(false);
      setCurrentUser({ id: null, name: "", email: "", role: "" });
    }
    setOpen(true);
  };

  const handleClose = () => setOpen(false);

  // Función para manejar cambios en los inputs
  const handleChange = (e) => {
    setCurrentUser({ ...currentUser, [e.target.name]: e.target.value });
  };

  // Función para agregar o actualizar usuario
  const handleSaveUser = () => {
    if (editMode) {
      setUsers(users.map((user) => (user.id === currentUser.id ? currentUser : user)));
    } else {
      setUsers([...users, { id: users.length + 1, ...currentUser }]);
    }
    handleClose();
  };

  // Función para eliminar usuario
  const handleDeleteUser = (id) => {
    setUsers(users.filter((user) => user.id !== id));
  };

  return (
    <Container>
      <Typography variant="h4" gutterBottom>
        Administración de Usuarios
      </Typography>

      <Button variant="contained" color="primary" onClick={() => handleOpen()}>
        Agregar Usuario
      </Button>

      <TableContainer component={Paper} sx={{ marginTop: 2 }}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Nombre</TableCell>
              <TableCell>Email</TableCell>
              <TableCell>Rol</TableCell>
              <TableCell>Acciones</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {users.map((user) => (
              <TableRow key={user.id}>
                <TableCell>{user.name}</TableCell>
                <TableCell>{user.email}</TableCell>
                <TableCell>{user.role}</TableCell>
                <TableCell>
                  <Button color="warning" size="small" onClick={() => handleOpen(user)}>
                    Editar
                  </Button>
                  <Button color="error" size="small" onClick={() => handleDeleteUser(user.id)}>
                    Eliminar
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      {/* Modal para agregar o editar usuario */}
      <Dialog open={open} onClose={handleClose}>
        <DialogTitle>{editMode ? "Editar Usuario" : "Agregar Usuario"}</DialogTitle>
        <DialogContent>
          <TextField label="Nombre" fullWidth margin="dense" name="name" value={currentUser.name} onChange={handleChange} />
          <TextField label="Email" fullWidth margin="dense" name="email" value={currentUser.email} onChange={handleChange} />
          <TextField label="Rol" fullWidth margin="dense" name="role" value={currentUser.role} onChange={handleChange} />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose} color="secondary">
            Cancelar
          </Button>
          <Button onClick={handleSaveUser} color="primary">
            {editMode ? "Guardar Cambios" : "Agregar"}
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default AdminUsers;

