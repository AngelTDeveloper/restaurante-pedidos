// routes/vista.routes.js - Rutas que renderizan vistas EJS
const express = require("express");
const router = express.Router();
const c = require("../controllers/vista.controller");

router.get("/", c.vistaInicio);
router.get("/categorias", c.vistaCategorias);
router.get("/menus", c.vistaMenus);
router.get("/pedidos", c.vistaPedidos);

module.exports = router;
