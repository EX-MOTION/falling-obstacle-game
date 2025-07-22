
const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

// 플레이어 설정
const player = {
    x: canvas.width / 2 - 25,
    y: canvas.height - 60,
    width: 50,
    height: 50,
    color: 'blue',
    speed: 8
};

// 장애물 설정
let obstacles = [];
const obstacleWidth = 50;
const obstacleHeight = 20;
const obstacleColor = 'red';
const obstacleSpeed = 5;
let obstacleInterval = 1000; // 장애물 생성 간격 (ms)
let lastObstacleTime = 0;

// 키보드 입력 상태
const keys = {
    ArrowLeft: false,
    ArrowRight: false
};

// 점수
let score = 0;
let gameOver = false;

// 이벤트 리스너 등록
document.addEventListener('keydown', (e) => {
    if (e.key === 'ArrowLeft' || e.key === 'ArrowRight') {
        keys[e.key] = true;
    }
});
document.addEventListener('keyup', (e) => {
    if (e.key === 'ArrowLeft' || e.key === 'ArrowRight') {
        keys[e.key] = false;
    }
});

function createObstacle() {
    const x = Math.random() * (canvas.width - obstacleWidth);
    obstacles.push({ x: x, y: 0, width: obstacleWidth, height: obstacleHeight });
}

function updatePlayer() {
    if (keys.ArrowLeft && player.x > 0) {
        player.x -= player.speed;
    }
    if (keys.ArrowRight && player.x < canvas.width - player.width) {
        player.x += player.speed;
    }
}

function updateObstacles() {
    for (let i = obstacles.length - 1; i >= 0; i--) {
        const obs = obstacles[i];
        obs.y += obstacleSpeed;

        // 충돌 감지
        if (
            player.x < obs.x + obs.width &&
            player.x + player.width > obs.x &&
            player.y < obs.y + obs.height &&
            player.y + player.height > obs.y
        ) {
            gameOver = true;
        }

        // 화면 밖으로 나간 장애물 제거 및 점수 증가
        if (obs.y > canvas.height) {
            obstacles.splice(i, 1);
            score++;
        }
    }
}

function drawPlayer() {
    ctx.fillStyle = player.color;
    ctx.fillRect(player.x, player.y, player.width, player.height);
}

function drawObstacles() {
    ctx.fillStyle = obstacleColor;
    obstacles.forEach(obs => {
        ctx.fillRect(obs.x, obs.y, obs.width, obs.height);
    });
}

function drawScore() {
    ctx.fillStyle = 'black';
    ctx.font = '24px Arial';
    ctx.fillText(`Score: ${score}`, 10, 30);
}

function drawGameOver() {
    ctx.fillStyle = 'rgba(0, 0, 0, 0.7)';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    ctx.fillStyle = 'white';
    ctx.font = '60px Arial';
    ctx.textAlign = 'center';
    ctx.fillText('GAME OVER', canvas.width / 2, canvas.height / 2 - 30);

    ctx.font = '30px Arial';
    ctx.fillText(`Final Score: ${score}`, canvas.width / 2, canvas.height / 2 + 30);

    ctx.font = '20px Arial';
    ctx.fillText('Press F5 to Restart', canvas.width / 2, canvas.height / 2 + 80);
}

function gameLoop(currentTime) {
    if (gameOver) {
        drawGameOver();
        return;
    }

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // 장애물 생성
    if (currentTime - lastObstacleTime > obstacleInterval) {
        createObstacle();
        lastObstacleTime = currentTime;
    }

    updatePlayer();
    updateObstacles();

    drawPlayer();
    drawObstacles();
    drawScore();

    requestAnimationFrame(gameLoop);
}

// 게임 시작
requestAnimationFrame(gameLoop);
