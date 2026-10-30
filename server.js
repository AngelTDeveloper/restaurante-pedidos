// server.js
require("dotenv").config();
const express = require("express");
const conectarDB = require("./config/db");

const categoriaRoutes = require("./routes/categoria.routes");
const menuRoutes = require("./routes/menu.routes");
const pedidoRoutes = require("./routes/pedido.routes");
const vistaRoutes = require("./routes/vista.routes");

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static("public"));

// Motor de plantillas EJS
app.set("view engine", "ejs");
app.set("views", "./views");

// API (JSON)
app.use("/api/categorias", categoriaRoutes);
app.use("/api/menus", menuRoutes);
app.use("/api/pedidos", pedidoRoutes);

// Vistas (HTML)
app.use("/", vistaRoutes);

// 404
app.use((req, res) => {
  if (req.originalUrl.startsWith("/api/")) {
    return res.status(404).json({ message: "Ruta no encontrada" });
  }
  return res.status(404).render("error", { mensaje: "Página no encontrada" });
});

// Errores generales (ej. JSON mal formado)
app.use((err, req, res, next) => {
  if (err.type === "entity.parse.failed") {
    return res.status(400).json({ message: "El cuerpo de la petición no es un JSON válido" });
  }
  console.error(err);
  return res.status(500).json({ message: "Error interno del servidor" });
});

conectarDB().then(() => {
  app.listen(PORT, () => console.log(`🚀 Servidor en http://localhost:${PORT}`));
});
