import ContactMessage from '../models/ContactMessage.js';
import { 
    validateContactData, 
    sanitizeContactData, 
    formatContactResponse,
    generateConfirmationEmail,
    generateAdminNotificationEmail
} from '../utils/contactUtils.js';

// Enviar mensaje de contacto
export const submitContact = async (req, res) => {
    try {
        const rawData = req.body;

        // Validar datos
        const validation = validateContactData(rawData);
        if (!validation.isValid) {
            return res.status(400).json({
                success: false,
                message: 'Datos del formulario inválidos',
                errors: validation.errors
            });
        }

        // Sanitizar datos
        const sanitizedData = sanitizeContactData(rawData);

        // Crear mensaje de contacto
        const contactMessage = new ContactMessage({
            ...sanitizedData,
            ipAddress: req.ip || req.connection.remoteAddress,
            userAgent: req.get('User-Agent'),
            ...(req.user && { userId: req.user._id }) // Si está autenticado
        });

        await contactMessage.save();

        // TODO: Implementar envío de emails (paso opcional)
        // await sendConfirmationEmail(contactMessage);
        // await sendAdminNotification(contactMessage);

        res.status(201).json({
            success: true,
            message: 'Mensaje enviado exitosamente. Te responderemos pronto.',
            data: {
                contact: formatContactResponse(contactMessage),
                referenceId: contactMessage._id
            }
        });

    } catch (error) { //
        console.error('Error enviando mensaje de contacto:', error);
        res.status(500).json({
            success: false,
            message: 'Error al enviar el mensaje. Por favor, intenta nuevamente.',
            error: process.env.NODE_ENV === 'development' ? error.message : undefined
        });
    }
};

// Obtener mensajes de contacto (solo admin)
export const getContactMessages = async (req, res) => {
    try {
        const { 
            page = 1, 
            limit = 10, 
            status, 
            category, 
            sortBy = 'createdAt', 
            sortOrder = 'desc' 
        } = req.query;

        // Construir query
        const query = {};
        if (status) query.status = status;
        if (category) query.category = category;

        // Opciones de paginación
        const options = {
            page: Math.max(1, parseInt(page)),
            limit: Math.min(50, Math.max(1, parseInt(limit))),
            sort: { [sortBy]: sortOrder === 'desc' ? -1 : 1 },
            populate: {
                path: 'userId',
                select: 'name email',
                match: { _id: { $ne: null } }
            }
        };

        // Ejecutar query con paginación
        const messages = await ContactMessage.find(query)
            .sort(options.sort)
            .limit(options.limit)
            .skip((options.page - 1) * options.limit)
            .populate(options.populate);

        const total = await ContactMessage.countDocuments(query);

        res.status(200).json({ //
            success: true,
            data: {
                messages: messages.map(formatContactResponse),
                pagination: {
                    total,
                    totalPages: Math.ceil(total / options.limit),
                    currentPage: options.page,
                    hasNext: options.page < Math.ceil(total / options.limit),
                    hasPrev: options.page > 1
                }
            }
        });

    } catch (error) { //
        console.error('Error obteniendo mensajes de contacto:', error);
        res.status(500).json({
            success: false,
            message: 'Error al obtener los mensajes de contacto'
        });
    }
};

// Obtener estadísticas de contactos (solo admin)
export const getContactStats = async (req, res) => {
    try {
        const stats = await ContactMessage.aggregate([
            {
                $facet: {
                    totalMessages: [{ $count: "count" }],
                    byStatus: [{ $group: { _id: "$status", count: { $sum: 1 } } }],
                    byCategory: [{ $group: { _id: "$category", count: { $sum: 1 } } }],
                    recentActivity: [ //
                        {
                            $match: {
                                createdAt: {
                                    $gte: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000)
                                }
                            }
                        },
                        {
                            $group: {
                                _id: {
                                    $dateToString: {
                                        format: "%Y-%m-%d",
                                        date: "$createdAt"
                                    }
                                },
                                count: { $sum: 1 }
                            }
                        },
                        { $sort: { _id: 1 } }
                    ]
                }
            }
        ]);

        res.status(200).json({ //
            success: true,
            data: {
                total: stats[0].totalMessages[0]?.count || 0,
                byStatus: stats[0].byStatus,
                byCategory: stats[0].byCategory,
                recentActivity: stats[0].recentActivity
            }
        });

    } catch (error) { //
        console.error('Error obteniendo estadísticas:', error);
        res.status(500).json({
            success: false,
            message: 'Error al obtener estadísticas de contacto'
        });
    }
};

// Obtener mensaje específico (solo admin)
export const getContactMessage = async (req, res) => {
    try {
        const { id } = req.params;

        const message = await ContactMessage.findById(id)
            .populate('userId', 'name email')
            .populate('assignedTo', 'name email')
            .populate('response.respondedBy', 'name email');

        if (!message) { //
            return res.status(404).json({
                success: false,
                message: 'Mensaje no encontrado'
            });
        }

        res.status(200).json({ //
            success: true,
            data: {
                message: {
                    ...message.toObject(), // Se usa toObject para poder mezclar con formatContactResponse si es necesario
                    ...formatContactResponse(message)
                }
            }
        });

    } catch (error) { //
        console.error('Error obteniendo mensaje:', error);
        if (error.name === 'CastError') {
            return res.status(400).json({
                success: false,
                message: 'ID de mensaje no válido'
            });
        }
        res.status(500).json({
            success: false,
            message: 'Error al obtener el mensaje'
        });
    }
};

// Actualizar estado de mensaje (solo admin)
export const updateMessageStatus = async (req, res) => {
    try {
        const { id } = req.params;
        const { status, priority, assignedTo } = req.body;

        const updateData = {};
        if (status) updateData.status = status;
        if (priority) updateData.priority = priority;
        if (assignedTo) updateData.assignedTo = assignedTo;

        const message = await ContactMessage.findByIdAndUpdate(
            id,
            updateData,
            { new: true, runValidators: true }
        ).populate('assignedTo', 'name email');

        if (!message) { //
            return res.status(404).json({
                success: false,
                message: 'Mensaje no encontrado'
            });
        }

        res.status(200).json({ //
            success: true,
            message: 'Mensaje actualizado exitosamente',
            data: {
                message: formatContactResponse(message)
            }
        });

    } catch (error) { //
        console.error('Error actualizando mensaje:', error);
        if (error.name === 'CastError') {
            return res.status(400).json({
                success: false,
                message: 'ID de mensaje no válido'
            });
        }
        res.status(500).json({
            success: false,
            message: 'Error al actualizar el mensaje'
        });
    }
};

// Responder al mensaje (solo admin)
export const respondToMessage = async (req, res) => {
    try {
        const { id } = req.params;
        const { responseMessage } = req.body;

        if (!responseMessage || responseMessage.trim().length === 0) { //
            return res.status(400).json({
                success: false,
                message: 'El mensaje de respuesta es requerido'
            });
        }

        const message = await ContactMessage.findByIdAndUpdate( //
            id,
            {
                status: 'resolved',
                response: {
                    message: responseMessage.trim(),
                    respondedBy: req.user._id,
                    respondedAt: new Date()
                }
            },
            { new: true, runValidators: true }
        ).populate('response.respondedBy', 'name email');

        if (!message) { //
            return res.status(404).json({
                success: false,
                message: 'Mensaje no encontrado'
            });
        }

        // TODO: Enviar email de respuesta al usuario
        // await sendResponseEmail(message);

        res.status(200).json({ //
            success: true,
            message: 'Respuesta enviada exitosamente',
            data: {
                message: formatContactResponse(message)
            }
        });

    } catch (error) { //
        console.error('Error respondiendo mensaje:', error);
        if (error.name === 'CastError') {
            return res.status(400).json({
                success: false,
                message: 'ID de mensaje no válido'
            });
        }
        res.status(500).json({
            success: false,
            message: 'Error al enviar la respuesta'
        });
    }
};

// Eliminar mensaje (solo admin)
export const deleteMessage = async (req, res) => {
    try {
        const { id } = req.params;

        const message = await ContactMessage.findByIdAndDelete(id);

        if (!message) {
            return res.status(404).json({
                success: false,
                message: 'Mensaje no encontrado'
            });
        }

        res.status(200).json({
            success: true,
            message: 'Mensaje eliminado exitosamente'
        });

    } catch (error) { //
        console.error('Error eliminando mensaje:', error);
        if (error.name === 'CastError') {
            return res.status(400).json({
                success: false,
                message: 'ID de mensaje no válido'
            });
        }
        res.status(500).json({
            success: false,
            message: 'Error al eliminar el mensaje'
        });
    }
};