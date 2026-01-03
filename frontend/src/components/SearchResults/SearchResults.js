import React, { useState, useEffect } from 'react';
import './SearchResults.css'; // (Opcional, si quieres estilos)

const SearchResults = ({ query }) => {
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);

  //
  useEffect(() => {
    // Si no hay texto, limpiamos los resultados y no buscamos nada
    if (!query) {
      setResults([]);
      return;
    }

    // Definimos la función de búsqueda dentro del efecto
    const search = async () => {
      setLoading(true);
      try {
        // Usamos la API de posts para buscar por texto
        const response = await fetch(
          `https://jsonplaceholder.typicode.com/posts?q=${query}`
        );
        const data = await response.json();
        setResults(data);
      } catch (error) {
        console.error('Error en búsqueda:', error);
      } finally {
        setLoading(false);
      }
    };

    // Ejecutamos la búsqueda
    // Pequeño truco PRO: Debouncing (esperar a que dejes de escribir)
    // Para este lab lo haremos directo, pero en la vida real usaríamos un timeout aquí.
    const timeoutId = setTimeout(() => {
        search();
    }, 500); // Espera 500ms antes de llamar a la API

    // Cleanup del timeout
    return () => clearTimeout(timeoutId);

  }, [query]); // <--- LA CLAVE: Se ejecuta SOLO cuando 'query' cambia

  // Renderizado
  return (
    <div style={{ padding: '20px', border: '1px solid #ddd', marginTop: '20px', borderRadius: '8px' }}>
      <h3>🔎 Resultados para: "{query}"</h3>
      
      {loading && <p style={{ color: '#666' }}>Buscando...</p>}
      
      {!loading && results.length === 0 && query && (
          <p>No se encontraron resultados.</p>
      )}

      <div style={{ maxHeight: '300px', overflowY: 'auto' }}>
        {results.map(result => (
          <div key={result.id} style={{ borderBottom: '1px solid #eee', padding: '10px 0' }}>
            <h4 style={{ margin: '0 0 5px 0', color: '#2563eb' }}>{result.title}</h4>
            <p style={{ margin: 0, fontSize: '0.9rem' }}>{result.body}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default SearchResults;