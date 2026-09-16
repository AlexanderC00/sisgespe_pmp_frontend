import { useAuth } from '../context/AuthContext';

export function Navbar() {
  const { user, logout } = useAuth();

  return (
    <header style={styles.header}>
      <div style={styles.brand}>
        <h2 style={styles.title}>🌱 SISGESPE PMP</h2>
        <span style={styles.subtitle}>Gestión y Pedidos de Productos Mínimamente Procesados</span>
      </div>

      {user && (
        <div style={styles.userInfo}>
          <span style={styles.userText}>
            👤 <strong>{user.name}</strong> ({user.email})
          </span>
          <span
            style={{
              ...styles.badge,
              backgroundColor: user.rol === 'admin' ? '#d97706' : '#2563eb',
            }}
          >
            {user.rol === 'admin' ? 'ADMINISTRADOR' : 'CLIENTE'}
          </span>
          <button style={styles.logoutBtn} onClick={logout}>
            Cerrar Sesión 🚪
          </button>
        </div>
      )}
    </header>
  );
}

const styles = {
  header: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '1rem 2rem',
    backgroundColor: '#0f172a',
    color: '#f8fafc',
    borderBottom: '2px solid #1e293b',
    flexWrap: 'wrap',
    gap: '1rem',
  },
  brand: {
    display: 'flex',
    flexDirection: 'column',
  },
  title: {
    margin: 0,
    fontSize: '1.4rem',
    color: '#34d399',
  },
  subtitle: {
    fontSize: '0.85rem',
    color: '#94a3b8',
  },
  userInfo: {
    display: 'flex',
    alignItems: 'center',
    gap: '1rem',
    flexWrap: 'wrap',
  },
  userText: {
    fontSize: '0.95rem',
  },
  badge: {
    padding: '0.25rem 0.6rem',
    borderRadius: '4px',
    fontSize: '0.75rem',
    fontWeight: 'bold',
    color: '#ffffff',
  },
  logoutBtn: {
    padding: '0.4rem 0.8rem',
    backgroundColor: '#ef4444',
    color: '#ffffff',
    border: 'none',
    borderRadius: '4px',
    cursor: 'pointer',
    fontWeight: 'bold',
  },
};
