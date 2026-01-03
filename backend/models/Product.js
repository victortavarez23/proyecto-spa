import mongoose from 'mongoose';

const productSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'El nombre del producto es requerido'],
        trim: true,
        maxlength: [100, 'El nombre no puede exceder 100 caracteres']
    },
    description: {
        type: String,
        required: [true, 'La descripción es requerida'],
        maxlength: [1000, 'La descripción no puede exceder 1000 caracteres']
    },
    price: {
        type: Number,
        required: [true, 'El precio es requerido'],
        min: [0, 'El precio no puede ser negativo']
    },
    originalPrice: {
        type: Number,
        min: [0, 'El precio original no puede ser negativo']
    },
    category: {
        type: String,
        required: [true, 'La categoría es requerida'],
        enum: ['electronics', 'clothing', 'books', 'home', 'sports', 'other']
    },
    image: {
        type: String,
        default: 'https://via.placeholder.com/300x300?text=Product+Image'
    },
    images: [{
        type: String
    }],
    stock: {
        type: Number,
        required: true,
        min: [0, 'El stock no puede ser negativo'],
        default: 0
    },
    sku: {
        type: String,
        unique: true,
        sparse: true
    },
    brand: {
        type: String,
        trim: true
    },
    rating: {
        average: {
            type: Number,
            min: 0,
            max: 5,
            default: 0
        },
        count: {
            type: Number,
            default: 0
        }
    },
    features: [{
        type: String
    }],
    specifications: {
        type: Map,
        of: String
    },
    isActive: {
        type: Boolean,
        default: true
    },
    tags: [{
        type: String,
        trim: true
    }]
}, {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true }
});

// Virtual para calcular porcentaje de descuento
productSchema.virtual('discountPercentage').get(function() {
    if (this.originalPrice && this.originalPrice > this.price) {
        return Math.round(((this.originalPrice - this.price) / this.originalPrice) * 100);
    }
    return 0;
});

// Virtual para verificar stock
productSchema.virtual('inStock').get(function() {
    return this.stock > 0;
});

// Índices para búsquedas eficientes
productSchema.index({ name: 'text', description: 'text' });
productSchema.index({ category: 1, price: 1 });
productSchema.index({ createdAt: -1 });
productSchema.index({ 'rating.average': -1 });

// Método estático para obtener solo productos activos
productSchema.static('getActiveProducts', function() {
    return this.find({ isActive: true });
});

const Product = mongoose.model('Product', productSchema);
export default Product;