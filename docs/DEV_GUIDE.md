# 📘 Guía del Desarrollador (Equivalencias Vue.js vs React)

Este documento está diseñado como una guía rápida para desarrolladores con experiencia en **Vue.js** que están explorando la arquitectura de este proyecto frontend en **React (Vite)**.

---

## 🔄 Tabla Comparativa de Conceptos Clave (Vue.js vs React)

| Concepto | Vue.js (Composition API / Options) | React (Hooks / JSX) | Cómo se implementa en este proyecto |
| :--- | :--- | :--- | :--- |
| **Punto de Entrada** | `main.js` (`createApp(App).mount('#app')`) | `main.jsx` (`createRoot().render(<App />)`) | [`src/main.jsx`](../src/main.jsx) |
| **Estado Reactivo Local** | `const email = ref('')` | `const [email, setEmail] = useState('')` | Utilizado en todos los formularios (`Login.jsx`, `Register.jsx`). |
| **Ciclos de Vida / Efectos** | `onMounted(() => { ... })` | `useEffect(() => { ... }, [])` | Usado para cargar productos e inventario desde el backend. |
| **Estado Global / Store** | **Pinia** / **Vuex** (`useAuthStore()`) | **React Context API** (`useContext(AuthContext)`) | [`src/context/AuthContext.jsx`](../src/context/AuthContext.jsx) (Manejo de token y sesión). |
| **Binding Bidireccional** | `v-model="email"` | Componente Controlado: `value={email} onChange={e => setEmail(e.target.value)}` | Captura de inputs en formularios. |
| **Renderizado Condicional** | `v-if="isAdmin"` / `v-else` | Operador Ternario: `{isAdmin ? <AdminDashboard /> : <ClienteDashboard />}` | Intercambio de paneles en [`src/App.jsx`](../src/App.jsx). |
| **Renderizado de Listas** | `v-for="prod in productos" :key="prod.id"` | `{productos.map(prod => <div key={prod.id}>...</div>)}` | Renderizado de tablas y listas en Dashboards. |
| **Cliente HTTP** | `axios.create()` | `axios.create()` + Interceptores | [`src/services/api.js`](../src/services/api.js) |

---

## 🛠️ Explicación de la Arquitectura del Proyecto

### 1. Servicio API Centralizado con Axios (`src/services/api.js`)
Al igual que en Vue cuando se configura una instancia global de Axios con `axios.create()`:
- Se utiliza `axios.create()` configurado con `import.meta.env.VITE_API_URL`.
- Cuenta con un **Interceptor de Peticiones** (`interceptors.request.use`) que inyecta automáticamente el encabezado `Authorization: Bearer <token>` consultando `localStorage`.
- Cuenta con un **Interceptor de Respuestas** (`interceptors.response.use`) que captura e interpreta los mensajes de error retornados por la API de Laravel.

### 2. Manejo de Estado de Autenticación (`src/context/AuthContext.jsx`)
Equivalente a un Store de **Pinia** en Vue:
- Almacena en memoria y en `localStorage` el `access_token` y el objeto `user`.
- Expone el hook personalizado `useAuth()` para consumir en cualquier componente los métodos `login()`, `register()`, `logout()` y los flags booleanos `isAdmin` / `isCliente`.

### 3. Vistas Principales
- **`Login.jsx` & `Register.jsx`**: Vistas de autenticación que interactúan con `AuthContext`.
- **`AdminDashboard.jsx`**: Panel donde el usuario administrador puede crear/eliminar productos del catálogo, ajustar existencias en `inventarios` y monitorear todos los pedidos.
- **`ClienteDashboard.jsx`**: Panel donde los clientes pueden armar su pedido (con validación de stock en tiempo real) y consultar/cancelar sus compras registradas.
