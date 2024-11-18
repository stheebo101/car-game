const game = document.getElementById("game");
const playerCar = document.getElementById("player-car");
const scoreDisplay = document.getElementById("score");
const speedButton = document.getElementById("speed-button");

let playerPosition = 180; // Initial horizontal position
let score = 0;
let acceleration = false;
let speedMultiplier = 1; // Default speed multiplier
let gameOver = false;

// Add keyboard movement
document.addEventListener("keydown", (event) => {
  if (event.key === "ArrowLeft" && playerPosition > 0) {
    playerPosition -= 10 * speedMultiplier;
    playerCar.style.left = `${playerPosition}px`;
  }
  if (event.key === "ArrowRight" && playerPosition < 360) {
    playerPosition += 10 * speedMultiplier;
    playerCar.style.left = `${playerPosition}px`;
  }
  // Spacebar is no longer used for speed up, so it doesn't do anything
});

// Add mouse movement
game.addEventListener("mousemove", (event) => {
  const gameRect = game.getBoundingClientRect();
  const mouseX = event.clientX - gameRect.left; // Mouse position relative to the game area
  if (mouseX >= 0 && mouseX <= 400) {
    playerPosition = mouseX - 20; // Center the car under the mouse cursor
    playerCar.style.left = `${playerPosition}px`;
  }
});

// Touch controls for swipe gestures
let touchStartX = 0;
let touchEndX = 0;

game.addEventListener("touchstart", (event) => {
  touchStartX = event.touches[0].clientX;
});

game.addEventListener("touchmove", (event) => {
  touchEndX = event.touches[0].clientX;
  const deltaX = touchEndX - touchStartX;

  if (deltaX < 0 && playerPosition > 0) {
    // Swipe left
    playerPosition -= Math.abs(deltaX) * 0.1 * speedMultiplier;
  }
  if (deltaX > 0 && playerPosition < 360) {
    // Swipe right
    playerPosition += Math.abs(deltaX) * 0.1 * speedMultiplier;
  }
  playerCar.style.left = `${playerPosition}px`;
});

// Speed button to toggle speed up
speedButton.addEventListener("mousedown", () => {
  acceleration = true;
  speedMultiplier = 2; // Double the speed
});

speedButton.addEventListener("mouseup", () => {
  acceleration = false;
  speedMultiplier = 1; // Reset to normal speed
});

// Check for boundaries and highlight edges
function checkBoundaries() {
  if (playerPosition <= 0 || playerPosition >= 360) {
    playerCar.classList.add("edge");
  } else {
    playerCar.classList.remove("edge");
  }
}

// Spawn opposing cars randomly
function spawnOpposingCar() {
  const opposingCar = document.createElement("div");
  opposingCar.classList.add("opposing-car");

  // Randomly place opposing cars within the game area (width of 0 to 360px)
  const randomX = Math.floor(Math.random() * 360);
  opposingCar.style.left = `${randomX}px`;

  game.appendChild(opposingCar);

  // Check for collision every 50ms
  const collisionCheckInterval = setInterval(() => {
    if (checkCollision(opposingCar)) {
      gameOver = true;
      alert("Game Over! You collided with an opposing car.");
      clearInterval(collisionCheckInterval);
      opposingCar.remove(); // Remove the car when game ends
    }
  }, 50);
}

// Collision detection
function checkCollision(opposingCar) {
  const carRect = playerCar.getBoundingClientRect();
  const opposingCarRect = opposingCar.getBoundingClientRect();

  // Check if the player car is within the bounds of an opposing car
  return !(
    carRect.right < opposingCarRect.left ||
    carRect.left > opposingCarRect.right ||
    carRect.bottom < opposingCarRect.top ||
    carRect.top > opposingCarRect.bottom
  );
}

// Game loop
function gameLoop() {
  if (gameOver) return;

  checkBoundaries();
  spawnOpposingCar();
  score++;
  scoreDisplay.textContent = `Score: ${score}`;

  // Spawn a new car every 2 seconds
  setTimeout(gameLoop, 2000);
}

// Start the game loop
gameLoop();
