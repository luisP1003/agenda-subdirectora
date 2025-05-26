import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import App from "./App.jsx";
import "./index.css";
import { TasksProvider } from "./context/TasksContext";
import { ThemeProvider, createTheme } from "@mui/material/styles";

// Define un tema personalizado para Material UI
const theme = createTheme({
  palette: {
    primary: {
      main: "#0047ab", // Azul oscuro con buen contraste
    },
    secondary: {
      main: "#1e90ff", // Azul claro
    },
    error: {
      main: "#f44336",
    },
    background: {
      default: "#f0f2f5",
    },
  },
  typography: {
    fontFamily: "'Roboto', sans-serif",
    button: {
      textTransform: "none", // Evita que los botones se muestren en mayúsculas por defecto
    },
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          fontWeight: "bold",
        },
      },
    },
  },
});

ReactDOM.createRoot(document.getElementById("root")).render(
  <TasksProvider>
    <ThemeProvider theme={theme}>
      <BrowserRouter>
        <App />
      </BrowserRouter>
    </ThemeProvider>
  </TasksProvider>
);
