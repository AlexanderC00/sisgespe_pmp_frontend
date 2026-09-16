import { useState } from 'react';
import { AuthProvider, useAuth } from './context/AuthContext';
import { Navbar } from './components/Navbar';
import { Login } from './pages/Login';
import { Register } from './pages/Register';
import { AdminDashboard } from './pages/AdminDashboard';
import { ClienteDashboard } from './pages/ClienteDashboard';
import './App.css';

function MainContent() {
  const { isAuthenticated, isAdmin } = useAuth();
  const [authView, setAuthView] = useState('login'); // 'login' | 'register'

  if (!isAuthenticated) {
    return authView === 'login' ? (
      <Login onSwitchToRegister={() => setAuthView('register')} />
    ) : (
      <Register onSwitchToLogin={() => setAuthView('login')} />
    );
  }

  return isAdmin ? <AdminDashboard /> : <ClienteDashboard />;
}

export default function App() {
  return (
    <AuthProvider>
      <div style={styles.appContainer}>
        <Navbar />
        <main style={styles.main}>
          <MainContent />
        </main>
      </div>
    </AuthProvider>
  );
}

const styles = {
  appContainer: {
    minHeight: '100vh',
    backgroundColor: '#0f172a',
    color: '#f8fafc',
    fontFamily: "system-ui, -apple-system, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif",
  },
  main: {
    paddingBottom: '3rem',
  },
};
