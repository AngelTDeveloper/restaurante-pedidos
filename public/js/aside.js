// public/js/aside.js - Lógica del componente aside (carrito)
import {
  actualizarCarritoUI,
  inicializarListenersCarrito,
  crearPedido,
} from "./carrito.js";

document.addEventListener("DOMContentLoaded", () => {
  const carritoBar = document.getElementById("carrito-bar");
  const cerrarCarrito = document.getElementById("cerrar-carrito");
  const fondo = document.getElementById("carrito-fondo");
  const btnFinalizarPedido = document.getElementById("btn-finalizar-pedido");

  const cerrar = () => carritoBar.classList.add("hidden");

  if (cerrarCarrito && carritoBar) cerrarCarrito.addEventListener("click", cerrar);
  if (fondo && carritoBar) fondo.addEventListener("click", cerrar);

  if (btnFinalizarPedido) {
    btnFinalizarPedido.addEventListener("click", async () => {
      btnFinalizarPedido.disabled = true;
      await crearPedido();
      btnFinalizarPedido.disabled = false;
    });
  }

  actualizarCarritoUI();
  inicializarListenersCarrito();
});
