const express = require('express');

const PostController = require('../controllers/posts');

const router = express.Router();

const checkAuth = require('../middleware/check-auth');
const extractFile = require('../middleware/file');


router.post('', checkAuth, extractFile, PostController.createPost);

router.get('', PostController.getPosts);

router.get('/:id', PostController.getPostById);

router.put('/:id', checkAuth, extractFile, PostController.updatePost);

router.delete('/:id', checkAuth, PostController.deletePost);

module.exports = router;

3
