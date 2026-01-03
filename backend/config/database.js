import mongoose from 'mongoose';
import dotenv from 'dotenv';

// Cargar variables de entorno
dotenv.config();

class Database {
    constructor() {
        this.connection = null;
        this.connect(); // Se conecta automáticamente al instanciar
    }

    async connect() {
        try {
            // Opciones de conexión para Mongoose 7+
            const options = {
                maxPoolSize: 10, // Máximo de conexiones simultáneas
                serverSelectionTimeoutMS: 5000, // Timeout para seleccionar servidor
                socketTimeoutMS: 45000, // Timeout de inactividad
                family: 4 // Usar IPv4
            };

            console.log('🔄 Intentando conectar a MongoDB Atlas...');

            this.connection = await mongoose.connect(
                process.env.MONGODB_URI,
                options
            );

            console.log('✅ Conectado a MongoDB Atlas exitosamente!');
            console.log(`   ➜ Base de datos: ${this.connection.connection.name}`);
            console.log(`   ➜ Host: ${this.connection.connection.host}`);
            console.log(`   ➜ Puerto: ${this.connection.connection.port}`);

        } catch (error) {
            console.error('❌ Error conectando a MongoDB:', error.message);
            process.exit(1); // Salir del proceso con error
        }
    }

    async disconnect() {
        try {
            if (this.connection) {
                await mongoose.disconnect();
                console.log('✅ Desconectado de MongoDB Atlas');
            }
        } catch (error) {
            console.error('❌ Error desconectando de MongoDB:', error.message);
        }
    }

    getConnection() {
        return this.connection;
    }

    getStatus() {
        return {
            connected: mongoose.connection.readyState === 1,
            state: this.getStateString(mongoose.connection.readyState),
            dbName: mongoose.connection.name,
            host: mongoose.connection.host,
            port: mongoose.connection.port
        };
    }

    getStateString(state) {
        const states = {
            0: 'disconnected',
            1: 'connected',
            2: 'connecting',
            3: 'disconnecting',
            99: 'uninitialized'
        };
        return states[state] || 'unknown';
    }
}

// Manejo de eventos de conexión
mongoose.connection.on('connected', () => {
    console.log('📊 Mongoose conectado a MongoDB Atlas');
});

mongoose.connection.on('error', (err) => {
    console.error('❌ Error de conexión de Mongoose:', err);
});

mongoose.connection.on('disconnected', () => {
    console.log('⚠️ Mongoose desconectado de MongoDB');
});

// Manejar cierre graceful de la aplicación
process.on('SIGINT', async () => {
    await mongoose.connection.close();
    console.log('✅ Conexión a MongoDB cerrada por terminación de app');
    process.exit(0);
});

// Crear y exportar instancia única de Database
const database = new Database();
export default database;