import React, { useState, useEffect } from 'react';

const WindowSize = () => {
  // Inicializamos el estado con el tamaño actual de la ventana
  const [windowSize, setWindowSize] = useState({
    width: window.innerWidth,
    height: window.innerHeight,
  });

  useEffect(() => {
    // Función que actualiza el estado cuando la ventana cambia
    const handleResize = () => {
      setWindowSize({
        width: window.innerWidth,
        height: window.innerHeight,
      });
      // Un console.log para que veas cuándo ocurre el evento
      console.log('📏 Ventana redimensionada:', window.innerWidth);
    };

    // 1. SUSCRIPCIÓN: Le decimos al navegador "avísame si cambias de tamaño"
    window.addEventListener('resize', handleResize);

    // 2. CLEANUP (Limpieza): Esta función se ejecuta si el componente muere
    // Es vital para "colgar el teléfono" y dejar de escuchar.
    return () => {
      window.removeEventListener('resize', handleResize);
      console.log('🧹 Limpieza: Evento resize eliminado');
    };
  }, []); // [] significa que esto se configura solo una vez al montar

  return (
    <div style={{ 
      position: 'fixed', 
      bottom: '20px', 
      right: '20px', 
      background: 'rgba(0,0,0,0.8)', 
      color: 'white', 
      padding: '15px', 
      borderRadius: '8px',
      zIndex: 1000,
      boxShadow: '0 4px 6px rgba(0,0,0,0.1)'
    }}>
      <h3 style={{ margin: '0 0 10px 0', fontSize: '1rem' }}>Tamaño de ventana</h3>
      <p style={{ margin: 5 }}>Ancho: <strong>{windowSize.width}px</strong></p>
      <p style={{ margin: 5 }}>Alto: <strong>{windowSize.height}px</strong></p>
    </div>
  );
};

export default WindowSize;