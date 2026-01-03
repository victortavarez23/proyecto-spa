function StyleTest() {
  return (
    <div className="style-test" style={{ padding: '2rem' }}>
      
      <h1 className="heading-primary">Test de Estilos Migrados</h1>
      
      {/* Probando Botones */}
      <div style={{ marginBottom: '2rem' }}>
          <h3>Botones:</h3>
          {/* Usamos las clases de tu CSS original (btn, btn--primary, etc.) */}
          <button className="btn btn--primary" style={{ marginRight: '10px' }}>Botón Primario</button>
          <button className="btn btn--secondary">Botón Secundario</button>
      </div>

      {/* Probando Tarjetas */}
      <div className="card" style={{ maxWidth: '400px', padding: '1rem', border: '1px solid #ccc' }}>
        <h3>Tarjeta de prueba</h3>
        <p>Este es un contenido de prueba para verificar que las tarjetas se ven bien.</p>
      </div>

    </div>
  );
}

export default StyleTest;