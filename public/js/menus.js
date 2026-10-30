// public/js/menus.js - Crear, editar, activar/desactivar y eliminar menús
import { llamarApi } from "./api.js";

document.addEventListener("DOMContentLoaded", () => {
  const form = document.getElementById("crear-menu-form");
  const titulo = document.getElementById("titulo-form");
  const btnGuardar = document.getElementById("btn-guardar");
  const btnCancelar = document.getElementById("btn-cancelar");
  const lista = document.getElementById("lista-menus-admin");

  let idEditando = null;

  const salirDeEdicion = () => {
    idEditando = null;
    form.reset();
    titulo.textContent = "Nuevo menú";
    btnGuardar.textContent = "Guardar plato en el menú";
    btnCancelar.classList.add("hidden");
  };

  form.addEventListener("submit", async (event) => {
    event.preventDefault();

    const nombre = form.nombre.value.trim();
    const precio = parseFloat(form.precio.value);
    const categoria = form.categoria.value;
    const descripcion = form.descripcion.value.trim();

    if (nombre.length < 3) return alert("El nombre debe tener al menos 3 caracteres.");
    if (!Number.isFinite(precio) || precio <= 0) return alert("El precio debe ser un número mayor a 0.");
    if (!categoria) return alert("Selecciona una categoría.");
    if (descripcion.length > 300) return alert("La descripción no puede superar los 300 caracteres.");

    const cuerpo = { nombre, precio, categoria, descripcion };

    btnGuardar.disabled = true;
    const resultado = idEditando
      ? await llamarApi(`/api/menus/${idEditando}`, "PUT", cuerpo)
      : await llamarApi("/api/menus", "POST", cuerpo);
    btnGuardar.disabled = false;

    if (!resultado.ok) return alert(resultado.mensaje);
    window.location.reload();
  });

  btnCancelar.addEventListener("click", salirDeEdicion);

  if (lista) {
    lista.addEventListener("click", async (e) => {
      const boton = e.target.closest("button[data-accion]");
      if (!boton) return;
      const { accion, id } = boton.dataset;

      if (accion === "editar") {
        idEditando = id;
        form.nombre.value = boton.dataset.nombre;
        form.precio.value = boton.dataset.precio;
        form.categoria.value = boton.dataset.categoria;
        form.descripcion.value = boton.dataset.descripcion;
        titulo.textContent = "Editar menú";
        btnGuardar.textContent = "Guardar cambios";
        btnCancelar.classList.remove("hidden");
        form.nombre.focus();
        window.scrollTo({ top: 0, behavior: "smooth" });
        return;
      }

      let resultado;
      if (accion === "desactivar") resultado = await llamarApi(`/api/menus/${id}/desactivar`, "PATCH");
      if (accion === "activar") resultado = await llamarApi(`/api/menus/${id}/activar`, "PATCH");
      if (accion === "eliminar") {
        if (!confirm("¿Seguro que quieres eliminar este menú?")) return;
        resultado = await llamarApi(`/api/menus/${id}`, "DELETE");
      }

      if (!resultado.ok) return alert(resultado.mensaje);
      window.location.reload();
    });
  }
});
