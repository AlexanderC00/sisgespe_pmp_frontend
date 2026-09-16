import { useEffect, useState } from 'react';
import { api } from '../services/api';

export function AdminDashboard() {
  const [activeTab, setActiveTab] = useState('productos'); // 'productos' | 'inventario' | 'pedidos'
  const [productos, setProductos] = useState([]);
  const [pedidos, setPedidos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);

  // Formulario Nuevo Producto
  const [nuevoNombre, setNuevoNombre] = useState('');
  const [nuevaDesc, setNuevaDesc] = useState('');
  const [nuevoPrecio, setNuevoPrecio] = useState('');
  const [nuevaUnidad, setNuevaUnidad] = useState('libras');
  const [creandoProducto, setCreandoProducto] = useState(false);

  // Cargar datos del Backend
  const cargarDatos = async () => {
    setLoading(true);
    setError(null);
    try {
      const resProds = await api.getProductos();
      setProductos(resProds.data || []);

      const resPeds = await api.getPedidos();
      setPedidos(resPeds.data || []);
    } catch (err) {
      setError(err.message || 'Error al cargar información del backend');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    cargarDatos();
  }, []);

  const handleCrearProducto = async (e) => {
    e.preventDefault();
    setCreandoProducto(true);
    setError(null);
    setSuccess(null);

    try {
      await api.createProducto({
        nombre: nuevoNombre,
        descripcion: nuevaDesc,
        precio_venta: parseFloat(nuevoPrecio),
        unidad_medida: nuevaUnidad,
        estado: 'activo',
      });
      setSuccess('¡Producto creado exitosamente!');
      setNuevoNombre('');
      setNuevaDesc('');
      setNuevoPrecio('');
      cargarDatos();
    } catch (err) {
      setError(err.message || 'Error al crear producto');
    } finally {
      setCreandoProducto(false);
    }
  };

  const handleEliminarProducto = async (id, nombre) => {
    if (!window.confirm(`¿Seguro que deseas eliminar el producto "${nombre}"?`)) return;
    setError(null);
    setSuccess(null);

    try {
      await api.deleteProducto(id);
      setSuccess(`Producto "${nombre}" eliminado correctamente.`);
      cargarDatos();
    } catch (err) {
      // Muestra el mensaje de error de validación de negocio retornado por el backend
      setError(err.message);
    }
  };

  const handleActualizarInventario = async (id, nuevaCantidad) => {
    setError(null);
    setSuccess(null);

    try {
      await api.updateInventario(id, parseInt(nuevaCantidad, 10));
      setSuccess('Inventario actualizado correctamente.');
      cargarDatos();
    } catch (err) {
      setError(err.message || 'Error al actualizar inventario');
    }
  };

  return (
    <div style={styles.container}>
      <div style={styles.headerBox}>
        <h1 style={styles.pageTitle}>👑 Panel de Administración</h1>
        <p style={styles.pageDesc}>Gestión total de productos, stock en almacén y monitoreo de pedidos.</p>
      </div>

      {error && <div style={styles.errorBox}>⚠️ {error}</div>}
      {success && <div style={styles.successBox}>✅ {success}</div>}

      {/* TABS DE NAVEGACIÓN */}
      <div style={styles.tabs}>
        <button
          style={{ ...styles.tabBtn, ...(activeTab === 'productos' ? styles.tabActive : {}) }}
          onClick={() => setActiveTab('productos')}
        >
          🥦 Productos & Catálogo ({productos.length})
        </button>
        <button
          style={{ ...styles.tabBtn, ...(activeTab === 'inventario' ? styles.tabActive : {}) }}
          onClick={() => setActiveTab('inventario')}
        >
          📦 Control de Inventario
        </button>
        <button
          style={{ ...styles.tabBtn, ...(activeTab === 'pedidos' ? styles.tabActive : {}) }}
          onClick={() => setActiveTab('pedidos')}
        >
          📋 Todos los Pedidos ({pedidos.length})
        </button>
      </div>

      {loading ? (
        <div style={styles.loading}>Cargando información del servidor backend...</div>
      ) : (
        <>
          {/* TAB 1: PRODUCTOS */}
          {activeTab === 'productos' && (
            <div style={styles.section}>
              <div style={styles.gridTwoCols}>
                {/* Formulario Agregar */}
                <div style={styles.card}>
                  <h3 style={styles.cardTitle}>➕ Registrar Nuevo Producto</h3>
                  <form onSubmit={handleCrearProducto} style={styles.form}>
                    <div style={styles.field}>
                      <label style={styles.label}>Nombre del Producto:</label>
                      <input
                        type="text"
                        value={nuevoNombre}
                        onChange={(e) => setNuevoNombre(e.target.value)}
                        placeholder="Ej: Chocho en funda"
                        required
                        style={styles.input}
                      />
                    </div>
                    <div style={styles.field}>
                      <label style={styles.label}>Descripción:</label>
                      <textarea
                        value={nuevaDesc}
                        onChange={(e) => setNuevaDesc(e.target.value)}
                        placeholder="Detalles del empaque o proceso..."
                        style={styles.textarea}
                      />
                    </div>
                    <div style={styles.rowTwo}>
                      <div style={styles.field}>
                        <label style={styles.label}>Precio ($ USD):</label>
                        <input
                          type="number"
                          step="0.01"
                          value={nuevoPrecio}
                          onChange={(e) => setNuevoPrecio(e.target.value)}
                          placeholder="1.50"
                          required
                          style={styles.input}
                        />
                      </div>
                      <div style={styles.field}>
                        <label style={styles.label}>Unidad Medida:</label>
                        <input
                          type="text"
                          value={nuevaUnidad}
                          onChange={(e) => setNuevaUnidad(e.target.value)}
                          placeholder="libras / Kg / Bandeja"
                          required
                          style={styles.input}
                        />
                      </div>
                    </div>
                    <button type="submit" disabled={creandoProducto} style={styles.btnPrimary}>
                      {creandoProducto ? 'Guardando...' : 'Guardar Producto'}
                    </button>
                  </form>
                </div>

                {/* Lista de Productos */}
                <div style={styles.card}>
                  <h3 style={styles.cardTitle}>📋 Lista de Productos Registrados</h3>
                  {productos.length === 0 ? (
                    <p style={styles.emptyText}>No hay productos en catálogo.</p>
                  ) : (
                    <div style={styles.tableWrapper}>
                      <table style={styles.table}>
                        <thead>
                          <tr>
                            <th>ID</th>
                            <th>Nombre</th>
                            <th>Precio</th>
                            <th>Unidad</th>
                            <th>Stock</th>
                            <th>Acciones</th>
                          </tr>
                        </thead>
                        <tbody>
                          {productos.map((prod) => (
                            <tr key={prod.id}>
                              <td>#{prod.id}</td>
                              <td><strong>{prod.nombre}</strong></td>
                              <td>${prod.precio_venta}</td>
                              <td>{prod.unidad_medida}</td>
                              <td>{prod.inventario?.cantidad_disponible ?? 0}</td>
                              <td>
                                <button
                                  style={styles.btnDanger}
                                  onClick={() => handleEliminarProducto(prod.id, prod.nombre)}
                                >
                                  🗑️ Eliminar
                                </button>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: INVENTARIO */}
          {activeTab === 'inventario' && (
            <div style={styles.card}>
              <h3 style={styles.cardTitle}>📦 Actualización de Stock en Inventario</h3>
              <p style={styles.cardSubtitle}>
                Modifica la cantidad disponible de cada producto. El backend refrescará la fecha de ingreso.
              </p>

              <div style={styles.tableWrapper}>
                <table style={styles.table}>
                  <thead>
                    <tr>
                      <th>ID Producto</th>
                      <th>Nombre Producto</th>
                      <th>Stock Actual</th>
                      <th>Nuevo Stock</th>
                      <th>Acción</th>
                    </tr>
                  </thead>
                  <tbody>
                    {productos.map((prod) => (
                      <InventarioRow
                        key={prod.id}
                        producto={prod}
                        onUpdate={handleActualizarInventario}
                      />
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* TAB 3: PEDIDOS */}
          {activeTab === 'pedidos' && (
            <div style={styles.card}>
              <h3 style={styles.cardTitle}>📋 Pedidos Globales del Sistema</h3>
              {pedidos.length === 0 ? (
                <p style={styles.emptyText}>No se han registrado pedidos aún.</p>
              ) : (
                <div style={styles.pedidosList}>
                  {pedidos.map((ped) => (
                    <div key={ped.id} style={styles.pedidoCard}>
                      <div style={styles.pedidoHeader}>
                        <div>
                          <strong>Pedido #{ped.id}</strong> — Cliente: {ped.cliente?.name || `ID ${ped.user_id}`} ({ped.cliente?.email})
                        </div>
                        <div style={styles.statusBadge}>{ped.estado_pedido}</div>
                      </div>
                      <div style={styles.pedidoBody}>
                        <p style={styles.metaText}>📅 Fecha: {ped.fecha_pedido}</p>
                        <p style={styles.totalText}>💰 Total: ${ped.total}</p>

                        <div style={styles.itemsList}>
                          <strong>Ítems del Pedido:</strong>
                          <ul>
                            {ped.detalles?.map((det) => (
                              <li key={det.id}>
                                {det.producto?.nombre || `Prod #${det.producto_id}`} — {det.cantidad} {det.producto?.unidad_medida || 'unidades'} x ${det.precio_unitario_historico} = ${det.subtotal}
                              </li>
                            ))}
                          </ul>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </>
      )}
    </div>
  );
}

// Subcomponente de Fila para actualizar Inventario
function InventarioRow({ producto, onUpdate }) {
  const [val, setVal] = useState(producto.inventario?.cantidad_disponible ?? 0);

  return (
    <tr>
      <td>#{producto.id}</td>
      <td><strong>{producto.nombre}</strong></td>
      <td>{producto.inventario?.cantidad_disponible ?? 0} {producto.unidad_medida}</td>
      <td>
        <input
          type="number"
          min="0"
          value={val}
          onChange={(e) => setVal(e.target.value)}
          style={styles.inputSmall}
        />
      </td>
      <td>
        <button
          style={styles.btnSuccess}
          onClick={() => onUpdate(producto.id, val)}
        >
          💾 Guardar Stock
        </button>
      </td>
    </tr>
  );
}

const styles = {
  container: {
    padding: '2rem',
    maxWidth: '1200px',
    margin: '0 auto',
    color: '#f8fafc',
  },
  headerBox: {
    marginBottom: '1.5rem',
  },
  pageTitle: {
    fontSize: '2rem',
    margin: 0,
    color: '#fbbf24',
  },
  pageDesc: {
    color: '#94a3b8',
    margin: '0.4rem 0 0',
  },
  errorBox: {
    backgroundColor: '#7f1d1d',
    color: '#fecaca',
    padding: '1rem',
    borderRadius: '6px',
    marginBottom: '1rem',
  },
  successBox: {
    backgroundColor: '#064e3b',
    color: '#a7f3d0',
    padding: '1rem',
    borderRadius: '6px',
    marginBottom: '1rem',
  },
  tabs: {
    display: 'flex',
    gap: '0.5rem',
    marginBottom: '1.5rem',
    flexWrap: 'wrap',
  },
  tabBtn: {
    padding: '0.75rem 1.25rem',
    backgroundColor: '#1e293b',
    color: '#cbd5e1',
    border: '1px solid #334155',
    borderRadius: '6px',
    cursor: 'pointer',
    fontWeight: 'bold',
  },
  tabActive: {
    backgroundColor: '#d97706',
    color: '#ffffff',
    borderColor: '#f59e0b',
  },
  loading: {
    padding: '2rem',
    textAlign: 'center',
    fontSize: '1.1rem',
    color: '#94a3b8',
  },
  section: {
    display: 'flex',
    flexDirection: 'column',
    gap: '1.5rem',
  },
  gridTwoCols: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(340px, 1fr))',
    gap: '1.5rem',
  },
  card: {
    backgroundColor: '#1e293b',
    padding: '1.5rem',
    borderRadius: '8px',
    border: '1px solid #334155',
  },
  cardTitle: {
    margin: '0 0 1rem',
    fontSize: '1.25rem',
    color: '#f1f5f9',
  },
  cardSubtitle: {
    color: '#94a3b8',
    fontSize: '0.9rem',
    marginTop: '-0.5rem',
    marginBottom: '1rem',
  },
  form: {
    display: 'flex',
    flexDirection: 'column',
    gap: '1rem',
  },
  field: {
    display: 'flex',
    flexDirection: 'column',
    gap: '0.3rem',
  },
  rowTwo: {
    display: 'grid',
    gridTemplateColumns: '1fr 1fr',
    gap: '0.8rem',
  },
  label: {
    fontSize: '0.85rem',
    color: '#cbd5e1',
  },
  input: {
    padding: '0.6rem',
    borderRadius: '4px',
    border: '1px solid #334155',
    backgroundColor: '#0f172a',
    color: '#fff',
  },
  textarea: {
    padding: '0.6rem',
    borderRadius: '4px',
    border: '1px solid #334155',
    backgroundColor: '#0f172a',
    color: '#fff',
    minHeight: '60px',
  },
  inputSmall: {
    padding: '0.4rem',
    width: '90px',
    borderRadius: '4px',
    border: '1px solid #334155',
    backgroundColor: '#0f172a',
    color: '#fff',
  },
  btnPrimary: {
    padding: '0.75rem',
    backgroundColor: '#10b981',
    color: '#fff',
    border: 'none',
    borderRadius: '4px',
    fontWeight: 'bold',
    cursor: 'pointer',
  },
  btnDanger: {
    padding: '0.35rem 0.6rem',
    backgroundColor: '#ef4444',
    color: '#fff',
    border: 'none',
    borderRadius: '4px',
    fontSize: '0.8rem',
    cursor: 'pointer',
  },
  btnSuccess: {
    padding: '0.4rem 0.7rem',
    backgroundColor: '#059669',
    color: '#fff',
    border: 'none',
    borderRadius: '4px',
    fontSize: '0.8rem',
    cursor: 'pointer',
  },
  emptyText: {
    color: '#94a3b8',
  },
  tableWrapper: {
    overflowX: 'auto',
  },
  table: {
    width: '100%',
    borderCollapse: 'collapse',
    textAlign: 'left',
    fontSize: '0.9rem',
  },
  pedidosList: {
    display: 'flex',
    flexDirection: 'column',
    gap: '1rem',
  },
  pedidoCard: {
    backgroundColor: '#0f172a',
    padding: '1rem',
    borderRadius: '6px',
    border: '1px solid #334155',
  },
  pedidoHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '0.5rem',
  },
  statusBadge: {
    backgroundColor: '#d97706',
    color: '#fff',
    padding: '0.2rem 0.5rem',
    borderRadius: '4px',
    fontSize: '0.75rem',
    fontWeight: 'bold',
    textTransform: 'uppercase',
  },
  pedidoBody: {
    fontSize: '0.9rem',
  },
  metaText: {
    margin: '0.2rem 0',
    color: '#94a3b8',
  },
  totalText: {
    margin: '0.2rem 0 0.5rem',
    fontWeight: 'bold',
    color: '#34d399',
  },
  itemsList: {
    marginTop: '0.5rem',
    fontSize: '0.85rem',
  },
};
