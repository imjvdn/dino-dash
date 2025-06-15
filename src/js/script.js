/**
 * Dino Dash - Professional JavaScript Game Engine
 * A Chrome Dinosaur Runner clone with enhanced graphics and animations
 */

// ===== GAME CONFIGURATION =====
const CONFIG = {
    CANVAS_WIDTH: 800,
    CANVAS_HEIGHT: 200,
    GROUND_HEIGHT: 20,
    GRAVITY: 0.6,
    JUMP_STRENGTH: -12,
    INITIAL_SPEED: 2,
    SPEED_INCREMENT: 0.005,
    OBSTACLE_SPAWN_RATE: 0.01,
    NIGHT_MODE_THRESHOLD: 700
};

// ===== GAME STATE MANAGEMENT =====
class GameState {
    constructor() {
        this.isRunning = false;
        this.score = 0;
        this.speed = CONFIG.INITIAL_SPEED;
        this.frameCount = 0;
        this.nightMode = false;
        this.highScore = parseInt(localStorage.getItem('dinoHighScore')) || 0;
    }

    reset() {
        this.isRunning = true;
        this.score = 0;
        this.speed = CONFIG.INITIAL_SPEED;
        this.frameCount = 0;
        this.nightMode = false;
    }

    update() {
        if (!this.isRunning) return;

        this.frameCount++;
        this.score += 0.1;
        this.speed += CONFIG.SPEED_INCREMENT;

        // Activate night mode
        if (this.score >= CONFIG.NIGHT_MODE_THRESHOLD && !this.nightMode) {
            this.nightMode = true;
            document.body.classList.add('night-mode');
        }

        // Update high score
        if (this.score > this.highScore) {
            this.highScore = Math.floor(this.score);
            localStorage.setItem('dinoHighScore', this.highScore.toString());
        }
    }

    gameOver() {
        this.isRunning = false;
        document.getElementById('gameOver').style.display = 'block';
    }
}

// ===== PLAYER CLASS =====
class Player {
    constructor(canvas) {
        this.x = 50;
        this.y = canvas.height - CONFIG.GROUND_HEIGHT - 40;
        this.width = 40;
        this.height = 40;
        this.velocityY = 0;
        this.isJumping = false;
        this.groundY = canvas.height - CONFIG.GROUND_HEIGHT - 40;
        this.jumpCount = 0;
        this.maxJumps = 2;
        this.animationFrame = 0;
        this.animationSpeed = 8;
        this.state = 'running';
    }

    jump() {
        console.log('Player.jump called, jumpCount:', this.jumpCount, 'maxJumps:', this.maxJumps);
        if (this.jumpCount < this.maxJumps) {
            this.velocityY = CONFIG.JUMP_STRENGTH;
            this.isJumping = true;
            this.jumpCount++;
            console.log('Jump initiated, new velocityY:', this.velocityY, 'jumpCount:', this.jumpCount);
        } else {
            console.log('Max jumps reached, cannot jump');
        }
    }

    update(inputState, particleSystem) {
        // Apply gravity (reduced if floating during descent)
        const isFloating = (inputState.spacePressed || inputState.upPressed) && 
                          this.isJumping && this.velocityY > 0;
        const currentGravity = isFloating ? CONFIG.GRAVITY * 0.25 : CONFIG.GRAVITY;
        
        this.velocityY += currentGravity;
        this.y += this.velocityY;
        
        // Ground collision
        if (this.y >= this.groundY) {
            if (this.isJumping) {
                particleSystem.createLandingParticles(this.x + this.width / 2, this.y + this.height);
            }
            
            this.y = this.groundY;
            this.velocityY = 0;
            this.isJumping = false;
            this.jumpCount = 0;
        }

        // Update animation
        this.animationFrame++;
        this.state = this.isJumping ? 'jumping' : 'running';

        // Create jump trail
        if (this.isJumping && Math.random() < 0.3) {
            particleSystem.createJumpTrail(this.x + this.width / 2, this.y + this.height / 2);
        }
    }

    draw(ctx, gameState, inputState) {
        // Check if floating for visual feedback
        const isFloating = (inputState.spacePressed || inputState.upPressed) && 
                          this.isJumping && this.velocityY > 0;
        
        // Set color based on state and floating
        if (isFloating) {
            ctx.fillStyle = gameState.nightMode ? '#ccc' : '#777';
        } else {
            ctx.fillStyle = gameState.nightMode ? '#f7f7f7' : '#535353';
        }
        
        const px = this.x;
        const py = this.y;
        
        if (this.state === 'running') {
            this._drawRunningSprite(ctx, px, py, gameState, isFloating);
        } else if (this.state === 'jumping') {
            this._drawJumpingSprite(ctx, px, py, gameState, isFloating);
        }
    }

    _drawRunningSprite(ctx, px, py, gameState, isFloating) {
        // Main body
        ctx.fillRect(px + 8, py + 12, 20, 16);
        
        // Head
        ctx.fillRect(px + 22, py + 2, 16, 14);
        
        // Snout
        ctx.fillRect(px + 38, py + 8, 6, 4);
        
        // Eye
        ctx.fillStyle = gameState.nightMode ? '#2c2c2c' : '#f7f7f7';
        ctx.fillRect(px + 30, py + 5, 3, 3);
        
        // Reset color
        ctx.fillStyle = isFloating ? (gameState.nightMode ? '#ccc' : '#777') : (gameState.nightMode ? '#f7f7f7' : '#535353');
        
        // Animated legs
        const legCycle = Math.floor(this.animationFrame / this.animationSpeed) % 4;
        if (legCycle === 0 || legCycle === 2) {
            ctx.fillRect(px + 10, py + 28, 4, 8);
            ctx.fillRect(px + 18, py + 30, 4, 6);
        } else {
            ctx.fillRect(px + 10, py + 30, 4, 6);
            ctx.fillRect(px + 18, py + 28, 4, 8);
        }
        
        // Arms, tail, and spikes
        this._drawBodyDetails(ctx, px, py);
    }

    _drawJumpingSprite(ctx, px, py, gameState, isFloating) {
        // Main body
        ctx.fillRect(px + 8, py + 12, 20, 16);
        
        // Head
        ctx.fillRect(px + 22, py + 2, 16, 14);
        
        // Snout
        ctx.fillRect(px + 38, py + 8, 6, 4);
        
        // Eye
        ctx.fillStyle = gameState.nightMode ? '#2c2c2c' : '#f7f7f7';
        ctx.fillRect(px + 30, py + 5, 3, 3);
        
        // Reset color
        ctx.fillStyle = isFloating ? (gameState.nightMode ? '#ccc' : '#777') : (gameState.nightMode ? '#f7f7f7' : '#535353');
        
        // Tucked legs
        ctx.fillRect(px + 12, py + 26, 4, 6);
        ctx.fillRect(px + 18, py + 26, 4, 6);
        
        // Extended arms
        ctx.fillRect(px + 10, py + 16, 4, 6);
        ctx.fillRect(px + 22, py + 16, 4, 6);
        
        // Extended tail
        ctx.fillRect(px - 2, py + 18, 10, 4);
        ctx.fillRect(px - 6, py + 20, 6, 3);
        
        // Back spikes
        ctx.fillRect(px + 15, py + 10, 2, 3);
        ctx.fillRect(px + 20, py + 8, 2, 4);
    }

    _drawBodyDetails(ctx, px, py) {
        // Arms
        ctx.fillRect(px + 12, py + 16, 3, 6);
        ctx.fillRect(px + 20, py + 16, 3, 6);
        
        // Tail
        ctx.fillRect(px, py + 18, 8, 4);
        ctx.fillRect(px - 4, py + 20, 6, 3);
        
        // Back spikes
        ctx.fillRect(px + 15, py + 10, 2, 3);
        ctx.fillRect(px + 20, py + 8, 2, 4);
    }

    getHitbox() {
        return {
            x: this.x + 8,
            y: this.y + 2,
            width: this.width - 16,
            height: this.height - 4
        };
    }
}

// ===== PARTICLE SYSTEM =====
class ParticleSystem {
    constructor() {
        this.particles = [];
    }

    createLandingParticles(x, y) {
        for (let i = 0; i < 8; i++) {
            this.particles.push({
                x: x + (Math.random() - 0.5) * 20,
                y: y,
                velocityX: (Math.random() - 0.5) * 4,
                velocityY: -Math.random() * 3 - 1,
                life: 30,
                maxLife: 30,
                size: Math.random() * 3 + 1,
                type: 'dust'
            });
        }
    }

    createJumpTrail(x, y) {
        this.particles.push({
            x: x,
            y: y,
            velocityX: -2,
            velocityY: Math.random() * 2 - 1,
            life: 20,
            maxLife: 20,
            size: Math.random() * 2 + 1,
            type: 'trail'
        });
    }

    update() {
        for (let i = this.particles.length - 1; i >= 0; i--) {
            const particle = this.particles[i];
            
            particle.x += particle.velocityX;
            particle.y += particle.velocityY;
            particle.velocityY += 0.1; // Gravity
            particle.life--;
            
            if (particle.life <= 0) {
                this.particles.splice(i, 1);
            }
        }
    }

    draw(ctx, gameState) {
        ctx.fillStyle = gameState.nightMode ? '#ccc' : '#777';
        for (let particle of this.particles) {
            ctx.fillRect(particle.x, particle.y, particle.size, particle.size);
        }
    }

    reset() {
        this.particles = [];
    }
}

// ===== BACKGROUND SYSTEM =====
class BackgroundSystem {
    constructor(canvas) {
        this.canvas = canvas;
        this.layers = {
            mountains: [],
            hills: [],
            bushes: []
        };
        this.clouds = [];
        this.groundSegments = [];
        this.init();
    }

    init() {
        // Initialize mountains
        for (let i = 0; i < 3; i++) {
            this.layers.mountains.push({
                x: i * 300,
                y: this.canvas.height * 0.2,
                width: 300,
                height: 80,
                speed: 0.2
            });
        }

        // Initialize hills
        for (let i = 0; i < 4; i++) {
            this.layers.hills.push({
                x: i * 250,
                y: this.canvas.height * 0.4,
                width: 250,
                height: 60,
                speed: 0.5
            });
        }

        // Initialize bushes
        for (let i = 0; i < 6; i++) {
            this.layers.bushes.push({
                x: i * 150 + Math.random() * 50,
                y: this.canvas.height - CONFIG.GROUND_HEIGHT - 15,
                width: 20 + Math.random() * 10,
                height: 15,
                speed: 1.5
            });
        }

        // Initialize clouds
        for (let i = 0; i < 5; i++) {
            this.clouds.push({
                x: Math.random() * this.canvas.width,
                y: Math.random() * 50 + 20,
                width: 40 + Math.random() * 20,
                height: 20 + Math.random() * 10,
                speed: 0.3 + Math.random() * 0.2
            });
        }

        // Initialize ground segments
        for (let i = 0; i < Math.ceil(this.canvas.width / 20) + 1; i++) {
            this.groundSegments.push({
                x: i * 20,
                width: 20,
                height: 2
            });
        }
    }

    update(gameState) {
        // Update mountains
        for (let mountain of this.layers.mountains) {
            mountain.x -= mountain.speed;
            if (mountain.x + mountain.width < 0) {
                mountain.x = this.canvas.width;
            }
        }

        // Update hills
        for (let hill of this.layers.hills) {
            hill.x -= hill.speed;
            if (hill.x + hill.width < 0) {
                hill.x = this.canvas.width;
            }
        }

        // Update bushes
        for (let bush of this.layers.bushes) {
            bush.x -= bush.speed;
            if (bush.x + bush.width < 0) {
                bush.x = this.canvas.width + Math.random() * 100;
                bush.y = this.canvas.height - CONFIG.GROUND_HEIGHT - 15;
                bush.width = 20 + Math.random() * 10;
            }
        }

        // Update clouds
        for (let cloud of this.clouds) {
            cloud.x -= cloud.speed;
            if (cloud.x + cloud.width < 0) {
                cloud.x = this.canvas.width + Math.random() * 200;
                cloud.y = Math.random() * 50 + 20;
            }
        }

        // Update ground segments
        for (let segment of this.groundSegments) {
            segment.x -= gameState.speed;
            if (segment.x + segment.width < 0) {
                segment.x = this.canvas.width;
            }
        }
    }

    draw(ctx, gameState) {
        // Draw mountains
        ctx.fillStyle = gameState.nightMode ? '#333' : '#666';
        for (let mountain of this.layers.mountains) {
            ctx.fillRect(mountain.x, mountain.y, mountain.width, mountain.height);
        }

        // Draw hills
        ctx.fillStyle = gameState.nightMode ? '#555' : '#888';
        for (let hill of this.layers.hills) {
            ctx.fillRect(hill.x, hill.y, hill.width, hill.height);
        }

        // Draw bushes
        ctx.fillStyle = gameState.nightMode ? '#777' : '#aaa';
        for (let bush of this.layers.bushes) {
            ctx.fillRect(bush.x, bush.y, bush.width, bush.height);
        }

        // Draw clouds
        ctx.fillStyle = gameState.nightMode ? '#444' : '#fff';
        for (let cloud of this.clouds) {
            ctx.fillRect(cloud.x, cloud.y, cloud.width, cloud.height);
        }

        // Draw ground
        ctx.fillStyle = gameState.nightMode ? '#2c2c2c' : '#654321';
        for (let segment of this.groundSegments) {
            ctx.fillRect(segment.x, this.canvas.height - CONFIG.GROUND_HEIGHT, segment.width, segment.height);
        }
    }

    reset() {
        this.layers.mountains.forEach(mountain => mountain.x = Math.random() * this.canvas.width);
        this.layers.hills.forEach(hill => hill.x = Math.random() * this.canvas.width);
        this.layers.bushes.forEach(bush => bush.x = Math.random() * this.canvas.width);
        this.clouds.forEach(cloud => cloud.x = Math.random() * this.canvas.width);
    }
}

// ===== OBSTACLE SYSTEM =====
class ObstacleSystem {
    constructor(canvas) {
        this.canvas = canvas;
        this.obstacles = [];
    }

    update(gameState) {
        // Generate new obstacles
        if (Math.random() < CONFIG.OBSTACLE_SPAWN_RATE * gameState.speed) {
            this.obstacles.push({
                x: this.canvas.width,
                y: this.canvas.height - CONFIG.GROUND_HEIGHT - 30,
                width: 20,
                height: 30
            });
        }

        // Update obstacle positions
        for (let i = this.obstacles.length - 1; i >= 0; i--) {
            this.obstacles[i].x -= gameState.speed;
            
            if (this.obstacles[i].x + this.obstacles[i].width < 0) {
                this.obstacles.splice(i, 1);
            }
        }
    }

    draw(ctx, gameState) {
        ctx.fillStyle = gameState.nightMode ? '#2c2c2c' : '#228B22';
        for (let obstacle of this.obstacles) {
            // Draw cactus body
            ctx.fillRect(obstacle.x, obstacle.y, obstacle.width, obstacle.height);
            
            // Draw cactus arms
            ctx.fillRect(obstacle.x - 5, obstacle.y + 8, 8, 3);
            ctx.fillRect(obstacle.x + obstacle.width - 3, obstacle.y + 12, 8, 3);
        }
    }

    checkCollision(player) {
        const playerHitbox = player.getHitbox();
        
        for (let obstacle of this.obstacles) {
            if (playerHitbox.x < obstacle.x + obstacle.width &&
                playerHitbox.x + playerHitbox.width > obstacle.x &&
                playerHitbox.y < obstacle.y + obstacle.height &&
                playerHitbox.y + playerHitbox.height > obstacle.y) {
                return true;
            }
        }
        return false;
    }

    reset() {
        this.obstacles = [];
    }
}

// ===== INPUT SYSTEM =====
class InputSystem {
    constructor() {
        this.state = {
            spacePressed: false,
            upPressed: false
        };
        this.setupEventListeners();
    }

    setupEventListeners() {
        // Keyboard events
        document.addEventListener('keydown', (e) => {
            if (e.code === 'Space' || e.code === 'ArrowUp') {
                e.preventDefault();
                if (!this.state.spacePressed && !this.state.upPressed) {
                    game.handleJump();
                }
                this.state.spacePressed = e.code === 'Space';
                this.state.upPressed = e.code === 'ArrowUp';
            }
        });

        document.addEventListener('keyup', (e) => {
            if (e.code === 'Space') {
                this.state.spacePressed = false;
            }
            if (e.code === 'ArrowUp') {
                this.state.upPressed = false;
            }
        });

        // Mobile touch events
        const jumpButton = document.getElementById('jumpButton');
        if (jumpButton) {
            jumpButton.addEventListener('touchstart', (e) => {
                e.preventDefault();
                game.handleJump();
            });

            jumpButton.addEventListener('click', (e) => {
                e.preventDefault();
                game.handleJump();
            });
        }

        // Canvas touch events
        const canvas = document.getElementById('gameCanvas');
        if (canvas) {
            canvas.addEventListener('touchstart', (e) => {
                e.preventDefault();
                game.handleJump();
            });

            canvas.addEventListener('click', (e) => {
                e.preventDefault();
                game.handleJump();
            });
        }

        // Restart game events
        document.addEventListener('keydown', (e) => {
            if (!game.gameState.isRunning && (e.code === 'Space' || e.code === 'ArrowUp' || e.code === 'Enter')) {
                e.preventDefault();
                game.restart();
            }
        });
    }
}

// ===== MAIN GAME CLASS =====
class Game {
    constructor() {
        this.canvas = document.getElementById('gameCanvas');
        this.ctx = this.canvas.getContext('2d');
        
        // Set canvas size
        this.canvas.width = CONFIG.CANVAS_WIDTH;
        this.canvas.height = CONFIG.CANVAS_HEIGHT;
        
        // Initialize game systems
        this.gameState = new GameState();
        this.player = new Player(this.canvas);
        this.particleSystem = new ParticleSystem();
        this.backgroundSystem = new BackgroundSystem(this.canvas);
        this.obstacleSystem = new ObstacleSystem(this.canvas);
        this.inputSystem = new InputSystem();
        
        // Start game loop
        this.gameLoop();
    }

    handleJump() {
        console.log('handleJump called, gameState.isRunning:', this.gameState.isRunning);
        if (this.gameState.isRunning) {
            console.log('Calling player.jump()');
            this.player.jump();
        } else {
            console.log('Game not running, jump ignored');
        }
    }

    restart() {
        this.gameState.reset();
        this.player = new Player(this.canvas);
        this.particleSystem.reset();
        this.backgroundSystem.reset();
        this.obstacleSystem.reset();
        
        document.getElementById('gameOver').style.display = 'none';
        document.body.classList.remove('night-mode');
    }

    update() {
        if (!this.gameState.isRunning) {
            console.log('Game not running, skipping update');
            return;
        }

        this.gameState.update();
        this.player.update(this.inputSystem.state, this.particleSystem);
        this.particleSystem.update();
        this.backgroundSystem.update(this.gameState);
        this.obstacleSystem.update(this.gameState);

        // Check collisions
        if (this.obstacleSystem.checkCollision(this.player)) {
            console.log('Collision detected, game over');
            this.gameState.gameOver();
        }

        // Update UI
        this.updateUI();
    }

    draw() {
        // Clear canvas with debug color to verify clearing
        this.ctx.fillStyle = '#f0f0f0';
        this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
        
        // Draw all game elements in order
        try {
            this.backgroundSystem.draw(this.ctx, this.gameState);
            this.player.draw(this.ctx, this.gameState, this.inputSystem.state);
            this.obstacleSystem.draw(this.ctx, this.gameState);
            this.particleSystem.draw(this.ctx, this.gameState);
            
            // Draw debug info
            this.ctx.fillStyle = 'red';
            this.ctx.font = '12px Arial';
            this.ctx.fillText(`Game Running: ${this.gameState.isRunning}`, 10, 20);
            this.ctx.fillText(`Player Y: ${Math.round(this.player.y)}`, 10, 35);
        } catch (error) {
            console.error('Error in draw loop:', error);
        }
    }

    updateUI() {
        document.getElementById('score').textContent = Math.floor(this.gameState.score);
        document.getElementById('highScore').textContent = this.gameState.highScore;
    }

    gameLoop() {
        this.update();
        this.draw();
        requestAnimationFrame(() => this.gameLoop());
    }
}

// ===== GAME INITIALIZATION =====
console.log('Script loaded successfully!');
let game;

// Function to initialize the game
function initGame() {
    console.log('DOM fully loaded, initializing game...');
    try {
        game = new Game();
        console.log('Game initialized successfully!');
        
        // Hide loading screen once game is initialized
        if (window.hideLoadingScreen) {
            window.hideLoadingScreen();
        } else {
            console.warn('hideLoadingScreen function not found on window');
            // Fallback: hide loading screen directly
            const loadingElement = document.getElementById('loading');
            if (loadingElement) loadingElement.style.display = 'none';
        }
        
        return true;
    } catch (error) {
        const errorMsg = `Error initializing game: ${error.message}`;
        console.error(errorMsg, error);
        
        // Show error in the UI if possible
        if (window.showError) {
            window.showError(errorMsg);
        }
        
        // Still hide loading screen to show the error
        const loadingElement = document.getElementById('loading');
        if (loadingElement) loadingElement.style.display = 'none';
        
        return false;
    }
}

// Initialize game when DOM is loaded
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initGame);
} else {
    // DOMContentLoaded has already fired, initialize immediately
    setTimeout(initGame, 0);
}
