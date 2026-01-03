import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../../context/AuthContext'; // Ajusta la ruta si es necesario
import './RegisterForm.css';

const RegisterForm = () => {
  const { register, handleSubmit, watch, formState: { errors } } = useForm();
  const { register: registerUser, loading } = useAuth();
  const navigate = useNavigate();
    
  const [apiError, setApiError] = useState(null);
  const [isSuccess, setIsSuccess] = useState(false);
  const password = watch('password'); 

  const onSubmit = async (data) => {
    setApiError(null);
    
    // Enviamos SOLO lo que el backend espera: name, email, password
    const result = await registerUser({
      name: data.name,
      email: data.email,
      password: data.password
    });

    if (result.success) {
      setIsSuccess(true);
      setTimeout(() => {
        navigate('/login');
      }, 2000);
    } else {
      // Mostramos el error exacto que viene del backend
      setApiError(result.error);
    }
  };

  if (isSuccess) {
    return (
      <div className="register-section">
        <div className="success-message" style={{textAlign: 'center', padding: '2rem'}}>
          <h2 style={{ color: '#28a745' }}>✅ ¡Registro Exitoso!</h2>
          <p>Redirigiendo al login...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="register-section">
      <div className="form-header">
        <h2>Crea tu cuenta</h2>
        <p>Gestiona tus proyectos de SPA & Bienestar</p>
      </div>

      {apiError && (
        <div className="api-error-message" style={{ color: 'red', background: '#ffe6e6', padding: '10px', borderRadius: '5px', marginBottom: '15px' }}>
          ⚠️ {apiError}
        </div>
      )}

      <form className="register-form" onSubmit={handleSubmit(onSubmit)}>
        {/* Nombre */}
        <div className="form-group">
          <label>Nombre completo</label>
          <input 
             type="text"
            {...register('name', { required: "El nombre es obligatorio" })}
          />
          {errors.name && <span className="error-msg">{errors.name.message}</span>}
        </div>

        {/* Email */}
        <div className="form-group">
          <label>Correo electrónico</label>
          <input 
             type="email" 
             {...register('email', { 
               required: "El email es obligatorio",
               pattern: {
                 value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                 message: "Email inválido"
               }
            })}
          />
          {errors.email && <span className="error-msg">{errors.email.message}</span>}
        </div>

        {/* Password - VALIDACIÓN CRÍTICA PARA EL BACKEND */}
        <div className="form-group">
          <label>Contraseña</label>
          <input 
             type="password"
            {...register('password', { 
               required: "La contraseña es obligatoria",
               minLength: { value: 6, message: "Mínimo 6 caracteres" },
               validate: {
                   hasUpper: value => /[A-Z]/.test(value) || "Debe tener una mayúscula",
                   hasNumber: value => /[0-9]/.test(value) || "Debe tener un número"
               }
            })}
            placeholder="Ej: Password123"
          />
          {errors.password && <span className="error-msg">{errors.password.message}</span>}
        </div>

        {/* Confirmar Password */}
        <div className="form-group">
          <label>Confirmar contraseña</label>
          <input 
             type="password"
            {...register('confirmPassword', { 
               required: "Confirma tu contraseña",
               validate: value => value === password || "Las contraseñas no coinciden"
            })}
          />
          {errors.confirmPassword && <span className="error-msg">{errors.confirmPassword.message}</span>}
        </div>

        <button type="submit" className="submit-btn" disabled={loading}>
          {loading ? 'Registrando...' : 'Registrarme'}
        </button>
      </form>
    </div>
  );
};

export default RegisterForm; 