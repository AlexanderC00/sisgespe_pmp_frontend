import { useState } from 'react';
import { useAuth } from '../context/AuthContext';

export function Register({ onSwitchToLogin }) {
  const { register } = useAuth();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [rol, setRol] = useState('cliente');
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      await register(name, email, password, rol);
    } catch (err) {
      setError(err.message || 'Error al registrar usuario');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={styles.container}>
      <div style={styles.card}>
        <h2 style={styles.title}>📝 Crear Cuenta</h2>
        <p style={styles.subtitle}>Registro de Usuario en SISGESPE PMP</p>

        {error && <div style={styles.errorBox}>⚠️ {error}</div>}

        <form onSubmit={handleSubmit} style={styles.form}>
          <div style={styles.field}>
            <label style={styles.label}>Nombre Completo:</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Juan Pérez"
              required
              style={styles.input}
            />
          </div>

          <div style={styles.field}>
            <label style={styles.label}>Correo Electrónico:</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="juan@correo.com"
              required
              style={styles.input}
            />
          </div>

          <div style={styles.field}>
            <label style={styles.label}>Contraseña (mínimo 6 caracteres):</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              required
              minLength={6}
              style={styles.input}
            />
          </div>

          <div style={styles.field}>
            <label style={styles.label}>Rol de Usuario:</label>
            <select value={rol} onChange={(e) => setRol(e.target.value)} style={styles.select}>
              <option value="cliente">Cliente</option>
              <option value="admin">Administrador</option>
            </select>
          </div>

          <button type="submit" disabled={loading} style={styles.submitBtn}>
            {loading ? 'Registrando...' : 'Completar Registro'}
          </button>
        </form>

        <div style={styles.footer}>
          <span>¿Ya tienes una cuenta registrada? </span>
          <button type="button" onClick={onSwitchToLogin} style={styles.linkBtn}>
            Inicia sesión aquí
          </button>
        </div>
      </div>
    </div>
  );
}

const styles = {
  container: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    minHeight: '80vh',
    padding: '1rem',
  },
  card: {
    backgroundColor: '#1e293b',
    color: '#f8fafc',
    padding: '2.5rem',
    borderRadius: '12px',
    boxShadow: '0 10px 25px rgba(0,0,0,0.5)',
    width: '100%',
    maxWidth: '440px',
  },
  title: {
    margin: 0,
    fontSize: '1.8rem',
    color: '#38bdf8',
    textAlign: 'center',
  },
  subtitle: {
    margin: '0.5rem 0 1.5rem',
    fontSize: '0.9rem',
    color: '#94a3b8',
    textAlign: 'center',
  },
  errorBox: {
    backgroundColor: '#7f1d1d',
    color: '#fecaca',
    padding: '0.8rem',
    borderRadius: '6px',
    marginBottom: '1rem',
    fontSize: '0.9rem',
  },
  form: {
    display: 'flex',
    flexDirection: 'column',
    gap: '1.2rem',
  },
  field: {
    display: 'flex',
    flexDirection: 'column',
    gap: '0.4rem',
  },
  label: {
    fontSize: '0.85rem',
    fontWeight: 'bold',
    color: '#cbd5e1',
  },
  input: {
    padding: '0.75rem',
    borderRadius: '6px',
    border: '1px solid #334155',
    backgroundColor: '#0f172a',
    color: '#ffffff',
    fontSize: '1rem',
  },
  select: {
    padding: '0.75rem',
    borderRadius: '6px',
    border: '1px solid #334155',
    backgroundColor: '#0f172a',
    color: '#ffffff',
    fontSize: '1rem',
  },
  submitBtn: {
    padding: '0.85rem',
    backgroundColor: '#0284c7',
    color: '#ffffff',
    border: 'none',
    borderRadius: '6px',
    fontSize: '1rem',
    fontWeight: 'bold',
    cursor: 'pointer',
    marginTop: '0.5rem',
  },
  footer: {
    marginTop: '1.5rem',
    textAlign: 'center',
    fontSize: '0.9rem',
    color: '#cbd5e1',
  },
  linkBtn: {
    background: 'none',
    border: 'none',
    color: '#34d399',
    cursor: 'pointer',
    fontWeight: 'bold',
    textDecoration: 'underline',
  },
};
