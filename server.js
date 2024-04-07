const express = require('express');
const multer = require('multer');
const path = require('path');
const { sequelize } = require('./models'); // Post, Photo 모델 임포트
const cors = require('cors');

const app = express();
app.use(express.json()); // JSON 요청 본문을 파싱하기 위함

// CORS 설정: 개발 단계에서만 필요
app.use(cors({
  origin: 'http://localhost:3000'
}));

const PORT = process.env.PORT || 3001; // 서버 포트 설정

// 데이터베이스 연결 확인
sequelize.authenticate()
  .then(() => console.log('Connection has been established successfully.'))
  .catch(err => console.error('Unable to connect to the database:', err));

// multer 설정
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads/');
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + path.extname(file.originalname));
  }
});

const upload = multer({ storage: storage });
const blogRoutes = require('./routes/blogRoutes')(upload); // 라우트 모듈 임포트

// 블로그 라우트 사용
app.use('/rest-api', blogRoutes);

// 정적 파일 제공
app.use('/uploads', express.static('uploads'));

// 서버 시작
app.listen(PORT, () => console.log(`Server is running on port ${PORT}.`));
