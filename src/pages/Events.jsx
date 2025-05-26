import { useEffect, useState, useRef } from "react";
import {
  Container, Typography, TextField, Button, Grid,
  Dialog, DialogTitle, DialogContent, DialogActions,
  Snackbar, Alert, Card, CardMedia, CardContent,
  IconButton, DialogContentText, Box, Modal, Divider
} from "@mui/material";
import {
  Add as AddIcon, Delete as DeleteIcon, Edit as EditIcon, Visibility as VisibilityIcon, Print as PrintIcon
} from "@mui/icons-material";
import api from "../api";
import Lightbox from "react-image-lightbox";
import "react-image-lightbox/style.css";

const Events = () => {
  const [events, setEvents] = useState([]);
  const [newEvent, setNewEvent] = useState({
    titulo: "", fecha: "", hora: "", lugar: "", objetivo: "",
    participantes_empresa: "", participantes_itt: "",
    participantes_alumnos: "", actividades: "", imagenes: [],
  });
  const [images, setImages] = useState([]);
  const [editMode, setEditMode] = useState(false);
  const [currentId, setCurrentId] = useState(null);
  const [open, setOpen] = useState(false);
  const [openModal, setOpenModal] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [snackbar, setSnackbar] = useState({ open: false, message: "", severity: "success" });
  const [eventToDelete, setEventToDelete] = useState(null);
  const [lightboxIndex, setLightboxIndex] = useState(0);
  const [lightboxImages, setLightboxImages] = useState([]);
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const printRef = useRef();

  const fetchEvents = async () => {
    try {
      const res = await api.get("/eventos");
      setEvents(res.data);
    } catch (err) {
      console.error("Error al obtener eventos:", err);
    }
  };

  useEffect(() => {
    fetchEvents();
  }, []);

  const handleInputChange = (e) => {
    setNewEvent({ ...newEvent, [e.target.name]: e.target.value });
  };

  const handleOpenDialog = () => {
    setEditMode(false);
    setCurrentId(null);
    setNewEvent({
      titulo: "", fecha: "", hora: "", lugar: "", objetivo: "",
      participantes_empresa: "", participantes_itt: "",
      participantes_alumnos: "", actividades: "", imagenes: [],
    });
    setImages([]);
    setOpen(true);
  };

  const handleCloseDialog = () => {
    setOpen(false);
  };

  const handleSubmit = async () => {
    try {
      const formData = new FormData();
      Object.keys(newEvent).forEach((key) => {
        if (key !== "imagenes") formData.append(key, newEvent[key]);
      });
      images.forEach((img) => formData.append("imagenes", img));

      if (editMode) {
        await api.put(`/eventos/${currentId}`, formData);
        setSnackbar({ open: true, message: "Evento actualizado", severity: "success" });
      } else {
        await api.post("/eventos", formData);
        setSnackbar({ open: true, message: "Evento creado", severity: "success" });
      }

      fetchEvents();
      setOpen(false);
    } catch (error) {
      console.error("Error al guardar evento:", error);
      setSnackbar({ open: true, message: "Error al guardar", severity: "error" });
    }
  };

  const handleEdit = (evento) => {
    setEditMode(true);
    setCurrentId(evento.id);
    setNewEvent({ ...evento });
    setImages([]);
    setOpen(true);
  };

  const handleDelete = (id) => {
    setEventToDelete(id);
  };

  const handleDeleteConfirm = async () => {
    try {
      await api.delete(`/eventos/${eventToDelete}`);
      setSnackbar({ open: true, message: "Evento eliminado", severity: "info" });
      fetchEvents();
    } catch (error) {
      console.error("Error al eliminar evento:", error);
      setSnackbar({ open: true, message: "Error al eliminar", severity: "error" });
    } finally {
      setEventToDelete(null);
    }
  };

  const handleOpenView = (event) => {
    setSelectedEvent(event);
    setOpenModal(true);
  };

  const handleCloseView = () => {
    setSelectedEvent(null);
    setOpenModal(false);
  };

  const handlePrint = (event) => {
    const printWindow = window.open("", "_blank");
    if (printWindow) {
      const html = `
        <html>
          <head>
            <title>Ficha Técnica</title>
            <style>
              body { font-family: Arial; padding: 20px; }
              h2 { text-align: center; }
              .section { margin-bottom: 10px; }
              .section strong { display: block; margin-top: 5px; }
              .images img { margin: 5px; width: 150px; height: 100px; object-fit: cover; border-radius: 5px; }
            </style>
          </head>
          <body>
            <h2>Ficha Técnica del Evento</h2>
            <div class="section"><strong>Título:</strong> ${event.titulo}</div>
            <div class="section"><strong>Fecha:</strong> ${formatDate(event.fecha)} <strong>Hora:</strong> ${event.hora}</div>
            <div class="section"><strong>Lugar:</strong> ${event.lugar}</div>
            <div class="section"><strong>Objetivo:</strong><br/>${event.objetivo}</div>
            <div class="section"><strong>Participantes Empresa:</strong><br/>${event.participantes_empresa.replace(/\n/g, "<br/>")}</div>
            <div class="section"><strong>Participantes ITT:</strong><br/>${event.participantes_itt.replace(/\n/g, "<br/>")}</div>
            <div class="section"><strong>Participantes Alumnos:</strong><br/>${event.participantes_alumnos.replace(/\n/g, "<br/>")}</div>
            <div class="section"><strong>Actividades:</strong><br/>${event.actividades.replace(/\n/g, "<br/>")}</div>
            ${event.imagenes?.length > 0 ? `<div class="images">${event.imagenes.map(img => `<img src="http://localhost:5000${img}" />`).join("")}</div>` : ""}
          </body>
        </html>`;
      printWindow.document.write(html);
      printWindow.document.close();
      printWindow.focus();
      setTimeout(() => printWindow.print(), 500);
    }
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    if (isNaN(date)) return dateString;
    return date.toLocaleDateString("es-MX", { day: "2-digit", month: "2-digit", year: "numeric" });
  };
  return (
    <Container sx={{ mt: 4 }}>
      <Typography variant="h4" gutterBottom>Gestión de Eventos 📅</Typography>

      <Button variant="contained" startIcon={<AddIcon />} onClick={handleOpenDialog} sx={{ mb: 3 }}>
        Agregar Evento
      </Button>

      <Grid container spacing={3}>
        {events.map((event) => (
          <Grid item xs={12} sm={6} md={4} key={event.id}>
            <Card sx={{ height: "100%" }}>
              {event.imagenes?.length > 0 && (
                <CardMedia
                  component="img"
                  height="200"
                  image={`http://localhost:5000${event.imagenes[0]}`}
                  alt={event.titulo}
                  sx={{ objectFit: "cover", cursor: "pointer" }}
                  onClick={() => {
                    setLightboxImages(event.imagenes.map((img) => `http://localhost:5000${img}`));
                    setLightboxIndex(0);
                    setLightboxOpen(true);
                  }}
                />
              )}
              <CardContent>
                <Typography variant="h6" gutterBottom>{event.titulo}</Typography>
                <Typography variant="body2">📍 {event.lugar}</Typography>
                <Typography variant="body2">🗓 {formatDate(event.fecha)} ⏰ {event.hora}</Typography>
                <Typography variant="body2" sx={{ mt: 1 }}>{event.objetivo}</Typography>
              </CardContent>
              <Box sx={{ display: "flex", justifyContent: "flex-end", p: 1 }}>
                <IconButton onClick={() => handleOpenView(event)}><VisibilityIcon /></IconButton>
                <IconButton onClick={() => handleEdit(event)}><EditIcon /></IconButton>
                <IconButton onClick={() => handlePrint(event)}><PrintIcon /></IconButton>
                <IconButton color="error" onClick={() => handleDelete(event.id)}><DeleteIcon /></IconButton>
              </Box>
            </Card>
          </Grid>
        ))}
      </Grid>

      {/* Diálogo Crear/Editar */}
      <Dialog open={open} onClose={handleCloseDialog} fullWidth maxWidth="md">
        <DialogTitle>{editMode ? "Editar Evento" : "Agregar Evento"}</DialogTitle>
        <DialogContent>
          <Grid container spacing={2} mt={1}>
            <Grid item xs={12} sm={6}>
              <TextField label="Título" fullWidth name="titulo" value={newEvent.titulo} onChange={handleInputChange} />
            </Grid>
            <Grid item xs={6} sm={3}>
              <TextField type="date" fullWidth name="fecha" value={newEvent.fecha} onChange={handleInputChange} />
            </Grid>
            <Grid item xs={6} sm={3}>
              <TextField type="time" fullWidth name="hora" value={newEvent.hora} onChange={handleInputChange} />
            </Grid>
            <Grid item xs={12}>
              <TextField label="Lugar" fullWidth name="lugar" value={newEvent.lugar} onChange={handleInputChange} />
            </Grid>
            <Grid item xs={12}>
              <TextField label="Objetivo" fullWidth name="objetivo" value={newEvent.objetivo} onChange={handleInputChange} multiline rows={2} />
            </Grid>
            <Grid item xs={12} sm={4}>
              <TextField label="Participantes Empresa" fullWidth name="participantes_empresa" value={newEvent.participantes_empresa} onChange={handleInputChange} multiline rows={3} />
            </Grid>
            <Grid item xs={12} sm={4}>
              <TextField label="Participantes ITT" fullWidth name="participantes_itt" value={newEvent.participantes_itt} onChange={handleInputChange} multiline rows={3} />
            </Grid>
            <Grid item xs={12} sm={4}>
              <TextField label="Participantes Alumnos" fullWidth name="participantes_alumnos" value={newEvent.participantes_alumnos} onChange={handleInputChange} multiline rows={3} />
            </Grid>
            <Grid item xs={12}>
              <TextField label="Actividades" fullWidth name="actividades" value={newEvent.actividades} onChange={handleInputChange} multiline rows={3} />
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog} color="secondary">Cancelar</Button>
          <Button onClick={handleSubmit} variant="contained">Guardar</Button>
        </DialogActions>
      </Dialog>

      {/* Modal de Vista Detallada */}
      <Modal open={openModal} onClose={handleCloseView}>
        <Box sx={{
          position: "absolute", top: "50%", left: "50%",
          transform: "translate(-50%, -50%)", width: "90%", maxWidth: 800,
          bgcolor: "background.paper", boxShadow: 24, p: 4, borderRadius: 2
        }}>
          <Typography variant="h5" gutterBottom fontWeight="bold" textAlign="center">
            FICHA TÉCNICA DEL EVENTO
          </Typography>
          <Divider sx={{ my: 2 }} />
          {selectedEvent && (
            <Grid container spacing={2}>
              <Grid item xs={6}><strong>Título:</strong> {selectedEvent.titulo}</Grid>
              <Grid item xs={3}><strong>Fecha:</strong> {formatDate(selectedEvent.fecha)}</Grid>
              <Grid item xs={3}><strong>Hora:</strong> {selectedEvent.hora}</Grid>
              <Grid item xs={12}><strong>Lugar:</strong> {selectedEvent.lugar}</Grid>
              <Grid item xs={12}><strong>Objetivo:</strong> {selectedEvent.objetivo}</Grid>
              <Grid item xs={4}><strong>Participantes Empresa:</strong><br />
                <div style={{ whiteSpace: "pre-line" }}>{selectedEvent.participantes_empresa}</div>
              </Grid>
              <Grid item xs={4}><strong>Participantes ITT:</strong><br />
                <div style={{ whiteSpace: "pre-line" }}>{selectedEvent.participantes_itt}</div>
              </Grid>
              <Grid item xs={4}><strong>Participantes Alumnos:</strong><br />
                <div style={{ whiteSpace: "pre-line" }}>{selectedEvent.participantes_alumnos}</div>
              </Grid>
              <Grid item xs={12}><strong>Actividades:</strong><br />
                <div style={{ whiteSpace: "pre-line" }}>{selectedEvent.actividades}</div>
              </Grid>
              {selectedEvent.imagenes?.length > 0 && (
                <Grid item xs={12}>
                  <Typography variant="subtitle1"><strong>Imágenes:</strong></Typography>
                  <Box sx={{ display: "flex", flexWrap: "wrap", gap: 2 }}>
                    {selectedEvent.imagenes.map((img, index) => (
                      <img
                        key={index}
                        src={`http://localhost:5000${img}`}
                        alt={`imagen-${index}`}
                        style={{ width: "150px", height: "100px", objectFit: "cover", borderRadius: 5 }}
                      />
                    ))}
                  </Box>
                </Grid>
              )}
            </Grid>
          )}
          <Box textAlign="right" mt={3}>
            <Button onClick={handleCloseView} variant="contained">Cerrar</Button>
          </Box>
        </Box>
      </Modal>

      {/* Confirmación de eliminación */}
      <Dialog open={Boolean(eventToDelete)} onClose={() => setEventToDelete(null)}>
        <DialogTitle>¿Eliminar evento?</DialogTitle>
        <DialogContent>
          <DialogContentText>Esta acción no se puede deshacer.</DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setEventToDelete(null)}>Cancelar</Button>
          <Button onClick={handleDeleteConfirm} color="error">Eliminar</Button>
        </DialogActions>
      </Dialog>

      {/* Notificación Snackbar */}
      <Snackbar open={snackbar.open} autoHideDuration={3000} onClose={() => setSnackbar({ ...snackbar, open: false })}>
        <Alert severity={snackbar.severity}>{snackbar.message}</Alert>
      </Snackbar>

      {/* Lightbox para imágenes */}
      {lightboxOpen && (
        <Lightbox
          mainSrc={lightboxImages[lightboxIndex]}
          nextSrc={lightboxImages[(lightboxIndex + 1) % lightboxImages.length]}
          prevSrc={lightboxImages[(lightboxIndex + lightboxImages.length - 1) % lightboxImages.length]}
          onCloseRequest={() => setLightboxOpen(false)}
          onMovePrevRequest={() =>
            setLightboxIndex((lightboxIndex + lightboxImages.length - 1) % lightboxImages.length)
          }
          onMoveNextRequest={() =>
            setLightboxIndex((lightboxIndex + 1) % lightboxImages.length)
          }
        />
      )}
    </Container>
  );
};

export default Events;
