// controllers/pedido.controller.js - API de pedidos
const mongoose = require("mongoose");
const Pedido = require("../models/Pedido");
const Menu = require("../models/Menu");

// Estados finales: ya no se pueden modificar
const ESTADOS_FINALES = ["entregado", "cancelado"];

const buscarActivo = async (id) => {
  if (!mongoose.isValidObjectId(id)) {
    return { error: { status: 400, message: "El id del pedido no es válido" } };
  }
  const pedido = await Pedido.findOne({ _id: id, fecha_eliminado: null });
  if (!pedido) return { error: { status: 404, message: "Pedido no encontrado" } };
  return { pedido };
};

// GET /api/pedidos?estado=pendiente  (la cocina ve todos los pedidos)
const listarPedidos = async (req, res) => {
  try {
    const filtro = { fecha_eliminado: null };
    if (req.query.estado) {
      if (!Pedido.ESTADOS.includes(req.query.estado)) {
        return res.status(400).json({ message: `Estado no válido. Usa: ${Pedido.ESTADOS.join(", ")}` });
      }
      filtro.estado = req.query.estado;
    }
    const pedidos = await Pedido.find(filtro).populate("menus").sort({ fecha_creacion: -1 });
    return res.json(pedidos);
  } catch (error) {
    return res.status(500).json({ message: "Error al listar pedidos", error: error.message });
  }
};

// POST /api/pedidos  body: { menus: [id, id, ...] }
const crearPedido = async (req, res) => {
  try {
    const { menus } = req.body;

    if (!Array.isArray(menus) || menus.length === 0) {
      return res.status(400).json({ message: "El pedido debe incluir al menos un menú" });
    }
    if (!menus.every((id) => mongoose.isValidObjectId(id))) {
      return res.status(400).json({ message: "La lista contiene ids de menú no válidos" });
    }

    // Buscar los menús distintos (los ids pueden repetirse)
    const idsUnicos = [...new Set(menus.map(String))];
    const encontrados = await Menu.find({ _id: { $in: idsUnicos }, fecha_eliminado: null });
    const porId = new Map(encontrados.map((m) => [String(m._id), m]));

    for (const id of idsUnicos) {
      const menu = porId.get(id);
      if (!menu) {
        return res.status(404).json({ message: "Uno de los menús seleccionados ya no existe" });
      }
      if (!menu.disponible) {
        return res.status(400).json({ message: `El menú "${menu.nombre}" no está disponible` });
      }
    }

    // El total lo calcula el servidor, no el cliente
    const total = menus.reduce((acc, id) => acc + porId.get(String(id)).precio, 0);

    const pedido = await Pedido.create({
      menus,
      total: Math.round(total * 100) / 100,
      estado: "pendiente",
    });

    return res.status(201).json({ message: "Pedido creado con éxito", pedidoId: pedido._id, pedido });
  } catch (error) {
    return res.status(500).json({ message: "Error al crear el pedido", error: error.message });
  }
};

// PATCH /api/pedidos/:id/estado  body: { estado }
const actualizarEstado = async (req, res) => {
  try {
    const { error, pedido } = await buscarActivo(req.params.id);
    if (error) return res.status(error.status).json({ message: error.message });

    const { estado } = req.body;
    if (!Pedido.ESTADOS.includes(estado)) {
      return res.status(400).json({ message: `Estado no válido. Usa: ${Pedido.ESTADOS.join(", ")}` });
    }
    if (ESTADOS_FINALES.includes(pedido.estado)) {
      return res.status(400).json({ message: `Un pedido ${pedido.estado} ya no puede cambiar de estado` });
    }
    if (pedido.estado === estado) {
      return res.status(400).json({ message: "El pedido ya tiene ese estado" });
    }

    pedido.estado = estado;
    await pedido.save();
    return res.json({ message: "Estado actualizado", pedido });
  } catch (error) {
    return res.status(500).json({ message: "Error al actualizar el estado", error: error.message });
  }
};

// DELETE /api/pedidos/:id (borrado lógico)
const eliminarPedido = async (req, res) => {
  try {
    const { error, pedido } = await buscarActivo(req.params.id);
    if (error) return res.status(error.status).json({ message: error.message });

    pedido.fecha_eliminado = new Date();
    await pedido.save();
    return res.json({ message: "Pedido eliminado con éxito" });
  } catch (error) {
    return res.status(500).json({ message: "Error al eliminar el pedido", error: error.message });
  }
};

module.exports = { listarPedidos, crearPedido, actualizarEstado, eliminarPedido };
