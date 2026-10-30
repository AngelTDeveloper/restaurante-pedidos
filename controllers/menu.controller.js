// controllers/menu.controller.js - API de menús (platos)
const mongoose = require("mongoose");
const Menu = require("../models/Menu");
const Categoria = require("../models/Categoria");

// Valida los datos de un menú. Devuelve mensaje de error o null
const validarMenu = async ({ nombre, descripcion, precio, categoria }) => {
  if (typeof nombre !== "string" || nombre.trim().length === 0) return "El nombre es obligatorio";
  if (nombre.trim().length < 3) return "El nombre debe tener al menos 3 caracteres";
  if (nombre.trim().length > 100) return "El nombre no puede superar los 100 caracteres";

  if (descripcion !== undefined && typeof descripcion !== "string") return "La descripción debe ser texto";
  if (descripcion && descripcion.trim().length > 300) return "La descripción no puede superar los 300 caracteres";

  const precioNum = Number(precio);
  if (precio === undefined || precio === null || precio === "" || !Number.isFinite(precioNum)) {
    return "El precio es obligatorio y debe ser un número";
  }
  if (precioNum <= 0) return "El precio debe ser mayor a 0";

  if (!mongoose.isValidObjectId(categoria)) return "Debes seleccionar una categoría válida";
  const existe = await Categoria.exists({ _id: categoria, fecha_eliminado: null });
  if (!existe) return "La categoría seleccionada no existe";

  return null;
};

const buscarActivo = async (id) => {
  if (!mongoose.isValidObjectId(id)) {
    return { error: { status: 400, message: "El id del menú no es válido" } };
  }
  const menu = await Menu.findOne({ _id: id, fecha_eliminado: null });
  if (!menu) return { error: { status: 404, message: "Menú no encontrado" } };
  return { menu };
};

// GET /api/menus
const listarMenus = async (req, res) => {
  try {
    const menus = await Menu.find({ fecha_eliminado: null })
      .populate("categoria")
      .sort({ fecha_creacion: -1 });
    return res.json(menus);
  } catch (error) {
    return res.status(500).json({ message: "Error al listar menús", error: error.message });
  }
};

// POST /api/menus (se crea como disponible por defecto)
const crearMenu = async (req, res) => {
  try {
    const err = await validarMenu(req.body);
    if (err) return res.status(400).json({ message: err });

    const { nombre, descripcion, precio, categoria } = req.body;
    const menu = await Menu.create({
      nombre,
      descripcion,
      precio: Number(precio),
      categoria,
      disponible: true,
    });
    return res.status(201).json({ message: "Menú creado con éxito", menu });
  } catch (error) {
    return res.status(500).json({ message: "Error al crear el menú", error: error.message });
  }
};

// PUT /api/menus/:id
const actualizarMenu = async (req, res) => {
  try {
    const { error, menu } = await buscarActivo(req.params.id);
    if (error) return res.status(error.status).json({ message: error.message });

    const err = await validarMenu(req.body);
    if (err) return res.status(400).json({ message: err });

    const { nombre, descripcion, precio, categoria } = req.body;
    menu.nombre = nombre;
    menu.descripcion = descripcion || "";
    menu.precio = Number(precio);
    menu.categoria = categoria;
    await menu.save();
    return res.json({ message: "Menú actualizado con éxito", menu });
  } catch (error) {
    return res.status(500).json({ message: "Error al actualizar el menú", error: error.message });
  }
};

const cambiarDisponibilidad = (disponible) => async (req, res) => {
  try {
    const { error, menu } = await buscarActivo(req.params.id);
    if (error) return res.status(error.status).json({ message: error.message });

    if (menu.disponible === disponible) {
      return res.status(400).json({
        message: disponible ? "El menú ya está activo" : "El menú ya está desactivado",
      });
    }

    menu.disponible = disponible;
    await menu.save();
    return res.json({
      message: disponible ? "Menú reactivado" : "Menú desactivado",
      menu,
    });
  } catch (error) {
    return res.status(500).json({ message: "Error al cambiar la disponibilidad", error: error.message });
  }
};

// PATCH /api/menus/:id/desactivar  y  /activar
const desactivarMenu = cambiarDisponibilidad(false);
const activarMenu = cambiarDisponibilidad(true);

// DELETE /api/menus/:id (borrado lógico)
const eliminarMenu = async (req, res) => {
  try {
    const { error, menu } = await buscarActivo(req.params.id);
    if (error) return res.status(error.status).json({ message: error.message });

    menu.fecha_eliminado = new Date();
    await menu.save();
    return res.json({ message: "Menú eliminado con éxito" });
  } catch (error) {
    return res.status(500).json({ message: "Error al eliminar el menú", error: error.message });
  }
};

module.exports = {
  listarMenus,
  crearMenu,
  actualizarMenu,
  desactivarMenu,
  activarMenu,
  eliminarMenu,
};
