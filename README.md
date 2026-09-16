# Sistema de Gestión y Pedidos de Productos Mínimamente Procesados (Frontend)

Este repositorio contiene la aplicación cliente web desarrollada en **React (Vite)** para el **Sistema de Gestión y Pedidos de Productos Mínimamente Procesados (SISGESPE PMP)**. Se conecta directamente con la API RESTful de Laravel en el backend.

---

## 📌 Requisitos Previos

- **Node.js** >= 18.0
- **NPM** o **Yarn**
- Backend en Laravel ejecutándose localmente en `http://127.0.0.1:8000`

---

## 🚀 Guía de Instalación y Ejecución

Sigue estos pasos para clonar e iniciar el proyecto cliente localmente:

### 1. Clonar e ingresar a la carpeta del Frontend

```bash
git clone https://github.com/AlexanderC00/sisgespe_pmp_frontend.git
cd sisgespe_pmp_frontend
```

### 2. Instalar Dependencias

```bash
npm install
```

### 3. Iniciar Servidor Local de Desarrollo (Vite)

```bash
npm run dev
```

La aplicación estará accesible por defecto en `http://localhost:5173`.

---

## 🔑 Cuentas de Acceso Iniciales (Seeders del Backend)

Luego de clonar el proyecto y ejecutar las migraciones y datos de prueba en el backend de Laravel (`php artisan migrate --seed`), puedes iniciar sesión en el frontend utilizando los siguientes correos registrados:

- 👑 **Cuenta de Administrador:** `admin@example.com`
- 🛒 **Cuenta de Cliente:** `cliente1@example.com`

---

## 🌐 Funcionalidades Disponibles en la Aplicación (MVP)

### 1. Módulo de Autenticación (`Login` y `Registro`)
- Registro de nuevos usuarios indicando rol (`cliente` o `admin`).
- Inicio de sesión con generación y persistencia del Token Bearer Sanctum en el store global (`AuthContext`) y `localStorage`.

### 2. Panel de Administración (`AdminDashboard`)
- **Gestión de Productos**: Alta de productos PMP, consulta de catálogo y eliminación segura (con bloqueo en caso de existencias en stock o pedidos activos).
- **Control de Inventario**: Modificación directa de existencias disponibles (`cantidad_disponible`) en almacén.
- **Visualización Global**: Monitoreo de todos los pedidos registrados en el sistema.

### 3. Panel de Cliente (`ClienteDashboard`)
- **Catálogo y Pedidos**: Visualización en tiempo real de productos y su disponibilidad física. Permite armar y enviar pedidos descontando unidades del stock.
- **Mis Pedidos**: Historial de compras protegido mediante aislamiento de datos por usuario, con opción de cancelar/eliminar pedidos propios devolviendo el stock al almacén.

---

## 📚 Documentación para Desarrolladores

Para comprender la estructura de componentes o si provienes de un entorno en **Vue.js**:

- 📘 [**Guía del Desarrollador (Equivalencias Vue.js vs React)**](docs/DEV_GUIDE.md): Comparativa detallada entre Vue (Composition API, Pinia, `v-model`) y React (`useState`, `useContext`, JSX).
- 💻 [**Documentación Técnica del Frontend**](docs/README.md): Explicación detallada de la arquitectura de archivos, servicios HTTP y flujo de autenticación.
