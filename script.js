

const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");

const menu = document.getElementById("menu");
const gameArea = document.getElementById("gameArea");
const restartBtn = document.getElementById("restartBtn");
const scoreDisplay = document.getElementById("score");
const bestScoreDisplay = document.getElementById("bestScore");

const box = 20;
const canvasSize = 600;
let snake, direction, food, score, game, speed, gameOver = false;
let bestScore = localStorage.getItem("bestScore") || 0;

function initGame() {
  snake = [{ x: 200, y: 200 }];
  direction = "RIGHT";
  food = spawnFood();
  score = 0;
  gameOver = false;
  scoreDisplay.innerText = "Score : 0";
  scoreDisplay.classList.remove("text-danger");
  bestScoreDisplay.innerText = "🥇 Meilleur score : " + bestScore;
  if (game) clearInterval(game);
  game = setInterval(draw, speed);
}

function startGame(selectedSpeed) {
  speed = selectedSpeed;
  menu.classList.add("d-none");
  gameArea.classList.remove("d-none");
  initGame();
}

function changeDirection(e) {
  const key = e.keyCode;
  if (key === 37 && direction !== "RIGHT") direction = "LEFT";
  else if (key === 38 && direction !== "DOWN") direction = "UP";
  else if (key === 39 && direction !== "LEFT") direction = "RIGHT";
  else if (key === 40 && direction !== "UP") direction = "DOWN";
}

function spawnFood() {
  return {
    x: Math.floor(Math.random() * (canvasSize / box)) * box,
    y: Math.floor(Math.random() * (canvasSize / box)) * box
  };
}

function draw() {
  if (!food || food.x === undefined || food.y === undefined) food = spawnFood();
  ctx.clearRect(0, 0, canvasSize, canvasSize);

  // Draw food (as emoji)
  ctx.font = "20px Arial";
  ctx.fillText("🍎", food.x + 3, food.y + 17);

  // Draw snake
  for (let i = 0; i < snake.length; i++) {
    const part = snake[i];
    ctx.fillStyle = "lime";
    ctx.fillRect(part.x, part.y, box, box);

    // Draw eyes on head
    if (i === 0) {
      ctx.fillStyle = "black";
      if (direction === "RIGHT" || direction === "LEFT") {
        ctx.beginPath();
        ctx.arc(part.x + 5, part.y + 5, 2, 0, 2 * Math.PI);
        ctx.arc(part.x + 5, part.y + 15, 2, 0, 2 * Math.PI);
      } else {
        ctx.beginPath();
        ctx.arc(part.x + 5, part.y + 5, 2, 0, 2 * Math.PI);
        ctx.arc(part.x + 15, part.y + 5, 2, 0, 2 * Math.PI);
      }
      ctx.fill();
    }
  }

  // Move
  let head = { ...snake[0] };
  if (direction === "LEFT") head.x -= box;
  else if (direction === "UP") head.y -= box;
  else if (direction === "RIGHT") head.x += box;
  else if (direction === "DOWN") head.y += box;

  // Collision
  if (
    head.x < 0 || head.x >= canvasSize || head.y < 0 || head.y >= canvasSize ||
    snake.some((part, index) => index !== 0 && part.x === head.x && part.y === head.y)
  ) {
    clearInterval(game);
    scoreDisplay.innerText = "💀 Game Over ! Score : " + score;
    scoreDisplay.classList.add("text-danger");
    if (score > bestScore) {
      localStorage.setItem("bestScore", score);
      bestScore = score;
      bestScoreDisplay.innerText = "🥇 Nouveau meilleur score : " + score;
    }
    return;
  }

  snake.unshift(head);

  // Eat
  if (head.x === food.x && head.y === food.y) {
    score++;
    scoreDisplay.innerText = "Score : " + score;
    food = spawnFood();
    canvas.classList.add("scale");
    canvas.style.transform = "scale(1.03)";
    setTimeout(() => canvas.style.transform = "scale(1)", 100);
  } else {
    snake.pop();
  }
}

document.addEventListener("keydown", changeDirection);
restartBtn.addEventListener("click", initGame);


const eatSound = document.getElementById("eatSound");
const gameOverSound = document.getElementById("gameOverSound");
const bgMusic = document.getElementById("music");

// Mode nuit auto
if (new Date().getHours() >= 20 || new Date().getHours() < 7) {
    document.getElementById("body").classList.add("bg-black");
}

// Effets audio
function playEatSound() {
    eatSound.currentTime = 0;
    eatSound.play();
}

function playGameOverSound() {
    gameOverSound.currentTime = 0;
    gameOverSound.play();
}

// Override eat logic with sound
function draw() {
  if (!food || food.x === undefined || food.y === undefined) food = spawnFood();
    ctx.clearRect(0, 0, canvasSize, canvasSize);
    ctx.font = "20px Arial";
    ctx.fillText("🍎", food.x + 3, food.y + 17);

    for (let i = 0; i < snake.length; i++) {
        const part = snake[i];
        ctx.fillStyle = "lime";
        ctx.fillRect(part.x, part.y, box, box);
        if (i === 0) {
            ctx.fillStyle = "black";
            ctx.beginPath();
            ctx.arc(part.x + 5, part.y + 5, 2, 0, 2 * Math.PI);
            ctx.arc(part.x + 15, part.y + 5, 2, 0, 2 * Math.PI);
            ctx.fill();
        }
    }

    let head = { ...snake[0] };
    if (direction === "LEFT") head.x -= box;
    else if (direction === "UP") head.y -= box;
    else if (direction === "RIGHT") head.x += box;
    else if (direction === "DOWN") head.y += box;

    if (
        head.x < 0 || head.x >= canvasSize || head.y < 0 || head.y >= canvasSize ||
        snake.some((part, index) => index !== 0 && part.x === head.x && part.y === head.y)
    ) {
        clearInterval(game);
        playGameOverSound();
        scoreDisplay.innerText = "💀 Game Over ! Score : " + score;
        scoreDisplay.classList.add("text-danger");
        if (score > bestScore) {
            localStorage.setItem("bestScore", score);
            bestScore = score;
            bestScoreDisplay.innerText = "🥇 Nouveau meilleur score : " + score;
        }
        return;
    }

    snake.unshift(head);

    if (head.x === food.x && head.y === food.y) {
        score++;
        playEatSound();
        scoreDisplay.innerText = "Score : " + score;
        food = spawnFood();
        canvas.style.transform = "scale(1.03)";
        setTimeout(() => canvas.style.transform = "scale(1)", 100);
    } else {
        snake.pop();
    }
}
