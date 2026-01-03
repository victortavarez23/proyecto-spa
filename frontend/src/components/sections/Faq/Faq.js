import React, { useState } from 'react';
import Container from '../../layout/Container';
import './Faq.css';

const Faq = () => {
  const [activeIndex, setActiveIndex] = useState(null);

  const faqData = [
    {
      question: "¿Haces tanto el diseño como el código?",
      answer: "Sí. Puedo encargarme de la identidad visual (Logo, Branding) y maquetar tu sitio web, asegurando coherencia total entre cómo se ve y cómo funciona."
    },
    {
      question: "¿Qué tecnologías utilizas?",
      answer: "Actualmente trabajo con el stack moderno de React (SPA), CSS3 avanzado, JavaScript (ES6+) y herramientas de optimización para asegurar sitios rápidos."
    },
    {
      question: "¿Trabajas con proyectos e-commerce?",
      answer: "Correcto. Tengo experiencia integrando pasarelas de pago y diseñando flujos de compra optimizados para la conversión."
    }
  ];

  const toggleAccordion = (index) => {
    setActiveIndex(activeIndex === index ? null : index);
  };

  return (
    <section id="faq" className="faq section">
      <Container>
        <div className="faq__header text-center mb-5">
          <h2 className="fw-bold">Preguntas Frecuentes</h2>
        </div>

        <div className="faq__container">
          {faqData.map((item, index) => (
            <div key={index} className="faq-item mb-3">
              <button 
                className={`faq-question ${activeIndex === index ? 'is-active' : ''}`}
                onClick={() => toggleAccordion(index)}
                aria-expanded={activeIndex === index}
              >
                {item.question}
                <span className="icon">{activeIndex === index ? '-' : '+'}</span>
              </button>
              
              <div 
                className={`faq-answer ${activeIndex === index ? 'is-open' : ''}`}
                aria-hidden={activeIndex !== index}
              >
                <p>{item.answer}</p>
              </div>
            </div>
          ))}
        </div>
      </Container>
    </section>
  );
};

export default Faq;