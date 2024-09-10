const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");

canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

const crab = {
  x: 50,
  y: canvas.height - 50,
  width: 32,
  height: 32,
  speed: 5,
  jumpForce: 15,
  gravity: 0.8,
  velocityY: 0,
  isJumping: false,
};

let obstacles = []; // Changed from const to let
let score = 0;
let gameLoop;

function drawCrab() {
  ctx.fillStyle = "red";
  ctx.fillRect(crab.x, crab.y, crab.width, crab.height);
}

function createObstacle() {
  const obstacle = {
    x: canvas.width,
    y: canvas.height - 30,
    width: 20,
    height: 30,
    speed: 5,
  };
  obstacles.push(obstacle);
}

function drawObstacles() {
  ctx.fillStyle = "green";
  obstacles.forEach((obstacle) => {
    ctx.fillRect(obstacle.x, obstacle.y, obstacle.width, obstacle.height);
  });
}

function moveObstacles() {
  obstacles.forEach((obstacle) => {
    obstacle.x -= obstacle.speed;
  });

  obstacles = obstacles.filter((obstacle) => obstacle.x + obstacle.width > 0);
}

function checkCollision() {
  return obstacles.some(
    (obstacle) =>
      crab.x < obstacle.x + obstacle.width &&
      crab.x + crab.width > obstacle.x &&
      crab.y < obstacle.y + obstacle.height &&
      crab.y + crab.height > obstacle.y
  );
}

function updateCrab() {
  if (crab.isJumping) {
    crab.velocityY += crab.gravity;
    crab.y += crab.velocityY;

    if (crab.y > canvas.height - crab.height) {
      crab.y = canvas.height - crab.height;
      crab.isJumping = false;
    }
  }
}

function drawScore() {
  ctx.fillStyle = "black";
  ctx.font = "20px Arial";
  ctx.fillText(`Score: ${score}`, 10, 30);
}

function gameOver() {
  cancelAnimationFrame(gameLoop);
  ctx.fillStyle = "black";
  ctx.font = "40px Arial";
  ctx.fillText("Game Over!", canvas.width / 2 - 100, canvas.height / 2);
}

function jump() {
    if (!crab.isJumping) {
        crab.isJumping = true;
        crab.velocityY = -crab.jumpForce;
    }
}

function update() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  drawCrab();
  drawObstacles();
  updateCrab();
  moveObstacles();
  drawScore();

  if (checkCollision()) {
    gameOver();
    return;
  }

  if (Math.random() < 0.02) {
    createObstacle();
  }

  score++;

  gameLoop = requestAnimationFrame(update);
}

document.addEventListener('keydown', (event) => {
    if (event.code === 'Space' || event.code === 'ArrowUp') {
        jump();
    }
});

update();
