import mongoose from 'mongoose';
import dotenv from 'dotenv';
import User from './models/User.js';

dotenv.config();

const resetAdmin = async () => {
    try {
        await mongoose.connect(process.env.MONGODB_URI);
        console.log('🔌 Conectado a MongoDB...');

        const adminEmail = 'admin@example.com';
        const newPassword = 'password123';

        // 1. Buscar si existe
        let admin = await User.findOne({ email: adminEmail });

        if (admin) {
            // 2. Si existe, FORZAMOS el cambio de contraseña
            console.log('🔄 Usuario encontrado. Actualizando contraseña...');
            admin.password = newPassword;
            // Al guardar, el modelo User.js detectará el cambio y encriptará la contraseña automáticamente
            await admin.save();
            console.log('✅ Contraseña restablecida a: password123');
        } else {
            // 3. Si no existe, lo creamos de cero
            console.log('✨ Creando usuario Admin nuevo...');
            admin = new User({
                name: 'Administrador',
                email: adminEmail,
                password: newPassword,
                role: 'admin',
                isActive: true
            });
            await admin.save();
            console.log('✅ Usuario creado con: password123');
        }

        console.log('🔒 Todo listo. Intenta hacer login ahora.');
        process.exit();

    } catch (error) {
        console.error('❌ Error:', error);
        process.exit(1);
    }
};

resetAdmin();