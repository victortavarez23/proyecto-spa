import './Footer.css'; // Importamos los estilos específicos para que se vea horizontal

const Footer = () => {
  // Obtenemos el año actual automáticamente
  const currentYear = new Date().getFullYear();

  return (
    <footer className="footer">
      <div className="container">
        {/* Copyright con año dinámico */}
        <p>
          &copy; <span id="current-year">{currentYear}</span> Víctor Tavárez. Todos los derechos reservados.
        </p>
        
        {/* Dirección de contacto */}
        <address>
          Contacto: <a href="mailto:victortavarez23@gmail.com">victortavarez23@gmail.com</a>
        </address>

        {/* Enlaces legales */}
        <nav aria-label="Enlaces legales">
          <ul>
            <li><a href="#privacy">Política de Privacidad</a></li>
            <li><a href="#terms">Términos de Servicio</a></li>
          </ul>
        </nav>
      </div>
    </footer>
  );
};

export default Footer;