const {prisma} = require('../prisma/prisma-client')

const FollowController = {
  followUser: async (req, res) => {
      let { followingId } = req.body;
      const userId = parseInt(req.user.userId, 10);
      followingId = parseInt(followingId, 10);

      // Проверка на корректность ID
      if (isNaN(userId) || isNaN(followingId)) {
          return res.status(400).json({ error: 'Invalid ID format' });
      }

      if (followingId === userId) {
          return res.status(500).json({ error: 'Вы не можете подписаться на самого себя' });
      }

      try {
          const existingSubscription = await prisma.follows.findFirst({
              where: {
                  AND: [
                      { followerId: userId },
                      { followingId: followingId }
                  ]
              }
          });

          if (existingSubscription) {
              return res.status(400).json({ error: 'Подписка уже существует' });
          }

          await prisma.follows.create({
              data: {
                  follower: { connect: { id: userId } },
                  following: { connect: { id: followingId } }
              }
          });

          res.status(201).json({ message: 'Подписка уже создана' });
      } catch (error) {
          console.error('Follow error', error);
          return res.status(500).json({ error: 'Internal server error' });
      }
  },

  unfollowUser: async (req, res) => {
      let { followingId } = req.body;
      const userId = parseInt(req.user.userId, 10);
     
      try {
          const follows = await prisma.follows.findFirst({
              where: {
                  AND: [{ followerId: userId }, { followingId: followingId }]
              },
          });

          if (!follows) {
              return res.status(404).json({ error: "Запись не найдена" });
          }

          await prisma.follows.delete({
              where: { id: follows.id },
          });

          res.status(200).json({ message: 'Отписка успешно выполнена' });
      } catch (error) {
          console.log('Error', error);
          res.status(500).json({ error: 'Ошибка сервера' });
      }
    },
  
    getfollowersUser: async (req, res) => {
        const { id } = req.params;
        const userId = parseInt(id, 10);

        try {
            const followers = await prisma.follows.findMany({
                where: {
                    followingId: userId,
                },
                include: {
                    follower: {
                        select: {
                            id: true,
                            name: true,
                            email: true,
                            avatarUrl: true,
                        },
                    },
                },
            });

            const formattedFollowers = followers.map((f) => ({
                id: f.follower.id,
                name: f.follower.name,
                email: f.follower.email,
                avatarUrl: f.follower.avatarUrl,

            }));

            res.status(200).json(formattedFollowers);
        } catch (error) {
            console.error('Error fetching follwoers', error);
            res.status(500).json({ error: 'Internal server error' });
        }
    },

    getfollowingUser: async (req, res) => {
        const { id } = req.params;
        const userId = parseInt(id, 10);

        try {
            const following = await prisma.follows.findMany({
                where: {
                    followerId: userId,
                },
                include: {
                    following: {
                        select: {
                            id: true,
                            name: true,
                            email: true,
                            avatarUrl: true,
                        },
                    },
                },
            });

            const formattedFollowing = following.map((f) => ({
                id: f.following.id,
                name: f.following.name,
                email: f.following.email,
                avatarUrl: f.following.avatarUrl,

            }));

            res.status(200).json(formattedFollowing);
        } catch (error) {
            console.error('Error fetching follwoers', error);
            res.status(500).json({ error: 'Internal server error' });
        }
    },
};


module.exports = FollowController