import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import database from './config/database.js';
import { requestLogger, errorLogger } from './middleware/logger.js';

// --- IMPORTAR RUTAS ---
import authRoutes from './routes/auth.js';
import productRoutes from './routes/products.js';
import cartRoutes from './routes/cart.js';
import contactRoutes from './routes/contact.js';

// Cargar variables de entorno
dotenv.config();

const app = express();

// --- CONFIGURACIÓN DE CORS (Dinámica y Segura) ---
const allowedOrigins = [
    process.env.CLIENT_URL,      // La URL de Render (Producción)
    'http://localhost:5173',     // Frontend local 
    'http://localhost:3000',     // Frontend alternativo (por si acaso)
    'http://localhost:5000',      // Para pruebas locales del backend
    'http://localhost'
];

app.use(cors({
    origin: function (origin, callback) {
        // Permitir requests sin 'origin' (como Postman, apps móviles o curl)
        if (!origin) return callback(null, true);
        
        // Verificar si el origen está en la lista blanca
        if (allowedOrigins.indexOf(origin) === -1) {
            const msg = 'La política CORS de este sitio no permite acceso desde el origen especificado.';
            return callback(new Error(msg), false);
        }
        return callback(null, true);
    },
    credentials: true, // Permite enviar cookies/tokens
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With', 'Accept']
}));

// --- MIDDLEWARES (Van DESPUÉS de CORS) ---
app.use(requestLogger); 
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));

// Verificar conexión a la base de datos (Middleware de protección 503)
app.use((req, res, next) => {
    const dbStatus = database.getStatus();
    if (req.path === '/api/health') return next(); // Health check siempre pasa

    if (!dbStatus.connected) {
        return res.status(503).json({
            success: false,
            message: 'Servicio no disponible - Base de datos desconectada',
            error: 'database_connection_error'
        });
    }
    next();
});

// --- RUTAS DE UTILIDAD ---
app.get('/api/health', (req, res) => {
    res.status(200).json({
        success: true,
        message: '🚀 Servidor funcionando correctamente',
        timestamp: new Date().toISOString(),
        environment: process.env.NODE_ENV,
        database: database.getStatus()
    });
});

app.get('/api/db-status', (req, res) => {
    const status = database.getStatus();
    res.status(200).json({ success: true, database: status });
});

// ➤ MONTAR RUTAS PRINCIPALES
app.use('/api/auth', authRoutes);
app.use('/api/products', productRoutes);
app.use('/api/cart', cartRoutes);
app.use('/api/contact', contactRoutes);

// Manejo de errores (Middleware final)
app.use(errorLogger);
app.use((error, req, res, next) => {
    console.error(`❌ Error: ${error.message}`);
    res.status(error.status || 500).json({
        success: false,
        message: error.message || 'Error interno del servidor',
        stack: process.env.NODE_ENV === 'development' ? error.stack : undefined
    });
});

// Iniciar servidor
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`\n==================================================`);
    console.log(`🚀 Backend Server iniciado exitosamente!`);
    console.log(`📡 URL: http://localhost:${PORT}`);
    console.log(`==================================================\n`);
});

export default app;