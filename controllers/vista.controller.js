// controllers/vista.controller.js - Renderiza las vistas EJS
const Categoria = require("../models/Categoria");
const Menu = require("../models/Menu");
const Pedido = require("../models/Pedido");

const ETIQUETAS_ESTADO = {
  pendiente: "Pendiente",
  en_preparacion: "En preparación",
  listo: "Listo",
  entregado: "Entregado",
  cancelado: "Cancelado",
};

// GET /  -> menú disponible, agrupado por categoría
const vistaInicio = async (req, res) => {
  try {
    const menus = await Menu.find({ fecha_eliminado: null, disponible: true })
      .populate("categoria")
      .sort({ nombre: 1 });

    const grupos = {};
    menus.forEach((menu) => {
      const nombreCategoria = menu.categoria ? menu.categoria.nombre : "Sin categoría";
      if (!grupos[nombreCategoria]) grupos[nombreCategoria] = [];
      grupos[nombreCategoria].push(menu);
    });

    return res.render("inicio", { menus, grupos });
  } catch (error) {
    return res.status(500).render("error", { mensaje: "No se pudo cargar el menú" });
  }
};

// GET /categorias
const vistaCategorias = async (req, res) => {
  try {
    const categorias = await Categoria.find({ fecha_eliminado: null }).sort({ nombre: 1 });
    return res.render("categorias", { categorias });
  } catch (error) {
    return res.status(500).render("error", { mensaje: "No se pudieron cargar las categorías" });
  }
};

// GET /menus  -> gestión del menú (activos e inactivos)
const vistaMenus = async (req, res) => {
  try {
    const categorias = await Categoria.find({ fecha_eliminado: null }).sort({ nombre: 1 });
    const menus = await Menu.find({ fecha_eliminado: null })
      .populate("categoria")
      .sort({ fecha_creacion: -1 });
    return res.render("menus", { categorias, menus });
  } catch (error) {
    return res.status(500).render("error", { mensaje: "No se pudo cargar la gestión de menús" });
  }
};

// GET /pedidos  -> vista de cocina
const vistaPedidos = async (req, res) => {
  try {
    const pedidos = await Pedido.find({ fecha_eliminado: null })
      .populate("menus")
      .sort({ fecha_creacion: -1 });
    return res.render("pedidos", {
      pedidos,
      estados: Pedido.ESTADOS,
      etiquetas: ETIQUETAS_ESTADO,
    });
  } catch (error) {
    return res.status(500).render("error", { mensaje: "No se pudieron cargar los pedidos" });
  }
};

module.exports = { vistaInicio, vistaCategorias, vistaMenus, vistaPedidos };
