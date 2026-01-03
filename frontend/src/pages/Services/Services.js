import React from 'react';
import { Routes, Route, Link, useLocation } from 'react-router-dom';

// Importamos los componentes (asegúrate de que los archivos existan)
import WebDevelopment from './WebDevelopment';
import Consulting from './Consulting';
import GraphicDesign from './GraphicDesign'; // Nuevo
import Ecommerce from './Ecommerce'; // Nuevo
import './Services.css';

const Services = () => {
  const location = useLocation();

  return (
    <div className="services-page">
      <h1 style={{textAlign: 'center', margin: '2rem 0'}}>Nuestros Servicios</h1>
      
      <div className="services-container">
        {/* NAVEGACIÓN IZQUIERDA */}
        <nav className="services-nav">
          <Link 
            to="/servicios/desarrollo-web"
            className={location.pathname.includes('desarrollo-web') ? 'active' : ''}
          >
            Desarrollo Web
          </Link>
          
          {/* Nuevo: Diseño Gráfico */}
          <Link 
            to="/servicios/diseno-grafico"
            className={location.pathname.includes('diseno-grafico') ? 'active' : ''}
          >
            Diseño Gráfico
          </Link>
          
          {/* Nuevo: E-commerce */}
          <Link 
            to="/servicios/ecommerce"
            className={location.pathname.includes('ecommerce') ? 'active' : ''}
          >
            E-commerce
          </Link>

          <Link 
            to="/servicios/consultoria"
            className={location.pathname.includes('consultoria') ? 'active' : ''}
          >
            Consultoría
          </Link>
        </nav>

        {/* CONTENIDO DERECHA */}
        <div className="services-content">
          <Routes>
            <Route path="desarrollo-web" element={<WebDevelopment />} />
            <Route path="diseno-grafico" element={<GraphicDesign />} />
            <Route path="ecommerce" element={<Ecommerce />} />
            <Route path="consultoria" element={<Consulting />} />
            {/* Mensaje por defecto */}
            <Route path="" element={<div className="select-msg">👈Selecciona un servicio del menú para ver los detalles</div>} />
          </Routes>
        </div>
      </div>
    </div>
  );
};

export default Services;