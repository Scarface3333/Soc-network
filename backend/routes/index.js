const express = require("express");
const router = express.Router();
const multer = require('multer');
const { UserController, PostController, CommentController, LikeController, FollowController } = require("../controllers");
const { authenticateToken} = require("../middleware/auth");
const MessageController = require("../controllers/message-controller");


const uploadDestination = 'uploads';

// Показываем, где хранить загружаемые файлы
const storage = multer.diskStorage({
  destination: uploadDestination,
  filename: function (req, file, cb) {
    cb(null, file.originalname);
  }
});

const uploads = multer({ storage: storage });
// Роуты User
router.post('/register', UserController.register)
router.post('/login', UserController.login)
router.get('/current', authenticateToken, UserController.current)
router.get('/users/:id', authenticateToken,UserController.getUserByID)
router.put('/users/:id',authenticateToken,uploads.single('avatar'), UserController.updateUser)
router.get('/search',authenticateToken, UserController.search);

//Роуты Post
router.post('/posts',authenticateToken,PostController.createPost)
router.get('/posts',authenticateToken,PostController.getAllPosts)
router.get('/posts/:id',authenticateToken,PostController.getPostById)
router.delete('/posts/:id',authenticateToken,PostController.deletePost)

//Роуты Comment
router.post('/comments',authenticateToken, CommentController.createComment)
router.delete('/comments/:id',authenticateToken,CommentController.deleteComment)

//Роуты Like
router.post('/likes',authenticateToken,LikeController.likePost)
router.delete('/likes/:id',authenticateToken,LikeController.unlikePost)

//Роуты Follow
router.post('/follow',authenticateToken,FollowController.followUser)
router.delete('/unfollow/:id', authenticateToken, FollowController.unfollowUser)
router.get('/followers/:id', FollowController.getfollowersUser);
router.get('/following/:id', FollowController.getfollowingUser);

//Роуты Message
router.post('/messages', MessageController.createMessage);
router.get('/messages/:userId/:chatPartnerId', MessageController.getMessages);
router.delete('/messages/:messageId', MessageController.deleteMessage);
router.get('/messages/:userId', MessageController.getUserMessages);

module.exports = router;