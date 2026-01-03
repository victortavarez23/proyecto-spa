import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';

const DashboardPage = () => {
    const { user, logout } = useAuth();
    const navigate = useNavigate();

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    return (
        <div style={{ padding: '40px', maxWidth: '1200px', margin: '0 auto' }}>
            <div style={{ background: 'white', padding: '30px', borderRadius: '15px', boxShadow: '0 4px 20px rgba(0,0,0,0.05)' }}>
                <h1 style={{ color: '#2b57f2', marginBottom: '10px' }}>¡Bienvenido al Dashboard!</h1>
                
                <div style={{ background: '#f8f9fa', padding: '20px', borderRadius: '8px', marginTop: '20px' }}>
                    <h3 style={{ margin: 0 }}>Información del Usuario</h3>
                    <p><strong>Nombre:</strong> {user?.name}</p>
                    <p><strong>Email:</strong> {user?.email}</p>
                    <p><strong>Rol:</strong> <span style={{ background: '#d4edda', color: '#155724', padding: '3px 10px', borderRadius: '20px', fontSize: '0.9em' }}>{user?.role}</span></p>
                </div>

                <button 
                    onClick={handleLogout}
                    style={{ marginTop: '30px', padding: '10px 25px', background: '#dc3545', color: 'white', border: 'none', borderRadius: '5px', cursor: 'pointer', fontWeight: 'bold' }}
                >
                    Cerrar Sesión
                </button>
            </div>
        </div>
    );
};

export default DashboardPage;