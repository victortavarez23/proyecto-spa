import React, { useState } from 'react'; // Ya no necesitas useEffect aquí para el scroll
import UserList from '../components/UserList';
import SearchResults from '../components/SearchResults/SearchResults';

import WeatherSection from '../components/Weather/WeatherSection';

const UsersPage = () => {
  const [searchTerm, setSearchTerm] = useState('');

  return (
    <div style={{ padding: '100px 20px', maxWidth: '800px', margin: '0 auto' }}>

      {/* Aquí aparecerá el banner del clima arriba del todo */}
      <WeatherSection />

      <h1>Zona de Usuarios (API Demo)</h1>
      
      {/* Buscador */}
      <section style={{ marginBottom: '40px' }}>
        <h2>Buscador de Posts</h2>
        <input 
          type="text" 
          placeholder="Escribe para buscar..." 
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          style={{ padding: '10px', width: '100%', fontSize: '1rem', marginBottom: '10px' }}
        />
        <SearchResults query={searchTerm} />
      </section>

      <hr />

      {/* Lista de Usuarios */}
      <UserList />
    </div>
  );
};

export default UsersPage;