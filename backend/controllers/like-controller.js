const {prisma} = require('../prisma/prisma-client')

const LikeController = {
likePost: async (req,res) => {
    const{postId} = req.body;
    const userId = req.user.userId;

    if(!postId){
        return res.status(400).json({error: 'Все поля обязательны'})
    }

    try {
        const existingLike = await prisma.like.findFirst({
            where: {postId,userId}
        })

        if(existingLike){
            return res.status(400).json({error:'Вы уже поставили лайк'})
        }

        const like = await prisma.like.create({
            data: {postId,userId}
        })
        res.json(like)
    } catch (error) {
        console.error('Error like post',error)
        res.status(500).json({error:'Internet server error'})
    }
},
unlikePost: async (req, res) => {
    const { id } = req.params;
    const userId = req.user.userId;
    
    // Преобразуем id в число
    const postId = parseInt(id, 10);

    if (isNaN(postId)) {
        return res.status(400).json({ error: "Invalid ID format" });
    }

    try {
        // Ищем, есть ли уже лайк
        const existingLike = await prisma.like.findFirst({
            where: { postId: postId, userId: userId }
        });

        if (!existingLike) {
            return res.status(400).json({ error: 'Нельзя поставить дизлайк' });
        }

        // Удаляем лайк
        const like = await prisma.like.deleteMany({
            where: { postId: postId, userId: userId }
        });

        res.json(like);
    } catch (error) {
        console.error('Error unlike post', error);
        res.status(500).json({ error: 'Internet server error' });
    }
},
}

module.exports = LikeController