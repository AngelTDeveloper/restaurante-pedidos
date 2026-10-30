// controllers/categoria.controller.js - API de categorías
const mongoose = require("mongoose");
const Categoria = require("../models/Categoria");
const Menu = require("../models/Menu");

const validarNombre = (nombre) => {
  if (typeof nombre !== "string" || nombre.trim().length === 0) return "El nombre es obligatorio";
  if (nombre.trim().length < 3) return "El nombre debe tener al menos 3 caracteres";
  if (nombre.trim().length > 50) return "El nombre no puede superar los 50 caracteres";
  return null;
};

// Existe otra categoría activa con el mismo nombre (sin distinguir mayúsculas)
const nombreDuplicado = async (nombre, idActual = null) => {
  const filtro = {
    nombre: { $regex: `^${nombre.trim().replace(/[.*+?^${}()|[\]\\]/g, "\\$&")}$`, $options: "i" },
    fecha_eliminado: null,
  };
  if (idActual) filtro._id = { $ne: idActual };
  return Categoria.exists(filtro);
};

const buscarActiva = async (id) => {
  if (!mongoose.isValidObjectId(id)) {
    return { error: { status: 400, message: "El id de la categoría no es válido" } };
  }
  const categoria = await Categoria.findOne({ _id: id, fecha_eliminado: null });
  if (!categoria) return { error: { status: 404, message: "Categoría no encontrada" } };
  return { categoria };
};

// GET /api/categorias
const listarCategorias = async (req, res) => {
  try {
    const categorias = await Categoria.find({ fecha_eliminado: null }).sort({ nombre: 1 });
    return res.json(categorias);
  } catch (error) {
    return res.status(500).json({ message: "Error al listar categorías", error: error.message });
  }
};

// POST /api/categorias
const crearCategoria = async (req, res) => {
  try {
    const { nombre } = req.body;
    const err = validarNombre(nombre);
    if (err) return res.status(400).json({ message: err });
    if (await nombreDuplicado(nombre)) {
      return res.status(409).json({ message: "Ya existe una categoría con ese nombre" });
    }
    const categoria = await Categoria.create({ nombre });
    return res.status(201).json({ message: "Categoría creada con éxito", categoria });
  } catch (error) {
    return res.status(500).json({ message: "Error al crear la categoría", error: error.message });
  }
};

// PUT /api/categorias/:id
const actualizarCategoria = async (req, res) => {
  try {
    const { error, categoria } = await buscarActiva(req.params.id);
    if (error) return res.status(error.status).json({ message: error.message });

    const { nombre } = req.body;
    const err = validarNombre(nombre);
    if (err) return res.status(400).json({ message: err });
    if (await nombreDuplicado(nombre, categoria._id)) {
      return res.status(409).json({ message: "Ya existe una categoría con ese nombre" });
    }

    categoria.nombre = nombre;
    await categoria.save();
    return res.json({ message: "Categoría actualizada con éxito", categoria });
  } catch (error) {
    return res.status(500).json({ message: "Error al actualizar la categoría", error: error.message });
  }
};

// DELETE /api/categorias/:id (borrado lógico)
const eliminarCategoria = async (req, res) => {
  try {
    const { error, categoria } = await buscarActiva(req.params.id);
    if (error) return res.status(error.status).json({ message: error.message });

    const menusAsociados = await Menu.countDocuments({
      categoria: categoria._id,
      fecha_eliminado: null,
    });
    if (menusAsociados > 0) {
      return res.status(409).json({
        message: `No se puede eliminar: tiene ${menusAsociados} menú(s) asociado(s). Elimínalos o cámbialos de categoría primero.`,
      });
    }

    categoria.fecha_eliminado = new Date();
    await categoria.save();
    return res.json({ message: "Categoría eliminada con éxito" });
  } catch (error) {
    return res.status(500).json({ message: "Error al eliminar la categoría", error: error.message });
  }
};

module.exports = { listarCategorias, crearCategoria, actualizarCategoria, eliminarCategoria };
