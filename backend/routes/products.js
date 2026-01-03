import express from 'express';
import {
    getProducts,
    getProductById,
    createProduct,
    updateProduct,
    deleteProduct,
    getProductsByCategory,
    searchProducts,
    getFeaturedProducts
} from '../controllers/productController.js';
import { authenticateToken, requireRole } from '../middleware/authMiddleware.js';
import { validateObjectId, validateProductQuery } from '../middleware/validationMiddleware.js'; // 👈 Nueva importación

const router = express.Router();

// --- RUTAS PÚBLICAS ---

// Listados y Búsquedas (Validamos los query params como ?limit=10&minPrice=100)
router.get('/', validateProductQuery, getProducts);
router.get('/search', validateProductQuery, searchProducts);
router.get('/featured', validateProductQuery, getFeaturedProducts);
router.get('/category/:category', validateProductQuery, getProductsByCategory);

// Detalle por ID (Validamos que el :id sea un ObjectId real de Mongo)
router.get('/:id', validateObjectId, getProductById);

// --- RUTAS PROTEGIDAS (SOLO ADMIN) ---

// Crear (No requiere validar ID ni query, el body se valida en el controlador)
router.post('/', authenticateToken, requireRole(['admin']), createProduct);

// Actualizar y Eliminar (Validamos ID + Token + Rol Admin)
router.put('/:id', validateObjectId, authenticateToken, requireRole(['admin']), updateProduct);
router.delete('/:id', validateObjectId, authenticateToken, requireRole(['admin']), deleteProduct);

// --- RUTA INFORMATIVA DE API ---
router.get('/info/api', (req, res) => {
    res.status(200).json({
        success: true,
        message: 'Products API funcionando con validaciones',
        endpoints: {
            getAll: 'GET /api/products',
            getById: 'GET /api/products/:id',
            search: 'GET /api/products/search?q=term',
            featured: 'GET /api/products/featured',
            byCategory: 'GET /api/products/category/:category',
            create: 'POST /api/products (admin only)',
            update: 'PUT /api/products/:id (admin only)',
            delete: 'DELETE /api/products/:id (admin only)'
        }
    });
});

export default router;