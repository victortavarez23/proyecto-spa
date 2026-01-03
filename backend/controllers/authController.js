import User from '../models/User.js';
import { 
    generateToken, 
    generateAuthResponse, 
    comparePassword, 
    hashPassword 
} from '../utils/authUtils.js';
import { 
    validateRegistrationData, 
    validateLoginData,
    validateName 
} from '../utils/validationUtils.js';

// Registrar nuevo usuario
export const register = async (req, res) => {
    try {
        const { name, email, password } = req.body;

        // Validar datos de entrada
        const validation = validateRegistrationData({ name, email, password });
        if (!validation.isValid) {
            return res.status(400).json({
                success: false,
                message: 'Datos de registro inválidos',
                errors: validation.errors
            });
        }

        // Verificar si el usuario ya existe
        const existingUser = await User.findOne({ email: email.toLowerCase() });
        if (existingUser) {
            return res.status(409).json({
                success: false,
                message: 'El email ya está registrado',
                error: 'EMAIL_ALREADY_EXISTS'
            });
        }

        // Crear nuevo usuario
        const user = new User({
            name: name.trim(),
            email: email.toLowerCase(),
            password,
            role: 'user'
        });

        await user.save();

        // Generar token JWT
        const token = generateToken(user._id, user.role);

        // Actualizar último login
        user.lastLogin = new Date();
        await user.save();

        res.status(201).json(generateAuthResponse(user, token));

    } catch (error) {
        console.error('Error en registro:', error);
        res.status(500).json({
            success: false,
            message: 'Error interno del servidor durante el registro',
            error: process.env.NODE_ENV === 'development' ? error.message : undefined
        });
    }
};

// Login de usuario
export const login = async (req, res) => {
    try {
        const { email, password } = req.body;

        // Validar datos de entrada
        const validation = validateLoginData({ email, password });
        if (!validation.isValid) {
            return res.status(400).json({
                success: false,
                message: 'Datos de login inválidos',
                errors: validation.errors
            });
        }

        // Buscar usuario incluyendo password (que por defecto está oculto)
        const user = await User.findOne({ email: email.toLowerCase() }).select('+password');

        if (!user) {
            return res.status(401).json({
                success: false,
                message: 'Credenciales inválidas',
                error: 'INVALID_CREDENTIALS'
            });
        }

        if (!user.isActive) {
            return res.status(401).json({
                success: false,
                message: 'Cuenta desactivada',
                error: 'ACCOUNT_DEACTIVATED'
            });
        }

        // Verificar contraseña
        const isPasswordValid = await comparePassword(password, user.password);
        if (!isPasswordValid) {
            return res.status(401).json({
                success: false,
                message: 'Credenciales inválidas',
                error: 'INVALID_CREDENTIALS'
            });
        }

        // Generar token JWT
        const token = generateToken(user._id, user.role);

        // Actualizar último login
        user.lastLogin = new Date();
        await user.save();

        // Eliminar password de la respuesta (por seguridad)
        user.password = undefined;

        res.status(200).json(generateAuthResponse(user, token));

    } catch (error) {
        console.error('Error en login:', error);
        res.status(500).json({
            success: false,
            message: 'Error interno del servidor durante el login',
            error: process.env.NODE_ENV === 'development' ? error.message : undefined
        });
    }
};

// Obtener perfil de usuario actual
export const getProfile = async (req, res) => {
    try {
        // req.user viene del middleware de autenticación
        const user = await User.findById(req.user._id);

        res.status(200).json({
            success: true,
            data: {
                user: {
                    id: user._id,
                    name: user.name,
                    email: user.email,
                    role: user.role,
                    lastLogin: user.lastLogin,
                    createdAt: user.createdAt
                }
            }
        });
    } catch (error) {
        console.error('Error obteniendo perfil:', error);
        res.status(500).json({
            success: false,
            message: 'Error obteniendo perfil de usuario'
        });
    }
};

// Actualizar perfil de usuario
export const updateProfile = async (req, res) => {
    try {
        const { name } = req.body;
        const updates = {};

        if (name) {
            const nameError = validateName(name);
            if (nameError) {
                return res.status(400).json({
                    success: false,
                    message: nameError
                });
            }
            updates.name = name.trim();
        }

        const user = await User.findByIdAndUpdate(
            req.user._id,
            updates,
            { new: true, runValidators: true }
        );

        res.status(200).json({
            success: true,
            message: 'Perfil actualizado exitosamente',
            data: {
                user: {
                    id: user._id,
                    name: user.name,
                    email: user.email,
                    role: user.role
                }
            }
        });

    } catch (error) {
        console.error('Error actualizando perfil:', error);
        res.status(500).json({
            success: false,
            message: 'Error actualizando perfil de usuario'
        });
    }
};

// Verificar token (para frontend)
export const verifyAuth = async (req, res) => {
    try {
        // Si llega aquí, es porque el middleware ya verificó el token
        res.status(200).json({
            success: true,
            message: 'Token válido',
            data: {
                user: {
                    id: req.user._id,
                    name: req.user.name,
                    email: req.user.email,
                    role: req.user.role
                },
                valid: true
            }
        });
    } catch (error) {
        res.status(401).json({
            success: false,
            message: 'Token inválido',
            valid: false
        });
    }
};

// Logout (manejado en frontend, pero podemos invalidar token si es necesario)
export const logout = async (req, res) => {
    try {
        // En un sistema más avanzado con Redis, aquí invalidaríamos el token.
        // Para este ejemplo (stateless JWT), el logout real ocurre en el frontend borrando el token.
        
        res.status(200).json({
            success: true,
            message: 'Sesión cerrada exitosamente'
        });
    } catch (error) {
        console.error('Error en logout:', error);
        res.status(500).json({
            success: false,
            message: 'Error cerrando sesión'
        });
    }
};