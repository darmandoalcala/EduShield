import express from "express";
import { createServer } from "http";
import { Server } from "socket.io";

const app = express();
const httpServer = createServer(app);

// Socket.IO para tiempo real
const io = new Server(httpServer, { cors: { origin: "*" } });

// Almacenamiento temporal de usuarios
// Cada usuario: { userId, lat, lng, alerta }
const usuariosActivos = {};

io.on("connection", (socket) => {
  console.log("Usuario conectado:", socket.id);

  // Cuando un usuario activa alerta o envía ubicación
  socket.on("ubicacion", (data) => {
    usuariosActivos[socket.id] = data;
    io.emit("actualizarMapa", Object.values(usuariosActivos));
  });

  // Cuando un usuario cancela alerta
  socket.on("desconectarUbicacion", () => {
    delete usuariosActivos[socket.id];
    io.emit("actualizarMapa", Object.values(usuariosActivos));
  });

  // Cuando se desconecta el cliente
  socket.on("disconnect", () => {
    delete usuariosActivos[socket.id];
    io.emit("actualizarMapa", Object.values(usuariosActivos));
  });
});

const PORT = 3000;
httpServer.listen(PORT, () => {
  console.log(`Servidor de mapa en tiempo real corriendo ${PORT}`);
});
