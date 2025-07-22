const express = require('express');
const path = require('path');

const app = express();
const port = 3000;

// 정적 파일(HTML, CSS, JS)을 제공할 폴더 설정
app.use(express.static(path.join(__dirname, 'public')));

// 루트 URL('/')로 접속 시 index.html 제공
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

app.listen(port, () => {
    console.log(`Server is running at http://localhost:${port}`);
});