import { validateContactData } from '../utils/contactUtils.js'; //

// Middleware de validación para contacto (Formulario público)
export const validateContactInput = (req, res, next) => {
    // Reutilizamos la utilidad que creamos en el paso 2
    const validation = validateContactData(req.body); //

    if (!validation.isValid) {
        return res.status(400).json({
            success: false,
            message: 'Datos del formulario inválidos',
            errors: validation.errors
        });
    }

    next();
};

// Middleware para validar que el ID sea un ObjectId válido de MongoDB
export const validateMessageId = (req, res, next) => {
    const { id } = req.params; //

    // Regex para validar formato hexadecimal de 24 caracteres
    if (!id.match(/^[0-9a-fA-F]{24}$/)) {
        return res.status(400).json({
            success: false,
            message: 'ID de mensaje no válido'
        });
    }

    next();
};

// Middleware para validar el contenido de la respuesta (Admin)
export const validateResponse = (req, res, next) => {
    const { responseMessage } = req.body; //

    // Validar que no esté vacío
    if (!responseMessage || responseMessage.trim().length === 0) {
        return res.status(400).json({
            success: false,
            message: 'El mensaje de respuesta es requerido'
        });
    }

    // Validar longitud máxima
    if (responseMessage.length > 2000) {
        return res.status(400).json({
            success: false,
            message: 'La respuesta no puede exceder 2000 caracteres'
        });
    }

    next();
};