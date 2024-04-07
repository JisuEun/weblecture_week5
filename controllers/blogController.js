const { Post, Photo } = require('../models');

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
// 수정: 사진 업로드 포함
exports.createPost = async (req, res) => {
    try {
      const { title, author, content, photos } = req.body;
      const newPost = await Post.create({ title, author, content });
      if (photos && photos.length > 0) {
        await Promise.all(photos.map(async (photo) => {
            await Photo.create({ path: photo, post_id: newPost.id });
        }));
      }
      res.status(201).json(newPost);
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: 'An error occurred while creating the post' });
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

// 글 수정하기
exports.updatePost = async (req, res) => {
    try {
      const post = await Post.findByPk(req.params.id);
      if (post) {
        await post.update(req.body);
        res.json(post);
      } else {
        res.status(404).json({ error: 'Post not found' });
      }
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: 'An error occurred while updating the post' });
    }
  };

// 글 삭제하기
// 수정: 연관된 사진도 함께 삭제
exports.deletePost = async (req, res) => {
    try {
      const post = await Post.findByPk(req.params.id);
      if (!post) {
        return res.status(404).json({ error: 'Post not found' });
      }
      await Photo.destroy({where: {post_id: post.id}});
      await post.destroy();
      res.status(200).json({ message: 'Post deleted successfully' });
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: 'An error occurred while deleting the post' });
    }
  };