import React from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';

const ServiceDetail = () => {
  const { serviceId } = useParams();
  const navigate = useNavigate();

  // Simular datos de servicios (Hardcodeado como en la imagen del lab)
  const services = {
    'web-development': {
      title: 'Desarrollo Web',
      description: 'Creación de aplicaciones web modernas y responsive.'
    },
    'mobile-app': {
      title: 'Desarrollo Mobile',
      description: 'Aplicaciones nativas e híbridas para iOS y Android.'
    },
    // Puedes agregar tus propios servicios aquí para probar:
    'diseno-grafico': {
      title: 'Diseño Gráfico',
      description: 'Identidad visual impactante para tu marca.'
    }
  };

  const service = services[serviceId];

  // Validación: Si el ID no existe en nuestra lista
  if (!service) {
    return (
      <div style={{ padding: '50px', textAlign: 'center' }}>
        <h2>Servicio no encontrado</h2>
        <Link to="/servicios">Volver a servicios</Link>
      </div>
    );
  }

  return (
    <div className="service-detail" style={{ padding: '50px', maxWidth: '800px', margin: '0 auto' }}>
      <button 
        onClick={() => navigate(-1)} 
        className="back-button"
        style={{ marginBottom: '20px', padding: '8px 16px', cursor: 'pointer' }}
      >
        ← Volver
      </button>

      <h1>{service.title}</h1>
      <p style={{ fontSize: '1.2rem', color: '#555', margin: '20px 0' }}>
        {service.description}
      </p>

      <div style={{ marginTop: '30px' }}>
        <Link 
          to="/contacto" 
          className="cta-button"
          style={{ 
             background: '#2563eb', 
             color: 'white', 
             padding: '10px 20px', 
             textDecoration: 'none', 
             borderRadius: '5px' 
          }}
        >
          Solicitar este servicio
        </Link>
      </div>
    </div>
  );
};

export default ServiceDetail;