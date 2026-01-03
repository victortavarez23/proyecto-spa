import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import App from './App';
import './index.css';

// Interceptor global para errores de autenticación
// Este listener escucha el evento 'authenticationFailed' que puede ser disparado por ProtectedRoute o useApi
window.addEventListener('authenticationFailed', () => {
    // 1. Limpiar cualquier rastro de sesión
    localStorage.removeItem('authToken'); // Nota: Si usas cookies, js-cookie se encarga en api.js, pero esto limpia estado extra
    localStorage.removeItem('userData');
    
    // 2. Si no estamos ya en el login, redirigir
    if (window.location.pathname !== '/login') {
        window.location.href = '/login';
    }
});

const root = ReactDOM.createRoot(document.getElementById('root'));

root.render(
  <React.StrictMode>
    <BrowserRouter>
      {/* Envolvemos la App con el AuthProvider para que toda la app tenga acceso al usuario */}
      <AuthProvider>
        <App />
      </AuthProvider>
    </BrowserRouter>
  </React.StrictMode>
);