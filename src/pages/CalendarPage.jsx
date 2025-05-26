import { useState, useEffect } from "react";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import timeGridPlugin from "@fullcalendar/timegrid";
import interactionPlugin from "@fullcalendar/interaction";
import api from "../api";
import {
  Container,
  Typography,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Box
} from "@mui/material";

const CalendarPage = () => {
  const [events, setEvents] = useState([]);
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);

  useEffect(() => {
    fetchCombinedData();
  }, []);

  const fetchCombinedData = async () => {
    try {
      const [taskRes, eventRes] = await Promise.all([
        api.get("/tasks"),
        api.get("/eventos"),
      ]);

      const taskEvents = taskRes.data.map((task) => ({
        id: `task-${task.id}`,
        title: task.title,
        start: task.due_date || task.time,
        backgroundColor: "#4caf50", // verde
        borderColor: "#4caf50",
        extendedProps: {
          type: "tarea",
          description: task.description || "",
        },
      }));

      const eventEvents = eventRes.data.map((ev) => ({
        id: `event-${ev.id}`,
        title: ev.titulo,
        start: ev.fecha,
        backgroundColor: "#2196f3", // azul
        borderColor: "#2196f3",
        extendedProps: {
          type: "evento",
          objetivo: ev.objetivo,
          lugar: ev.lugar,
          hora: ev.hora,
        },
      }));

      setEvents([...taskEvents, ...eventEvents]);
    } catch (error) {
      console.error("Error al cargar tareas o eventos:", error);
    }
  };

  const handleEventClick = (clickInfo) => {
    setSelectedEvent(clickInfo.event);
    setModalOpen(true);
  };

  const handleModalClose = () => {
    setSelectedEvent(null);
    setModalOpen(false);
  };

  return (
    <Container sx={{ mt: 4 }}>
      <Typography variant="h4" gutterBottom>
        Calendario de Tareas y Eventos 📅
      </Typography>

      <FullCalendar
        plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
        initialView="dayGridMonth"
        headerToolbar={{
          left: "prev,next today",
          center: "title",
          right: "dayGridMonth,timeGridWeek,timeGridDay",
        }}
        events={events}
        editable={false}
        eventClick={handleEventClick}
      />

      <Dialog open={modalOpen} onClose={handleModalClose}>
        <DialogTitle>Detalle</DialogTitle>
        <DialogContent>
          {selectedEvent && (
            <Box>
              <Typography variant="h6">{selectedEvent.title}</Typography>
              <Typography variant="body2">
                📅 Fecha: {new Date(selectedEvent.start).toLocaleDateString()}
              </Typography>
              {selectedEvent.extendedProps.type === "evento" ? (
                <>
                  <Typography variant="body2">
                    🕒 Hora: {selectedEvent.extendedProps.hora}
                  </Typography>
                  <Typography variant="body2">
                    📍 Lugar: {selectedEvent.extendedProps.lugar}
                  </Typography>
                  <Typography variant="body2" sx={{ mt: 1 }}>
                    🎯 Objetivo: {selectedEvent.extendedProps.objetivo}
                  </Typography>
                </>
              ) : (
                <>
                  <Typography variant="body2" sx={{ mt: 1 }}>
                    📄 Descripción: {selectedEvent.extendedProps.description}
                  </Typography>
                </>
              )}
            </Box>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={handleModalClose} variant="contained">Cerrar</Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default CalendarPage;
