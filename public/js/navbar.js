// public/js/navbar.js - Ícono del carrito: contador y apertura del aside
import { actualizarContador } from "./carrito.js";

document.addEventListener("DOMContentLoaded", () => {
  actualizarContador();

  const carrito = document.getElementById("carrito");
  if (!carrito) return;

  carrito.addEventListener("click", () => {
    const carritoBar = document.getElementById("carrito-bar");
    if (carritoBar) {
      carritoBar.classList.toggle("hidden");
    } else {
      // En las páginas sin aside, el carrito se gestiona desde el inicio
      window.location.href = "/";
    }
  });
});
