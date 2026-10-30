// routes/pedido.routes.js - API /api/pedidos
const express = require("express");
const router = express.Router();
const c = require("../controllers/pedido.controller");

router.get("/", c.listarPedidos);
router.post("/", c.crearPedido);
router.patch("/:id/estado", c.actualizarEstado);
router.delete("/:id", c.eliminarPedido);

module.exports = router;
