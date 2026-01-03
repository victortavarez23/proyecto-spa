import React, { useState, useEffect } from 'react';
import api from '../../services/api'; // Tu llave maestra
// Si tienes estilos específicos, impórtalos aquí, o usa los inline de abajo

const Services = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        // Petición GET al endpoint real
        const response = await api.get('/products');
        
        if (response.data.success && response.data.data) {
             // Si el backend devuelve { products: [...] }
             setProducts(response.data.data.products || []); 
        } else {
             setProducts([]);
        }
      } catch (err) {
        console.error("Error:", err);
        setError('No se pudieron cargar los productos.');
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  if (loading) return <div style={{padding: '50px', textAlign: 'center'}}>🌀 Cargando catálogo...</div>;

  return (
    <div style={{maxWidth: '1200px', margin: '0 auto', padding: '20px'}}>
      <h1 style={{textAlign: 'center', marginBottom: '30px'}}>Nuestros Productos (Desde MongoDB)</h1>
      
      {products.length === 0 ? (
        <p style={{textAlign: 'center'}}>No hay productos. (Ejecuta 'npm run seed' en el backend)</p>
      ) : (
        <div style={{
            display: 'grid', 
            gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', 
            gap: '20px'
        }}>
          {products.map((product) => (
            <div key={product._id} style={{
                border: '1px solid #ddd', 
                borderRadius: '10px', 
                overflow: 'hidden', 
                background: 'var(--card-bg, white)' // Variable CSS para modo oscuro si la tienes
            }}>
              <img 
                src={product.image || 'https://via.placeholder.com/300'} 
                alt={product.name} 
                style={{width: '100%', height: '200px', objectFit: 'cover'}}
              />
              <div style={{padding: '15px'}}>
                <h3>{product.name}</h3>
                <p style={{color: '#666', fontSize: '0.9em'}}>{product.description}</p>
                <div style={{display: 'flex', justifyContent: 'space-between', marginTop: '10px', alignItems: 'center'}}>
                  <span style={{fontWeight: 'bold', fontSize: '1.2em', color: '#2b57f2'}}>${product.price}</span>
                  <button style={{padding: '5px 15px', background: '#2b57f2', color: 'white', border: 'none', borderRadius: '5px', cursor: 'pointer'}}>
                    Ver
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Services;