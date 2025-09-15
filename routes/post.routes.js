const router = require('express').Router();
const postController = require('../controllers/post.controller');
const auth = require('../middleware/auth');

router.post('/', auth, postController.createPost);
router.get('/', postController.getAllPosts);
router.get('/:id', postController.getPostById);
router.put('/:id', auth, postController.updatePost);
router.delete('/:id', auth, postController.deletePost);
router.post('/:id/comment', auth, postController.addComment);
router.delete('/:id/comment', auth, postController.deleteComment);
router.put('/:id/like', auth, postController.likePost);
router.put('/:id/unlike', auth, postController.unlikePost);

module.exports = router;
