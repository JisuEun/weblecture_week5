const express = require('express');
const blogController = require('../controllers/blogController');
const photoController = require('../controllers/photoController'); // 사진 컨트롤러 추가

module.exports = (upload) => {
    const router = express.Router();

    // 글 목록 가져오기
    router.get('/posts', blogController.getPosts);

    // 글 작성하기
    router.post('/posts', upload.array('photos', 2), blogController.createPost);

    // 특정 글 가져오기
    router.get('/posts/:id', blogController.getPost);

    // 글 수정하기
    router.put('/posts/:id', upload.array('photos', 2), blogController.updatePost); // 사진 수정 로직을 포함해야 한다면 여기에도 upload.array를 추가

    // 글 삭제하기
    router.delete('/posts/:id', blogController.deletePost);

    // 사진 삭제하기 (추가)
    router.delete('/photos/:id', photoController.deletePhoto);

    return router;
}