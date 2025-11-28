const router = require('express').Router();
const postController = require('../controllers/post.controller');
const auth = require('../middleware/auth');

router.post('/', auth, postController.createPost);
router.get('/', postController.getAllPosts);
router.get('/get/:id', postController.getPostById);
router.get('/me', auth, postController.getMyPosts);
router.put('/:id', auth, postController.updatePost);
router.delete('/:id', auth, postController.deletePost);

module.exports = router;
