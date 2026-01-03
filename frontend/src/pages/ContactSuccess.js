import { useLocation, Link } from 'react-router-dom';
import './ContactSuccess.css'; // Opcional, para estilos

const ContactSuccess = () => {
  // 1. Usamos el hook useLocation para acceder al estado de la navegación
  const location = useLocation();
  
  // 2. Extraemos los datos que enviamos desde el formulario
  // El "|| {}" evita que la app explote si alguien entra directo por URL sin llenar el form
  const { formData } = location.state || {};

  return (
    <div className="contact-success" style={{ padding: '80px 20px', textAlign: 'center', maxWidth: '600px', margin: '0 auto' }}>
      <h1 style={{ color: '#2563eb', marginBottom: '1rem' }}>¡Mensaje enviado con éxito! 🚀</h1>
      
      {/* 3. Mostramos el nombre del usuario dinámicamente */}
      <p style={{ fontSize: '1.2rem', color: '#555', marginBottom: '2rem' }}>
        Gracias <strong>{formData?.name || 'visitante'}</strong> por contactarnos. 
        Te responderemos pronto al correo <em>{formData?.email}</em>.
      </p>

      <Link 
        to="/" 
        className="home-link"
        style={{ 
          display: 'inline-block', 
          padding: '10px 20px', 
          backgroundColor: '#333', 
          color: 'white', 
          textDecoration: 'none', 
          borderRadius: '5px' 
        }}
      >
        Volver al inicio
      </Link>
    </div>
  );
};

export default ContactSuccess;