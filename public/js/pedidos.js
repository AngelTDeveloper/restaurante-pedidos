// public/js/pedidos.js - Cambiar estado y eliminar pedidos
import { llamarApi } from "./api.js";

document.addEventListener("DOMContentLoaded", () => {
  const lista = document.getElementById("lista-pedidos");
  if (!lista) return;

  lista.addEventListener("change", async (e) => {
    const select = e.target.closest("select.select-estado");
    if (!select) return;

    const resultado = await llamarApi(`/api/pedidos/${select.dataset.id}/estado`, "PATCH", {
      estado: select.value,
    });

    if (!resultado.ok) {
      alert(resultado.mensaje);
      select.value = select.dataset.actual;
      return;
    }
    window.location.reload();
  });

  lista.addEventListener("click", async (e) => {
    const boton = e.target.closest("button[data-accion='eliminar']");
    if (!boton) return;
    if (!confirm("¿Seguro que quieres eliminar este pedido?")) return;

    const resultado = await llamarApi(`/api/pedidos/${boton.dataset.id}`, "DELETE");
    if (!resultado.ok) return alert(resultado.mensaje);
    window.location.reload();
  });
});
