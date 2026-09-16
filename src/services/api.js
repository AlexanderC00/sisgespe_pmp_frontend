import axios from 'axios';

const apiInstance = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://127.0.0.1:8000/api',
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
  },
});

// Interceptor para inyectar automáticamente el Bearer Token en cada petición
apiInstance.interceptors.request.use((config) => {
  const token = localStorage.getItem('access_token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Interceptor de respuesta para capturar y formatear errores del backend
apiInstance.interceptors.response.use(
  (response) => response.data,
  (error) => {
    const errorMsg =
      error.response?.data?.message ||
      error.response?.data?.error ||
      'Ocurrió un error en la comunicación con el servidor';
    return Promise.reject(new Error(errorMsg));
  }
);

export const api = {
  // Autenticación
  login: (credentials) => apiInstance.post('/user/login', credentials),
  register: (userData) => apiInstance.post('/user/register', userData),
  logout: () => apiInstance.post('/user/logout'),

  // Productos
  getProductos: () => apiInstance.get('/producto'),
  createProducto: (productoData) => apiInstance.post('/producto', productoData),
  deleteProducto: (id) => apiInstance.delete(`/producto/${id}`),

  // Inventarios
  getInventario: () => apiInstance.get('/inventario'),
  updateInventario: (id, cantidad) =>
    apiInstance.put(`/inventario/${id}`, { cantidad_disponible: cantidad }),

  // Pedidos
  getPedidos: () => apiInstance.get('/pedido'),
  createPedido: (items) => apiInstance.post('/pedido', { items }),
  deletePedido: (id) => apiInstance.delete(`/pedido/${id}`),
};
