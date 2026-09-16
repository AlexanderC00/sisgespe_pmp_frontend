import { useEffect, useState } from 'react';
import { api } from '../services/api';

export function ClienteDashboard() {
  const [activeTab, setActiveTab] = useState('catalogo'); // 'catalogo' | 'mis_pedidos'
  const [productos, setProductos] = useState([]);
  const [misPedidos, setMisPedidos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);

  // Carrito de compras local (para armar el pedido)
  const [carrito, setCarrito] = useState({}); // { producto_id: cantidad }
  const [enviandoPedido, setEnviandoPedido] = useState(false);

  const cargarDatos = async () => {
    setLoading(true);
    setError(null);
    try {
      const resProds = await api.getProductos();
      setProductos(resProds.data || []);

      const resPeds = await api.getPedidos();
      setMisPedidos(resPeds.data || []);
    } catch (err) {
      setError(err.message || 'Error al cargar productos');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    cargarDatos();
  }, []);

  const handleCantidadChange = (productoId, cantidad) => {
    const cantNum = parseInt(cantidad, 10);
    if (isNaN(cantNum) || cantNum <= 0) {
      const nuevoCarrito = { ...carrito };
      delete nuevoCarrito[productoId];
      setCarrito(nuevoCarrito);
    } else {
      setCarrito({
        ...carrito,
        [productoId]: cantNum,
      });
    }
  };

  const handleRealizarPedido = async () => {
    const items = Object.entries(carrito).map(([prodId, cant]) => ({
      producto_id: parseInt(prodId, 10),
      cantidad: cant,
    }));

    if (items.length === 0) {
      setError('Selecciona al menos un producto con cantidad válida para realizar el pedido.');
      return;
    }

    setEnviandoPedido(true);
    setError(null);
    setSuccess(null);

    try {
      await api.createPedido(items);
      setSuccess('🎉 ¡Tu pedido ha sido registrado con éxito!');
      setCarrito({});
      cargarDatos();
      setActiveTab('mis_pedidos');
    } catch (err) {
      setError(err.message || 'Error al registrar pedido');
    } finally {
      setEnviandoPedido(false);
    }
  };

  const handleCancelarPedido = async (pedidoId) => {
    if (!window.confirm('¿Seguro que deseas cancelar/eliminar este pedido?')) return;
    setError(null);
    setSuccess(null);

    try {
      await api.deletePedido(pedidoId);
      setSuccess('Pedido cancelado. El stock ha sido devuelto al inventario.');
      cargarDatos();
    } catch (err) {
      setError(err.message || 'Error al cancelar pedido');
    }
  };

  return (
    <div style={styles.container}>
      <div style={styles.headerBox}>
        <h1 style={styles.pageTitle}>🛒 Portal de Pedidos de Productos PMP</h1>
        <p style={styles.pageDesc}>Realiza tus pedidos de productos mínimamente procesados y revisa tu historial de compras.</p>
      </div>

      {error && <div style={styles.errorBox}>⚠️ {error}</div>}
      {success && <div style={styles.successBox}>✅ {success}</div>}

      {/* TABS DE NAVEGACIÓN */}
      <div style={styles.tabs}>
        <button
          style={{ ...styles.tabBtn, ...(activeTab === 'catalogo' ? styles.tabActive : {}) }}
          onClick={() => setActiveTab('catalogo')}
        >
          🥬 Catálogo de Productos ({productos.length})
        </button>
        <button
          style={{ ...styles.tabBtn, ...(activeTab === 'mis_pedidos' ? styles.tabActive : {}) }}
          onClick={() => setActiveTab('mis_pedidos')}
        >
          📋 Mis Pedidos ({misPedidos.length})
        </button>
      </div>

      {loading ? (
        <div style={styles.loading}>Cargando catálogo desde el backend...</div>
      ) : (
        <>
          {/* TAB 1: CATÁLOGO Y COMPRA */}
          {activeTab === 'catalogo' && (
            <div style={styles.section}>
              <div style={styles.card}>
                <h3 style={styles.cardTitle}>🥦 Seleccionar Productos del Catálogo</h3>

                {productos.length === 0 ? (
                  <p style={styles.emptyText}>No hay productos disponibles por el momento.</p>
                ) : (
                  <div style={styles.tableWrapper}>
                    <table style={styles.table}>
                      <thead>
                        <tr>
                          <th>Producto</th>
                          <th>Descripción</th>
                          <th>Precio Unitario</th>
                          <th>Stock Disponible</th>
                          <th>Cantidad a Pedir</th>
                        </tr>
                      </thead>
                      <tbody>
                        {productos.map((prod) => {
                          const stock = prod.inventario?.cantidad_disponible ?? 0;
                          return (
                            <tr key={prod.id}>
                              <td><strong>{prod.nombre}</strong></td>
                              <td style={styles.descCol}>{prod.descripcion || 'Sin descripción'}</td>
                              <td>${prod.precio_venta} / {prod.unidad_medida}</td>
                              <td>
                                <span style={{ color: stock > 0 ? '#34d399' : '#f87171', fontWeight: 'bold' }}>
                                  {stock > 0 ? `${stock} ${prod.unidad_medida}` : 'Agotado ❌'}
                                </span>
                              </td>
                              <td>
                                {stock > 0 ? (
                                  <input
                                    type="number"
                                    min="0"
                                    max={stock}
                                    value={carrito[prod.id] || ''}
                                    onChange={(e) => handleCantidadChange(prod.id, e.target.value)}
                                    placeholder="0"
                                    style={styles.inputQty}
                                  />
                                ) : (
                                  <span style={styles.noStock}>No disponible</span>
                                )}
                              </td>
                            </tr>
                          );
                        })}
                      </tbody>
                    </table>
                  </div>
                )}

                <div style={styles.cartFooter}>
                  <div style={styles.cartSummary}>
                    Items seleccionados: <strong>{Object.keys(carrito).length}</strong>
                  </div>
                  <button
                    style={styles.btnOrder}
                    disabled={enviandoPedido || Object.keys(carrito).length === 0}
                    onClick={handleRealizarPedido}
                  >
                    {enviandoPedido ? 'Procesando Pedido...' : '🚀 Enviar Pedido al Backend'}
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: MIS PEDIDOS */}
          {activeTab === 'mis_pedidos' && (
            <div style={styles.card}>
              <h3 style={styles.cardTitle}>📋 Historial de Mis Pedidos</h3>
              <p style={styles.cardSubtitle}>
                Aislamiento de seguridad: Solo puedes visualizar los pedidos registrados a tu nombre.
              </p>

              {misPedidos.length === 0 ? (
                <p style={styles.emptyText}>No has realizado ningún pedido aún.</p>
              ) : (
                <div style={styles.pedidosList}>
                  {misPedidos.map((ped) => (
                    <div key={ped.id} style={styles.pedidoCard}>
                      <div style={styles.pedidoHeader}>
                        <div>
                          <strong>Pedido #{ped.id}</strong> — 📅 {ped.fecha_pedido}
                        </div>
                        <div style={styles.statusBadge}>{ped.estado_pedido}</div>
                      </div>
                      <div style={styles.pedidoBody}>
                        <p style={styles.totalText}>💰 Total del Pedido: ${ped.total}</p>

                        <div style={styles.itemsList}>
                          <strong>Ítems Adquiridos:</strong>
                          <ul>
                            {ped.detalles?.map((det) => (
                              <li key={det.id}>
                                {det.producto?.nombre || `Producto #${det.producto_id}`} — {det.cantidad} {det.producto?.unidad_medida || 'unidades'} x ${det.precio_unitario_historico} = ${det.subtotal}
                              </li>
                            ))}
                          </ul>
                        </div>

                        <button
                          style={styles.btnDanger}
                          onClick={() => handleCancelarPedido(ped.id)}
                        >
                          ❌ Cancelar / Eliminar Pedido
                        </button>
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

const styles = {
  container: {
    padding: '2rem',
    maxWidth: '1100px',
    margin: '0 auto',
    color: '#f8fafc',
  },
  headerBox: {
    marginBottom: '1.5rem',
  },
  pageTitle: {
    fontSize: '2rem',
    margin: 0,
    color: '#38bdf8',
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
    backgroundColor: '#0284c7',
    color: '#ffffff',
    borderColor: '#38bdf8',
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
    fontSize: '0.85rem',
    marginTop: '-0.5rem',
    marginBottom: '1rem',
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
  descCol: {
    color: '#cbd5e1',
    fontSize: '0.85rem',
  },
  inputQty: {
    padding: '0.4rem',
    width: '80px',
    borderRadius: '4px',
    border: '1px solid #334155',
    backgroundColor: '#0f172a',
    color: '#fff',
  },
  noStock: {
    color: '#94a3b8',
    fontSize: '0.8rem',
  },
  cartFooter: {
    marginTop: '1.5rem',
    paddingTop: '1rem',
    borderTop: '1px stroke #334155',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    flexWrap: 'wrap',
    gap: '1rem',
  },
  cartSummary: {
    fontSize: '1rem',
    color: '#cbd5e1',
  },
  btnOrder: {
    padding: '0.85rem 1.5rem',
    backgroundColor: '#10b981',
    color: '#fff',
    border: 'none',
    borderRadius: '6px',
    fontSize: '1rem',
    fontWeight: 'bold',
    cursor: 'pointer',
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
    backgroundColor: '#0284c7',
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
  totalText: {
    margin: '0.2rem 0 0.5rem',
    fontWeight: 'bold',
    color: '#34d399',
  },
  itemsList: {
    marginTop: '0.5rem',
    marginBottom: '1rem',
    fontSize: '0.85rem',
  },
  btnDanger: {
    padding: '0.4rem 0.8rem',
    backgroundColor: '#ef4444',
    color: '#fff',
    border: 'none',
    borderRadius: '4px',
    fontSize: '0.8rem',
    cursor: 'pointer',
  },
};
