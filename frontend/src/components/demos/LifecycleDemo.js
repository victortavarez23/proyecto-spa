import React, { useState, useEffect } from 'react';

const LifecycleDemo = () => {
  const [loading, setLoading] = useState(true);
  const [count, setCount] = useState(0);

  // CASO 1: Sin dependencias
  // Se ejecuta SIEMPRE después de cada renderizado.
  useEffect(() => {
    console.log(' 1. Renderizado general: El componente se pintó o actualizó.');
  });

  // CASO 2: Array vacío []
  // Se ejecuta SOLO UNA VEZ al montar (nacer) el componente.
  // Ideal para llamadas a API iniciales.
  useEffect(() => {
    console.log(' 2. Montaje: El componente apareció por primera vez.');
  }, []);

  // CASO 3: Con dependencias [loading]
  // Se ejecuta solo cuando la variable 'loading' cambia.
  useEffect(() => {
    console.log(` 3. Cambio detectado: Loading ahora es ${loading}`);
  }, [loading]);

  // CASO 4: Con limpieza (Cleanup)
  // Útil para timers o suscripciones.
  useEffect(() => {
    const timer = setTimeout(() => {
      console.log(' 4. Timer: Han pasado 2 segundos, cambiamos loading...');
      setLoading(false);
    }, 2000);

    // Función de limpieza: Se ejecuta si el componente muere antes de los 2 seg
    return () => {
      clearTimeout(timer);
      console.log('🧹 Limpieza: Timer cancelado');
    };
  }, []); // Solo se configura al inicio

  return (
    <div style={{ padding: '20px', border: '2px dashed #2563eb', margin: '20px 0', borderRadius: '8px' }}>
      <h3>🔬 Laboratorio de useEffect</h3>
      <p>Estado de carga: <strong>{loading ? 'Cargando...' : 'Cargado Completado'}</strong></p>
      <p>Contador: {count}</p>
      
      <div style={{ display: 'flex', gap: '10px' }}>
        <button onClick={() => setCount(count + 1)}>
          Aumentar Contador (Render)
        </button>
        <button onClick={() => setLoading(!loading)}>
          Alternar Loading (Dependencia)
        </button>
      </div>
      
      <p style={{ fontSize: '0.8rem', color: '#666' }}>
        * Abre la consola (F12) para ver los mensajes.
      </p>
    </div>
  );
};

export default LifecycleDemo;