import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const LoginPage = () => {
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [error, setError] = useState(null);
  
  // Usamos el hook de autenticación corregido
  const { login, loading } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
    if (error) setError(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault(); // ¡ESTO ES VITAL! Evita que la página se recargue
    setError(null);

    console.log('Intentando login con:', formData.email);

    // Llamamos a la función login del AuthContext
    const result = await login(formData);

    if (result.success) {
      console.log('Login exitoso, redirigiendo...');
      navigate('/dashboard'); 
    } else {
      console.error('Fallo el login:', result.error);
      setError(result.error);
    }
  };

  return (
    <div className="login-page-container">
      <div className="login-box">
        <h2 className="login-title">Iniciar Sesión</h2>
        
        {/* Mensaje de Error Visual */}
        {error && (
          <div className="error-alert">
            <span className="error-icon">⚠️</span>
            <div>
              <strong>Algo salió mal</strong>
              <p>{error}</p>
            </div>
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Email:</label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="admin@example.com"
              required
              disabled={loading}
            />
          </div>

          <div className="form-group">
            <label>Contraseña:</label>
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              placeholder="••••••••"
              required
              disabled={loading}
            />
          </div>

          <button type="submit" className="btn-primary" disabled={loading}>
            {loading ? 'Verificando...' : 'Ingresar'}
          </button>
        </form>

        <div className="register-link">
          ¿No tienes cuenta? <Link to="/registro">Regístrate aquí</Link>
        </div>
      </div>

      {/* ESTILOS CSS ORIGINALES INTEGRADOS */}
      <style>{`
        .login-page-container {
          display: flex;
          justify-content: center;
          align-items: center;
          min-height: 80vh;
          background-color: #f4f6f8;
          font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
        }
        .login-box {
          background: white;
          padding: 2.5rem;
          border-radius: 12px;
          box-shadow: 0 5px 20px rgba(0,0,0,0.08);
          width: 100%;
          max-width: 420px;
        }
        .login-title {
          margin-top: 0;
          margin-bottom: 1.5rem;
          color: #333;
          font-size: 1.8rem;
          font-weight: 700;
        }
        .form-group { margin-bottom: 1.2rem; }
        .form-group label {
          display: block; margin-bottom: 0.5rem;
          font-weight: 600; color: #444;
        }
        .form-group input {
          width: 100%; padding: 12px;
          border: 1px solid #ddd; border-radius: 6px;
          font-size: 1rem; box-sizing: border-box;
        }
        .form-group input:focus { border-color: #007bff; outline: none; }
        .btn-primary {
          width: 100%; padding: 12px;
          background-color: #007bff; color: white;
          border: none; border-radius: 6px;
          font-size: 1rem; font-weight: 600;
          cursor: pointer; transition: background-color 0.3s;
          margin-top: 10px;
        }
        .btn-primary:hover { background-color: #0056b3; }
        .btn-primary:disabled { background-color: #a0cfff; cursor: not-allowed; }
        .error-alert {
          background-color: #fff2f2; color: #d63031;
          padding: 1rem; border-radius: 6px;
          border: 1px solid #ffcece; margin-bottom: 1.5rem;
          display: flex; gap: 10px;
        }
        .register-link { text-align: center; margin-top: 1.5rem; color: #666; }
        .register-link a { color: #007bff; text-decoration: none; font-weight: 600; }
      `}</style>
    </div>
  );
};

export default LoginPage;