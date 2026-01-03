import React, { useEffect } from 'react'; // 1. Importa useEffect
import { useLocation } from 'react-router-dom'; // 2. Importa useLocation
import Hero from '../components/sections/Hero/Hero';
import Features from '../components/sections/Features/Features';
import Faq from '../components/sections/Faq/Faq';
import heroImage from '../assets/images/foto-victor.jpg';

const HomePage = () => {
  const { hash } = useLocation(); // 3. Obtenemos el hash (ej: #servicios) de la URL

    // 4. Efecto para manejar el scroll al cambiar el hash
  useEffect(() => {
    if (hash) {
      const id = hash.replace('#', '');
      const element = document.getElementById(id);
      if (element) {
        // Un pequeño timeout asegura que la página ya se pintó antes de bajar
        setTimeout(() => {
          element.scrollIntoView({ behavior: 'smooth' });
        }, 100);
      }
    } else {
        // Si no hay hash (solo /), sube al inicio (útil al venir del footer)
        window.scrollTo(0, 0);
    }
  }, [hash]);

  const heroProps = {
    title: "Transformo tu marca en un negocio digital.",
    subtitle: "Publicista | Diseñador Gráfico | Full Stack Developer.",
    image: heroImage,
    ctaButton: {
      label: "Hablemos de tu proyecto",
      onClick: () => window.location.href = "#contacto",
    },
    secondaryButton: {
      label: "Ver mis servicios",
      onClick: () => window.location.href = "#servicios",
    },
    alignment: "center"
  };

  return (
    <>
      <Hero {...heroProps} />
      
      {/* 5. Asegúrate que el ID sigue aquí envolviendo a Features */}
      <div id="servicios">
        <Features />
      </div>

      <Faq />
    </>
  );
};

export default HomePage;