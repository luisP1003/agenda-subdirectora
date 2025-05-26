import React, { useState } from "react";
import "../styles/ModalEditTask.css";

const ModalEditTask = ({ isOpen, onClose, task, onSave }) => {
  const [title, setTitle] = useState(task?.title || "");
  const [time, setTime] = useState(task?.time || "");

  if (!isOpen) return null; // Si el modal no está abierto, no se muestra

  const handleSave = () => {
    onSave({ ...task, title, time }); // Guarda los cambios
    onClose(); // Cierra el modal
  };

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <h2>Editar tarea</h2>
        <input
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Nuevo título"
        />
        <input
          type="text"
          value={time}
          onChange={(e) => setTime(e.target.value)}
          placeholder="Nueva hora"
        />
        <div className="modal-buttons">
          <button onClick={handleSave}>Guardar</button>
          <button onClick={onClose}>Cancelar</button>
        </div>
      </div>
    </div>
  );
};

export default ModalEditTask;
