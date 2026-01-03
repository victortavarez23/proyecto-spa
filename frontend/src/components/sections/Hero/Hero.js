import React from 'react';
// Ajustamos la ruta para salir de "sections/Hero" e ir a "ui/Button"
import Button from '../../ui/Button'; 
// Ajustamos la ruta para ir a "layout/Container"
import Container from '../../layout/Container'; 
import './Hero.css';

const Hero = ({
  title,
  subtitle,
  image,
  ctaButton,
  secondaryButton,
  alignment = 'left',
}) => {
  return (
    <section className="hero">
      <Container>
        <div className={`hero__content hero__content--${alignment}`}>
          
          {/* Bloque de Texto */}
          <div className="hero__text">
            <h1 className="hero__title">{title}</h1>
            <p className="hero__subtitle">{subtitle}</p>

            <div className="hero__actions">
              {/* Botón Principal (CTA) */}
              {ctaButton && (
                <Button
                  variant="primary"
                  size="large"
                  onClick={ctaButton.onClick}
                >
                  {ctaButton.label}
                </Button>
              )}

              {/* Botón Secundario */}
              {secondaryButton && (
                <Button
                  variant="outline"
                  size="large"
                  onClick={secondaryButton.onClick}
                >
                  {secondaryButton.label}
                </Button>
              )}
            </div>
          </div>

          {/* Imagen del Hero */}
          {image && (
            <div className="hero__image">
              <img src={image} alt={title} className="hero__image-element" />
            </div>
          )}

        </div>
      </Container>
    </section>
  );
};

export default Hero;