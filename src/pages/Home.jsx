import { Typography, Button, Box } from "@mui/material";
import { Link } from "react-router-dom";

const Home = () => {
  return (
    <Box
      sx={{
        display: "flex",
        height: "100vh",
        width: "100vw",
        overflow: "hidden",
        background: "linear-gradient(-45deg,rgb(20, 76, 244),rgb(54, 201, 254),rgb(27, 78, 233),rgb(70, 199, 246))",
        backgroundSize: "400% 400%",
        animation: "gradientAnimation 15s ease infinite",
      }}
    >
      {/* Sección izquierda: imagen */}
      <Box
        sx={{
          width: "40%",
          backgroundColor: "white",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          p: 2,
        }}
      >
        <Box
          component="img"
          src="https://lh5.googleusercontent.com/p/AF1QipMoxR_gRtqf6Bq7aCXsqNRfPW-DL8Asobl4-OrH=w800-h500-k-no"
          alt="Instituto Tecnológico de Tehuacán"
          sx={{
            width: "80%",
            maxWidth: "400px",
            borderRadius: "10px",
            boxShadow: "0px 4px 10px rgba(0, 0, 0, 0.3)",
          }}
        />
      </Box>

      {/* Sección derecha: información y botones */}
      <Box
        sx={{
          width: "60%",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          p: 3,
        }}
      >
        <Typography
          variant="h4"
          fontWeight="bold"
          sx={{
            background: "linear-gradient(to right, rgba(0, 0, 0, 0.8), rgba(0, 0, 0, 0))",
            color: "white",
            p: 1,
            borderRadius: "8px",
            mb: 2,
          }}
        >
          Agenda Instituto Tecnológico de Tehuacán
        </Typography>

        <Typography variant="h6" sx={{ mb: 3, color: "white", textAlign: "center", px: 2 }}>
          Organiza tus actividades con facilidad y eficiencia.
        </Typography>

        <Box sx={{ display: "flex", flexDirection: "column", gap: 2, width: "100%", maxWidth: "350px" }}>
          <Button
            component={Link}
            to="/register"
            variant="contained"
            sx={{
              backgroundColor: "#FFD700",
              color: "b",
              fontWeight: "bold",
            }}
          >
            Registrarse
          </Button>
          <Button
            component={Link}
            to="/login"
            variant="outlined"
            sx={{
              color: "white",
              borderColor: "white",
              fontWeight: "bold",
            }}
          >
            Iniciar Sesión
          </Button>
        </Box>
      </Box>

      {/* Definición de la animación global */}
      <style jsx global>{`
        @keyframes gradientAnimation {
          0% {
            background-position: 0% 50%;
          }
          50% {
            background-position: 100% 50%;
          }
          100% {
            background-position: 0% 50%;
          }
        }
      `}</style>
    </Box>
  );
};

export default Home;
