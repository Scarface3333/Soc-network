const {prisma} = require('../prisma/prisma-client');

const MessageController = {
    createMessage: async (req, res) => {
        const { senderId, recipientId, content } = req.body;

        const senderIdInt = parseInt(senderId, 10);
        const recipientIdInt = parseInt(recipientId, 10);

        if (!senderIdInt || !recipientIdInt || !content) {
            return res.status(400).json({ error: 'Необходимо указать senderId, recipientId и content' });
        }

      
        try {
            const sender = await prisma.user.findUnique({where:{id:senderIdInt}})
            if (!sender) {
                return res.status(404).json({error:'Отправитель не сущетсвует'})
            }
            const recipient = await prisma.user.findUnique({where:{id:recipientIdInt}})
            if (!recipient) {
                return res.status(404).json({error:'Приниматель не сущетсвует'})
            }

            const message = await prisma.message.create({
                data: {
                    content,
                    senderId: senderIdInt,
                    recipientId: recipientIdInt,
                },
            });

            // Получаем io из приложения
            const io = req.app.get('io');
            if (io) {
                io.to(recipientIdInt).emit('NewMessage', message);
            } else {
                console.error('Socket.IO instance not found in app');
            }

            res.status(201).json(message);
        } catch (error) {
            console.error('Ошибка при создании сообщения:', error);
            res.status(500).json({ error: 'Ошибка сервера при создании сообщения.' });
        }
    },

    getMessages: async (req, res) => {
        const { userId, chatPartnerId } = req.params;
    
        // Проверяем переданные параметры
        if (!userId || !chatPartnerId) {
            return res.status(400).json({ error: 'Необходимо указать userId и chatPartnerId.' });
        }
    
        try {
            // Преобразуем параметры в числа
            const userIdInt = parseInt(userId, 10);
            const chatPartnerIdInt = parseInt(chatPartnerId, 10);
    
            if (isNaN(userIdInt) || isNaN(chatPartnerIdInt)) {
                return res.status(400).json({ error: 'userId и chatPartnerId должны быть числами.' });
            }
    
            // Проверяем существование пользователей
            const sender = await prisma.user.findUnique({ where: { id: userIdInt } });
            if (!sender) {
                return res.status(404).json({ error: `Пользователь с id ${userId} не существует.` });
            }
    
            const recipient = await prisma.user.findUnique({ where: { id: chatPartnerIdInt } });
            if (!recipient) {
                return res.status(404).json({ error: `Пользователь с id ${chatPartnerId} не существует.` });
            }
    
            // Извлекаем сообщения вместе с данными об отправителе
            const messages = await prisma.message.findMany({
                where: {
                    OR: [
                        { senderId: userIdInt, recipientId: chatPartnerIdInt },
                        { senderId: chatPartnerIdInt, recipientId: userIdInt },
                    ],
                },
                orderBy: {
                    createdAt: 'asc', // Сортируем сообщения по времени создания в порядке возрастания
                },
                include: {
                    sender: { // Добавляем данные об отправителе
                        select: {
                            id: true,
                            name: true,
                            avatarUrl: true, // Добавляем аватарку
                        },
                    },
                },
            });
    
            // Формируем данные ответа
            const formattedMessages = messages.map((message) => ({
                id: message.id,
                content: message.content,
                senderId: message.senderId,
                recipientId: message.recipientId,
                createdAt: message.createdAt,
                senderAvatar: message.sender.avatarUrl || '', // Аватарка отправителя
                senderName: message.sender.name || 'Неизвестный пользователь', // Имя отправителя
            }));
    
            res.status(200).json({
                messages: formattedMessages, // Сами сообщения
                chatPartner: {
                    id: recipient.id, // ID собеседника
                    name: recipient.name, // Имя собеседника
                    avatarUrl: recipient.avatarUrl || '', // Аватарка собеседника
                },
            });
            
        } catch (error) {
            console.error('Ошибка при получении сообщений:', error);
            res.status(500).json({ error: 'Ошибка сервера при получении сообщений.' });
        }
    },
    
    

    deleteMessage: async (req, res) => {
        const { messageId } = req.params;
    
        // Проверяем, указан ли messageId
        if (!messageId) {
            return res.status(400).json({ error: 'Необходимо указать messageId.' });
        }
    
        // Преобразуем messageId в число
        const messageIdInt = parseInt(messageId, 10);
        if (isNaN(messageIdInt)) {
            return res.status(400).json({ error: 'messageId должно быть числом.' });
        }
    
        try {
            // Проверяем существование сообщения
            const message = await prisma.message.findUnique({ where: { id: messageIdInt } });
            if (!message) {
                return res.status(404).json({ error: `Сообщение с id ${messageId} не существует.` });
            }
    
            // Удаляем сообщение
            const deletedMessage = await prisma.message.delete({
                where: { id: messageIdInt },
            });
    
            res.status(200).json({ message: 'Сообщение успешно удалено.', deletedMessage });
        } catch (error) {
            console.error('Ошибка при удалении сообщения:', error);
            res.status(500).json({ error: 'Ошибка при удалении сообщения.' });
        }
    },
    getUserMessages: async (req, res) => {
        const { userId } = req.params;
    
        if (!userId) {
            return res.status(400).json({ error: 'Необходимо указать userId.' });
        }
    
        try {
            const userIdInt = parseInt(userId, 10);
            if (isNaN(userIdInt)) {
                return res.status(400).json({ error: 'userId должно быть числом.' });
            }
    
            // Получаем все сообщения, где userId либо отправитель, либо получатель
            const messages = await prisma.message.findMany({
                where: {
                    OR: [
                        { senderId: userIdInt },
                        { recipientId: userIdInt },
                    ],
                },
                orderBy: {
                    createdAt: 'desc', // Последние сообщения будут первыми
                },
            });
    
            // Группируем сообщения по собеседникам
            const chatPartners = messages.reduce((acc, message) => {
                const partnerId =
                    message.senderId === userIdInt ? message.recipientId : message.senderId;
    
                if (!acc[partnerId]) {
                    acc[partnerId] = [];
                }
                acc[partnerId].push(message);
    
                return acc;
            }, {});
    
            // Получаем данные о собеседниках
            const partnerIds = Object.keys(chatPartners).map(Number);
            const users = await prisma.user.findMany({
                where: {
                    id: { in: partnerIds },
                },
                select: {
                    id: true,
                    name: true,
                    avatarUrl: true,
                },
            });
    
            // Формируем окончательный ответ
            const result = partnerIds.map((partnerId) => {
                const partner = users.find((user) => user.id === partnerId); // Найти пользователя по partnerId
                return {
                    partnerId,
                    partnerName: partner?.name || 'Неизвестный пользователь',
                    partnerAvatarUrl: partner?.avatarUrl || '', // Используем найденного партнера
                    messages: chatPartners[partnerId], // Сообщения с этим партнером
                };
            });
    
            res.status(200).json(result);
        } catch (error) {
            console.error('Ошибка при получении сообщений пользователя:', error);
            res.status(500).json({ error: 'Ошибка сервера при получении сообщений.' });
        }
    }
    
    
}

module.exports = MessageController;