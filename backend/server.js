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

// --- 1. MIDDLEWARE DE SEGURIDAD HTTPS (Solo Producción) ---
app.use((req, res, next) => {
    // Si el header 'x-forwarded-proto' no es https y estamos en producción, redirigir.
    if (req.header('x-forwarded-proto') !== 'https' && process.env.NODE_ENV === 'production') {
        res.redirect(`https://${req.header('host')}${req.url}`);
    } else {
        next();
    }
});

// --- 2. CONFIGURACIÓN DE CORS AVANZADA ---
const corsOptions = {
    origin: function (origin, callback) {
        // Lista de orígenes permitidos
        const allowedOrigins = [
            process.env.CLIENT_URL,      // La URL de Render (Producción)
            'http://localhost:5173',     // Frontend local (Vite)
            'http://localhost:3000',     // Frontend local alternativo
            'http://localhost:5000',     // Backend local (para pruebas directas)
            'http://localhost'           // Frontend en Docker (Puerto 80)
        ];

        // !origin permite peticiones sin origen (como Postman, Apps móviles o curl)
        // Si en el futuro quieres ser MUY estricto, podrías quitar "|| !origin"
        if (!origin || allowedOrigins.indexOf(origin) !== -1) {
            callback(null, true);
        } else {
            console.error(`❌ Bloqueo CORS para origen: ${origin}`);
            callback(new Error('No permitido por CORS (Bloqueo de Seguridad)'));
        }
    },
    credentials: true, // Permite cookies/tokens
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With', 'Accept']
};

// Aplicar la configuración
app.use(cors(corsOptions));

// --- 3. MIDDLEWARES GENERALES (Van DESPUÉS de CORS) ---
app.use(requestLogger); 
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));

// --- 4. VERIFICACIÓN DE BASE DE DATOS (Middleware de protección 503) ---
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

// --- 5. RUTAS DE UTILIDAD ---
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

// --- 6. MONTAR RUTAS PRINCIPALES ---
app.use('/api/auth', authRoutes);
app.use('/api/products', productRoutes);
app.use('/api/cart', cartRoutes);
app.use('/api/contact', contactRoutes);

// --- 7. MANEJO DE ERRORES (Middleware final) ---
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