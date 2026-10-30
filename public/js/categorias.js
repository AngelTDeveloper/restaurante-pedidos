// public/js/categorias.js - Crear, editar y eliminar categorías
import { llamarApi } from "./api.js";

document.addEventListener("DOMContentLoaded", () => {
  const form = document.getElementById("crear-categoria-form");
  const titulo = document.getElementById("titulo-form");
  const btnGuardar = document.getElementById("btn-guardar");
  const btnCancelar = document.getElementById("btn-cancelar");
  const lista = document.getElementById("lista-categorias");

  let idEditando = null;

  const salirDeEdicion = () => {
    idEditando = null;
    form.reset();
    titulo.textContent = "Nueva categoría";
    btnGuardar.textContent = "Guardar categoría";
    btnCancelar.classList.add("hidden");
  };

  form.addEventListener("submit", async (event) => {
    event.preventDefault();
    const nombre = form.nombre.value.trim();

    if (nombre.length < 3) return alert("El nombre debe tener al menos 3 caracteres.");
    if (nombre.length > 50) return alert("El nombre no puede superar los 50 caracteres.");

    btnGuardar.disabled = true;
    const resultado = idEditando
      ? await llamarApi(`/api/categorias/${idEditando}`, "PUT", { nombre })
      : await llamarApi("/api/categorias", "POST", { nombre });
    btnGuardar.disabled = false;

    if (!resultado.ok) return alert(resultado.mensaje);
    window.location.reload();
  });

  btnCancelar.addEventListener("click", salirDeEdicion);

  if (lista) {
    lista.addEventListener("click", async (e) => {
      const boton = e.target.closest("button[data-accion]");
      if (!boton) return;
      const { accion, id, nombre } = boton.dataset;

      if (accion === "editar") {
        idEditando = id;
        form.nombre.value = nombre;
        titulo.textContent = "Editar categoría";
        btnGuardar.textContent = "Guardar cambios";
        btnCancelar.classList.remove("hidden");
        form.nombre.focus();
        window.scrollTo({ top: 0, behavior: "smooth" });
      }

      if (accion === "eliminar") {
        if (!confirm("¿Seguro que quieres eliminar esta categoría?")) return;
        const resultado = await llamarApi(`/api/categorias/${id}`, "DELETE");
        if (!resultado.ok) return alert(resultado.mensaje);
        window.location.reload();
      }
    });
  }
});
