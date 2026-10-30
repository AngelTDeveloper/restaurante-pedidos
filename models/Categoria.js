// models/Categoria.js
const mongoose = require("mongoose");

const categoriaSchema = new mongoose.Schema({
  nombre: {
    type: String,
    required: [true, "El nombre de la categoría es obligatorio"],
    trim: true,
    minlength: [3, "El nombre debe tener al menos 3 caracteres"],
    maxlength: [50, "El nombre no puede superar los 50 caracteres"],
  },
  fecha_creacion: { type: Date, default: Date.now },
  // Borrado lógico
  fecha_eliminado: { type: Date, default: null },
});

module.exports = mongoose.model("Categoria", categoriaSchema);
