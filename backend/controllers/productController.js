import Product from '../models/Product.js';
import {
    validateProductData,
    buildProductQuery,
    buildPaginationOptions,
    calculatePaginationMetadata,
    formatProductResponse
} from '../utils/productUtils.js';

// Obtener todos los productos (público)
export const getProducts = async (req, res) => {
    try {
        const query = buildProductQuery(req.query);
        const { page, limit, skip, sort } = buildPaginationOptions(req.query);

        // Ejecutar query con paginación
        const [products, total] = await Promise.all([
            Product.find(query)
                .sort(sort)
                .skip(skip)
                .limit(limit)
                .lean(),
            Product.countDocuments(query)
        ]);

        const pagination = calculatePaginationMetadata(total, page, limit);

        res.status(200).json(formatProductResponse(products, pagination));

    } catch (error) {
        console.error('Error obteniendo productos:', error);
        res.status(500).json({
            success: false,
            message: 'Error al obtener productos',
            error: process.env.NODE_ENV === 'development' ? error.message : undefined
        });
    }
};

// Obtener producto por ID (público)
export const getProductById = async (req, res) => {
    try {
        const product = await Product.findOne({
            _id: req.params.id,
            isActive: true
        });

        if (!product) {
            return res.status(404).json({
                success: false,
                message: 'Producto no encontrado'
            });
        }

        res.status(200).json({
            success: true,
            data: { product: formatProductResponse([product]).data.products[0] }
        });

    } catch (error) {
        console.error('Error obteniendo producto:', error);

        if (error.name === 'CastError') {
            return res.status(400).json({
                success: false,
                message: 'ID de producto no válido'
            });
        }

        res.status(500).json({
            success: false,
            message: 'Error al obtener el producto'
        });
    }
};

// Obtener productos por categoría (público)
export const getProductsByCategory = async (req, res) => {
    try {
        const { category } = req.params;
        const query = buildProductQuery({ ...req.query, category });
        const { page, limit, skip, sort } = buildPaginationOptions(req.query);

        const [products, total] = await Promise.all([
            Product.find(query)
                .sort(sort)
                .skip(skip)
                .limit(limit)
                .lean(),
            Product.countDocuments(query)
        ]);

        const pagination = calculatePaginationMetadata(total, page, limit);

        res.status(200).json({
            ...formatProductResponse(products, pagination),
            category: category
        });

    } catch (error) {
        console.error('Error obteniendo productos por categoría:', error);
        res.status(500).json({
            success: false,
            message: 'Error al obtener productos por categoría'
        });
    }
};

// Buscar productos (público)
export const searchProducts = async (req, res) => {
    try {
        const { q } = req.query;

        if (!q || q.trim().length === 0) {
            return res.status(400).json({
                success: false,
                message: 'Término de búsqueda requerido'
            });
        }

        const query = buildProductQuery({ ...req.query, search: q });
        const { page, limit, skip, sort } = buildPaginationOptions(req.query);

        const [products, total] = await Promise.all([
            Product.find(query)
                .sort(sort)
                .skip(skip)
                .limit(limit)
                .lean(),
            Product.countDocuments(query)
        ]);

        const pagination = calculatePaginationMetadata(total, page, limit);

        res.status(200).json({
            ...formatProductResponse(products, pagination),
            searchTerm: q,
            resultsCount: total
        });

    } catch (error) {
        console.error('Error buscando productos:', error);
        res.status(500).json({
            success: false,
            message: 'Error al buscar productos'
        });
    }
};

// Obtener productos destacados (público)
export const getFeaturedProducts = async (req, res) => {
    try {
        const limit = Math.min(8, parseInt(req.query.limit) || 4);

        const products = await Product.find({
            isActive: true,
            'rating.average': { $gte: 4.0 }
        })
        .sort({ 'rating.average': -1, 'rating.count': -1 })
        .limit(limit)
        .lean();

        res.status(200).json({
            success: true,
            data: {
                products: formatProductResponse(products).data.products,
                featured: true
            }
        });

    } catch (error) {
        console.error('Error obteniendo productos destacados:', error);
        res.status(500).json({
            success: false,
            message: 'Error al obtener productos destacados'
        });
    }
};

// Crear nuevo producto (solo admin)
export const createProduct = async (req, res) => {
    try {
        const validation = validateProductData(req.body);
        if (!validation.isValid) {
            return res.status(400).json({
                success: false,
                message: 'Datos del producto inválidos',
                errors: validation.errors
            });
        }

        // Generar SKU automático si no se proporciona
        const productData = { ...req.body };
        if (!productData.sku) {
            const baseSku = productData.name
                .toLowerCase()
                .replace(/[^a-z0-9]+/g, '-')
                .replace(/(^-|-$)/g, '')
                .substring(0, 20);

            const count = await Product.countDocuments({
                sku: new RegExp(`^${baseSku}`)
            });

            productData.sku = count > 0 ? `${baseSku}-${count + 1}` : baseSku;
        }

        const product = new Product(productData);
        await product.save();

        res.status(201).json({
            success: true,
            message: 'Producto creado exitosamente',
            data: { product: formatProductResponse([product]).data.products[0] }
        });

    } catch (error) {
        console.error('Error creando producto:', error);

        if (error.code === 11000) {
            return res.status(409).json({
                success: false,
                message: 'El SKU del producto ya existe',
                error: 'DUPLICATE_SKU'
            });
        }

        res.status(500).json({
            success: false,
            message: 'Error al crear el producto',
            error: process.env.NODE_ENV === 'development' ? error.message : undefined
        });
    }
};

// Actualizar producto (solo admin)
export const updateProduct = async (req, res) => {
    try {
        const validation = validateProductData(req.body, true);
        if (!validation.isValid) {
            return res.status(400).json({
                success: false,
                message: 'Datos del producto inválidos',
                errors: validation.errors
            });
        }

        const product = await Product.findByIdAndUpdate(
            req.params.id,
            req.body,
            {
                new: true,
                runValidators: true,
                context: 'query'
            }
        );

        if (!product) {
            return res.status(404).json({
                success: false,
                message: 'Producto no encontrado'
            });
        }

        res.status(200).json({
            success: true,
            message: 'Producto actualizado exitosamente',
            data: { product: formatProductResponse([product]).data.products[0] }
        });

    } catch (error) {
        console.error('Error actualizando producto:', error);

        if (error.name === 'CastError') {
            return res.status(400).json({
                success: false,
                message: 'ID de producto no válido'
            });
        }

        if (error.code === 11000) {
            return res.status(409).json({
                success: false,
                message: 'El SKU del producto ya existe',
                error: 'DUPLICATE_SKU'
            });
        }

        res.status(500).json({
            success: false,
            message: 'Error al actualizar el producto'
        });
    }
};

// Eliminar producto (soft delete - solo admin)
export const deleteProduct = async (req, res) => {
    try {
        const product = await Product.findByIdAndUpdate(
            req.params.id,
            { isActive: false },
            { new: true }
        );

        if (!product) {
            return res.status(404).json({
                success: false,
                message: 'Producto no encontrado'
            });
        }

        res.status(200).json({
            success: true,
            message: 'Producto eliminado exitosamente'
        });

    } catch (error) {
        console.error('Error eliminando producto:', error);

        if (error.name === 'CastError') {
            return res.status(400).json({
                success: false,
                message: 'ID de producto no válido'
            });
        }

        res.status(500).json({
            success: false,
            message: 'Error al eliminar el producto'
        });
    }
};