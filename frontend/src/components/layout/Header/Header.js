import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../../context/AuthContext'; // Importamos el contexto
import './Header.css';

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  
  // 1. Extraemos los datos del usuario del contexto
  const { isAuthenticated, user, logout } = useAuth();
  const navigate = useNavigate();

  const closeMenu = () => {
    setIsMenuOpen(false);
  };

  // Función para manejar el cierre de sesión
  const handleLogout = () => {
    logout();
    closeMenu(); // Cerramos el menú móvil si está abierto
    navigate('/login');
  };

  return (
    <header className="header">
      <div className="logo">
        <Link to="/" onClick={closeMenu}>Víctor Tavárez</Link>
      </div>

      <div className="menu-icon" onClick={() => setIsMenuOpen(!isMenuOpen)}>
        <span className={isMenuOpen ? "bar open" : "bar"}></span>
        <span className={isMenuOpen ? "bar open" : "bar"}></span>
        <span className={isMenuOpen ? "bar open" : "bar"}></span>
      </div>

      <nav className={`nav-menu ${isMenuOpen ? "active" : ""}`}>
        <ul>
          <li>
            <Link to="/" onClick={closeMenu}>Inicio</Link>
          </li>
          
          <li>
            <Link to="/servicios" onClick={closeMenu}>Servicios</Link>
          </li> 
          
          <li>
            <Link to="/usuarios" onClick={closeMenu}>Playground (APIs)</Link>
          </li>

          {/* --- LÓGICA DEL DASHBOARD (Solo si es admin) --- */}
          {isAuthenticated && user?.role === 'admin' && (
            <li>
               {/* Estilo inline sutil solo para destacar el dashboard sin romper tu CSS */}
              <Link to="/dashboard" onClick={closeMenu} style={{ color: '#d4af37' }}>
                Dashboard
              </Link>
            </li>
          )}
          
          {/* --- LÓGICA DE LOGIN / REGISTRO vs USUARIO / SALIR --- */}
          {isAuthenticated ? (
            <>
              {/* Si está logueado, mostramos el nombre */}
              <li>
                <span className="user-greeting">
                  Hola, {user?.name?.split(' ')[0]}
                </span>
              </li>
              {/* Y el botón de Salir */}
              <li>
                <button 
                  onClick={handleLogout} 
                  style={{
                    background: 'none',
                    border: 'none',
                    cursor: 'pointer',
                    fontSize: '1rem', // Mismo tamaño que los enlaces
                    fontWeight: '500', // Mismo peso que los enlaces
                    color: '#dc3545', // Un rojo sutil para diferenciar
                    padding: 0,
                    fontFamily: 'inherit'
                  }}
                >
                  Salir
                </button>
              </li>
            </>
          ) : (
            <>
              {/* Si NO está logueado, mostramos lo de siempre */}
              <li>
                <Link to="/registro" onClick={closeMenu}>Registro</Link>
              </li>
              <li>
                <Link to="/login" onClick={closeMenu}>Iniciar Sesión</Link>
              </li>
            </>
          )}
          
          <li className="cart-icon-li">
            <Link to="/carrito" aria-label="Ir al carrito" onClick={closeMenu}>
                <span role="img" style={{fontSize: '1.5rem', cursor: 'pointer'}}>🛒</span>
            </Link>
          </li>

          <li>
            <Link to="/contacto" className="cta-button-header" onClick={closeMenu}>
              Contacto
            </Link>
          </li>
        </ul>
      </nav>
    </header>
  );
};

export default Header;