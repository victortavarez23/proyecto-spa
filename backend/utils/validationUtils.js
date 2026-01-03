import validator from 'validator';

// Validar email
export const validateEmail = (email) => {
    if (!email) {
        return 'Email es requerido';
    }

    if (!validator.isEmail(email)) {
        return 'Email no tiene formato válido';
    }

    return null;
};

// Validar password
export const validatePassword = (password) => {
    if (!password) {
        return 'Contraseña es requerida';
    }

    if (password.length < 6) {
        return 'Contraseña debe tener al menos 6 caracteres';
    }

    if (!/[A-Z]/.test(password)) {
        return 'Contraseña debe contener al menos una mayúscula';
    }

    if (!/[0-9]/.test(password)) {
        return 'Contraseña debe contener al menos un número';
    }

    return null;
};

// Validar nombre
export const validateName = (name) => {
    if (!name) {
        return 'Nombre es requerido';
    }

    if (name.length < 2) {
        return 'Nombre debe tener al menos 2 caracteres';
    }

    if (name.length > 50) {
        return 'Nombre no puede exceder 50 caracteres';
    }

    // Regex que acepta letras (incluyendo tildes y ñ) y espacios
    if (!/^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]+$/.test(name)) {
        return 'Nombre solo puede contener letras y espacios';
    }

    return null;
};

// Validar datos de registro (Agrupa las anteriores)
export const validateRegistrationData = (data) => {
    const errors = {};

    const nameError = validateName(data.name);
    if (nameError) errors.name = nameError;

    const emailError = validateEmail(data.email);
    if (emailError) errors.email = emailError;

    const passwordError = validatePassword(data.password);
    if (passwordError) errors.password = passwordError;

    return {
        isValid: Object.keys(errors).length === 0,
        errors
    };
};

// Validar datos de Login
export const validateLoginData = (data) => {
    const errors = {};

    const emailError = validateEmail(data.email);
    if (emailError) errors.email = emailError;

    if (!data.password) {
        errors.password = 'Contraseña es requerida';
    }

    return {
        isValid: Object.keys(errors).length === 0,
        errors
    };
};