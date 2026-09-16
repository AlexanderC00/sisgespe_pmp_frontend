# 💻 Documentación del Frontend - SISGESPE PMP (React + Vite)

Esta documentación describe la arquitectura, estructura de carpetas, flujo de autenticación, manejo de estado y conexión con el backend de Laravel para el **Sistema de Gestión y Pedidos de Productos Mínimamente Procesados (SISGESPE PMP)**.

---

## 🗺️ Estructura del Proyecto Frontend

```text
sisgespe_pmp_frontend/
├── docs/
│   └── README.md              # Documentación técnica del frontend
├── public/                    # Archivos estáticos de la aplicación
├── src/
│   ├── services/
│   │   └── api.js             # Servicio central de conexión HTTP con Laravel API
│   ├── context/
│   │   └── AuthContext.jsx    # Estado global de autenticación (Token y Usuario en Store/localStorage)
│   ├── components/
│   │   └── Navbar.jsx         # Barra de navegación con datos de usuario y botón de logout
│   ├── pages/
│   │   ├── Login.jsx          # Vista de Inicio de Sesión
│   │   ├── Register.jsx       # Vista de Registro de Nuevos Usuarios
│   │   ├── AdminDashboard.jsx # Panel de Administración (Productos, Inventario y Pedidos)
│   │   └── ClienteDashboard.jsx # Panel de Cliente (Catálogo, Creación de Pedidos y Mis Compras)
│   ├── App.jsx                # Enrutador principal y control de vistas según estado/rol
│   ├── App.css                # Estilos generales del sistema
│   └── main.jsx               # Punto de entrada principal de React
├── index.html                 # Plantilla HTML principal
├── package.json               # Dependencias del proyecto Vite + React
└── vite.config.js             # Configuración de Vite
```

---

## 🔌 Conexión con el Backend (API Laravel)

El frontend se conecta con la API de Laravel ejecutándose en:
- **Base URL API:** `http://127.0.0.1:8000/api`

### Configuración del Servicio HTTP (`src/services/api.js`)
Todas las peticiones HTTP hacia el backend se canalizan a través de funciones centralizadas que adjuntan automáticamente el **Bearer Token** guardado en el store/`localStorage` en el encabezado `Authorization`:

```javascript
// Encabezado enviado en rutas protegidas
Authorization: `Bearer ${token}`
Content-Type: "application/json"
```

---

## 🔐 Flujo de Autenticación y Manejo de Estado (Store / AuthContext)

El estado de autenticación se gestiona de forma reactiva con React Context (`AuthContext.jsx`) y se rehidrata desde `localStorage`:

1. **Inicio de Sesión (`POST /api/user/login`)**:
   - El usuario ingresa correo y contraseña.
   - El backend responde con el `access_token` Bearer y la información del `user` (incluyendo su `rol`: `'admin'` o `'cliente'`).
   - El token y los datos de usuario se almacenan en `localStorage` y en el estado global.

2. **Registro de Usuario (`POST /api/user/register`)**:
   - Permite registrar un nuevo usuario con rol asignado (`cliente` o `admin`).
   - Al registrarse, se almacena el token devuelto y se inicia sesión automáticamente.

3. **Control de Vistas según Rol**:
   - **Si `user.rol === 'admin'`**: Se renderiza la vista [`AdminDashboard.jsx`](../src/pages/AdminDashboard.jsx).
   - **Si `user.rol === 'cliente'`**: Se renderiza la vista [`ClienteDashboard.jsx`](../src/pages/ClienteDashboard.jsx).

4. **Cierre de Sesión (`POST /api/user/logout`)**:
   - Envía la petición al backend para revocar el token en la base de datos.
   - Limpia el token de `localStorage` y redirige a la vista de Login.

---

## ⚙️ Módulos y Funcionalidades Conectadas al Backend (MVP)

### 1. Vista de Administrador (`AdminDashboard.jsx`)
- **Catálogo de Productos**:
  - Consulta de productos (`GET /api/producto`).
  - Creación de nuevos productos (`POST /api/producto`).
  - Eliminación de productos (`DELETE /api/producto/{id}`): Con manejo de errores en pantalla si el producto conserva stock (>0) o pedidos asociados.
- **Gestión de Inventario**:
  - Actualización directa del stock disponible (`PUT /api/inventario/{id}`).
- **Monitoreo de Pedidos**:
  - Visualización global de todos los pedidos realizados en el sistema (`GET /api/pedido`).

### 2. Vista de Cliente (`ClienteDashboard.jsx`)
- **Catálogo y Compra**:
  - Visualización del catálogo de productos con unidades en inventario real.
  - Formulario interactivo para seleccionar producto, cantidad y agregar al pedido.
  - Envío del pedido (`POST /api/pedido`) con descuento automático de stock.
- **Mis Pedidos**:
  - Consulta segura aislada de las compras propias del cliente (`GET /api/pedido`).
  - Opción de cancelar/eliminar pedidos propios (`DELETE /api/pedido/{id}`) con devolución automática de stock.

---

## 🚀 Cómo Ejecutar el Frontend Localmente

1. Navega a la carpeta del frontend:
   ```bash
   cd sisgespe_pmp_frontend
   ```

2. Instala las dependencias (si es necesario):
   ```bash
   npm install
   ```

3. Inicia el servidor de desarrollo de Vite:
   ```bash
   npm run dev
   ```

La aplicación se abrirá en `http://localhost:5173`. Asegúrate de tener corriendo el backend de Laravel (`php artisan serve`) en `http://127.0.0.1:8000`.
