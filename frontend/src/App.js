import { Suspense, lazy } from 'react';
import { Routes, Route, useLocation } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext'; // <--- IMPORTANTE: Conectar el contexto

// --- LAYOUT GLOBAL ---
import Header from './components/layout/Header/Header';
import Footer from './components/layout/Footer/Footer';
import ThemeToggle from './components/ThemeToggle/ThemeToggle';
import WindowSize from './components/WindowSize/WindowSize';
import ProtectedRoute from './components/ProtectedRoute'; // Usaremos el componente inteligente
import './App.css';

// --- IMPORTS DINÁMICOS ---
const HomePage = lazy(() => import('./pages/HomePage'));
const RegisterForm = lazy(() => import('./components/sections/RegisterForm/RegisterForm'));
const ContactForm = lazy(() => import('./components/sections/ContactForm/ContactForm'));
const ContactSuccess = lazy(() => import('./pages/ContactSuccess'));
const Cart = lazy(() => import('./components/Cart/Cart'));
const UserList = lazy(() => import('./pages/UsersPage'));
const Services = lazy(() => import('./pages/Services/Services'));
const ServiceDetail = lazy(() => import('./pages/ServiceDetail'));
const Dashboard = lazy(() => import('./pages/Dashboard')); // Tu archivo Dashboard.js
const LoginPage = lazy(() => import('./pages/LoginPage'));
const NotFound = lazy(() => import('./pages/NotFound/NotFound'));

// Componente de carga
const Loading = () => (
  <div style={{ padding: '50px', textAlign: 'center', fontSize: '1.5rem', color: '#666' }}>
    🌀 Cargando contenido...
  </div>
);

function App() {
  useLocation();

  // Scroll to top automático
  if (typeof window !== 'undefined') {
    window.scrollTo({ top: 0, behavior: 'instant' });
  }

  return (
    // 1. Envolvemos TODA la app en el AuthProvider
    <AuthProvider>
      <div className="App">
        <div style={{ position: 'fixed', top: '20px', right: '20px', zIndex: 9999 }}>
          <ThemeToggle />
        </div>

        <Header />

        <main>
          <Suspense fallback={<Loading />}>
            <Routes>
              {/* Rutas Públicas */}
              <Route path="/" element={<HomePage />} />
              <Route path="/registro" element={<div style={{ padding: '50px 0' }}><RegisterForm /></div>} />
              <Route path="/contacto" element={<div style={{ padding: '50px 0' }}><ContactForm /></div>} />
              <Route path="/contacto/exito" element={<ContactSuccess />} />
              <Route path="/carrito" element={<div style={{ padding: '50px 0' }}><Cart /></div>} />
              <Route path="/usuarios" element={<UserList />} />
              <Route path="/servicios/*" element={<Services />} />
              <Route path="/servicio/:serviceId" element={<ServiceDetail />} />
              
              {/* Login ya no necesita props manuales, usa el contexto */}
              <Route path="/login" element={<LoginPage />} />

              {/* RUTA PROTEGIDA: El componente ProtectedRoute verificará el contexto él mismo */}
              <Route 
                path="/dashboard" 
                element={
                  <ProtectedRoute>
                    <Dashboard />
                  </ProtectedRoute>
                } 
              />

              <Route path="*" element={<NotFound />} />
            </Routes>
          </Suspense>
        </main>

        <WindowSize />
        <Footer />
      </div>
    </AuthProvider>
  );
}

export default App;