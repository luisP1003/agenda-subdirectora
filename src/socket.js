import { io } from "socket.io-client";

const socket = io("http://localhost:5000"); // Asegúrate de que la URL y puerto coincidan

export default socket;
