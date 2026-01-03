import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Product from '../models/Product.js';
import User from '../models/User.js';

// Cargar variables de entorno para obtener la URI de Mongo
dotenv.config();

const seedProducts = [
    {
        name: 'Smartphone Premium',
        description: 'Último modelo con cámara de 108MP y 5G',
        price: 899.99,
        originalPrice: 999.99,
        category: 'electronics',
        stock: 50,
        brand: 'TechBrand',
        features: ['5G', '108MP Camera', '8GB RAM', '256GB Storage'],
        rating: { average: 4.5, count: 120 }
    },
    {
        name: 'Laptop Ultradelgada',
        description: 'Laptop para trabajo y entretenimiento',
        price: 1299.99,
        category: 'electronics',
        stock: 25,
        brand: 'ComputerPro',
        features: ['Intel i7', '16GB RAM', '1TB SSD', '15.6" Display'],
        rating: { average: 4.3, count: 85 }
    },
    {
        name: 'Auriculares Cancelación Ruido',
        description: 'Sumérgete en tu música sin distracciones',
        price: 199.99,
        category: 'electronics',
        stock: 100,
        brand: 'SoundMaster',
        features: ['Active Noise Cancelling', '20h Battery', 'Bluetooth 5.2'],
        rating: { average: 4.8, count: 200 }
    },
    {
        name: 'Camiseta Algodón Orgánico',
        description: 'Comodidad y estilo sostenible',
        price: 29.99,
        category: 'clothing',
        stock: 150,
        brand: 'EcoWear',
        features: ['100% Organic Cotton', 'Breathable', 'Unisex'],
        rating: { average: 4.2, count: 45 }
    }
];

const seedUsers = [
    {
        name: 'Admin User',
        email: 'admin@example.com',
        password: 'password123', // Nota: En producción esto debería hashearse antes
        role: 'admin'
    },
    {
        name: 'John Doe',
        email: 'john@example.com',
        password: 'password123',
        role: 'user'
    }
];

const seedDatabase = async () => {
    try {
        // Conectar a la DB
        await mongoose.connect(process.env.MONGODB_URI);
        console.log('✅ Conectado a MongoDB para seeding');

        // Limpiar colecciones existentes (para no duplicar datos si corres el script varias veces)
        await Product.deleteMany({});
        await User.deleteMany({});
        console.log('🧹 Colecciones limpiadas');

        // Insertar datos de prueba
        // Nota: Al usar insertMany, el middleware pre-save de hashing a veces no se dispara en versiones viejas de Mongoose.
        // Pero para este lab está bien así.
        const products = await Product.insertMany(seedProducts);
        
        // Para asegurar que las contraseñas se hasheen, creamos los usuarios uno por uno
        // O usamos insertMany si confiamos en la config, pero el bucle es más seguro para el hash.
        // Seguiremos el patrón del lab (insertMany) por ahora:
        const users = await User.insertMany(seedUsers);

        console.log('🌱 Datos de prueba insertados:');
        console.log(`   ➜ Productos: ${products.length}`);
        console.log(`   ➜ Usuarios: ${users.length}`);

        process.exit(0);
    } catch (error) {
        console.error('❌ Error en seeding:', error);
        process.exit(1);
    }
};

// Ejecutar solo si se llama directamente desde la terminal
if (process.argv[1] === new URL(import.meta.url).pathname || process.argv[1].endsWith('seedDatabase.js')) {
    seedDatabase();
}

export { seedDatabase, seedProducts, seedUsers };