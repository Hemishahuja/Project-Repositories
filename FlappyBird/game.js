const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');
const scoreDisplay = document.getElementById('scoreDisplay');
const gameOverDiv = document.getElementById('gameOver');

// Game variables
let bird = {
    x: 50,
    y: 300,
    velocity: 0,
    gravity: 0.5,
    jump: -8,
    size: 20
};

let pipes = [];
let score = 0;
let gameLoop;
let isGameOver = false;
let godModeEnabled = false;
const pipeGap = 150;
const pipeWidth = 50;
const pipeSpacing = 200;

// Game functions
function drawBird() {
    // Add gradient and shadow effects
    const gradient = ctx.createRadialGradient(
        bird.x, bird.y, 1,
        bird.x, bird.y, bird.size
    );
    gradient.addColorStop(0, '#FFEA00');
    gradient.addColorStop(1, '#FFA500');
    
    ctx.shadowColor = 'rgba(0,0,0,0.5)';
    ctx.shadowBlur = 10;
    ctx.shadowOffsetY = 3;
    
    ctx.fillStyle = gradient;
    ctx.beginPath();
    ctx.arc(bird.x, bird.y, bird.size, 0, Math.PI * 2);
    ctx.fill();
    
    // Reset shadow
    ctx.shadowColor = 'transparent';
}

function drawPipe(pipe) {
    // Add metallic texture and 3D effect
    const gradient = ctx.createLinearGradient(pipe.x, 0, pipe.x + pipeWidth, 0);
    gradient.addColorStop(0, '#27AE60');
    gradient.addColorStop(0.5, '#2ECC71');
    gradient.addColorStop(1, '#229954');
    
    ctx.shadowColor = 'rgba(0,0,0,0.3)';
    ctx.shadowBlur = 8;
    ctx.shadowOffsetX = 3;
    
    ctx.fillStyle = gradient;
    ctx.fillRect(pipe.x, 0, pipeWidth, pipe.top);
    ctx.fillRect(pipe.x, pipe.top + pipeGap, pipeWidth, canvas.height - pipe.top - pipeGap);
    
    // Add pipe edges
    ctx.fillStyle = '#145A32';
    ctx.fillRect(pipe.x, pipe.top - 5, pipeWidth, 5);
    ctx.fillRect(pipe.x, pipe.top + pipeGap, pipeWidth, 5);
    
    ctx.shadowColor = 'transparent';
}

function createPipe() {
    return {
        x: canvas.width,
        top: Math.random() * (canvas.height - pipeGap - 100) + 50,
        passed: false
    };
}

function checkCollision(pipe) {
    return (bird.x + bird.size > pipe.x && 
            bird.x - bird.size < pipe.x + pipeWidth && 
            (bird.y - bird.size < pipe.top || 
             bird.y + bird.size > pipe.top + pipeGap));
}

function updateGame() {
    // Bird physics
    bird.velocity += bird.gravity;
    bird.y += bird.velocity;
    
    // God mode auto-jump
    if (godModeEnabled && bird.y > canvas.height * 0.4) {
        bird.velocity = bird.jump * 0.7;
    }
    
    // Pipe logic
    if (pipes.length === 0 || pipes[pipes.length-1].x < canvas.width - pipeSpacing) {
        pipes.push(createPipe());
    }

    pipes.forEach(pipe => {
        pipe.x -= 2;
        
        if (!pipe.passed && pipe.x + pipeWidth < bird.x) {
            score++;
            scoreDisplay.textContent = `Score: ${score}`;
            pipe.passed = true;
        }
        
        if (checkCollision(pipe) || bird.y + bird.size > canvas.height || bird.y - bird.size < 0) {
            gameOver();
        }
    });

    pipes = pipes.filter(pipe => pipe.x > -pipeWidth);
}

function gameOver() {
    isGameOver = true;
    gameOverDiv.style.display = 'block';
    cancelAnimationFrame(gameLoop);
}

function resetGame() {
    bird.y = 300;
    bird.velocity = 0;
    pipes = [];
    score = 0;
    isGameOver = false;
    gameOverDiv.style.display = 'none';
    scoreDisplay.textContent = 'Score: 0';
    gameLoop = requestAnimationFrame(gameLoop);
}

function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    drawBird();
    pipes.forEach(drawPipe);
    if (!isGameOver) updateGame();
}

// Event listeners
document.addEventListener('keydown', (e) => {
    if (e.code === 'Space' && !isGameOver) {
        bird.velocity = bird.jump;
    }
    if (e.code === 'KeyG') {
        godModeEnabled = !godModeEnabled;
        console.log(`God mode ${godModeEnabled ? 'ENABLED' : 'DISABLED'}`);
    }
});

// Start game
gameLoop = requestAnimationFrame(function animate() {
    draw();
    requestAnimationFrame(animate);
});
