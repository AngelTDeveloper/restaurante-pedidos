// public/js/api.js - Helper para llamar a la API y mostrar errores
export async function llamarApi(url, metodo = "GET", cuerpo) {
  try {
    const opciones = { method: metodo, headers: {} };
    if (cuerpo !== undefined) {
      opciones.headers["Content-Type"] = "application/json";
      opciones.body = JSON.stringify(cuerpo);
    }
    const respuesta = await fetch(url, opciones);
    const datos = await respuesta.json().catch(() => ({}));
    if (!respuesta.ok) {
      return { ok: false, mensaje: datos.message || `Error en el servidor (${respuesta.status})` };
    }
    return { ok: true, datos };
  } catch (error) {
    return { ok: false, mensaje: "No se pudo conectar con el servidor" };
  }
}
