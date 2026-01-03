import express from 'express';
import { 
    register, 
    login, 
    getProfile, 
    updateProfile, 
    verifyAuth, 
    logout 
} from '../controllers/authController.js';
import { authenticateToken, optionalAuth } from '../middleware/authMiddleware.js';

const router = express.Router();

// --- RUTAS PÚBLICAS ---
// Cualquiera puede registrarse o iniciar sesión
router.post('/register', register);
router.post('/login', login);

// Verificación de token (útil para que el frontend sepa si el usuario sigue logueado al recargar)
router.get('/verify', optionalAuth, verifyAuth);

// --- RUTAS PROTEGIDAS ---
// Requieren que el usuario envíe un token válido en los headers
router.get('/profile', authenticateToken, getProfile);
router.put('/profile', authenticateToken, updateProfile);
router.post('/logout', authenticateToken, logout);

// --- RUTA INFORMATIVA ---
// Para verificar rápidamente que el módulo de auth está cargado
router.get('/info', (req, res) => {
    res.status(200).json({
        success: true,
        message: 'Auth API funcionando',
        endpoints: {
            register: 'POST /api/auth/register',
            login: 'POST /api/auth/login',
            profile: 'GET /api/auth/profile (protected)',
            verify: 'GET /api/auth/verify'
        },
        security: {
            type: 'JWT',
            algorithm: 'HS256'
        }
    });
});

export default router;