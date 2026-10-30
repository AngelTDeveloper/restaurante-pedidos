// routes/categoria.routes.js - API /api/categorias
const express = require("express");
const router = express.Router();
const c = require("../controllers/categoria.controller");

router.get("/", c.listarCategorias);
router.post("/", c.crearCategoria);
router.put("/:id", c.actualizarCategoria);
router.delete("/:id", c.eliminarCategoria);

module.exports = router;
