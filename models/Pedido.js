// models/Pedido.js
const mongoose = require("mongoose");

const ESTADOS = ["pendiente", "en_preparacion", "listo", "entregado", "cancelado"];

const pedidoSchema = new mongoose.Schema({
  // Un mismo menú puede repetirse (ej. 2 pizzas)
  menus: {
    type: [{ type: mongoose.Schema.Types.ObjectId, ref: "Menu" }],
    validate: [(v) => v.length > 0, "El pedido debe tener al menos un menú"],
  },
  total: { type: Number, required: true, min: 0 },
  // Por defecto, un pedido se registra como "pendiente"
  estado: { type: String, enum: ESTADOS, default: "pendiente" },
  fecha_creacion: { type: Date, default: Date.now },
  fecha_eliminado: { type: Date, default: null },
});

const Pedido = mongoose.model("Pedido", pedidoSchema);
Pedido.ESTADOS = ESTADOS;

module.exports = Pedido;
