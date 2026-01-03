import { verifyToken, extractTokenFromHeader } from '../utils/authUtils.js';
import User from '../models/User.js';

// Middleware para verificar JWT
export const authenticateToken = async (req, res, next) => {
    try {
        const authHeader = req.headers.authorization;
        const token = extractTokenFromHeader(authHeader);

        const decoded = verifyToken(token);

        // Verificar que el usuario aún existe
        const user = await User.findById(decoded.userId).select('-password');
        
        if (!user) {
            return res.status(401).json({
                success: false,
                message: 'Usuario no encontrado - token inválido'
            });
        }

        if (!user.isActive) {
            return res.status(401).json({
                success: false,
                message: 'Cuenta desactivada'
            });
        }

        // Agregar usuario al request
        req.user = user;
        next();

    } catch (error) {
        console.error('Error en autenticación:', error.message);

        return res.status(401).json({
            success: false,
            message: 'No autorizado - token inválido',
            error: error.message
        });
    }
};

// Middleware para verificar roles
export const requireRole = (allowedRoles) => {
    return (req, res, next) => {
        if (!req.user) {
            return res.status(401).json({
                success: false,
                message: 'Autenticación requerida'
            });
        }

        if (!allowedRoles.includes(req.user.role)) {
            return res.status(403).json({
                success: false,
                message: 'Permisos insuficientes para esta acción'
            });
        }

        next();
    };
};

// Middleware opcional de autenticación (para rutas públicas/privadas mixtas)
export const optionalAuth = async (req, res, next) => {
    try {
        const authHeader = req.headers.authorization;
        if (!authHeader) {
            return next(); // Continuar sin usuario
        }

        const token = extractTokenFromHeader(authHeader);
        const decoded = verifyToken(token);

        const user = await User.findById(decoded.userId).select('-password');
        if (user && user.isActive) {
            req.user = user;
        }

        next();
    } catch (error) {
        // Si hay error en el token, continuar sin autenticación (como usuario anónimo)
        next();
    }
};