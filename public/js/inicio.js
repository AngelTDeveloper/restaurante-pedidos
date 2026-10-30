// public/js/inicio.js - Botones "Añadir al Pedido"
import { agregarMenu } from "./carrito.js";

document.addEventListener("DOMContentLoaded", () => {
  const btnMenus = document.querySelectorAll(".btn-menu");

  btnMenus.forEach((btn) => {
    btn.addEventListener("click", (e) => {
      const { id, precio, nombre } = e.currentTarget.dataset;
      agregarMenu({ id, precio, nombre });
    });
  });
});
