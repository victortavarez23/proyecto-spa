import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';

// Generar JWT Token
export const generateToken = (userId, role = 'user') => {
    return jwt.sign(
        { 
            userId, 
            role,
            iss: 'spa-backend',
            aud: 'spa-frontend'
        },
        process.env.JWT_SECRET,
        {
            expiresIn: process.env.JWT_EXPIRE || '24h',
            algorithm: 'HS256'
        }
    );
};

// Verificar JWT Token
export const verifyToken = (token) => {
    try {
        return jwt.verify(token, process.env.JWT_SECRET, { algorithms: ['HS256'] });
    } catch (error) {
        throw new Error('Token inválido o expirado');
    }
};

// Hashear contraseña
export const hashPassword = async (password) => {
    const saltRounds = parseInt(process.env.BCRYPT_SALT_ROUNDS) || 12;
    return await bcrypt.hash(password, saltRounds);
};

// Comparar contraseña con hash
export const comparePassword = async (password, hashedPassword) => {
    return await bcrypt.compare(password, hashedPassword);
};

// Extraer token de headers
export const extractTokenFromHeader = (authHeader) => {
    if (!authHeader) {
        throw new Error('Authorization header required');
    }

    const parts = authHeader.split(' ');

    if (parts.length !== 2 || parts[0] !== 'Bearer') {
        throw new Error('Authorization header format: Bearer <token>');
    }

    return parts[1];
};

// Generar respuesta de autenticación estándar
export const generateAuthResponse = (user, token) => {
    return {
        success: true,
        message: 'Autenticación exitosa',
        data: {
            user: {
                id: user._id,
                name: user.name,
                email: user.email,
                role: user.role,
                lastLogin: user.lastLogin
            },
            token,
            expiresIn: process.env.JWT_EXPIRE || '24h'
        }
    };
};