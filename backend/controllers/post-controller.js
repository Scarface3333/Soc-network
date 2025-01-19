const {prisma} = require('../prisma/prisma-client')

const PostController = {
    createPost: async (req,res) => {
        const {content} = req.body;

        const authorId = req.user.userId;

        if(!content){
            return res.status(400).json({error:'Все поля обязательны'})
        }

        try {
            const post = await prisma.post.create({
                data: {
                    content,
                    authorId
                }
            })

            res.json(post)
        } catch (error) {
            console.error('Create post error',);
            res.status(500).json({error:'Internal server error'})
        }
    },
    getAllPosts: async (req,res) => {
        const userId = req.user.userId;

        try {
            const posts = await prisma.post.findMany({
                include:{
                    likes:true,
                    author:true,
                    comments:true,
                },
                orderBy: {
                    createdAt:'desc'
                }
            })

            const postWithLikeInfo = posts.map(post => ({
                ...post,
                likedByUser: post.likes.some(like => like.userId === userId)

            }))

            res.json(postWithLikeInfo);
        } catch (error) {
            console.error('Get All Posts error')
            res.status(400).json({error:'Internal server error'})
        }
    },
    getPostById: async (req,res) => {
        const {id} = req.params;
        const userId = req.user.userId;

        const postId = parseInt(id, 10);

        if (isNaN(postId)) {
            return res.status(400).json({ error: "Invalid ID format" });
        }
        
        try {
            const post = await prisma.post.findUnique({
                where: {id:postId},
                include: {
                    comments: {
                      include: {
                        user: true,
                      }
                    },
                    likes: true,
                    author: true
                  }, // Include related posts
            })

            if(!post){
                return res.status(404).json({error: 'Пост не найден'})
            }

            const postWithLikeInfo = {
                ...post,
                likedByUser: post.likes.some(like => like.userId === userId)
            }

            res.json(postWithLikeInfo)
        } catch (error) {
            console.error('Get Post by Id error',error);

            res.status(500).json({error:'Internal server error'})
        }
    },
   
    deletePost: async (req, res) => {
        try {
            // Преобразуем id из параметра в целое число
            let { id } = req.params;
            const userId = parseInt(req.user.userId, 10);
    
            // Проверка на корректность формата id и userId
            id = parseInt(id, 10);
            if (isNaN(id) || isNaN(userId)) {
                return res.status(400).json({ error: 'Неверный формат ID' });
            }
    
            const post = await prisma.post.findUnique({ where: { id } });
    
            if (!post) {
                return res.status(404).json({ error: 'Пост не найден' });
            }
    
            if (post.authorId !== userId) {
                return res.status(403).json({ error: 'Нет доступа к этому посту' });
            }
    
            // Выполняем транзакцию для удаления комментариев, лайков и самого поста
            const transaction = await prisma.$transaction([
                prisma.comment.deleteMany({ where: { postId: id } }),
                prisma.like.deleteMany({ where: { postId: id } }),
                prisma.post.delete({ where: { id } })
            ]);
    
            res.json(transaction);
        } catch (error) {
            console.error('Delete post error', error);
            res.status(500).json({ error: 'Ошибка сервера при удалении поста' });
        }
    },
    
}

module.exports =  PostController  
