const { Post, Photo, sequelize } = require('../models');
const fs = require('fs');
const path = require('path');

// 글 목록 가져오기
// 수정: 사진 정보 포함
exports.getPosts = async (req, res) => {
  try {
    const posts = await Post.findAll({
      include: [Photo]
    });
    res.json(posts);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'An error occurred while retrieving posts' });
  }
};

// 글 작성하기
// 수정: 사진 정보 포함
exports.createPost = async (req, res) => {
  // 트랜잭션 시작
  const transaction = await sequelize.transaction();

  try {
    const { title, author, content } = req.body;
    // 글 생성
    const newPost = await Post.create({
      title,
      author,
      content
    }, { transaction });

    // 파일 업로드가 있을 경우
    if (req.files && req.files.length > 0) {
      // 모든 파일에 대해 반복하면서 Photo 인스턴스 생성
      const photoPromises = req.files.map(file => {
        return Photo.create({
          post_id: newPost.id,
          path: file.path
        }, { transaction });
      });

      // 생성된 모든 Photo 인스턴스 저장
      await Promise.all(photoPromises);
    }

    // 모든 DB 작업이 성공적으로 완료되면 트랜잭션 커밋
    await transaction.commit();

    res.status(201).json(newPost);
  } catch (error) {
    // 에러 발생 시 트랜잭션 롤백
    await transaction.rollback();

    console.error(error);
    res.status(500).json({ error: 'An error occurred while creating the post' });
  }
};

// 글 수정하기 
// 수정: 사진 업로드 포함
exports.updatePost = async (req, res) => {
  const transaction = await sequelize.transaction();
  try {
    const { title, author, content, deletedPhotos } = req.body;
    const post = await Post.findByPk(req.params.id);

    if (post) {
      await post.update({ title, author, content }, { transaction });

      // 삭제할 사진 처리
      if (deletedPhotos && deletedPhotos.length > 0) {
        await Photo.destroy({
          where: {
            id: deletedPhotos
          }
        }, { transaction });
      }

      // 새로운 사진 추가
      if (req.files && req.files.length > 0) {
        const photoPromises = req.files.map(file => {
          return Photo.create({
            post_id: post.id,
            path: file.path
          }, { transaction });
        });
        await Promise.all(photoPromises);
      }

      await transaction.commit();
      res.json(post);
    } else {
      await transaction.rollback();
      res.status(404).json({ error: 'Post not found' });
    }
  } catch (err) {
    await transaction.rollback();
    console.error(err);
    res.status(500).json({ error: 'An error occurred while updating the post' });
  }
};

// 특정 글 가져오기
// 수정: 사진 정보 포함
exports.getPost = async (req, res) => {
  try {
    const post = await Post.findByPk(req.params.id, {
      include: [Photo]
    });
    if (!post) {
      return res.status(404).json({ error: 'Post not found' });
    }
    res.json(post);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'An error occurred while retrieving the post' });
  }
};

// 글 삭제하기
// 수정: 연관된 사진도 함께 삭제 (파일 시스템 포함)
exports.deletePost = async (req, res) => {
  const transaction = await sequelize.transaction(); // 트랜잭션 시작
  try {
    const post = await Post.findByPk(req.params.id, { transaction });
    if (!post) {
      await transaction.rollback(); // 롤백
      return res.status(404).json({ error: 'Post not found' });
    }

    // 연관된 사진 정보 조회
    const photos = await Photo.findAll({ where: { post_id: post.id }, transaction });
    
    // 각 사진 파일을 파일 시스템에서 삭제
    for (const photo of photos) {
      const filePath = path.join(__dirname, '..', 'uploads', path.basename(photo.path));
      fs.unlinkSync(filePath);
    }

    // 연관된 사진 정보를 데이터베이스에서 삭제
    await Photo.destroy({ where: { post_id: post.id }, transaction });
    
    // 글(Post) 정보를 데이터베이스에서 삭제
    await post.destroy({ transaction });

    // 모든 작업이 성공적으로 완료되면 트랜잭션 커밋
    await transaction.commit();

    res.status(200).json({ message: 'Post and associated photos deleted successfully' });
  } catch (err) {
    await transaction.rollback(); // 에러 발생 시 트랜잭션 롤백
    console.error(err);
    res.status(500).json({ error: 'An error occurred while deleting the post' });
  }
};