import React, { useState } from 'react';
import api from '../../../services/api'; // Importamos la misma llave (ajustando la ruta ../)
import './ContactForm.css';

const ContactForm = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: '',
    category: 'general' // Valor por defecto requerido por el backend
  });
  const [status, setStatus] = useState({ type: '', msg: '' });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setStatus({ type: '', msg: '' });

    try {
      // Petición POST al endpoint del Paso 6
      const response = await api.post('/contact/submit', formData);
      
      if (response.data.success) {
        setStatus({ type: 'success', msg: '¡Mensaje enviado con éxito! Te contactaremos pronto.' });
        setFormData({ name: '', email: '', subject: '', message: '', category: 'general' }); // Limpiar formulario
      }
    } catch (error) {
      console.error("Error enviando mensaje:", error);
      setStatus({ type: 'error', msg: 'Hubo un error al enviar el mensaje. Intenta nuevamente.' });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="contact-section">
      <h2 style={{textAlign: 'center', marginBottom: '20px'}}>Contáctanos</h2>
      
      {status.msg && (
        <div style={{
            padding: '15px', 
            marginBottom: '20px', 
            borderRadius: '5px', 
            textAlign: 'center',
            backgroundColor: status.type === 'error' ? '#f8d7da' : '#d4edda',
            color: status.type === 'error' ? '#721c24' : '#155724',
            border: `1px solid ${status.type === 'error' ? '#f5c6cb' : '#c3e6cb'}`
        }}>
          {status.msg}
        </div>
      )}

      <form onSubmit={handleSubmit} className="contact-form">
        <div className="form-group">
          <label>Nombre Completo</label>
          <input 
            type="text" name="name" required 
            value={formData.name} onChange={handleChange} 
            placeholder="Tu nombre"
          />
        </div>

        <div className="form-group">
          <label>Correo Electrónico</label>
          <input 
            type="email" name="email" required 
            value={formData.email} onChange={handleChange} 
            placeholder="ejemplo@correo.com"
          />
        </div>

        <div className="form-group">
          <label>Asunto</label>
          <input 
            type="text" name="subject" required 
            value={formData.subject} onChange={handleChange} 
            placeholder="Motivo de tu mensaje"
          />
        </div>

        <div className="form-group">
          <label>Mensaje</label>
          <textarea 
            name="message" rows="5" required 
            value={formData.message} onChange={handleChange} 
            placeholder="Escribe aquí tu consulta..."
          ></textarea>
        </div>

        <button type="submit" className="submit-btn" disabled={isSubmitting}>
          {isSubmitting ? 'Enviando...' : 'Enviar Mensaje'}
        </button>
      </form>
    </div>
  );
};

export default ContactForm;