// public/js/carrito.js - Lógica centralizada del carrito (usa localStorage)
const STORAGE_KEY = "menus";
const LISTA_MENUS_ID = "lista-menus";
const CANTIDAD_PEDIDOS_ID = "cantidad-pedidos";
const TOTAL_PEDIDO_ID = "total-pedido";

function escaparHtml(texto) {
  return String(texto)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

function obtenerMenus() {
  try {
    return JSON.parse(localStorage.getItem(STORAGE_KEY) || "[]");
  } catch (error) {
    return [];
  }
}

function guardarMenus(menus) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(menus));
}

function agregarMenu(nuevoMenu) {
  const menus = obtenerMenus();
  menus.push({
    idMenu: nuevoMenu.id,
    precio: nuevoMenu.precio,
    nombre: nuevoMenu.nombre,
    id: Date.now().toString() + Math.random().toString(16).slice(2, 6),
  });
  guardarMenus(menus);
  actualizarCarritoUI();
}

function eliminarMenu(menuId) {
  const menus = obtenerMenus().filter((menu) => menu.id != menuId);
  guardarMenus(menus);
  actualizarCarritoUI();
}

function crearHtmlItemMenu(menu) {
  return `
    <div class="w-full flex items-center justify-between border-2 border-primary text-primary rounded-lg p-2 mt-2">
      <p class="text-sm">${escaparHtml(menu.nombre)} - ${Number(menu.precio).toFixed(2)}$</p>
      <button data-id="${escaparHtml(menu.id)}" class="btn-eliminar-menu font-bold text-primary text-sm" aria-label="Quitar del carrito">
        X
      </button>
    </div>
  `;
}

function actualizarContador() {
  const cantidadPedidos = document.getElementById(CANTIDAD_PEDIDOS_ID);
  if (cantidadPedidos) {
    cantidadPedidos.innerText = obtenerMenus().length;
  }
}

function obtenerTotalPedido() {
  return obtenerMenus().reduce((acumulador, menu) => acumulador + Number(menu.precio), 0);
}

function actualizarTotalUI() {
  const totalElemento = document.getElementById(TOTAL_PEDIDO_ID);
  if (totalElemento) {
    totalElemento.innerText = `${obtenerTotalPedido().toFixed(2)}$`;
  }
}

function actualizarCarritoUI() {
  const listaMenu = document.getElementById(LISTA_MENUS_ID);
  const menus = obtenerMenus();

  if (listaMenu) {
    if (menus.length !== 0) {
      listaMenu.innerHTML = menus.map(crearHtmlItemMenu).join("");
    } else {
      listaMenu.innerHTML = `<p class="font-semibold text-black">No hay ningún menú seleccionado</p>`;
    }
  }

  actualizarContador();
  actualizarTotalUI();
}

function inicializarListenersCarrito() {
  const listaMenu = document.getElementById(LISTA_MENUS_ID);
  if (listaMenu) {
    listaMenu.addEventListener("click", (e) => {
      if (e.target.classList.contains("btn-eliminar-menu")) {
        eliminarMenu(e.target.dataset.id);
      }
    });
  }
}

async function crearPedido() {
  const menus = obtenerMenus();

  if (menus.length === 0) {
    alert("No puedes realizar un pedido sin menús en el carrito.");
    return;
  }

  const payload = { menus: menus.map((menu) => menu.idMenu) };

  try {
    const response = await fetch("/api/pedidos", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    const data = await response.json().catch(() => ({}));

    if (!response.ok) {
      throw new Error(data.message || `Error en el servidor: ${response.status}`);
    }

    localStorage.removeItem(STORAGE_KEY);
    actualizarCarritoUI();
    alert("¡Pedido creado con éxito! Puedes verlo en la sección Pedidos.");
    return data;
  } catch (error) {
    alert(`No se pudo crear el pedido: ${error.message}`);
  }
}

export {
  obtenerMenus,
  agregarMenu,
  eliminarMenu,
  actualizarCarritoUI,
  actualizarContador,
  inicializarListenersCarrito,
  obtenerTotalPedido,
  crearPedido,
};
