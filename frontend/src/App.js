import React, { Suspense, lazy } from 'react'; // 1. Importamos lazy y Suspense
import { Routes, Route, useLocation } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';

// --- LAYOUT GLOBAL (Estos se quedan estáticos porque se ven siempre) ---
import Header from './components/layout/Header/Header';
import Footer from './components/layout/Footer/Footer';
import ThemeToggle from './components/ThemeToggle/ThemeToggle';
import WindowSize from './components/WindowSize/WindowSize';
import ProtectedRoute from './components/ProtectedRoute';
import './App.css';

// --- 2. IMPORTS DINÁMICOS (Code Splitting) ---
// El navegador solo descargará estos archivos cuando el usuario visite la ruta
const HomePage = lazy(() => import('./pages/HomePage'));
const RegisterForm = lazy(() => import('./components/sections/RegisterForm/RegisterForm'));
const ContactForm = lazy(() => import('./components/sections/ContactForm/ContactForm'));
const ContactSuccess = lazy(() => import('./pages/ContactSuccess'));
const Cart = lazy(() => import('./components/Cart/Cart'));
const UserList = lazy(() => import('./pages/UsersPage'));
const Services = lazy(() => import('./pages/Services/Services'));
const ServiceDetail = lazy(() => import('./pages/ServiceDetail'));
const Dashboard = lazy(() => import('./pages/Dashboard'));
const LoginPage = lazy(() => import('./pages/LoginPage'));
const NotFound = lazy(() => import('./pages/NotFound/NotFound'));

// Componente de carga (Fallback) que se muestra mientras descarga el chunk
const Loading = () => (
  <div style={{ padding: '50px', textAlign: 'center', fontSize: '1.5rem', color: '#666' }}>
    🌀 Cargando aplicación...
  </div>
);

function App() {
  useLocation(); // Hook necesario para router

  // Scroll to top automático
  if (typeof window !== 'undefined') {
    window.scrollTo({ top: 0, behavior: 'instant' });
  }

  return (
    <AuthProvider>
      <div className="App">
        {/* Elementos fijos UI */}
        <div style={{ position: 'fixed', top: '20px', right: '20px', zIndex: 9999 }}>
          <ThemeToggle />
        </div>

        <Header />

        <main>
          {/* 3. Envolvemos las rutas en Suspense */}
          <Suspense fallback={<Loading />}>
            <Routes>
              {/* --- Rutas Públicas --- */}
              <Route path="/" element={<HomePage />} />
              <Route path="/registro" element={<div style={{ padding: '50px 0' }}><RegisterForm /></div>} />
              <Route path="/contacto" element={<div style={{ padding: '50px 0' }}><ContactForm /></div>} />
              <Route path="/contacto/exito" element={<ContactSuccess />} />
              <Route path="/carrito" element={<div style={{ padding: '50px 0' }}><Cart /></div>} />
              <Route path="/usuarios" element={<UserList />} />
              <Route path="/servicios/*" element={<Services />} />
              <Route path="/servicio/:serviceId" element={<ServiceDetail />} />
              
              <Route path="/login" element={<LoginPage />} />

              {/* --- Rutas Protegidas --- */}
              <Route 
                path="/dashboard" 
                element={
                  <ProtectedRoute>
                    <Dashboard />
                  </ProtectedRoute>
                } 
              />

              {/* 404 */}
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