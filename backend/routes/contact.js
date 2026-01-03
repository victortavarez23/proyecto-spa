import express from 'express';
import {
    submitContact,
    getContactMessages,
    getContactMessage,
    getContactStats,
    updateMessageStatus,
    respondToMessage,
    deleteMessage
} from '../controllers/contactController.js';
import { authenticateToken, requireRole } from '../middleware/authMiddleware.js';
// Importamos los nuevos middlewares de validación
import { 
    validateContactInput, 
    validateMessageId, 
    validateResponse 
} from '../middleware/contactValidation.js';

const router = express.Router();

// Ruta pública para enviar mensajes (con validación de datos)
router.post('/submit', validateContactInput, submitContact);

// Rutas protegidas (solo admin)
// Todo lo que esté debajo requerirá autenticación y rol de admin
router.use(authenticateToken);
router.use(requireRole(['admin']));

router.get('/messages', getContactMessages);
router.get('/stats', getContactStats);

// Rutas que requieren ID ahora incluyen validateMessageId
router.get('/messages/:id', validateMessageId, getContactMessage);

router.put('/messages/:id/status', validateMessageId, updateMessageStatus);

// La ruta de respuesta valida tanto el ID como el contenido de la respuesta
router.post('/messages/:id/respond', validateMessageId, validateResponse, respondToMessage);

router.delete('/messages/:id', validateMessageId, deleteMessage);

// Ruta de información (sin cambios)
router.get('/info', (req, res) => {
    res.status(200).json({
        success: true,
        message: 'Contact API funcionando',
        endpoints: {
            submit: 'POST /api/contact/submit (pública)',
            getMessages: 'GET /api/contact/messages (admin)',
            getMessage: 'GET /api/contact/messages/:id (admin)',
            getStats: 'GET /api/contact/stats (admin)',
            updateStatus: 'PUT /api/contact/messages/:id/status (admin)',
            respond: 'POST /api/contact/messages/:id/respond (admin)',
            delete: 'DELETE /api/contact/messages/:id (admin)'
        },
        categories: ['general', 'support', 'sales', 'technical', 'complaint', 'suggestion'],
        statuses: ['new', 'in_progress', 'resolved', 'closed']
    });
});

export default router;