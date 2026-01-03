import React, { useState, useEffect } from 'react';
import './UserList.css';

const UserList = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [page, setPage] = useState(1);

  // useEffect para fetching de datos
  useEffect(() => {
    const fetchUsers = async () => {
      try {
        setLoading(true);
        // Nota: No limpiamos el error aquí para que no parpadee si ya había datos
        
        const response = await fetch(
          `https://jsonplaceholder.typicode.com/users?_page=${page}&_limit=5`
        );

        if (!response.ok) {
          throw new Error('Error al cargar los usuarios');
        }

        const data = await response.json();

        //
        // Si es la página 1, reemplazamos. Si no, agregamos al final (spread operator)
        setUsers(prevUsers => {
            return page === 1 ? data : [...prevUsers, ...data];
        });
        setError(null); // Limpiamos el error si tuvo éxito

      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();
  }, [page]); // Se ejecuta cada vez que cambia la página

  const loadMore = () => {
    setPage(prevPage => prevPage + 1);
  };

  // Renderizado de Error
  if (error && users.length === 0) {
    return (
      <div className="user-list error">
        <h3>Error</h3>
        <p>{error}</p>
        <button onClick={() => setPage(1)}>Reintentar</button>
      </div>
    );
  }

  return (
    <div className="user-list">
      <h2>Lista de Usuarios</h2>

      {/* */}
      <div className="users-container">
        {users.map(user => (
          <div key={user.id} className="user-card">
            <h3>{user.name}</h3>
            <p>📧 {user.email}</p>
            <p>📞 {user.phone}</p>
          </div>
        ))}
      </div>

      {loading && <div className="loading">Cargando más usuarios...</div>}

      {/* Botón Cargar Más */}
      {!loading && !error && (
        <button 
          onClick={loadMore} 
          disabled={loading}
          className="load-more-btn"
        >
          Cargar más
        </button>
      )}
      
      {/* Mensaje de error discreto si falla al cargar más páginas */}
      {error && users.length > 0 && (
          <p className="error-text">No se pudieron cargar más usuarios. Intenta de nuevo.</p>
      )}
    </div>
  );
};

export default UserList;