
import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext'; // Importamos el hook

const ProtectedRoute = ({ children }) => {
  // Obtenemos el estado real desde el sistema de autenticación
  const { isAuthenticated, loading, user } = useAuth();

  if (loading) {
    return <div style={{textAlign: 'center', padding: '50px'}}>Verificando acceso...</div>;
  }

  // 1. Si no está logueado -> Al Login
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  // 2. Si está logueado pero NO es admin -> Al Home (Opcional, según tu lógica)
  if (user?.role !== 'admin') {
     alert("Acceso restringido a administradores");
     return <Navigate to="/" replace />;
  }

  // 3. Si todo está bien -> Muestra el Dashboard
  return children;
};

export default ProtectedRoute;