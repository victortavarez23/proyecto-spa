import React, { useEffect } from 'react';
import useLocalStorage from '../../hooks/useLocalStorage';
import './ThemeToggle.css'; // Crearemos este CSS enseguida

const ThemeToggle = () => {
  // Usamos nuestro hook personalizado. Si no hay nada guardado, inicia en 'light'.
  const [theme, setTheme] = useLocalStorage('theme', 'light');

  // Efecto secundario: Manipular el DOM real para cambiar la clase del <html> o <body>
  useEffect(() => {
    document.body.className = theme;
  }, [theme]); // Se ejecuta cuando cambia el tema

  return (
    <button 
      onClick={() => setTheme(theme === 'light' ? 'dark' : 'light')}
      className="theme-toggle-btn"
      aria-label="Cambiar tema"
    >
      {theme === 'light' ? '🌙 Modo Oscuro' : '☀️ Modo Claro'}
    </button>
  );
};

export default ThemeToggle;