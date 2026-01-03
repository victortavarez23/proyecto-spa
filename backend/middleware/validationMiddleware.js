import { ObjectId } from 'mongodb';

// Validar ObjectId de MongoDB (evita errores de CastError en Mongoose)
export const validateObjectId = (req, res, next) => {
    const { id } = req.params;

    if (!ObjectId.isValid(id)) {
        return res.status(400).json({
            success: false,
            message: 'ID no válido'
        });
    }

    next();
};

// Validar parámetros de query para productos
export const validateProductQuery = (req, res, next) => {
    const { limit, page, minPrice, maxPrice, minRating } = req.query;

    // Validar límite (items por página)
    if (limit && (isNaN(limit) || parseInt(limit) < 1)) {
        return res.status(400).json({
            success: false,
            message: 'El parámetro limit debe ser un número positivo'
        });
    }

    // Validar número de página
    if (page && (isNaN(page) || parseInt(page) < 1)) {
        return res.status(400).json({
            success: false,
            message: 'El parámetro page debe ser un número positivo'
        });
    }

    // Validar precio mínimo
    if (minPrice && (isNaN(minPrice) || parseFloat(minPrice) < 0)) {
        return res.status(400).json({
            success: false,
            message: 'El parámetro minPrice debe ser un número positivo'
        });
    }

    // Validar precio máximo
    if (maxPrice && (isNaN(maxPrice) || parseFloat(maxPrice) < 0)) {
        return res.status(400).json({
            success: false,
            message: 'El parámetro maxPrice debe ser un número positivo'
        });
    }

    // Validar rating (de 1 a 5 estrellas)
    if (minRating && (isNaN(minRating) || parseFloat(minRating) < 1 || parseFloat(minRating) > 5)) {
        return res.status(400).json({
            success: false,
            message: 'El parámetro minRating debe estar entre 1 y 5'
        });
    }

    next();
};