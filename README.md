# Gestión de pedidos de un restaurante (MVC)

Node.js + Express + EJS + MongoDB (Mongoose).

## Puesta en marcha
1. Tener MongoDB corriendo y ajustar `MONGO_URI` en `.env`.
2. `npm install`
3. `npm run dev`  (o `npm start`)
4. Abrir http://localhost:3000

## Vistas
| Ruta         | Descripción                                   |
|--------------|-----------------------------------------------|
| GET /        | Menú disponible por categoría + carrito       |
| GET /categorias | Crear, editar y eliminar categorías        |
| GET /menus   | Crear, editar, desactivar/reactivar y eliminar menús |
| GET /pedidos | Pedidos para la cocina (cambiar estado, eliminar) |

## API (JSON)
| Método | Ruta                          | Acción                       |
|--------|-------------------------------|------------------------------|
| GET    | /api/categorias               | Listar                       |
| POST   | /api/categorias               | Crear                        |
| PUT    | /api/categorias/:id           | Actualizar                   |
| DELETE | /api/categorias/:id           | Eliminar (borrado lógico)    |
| GET    | /api/menus                    | Listar                       |
| POST   | /api/menus                    | Crear (disponible por defecto) |
| PUT    | /api/menus/:id                | Actualizar                   |
| PATCH  | /api/menus/:id/desactivar     | Desactivar                   |
| PATCH  | /api/menus/:id/activar        | Reactivar                    |
| DELETE | /api/menus/:id                | Eliminar (borrado lógico)    |
| GET    | /api/pedidos[?estado=...]     | Listar pedidos               |
| POST   | /api/pedidos                  | Crear `{ menus: [ids] }` (estado pendiente) |
| PATCH  | /api/pedidos/:id/estado       | Cambiar estado `{ estado }`  |
| DELETE | /api/pedidos/:id              | Eliminar (borrado lógico)    |

Estados de un pedido: `pendiente`, `en_preparacion`, `listo`, `entregado`, `cancelado`.
