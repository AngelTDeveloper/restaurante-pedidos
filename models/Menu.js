// models/Menu.js
const mongoose = require("mongoose");

const menuSchema = new mongoose.Schema({
  nombre: {
    type: String,
    required: [true, "El nombre del plato es obligatorio"],
    trim: true,
    minlength: [3, "El nombre debe tener al menos 3 caracteres"],
    maxlength: [100, "El nombre no puede superar los 100 caracteres"],
  },
  descripcion: {
    type: String,
    trim: true,
    maxlength: [300, "La descripción no puede superar los 300 caracteres"],
    default: "",
  },
  precio: {
    type: Number,
    required: [true, "El precio es obligatorio"],
    min: [0.01, "El precio debe ser mayor a 0"],
  },
  categoria: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Categoria",
    required: [true, "La categoría es obligatoria"],
  },
  // Por defecto, un menú se crea como disponible
  disponible: { type: Boolean, default: true },
  fecha_creacion: { type: Date, default: Date.now },
  fecha_eliminado: { type: Date, default: null },
});

module.exports = mongoose.model("Menu", menuSchema);
