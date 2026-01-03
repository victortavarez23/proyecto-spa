import mongoose from 'mongoose';

const contactMessageSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'El nombre es requerido'],
        trim: true,
        maxlength: [100, 'El nombre no puede exceder 100 caracteres'],
        minlength: [2, 'El nombre debe tener al menos 2 caracteres']
    },
    email: {
        type: String,
        required: [true, 'El email es requerido'],
        lowercase: true,
        match: [
            /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/,
            'Por favor ingresa un email válido'
        ]
    },
    phone: {
        type: String,
        trim: true,
        maxlength: [20, 'El teléfono no puede exceder 20 caracteres'],
        match: [
            /^[\+]?[0-9\s-\(\)]{10,20}$/,
            'Por favor ingresa un número de teléfono válido'
        ]
    },
    subject: {
        type: String,
        required: [true, 'El asunto es requerido'],
        trim: true,
        maxlength: [200, 'El asunto no puede exceder 200 caracteres'],
        minlength: [5, 'El asunto debe tener al menos 5 caracteres']
    },
    message: {
        type: String,
        required: [true, 'El mensaje es requerido'],
        trim: true,
        maxlength: [2000, 'El mensaje no puede exceder 2000 caracteres'],
        minlength: [10, 'El mensaje debe tener al menos 10 caracteres']
    },
    category: {
        type: String,
        required: true,
        enum: {
            values: ['general', 'support', 'sales', 'technical', 'complaint', 'suggestion'],
            message: 'Categoría no válida'
        },
        default: 'general'
    },
    status: {
        type: String,
        enum: ['new', 'in_progress', 'resolved', 'closed'],
        default: 'new'
    },
    priority: {
        type: String,
        enum: ['low', 'medium', 'high', 'urgent'],
        default: 'medium'
    },
    ipAddress: {
        type: String,
        trim: true
    },
    userAgent: {
        type: String,
        trim: true
    },
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        default: null
    },
    response: {
        message: String,
        respondedBy: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User'
        },
        respondedAt: Date
    },
    assignedTo: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        default: null
    }
}, {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true }
});

// Índices para mejor performance
contactMessageSchema.index({ email: 1 });
contactMessageSchema.index({ status: 1 });
contactMessageSchema.index({ category: 1 });
contactMessageSchema.index({ createdAt: -1 });
contactMessageSchema.index({ priority: 1 });

// Virtual para tiempo desde creación
contactMessageSchema.virtual('ageInHours').get(function() {
    return Math.floor((Date.now() - this.createdAt) / (1000 * 60 * 60));
});

// Virtual para saber si tiene respuesta
contactMessageSchema.virtual('hasResponse').get(function() {
    return !!this.response && !!this.response.message;
});

// Método estático para contar mensajes por estado
contactMessageSchema.statics.countByStatus = function() {
    return this.aggregate([
        { $group: { _id: '$status', count: { $sum: 1 } } }
    ]);
};

// Método estático para obtener mensajes recientes
contactMessageSchema.statics.getRecentMessages = function(days = 7) {
    const date = new Date();
    date.setDate(date.getDate() - days);

    return this.find({ createdAt: { $gte: date } })
        .sort({ createdAt: -1 })
        .limit(50);
};

const ContactMessage = mongoose.model('ContactMessage', contactMessageSchema);
export default ContactMessage;