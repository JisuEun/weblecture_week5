const express = require('express');
const blogController = require('../controllers/blogController');

const router = express.Router();

// 글 목록 가져오기
router.get('/posts', blogController.getPosts);

// 글 작성하기
router.post('/posts', blogController.createPost);

// 특정 글 가져오기
router.get('/posts/:id', blogController.getPost);

// 글 수정하기
router.put('/posts/:id', blogController.updatePost);

// 글 삭제하기
router.delete('/posts/:id', blogController.deletePost);

module.exports = router;