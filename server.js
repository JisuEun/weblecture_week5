const express = require('express');
const path = require('path');
const { sequelize } = require('./models'); // Post, Photo 모델 임포트
const blogRoutes = require('./routes/blogRoutes'); // 라우트 모듈 임포트

const app = express();
app.use(express.json()); // JSON 요청 본문을 파싱하기 위함

// CORS 설정: 개발 단계에서만 필요
const cors = require('cors');
app.use(cors({
    origin: 'http://localhost:3000'
}));

const PORT = process.env.PORT || 3001; // 서버 포트 설정

// 데이터베이스 연결 확인
sequelize.authenticate()
  .then(() => console.log('Connection has been established successfully.'))
  .catch(err => console.error('Unable to connect to the database:', err));

// 블로그 라우트 사용
app.use('/rest-api', blogRoutes);

// 서버 시작
app.listen(PORT, () => console.log(`Server is running on port ${PORT}.`));