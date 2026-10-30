// routes/menu.routes.js - API /api/menus
const express = require("express");
const router = express.Router();
const c = require("../controllers/menu.controller");

router.get("/", c.listarMenus);
router.post("/", c.crearMenu);
router.put("/:id", c.actualizarMenu);
router.patch("/:id/desactivar", c.desactivarMenu);
router.patch("/:id/activar", c.activarMenu);
router.delete("/:id", c.eliminarMenu);

module.exports = router;
