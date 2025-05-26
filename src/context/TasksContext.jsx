import { createContext, useState, useEffect } from "react";

export const TasksContext = createContext();

export const TasksProvider = ({ children }) => {
  const [tasks, setTasks] = useState([]); // Estado global de tareas

  // 🔹 Función para obtener las tareas desde el backend
  const fetchTasks = async () => {
    try {
      const response = await fetch("http://localhost:5000/api/tasks"); // Asegúrate de que la URL sea correcta
      if (!response.ok) {
        throw new Error("Error al obtener las tareas");
      }
      const data = await response.json();
      setTasks(data); // Guardar las tareas en el estado
    } catch (error) {
      console.error("Error cargando tareas:", error);
    }
  };

  // 🔹 Obtener tareas cuando el contexto se monta
  useEffect(() => {
    fetchTasks();
  }, []);

  // 🔹 Agregar tarea al backend y actualizar el estado
  const addTask = async (task) => {
    try {
      const response = await fetch("http://localhost:5000/api/tasks", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(task),
      });

      if (!response.ok) {
        throw new Error("Error al agregar la tarea");
      }

      const newTask = await response.json();
      setTasks((prevTasks) => [...prevTasks, newTask]); // Agregar la tarea al estado
    } catch (error) {
      console.error("Error agregando tarea:", error);
    }
  };

  // 🔹 Eliminar tarea del backend y actualizar el estado
  const deleteTask = async (id) => {
    try {
      const response = await fetch(`http://localhost:5000/api/tasks/${id}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        throw new Error("Error al eliminar la tarea");
      }

      setTasks((prevTasks) => prevTasks.filter((task) => task.id !== id));
    } catch (error) {
      console.error("Error eliminando tarea:", error);
    }
  };

  return (
    <TasksContext.Provider value={{ tasks, addTask, deleteTask }}>
      {children}
    </TasksContext.Provider>
  );
};

