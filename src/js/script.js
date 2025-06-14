/**
 * Dino Dash - Professional JavaScript Game Engine
 * A Chrome Dinosaur Runner clone with enhanced graphics and animations
 */

// ===== GAME CONFIGURATION =====
const CONFIG = {
    CANVAS_WIDTH: 1200,  // Increased from 800
    CANVAS_HEIGHT: 300,  // Increased from 200
    GROUND_HEIGHT: 30,   // Slightly increased for larger canvas
    GRAVITY: 0.5,        // Reduced gravity for floatier feel
    JUMP_STRENGTH: -14,  // Slightly stronger jump to compensate for larger canvas
    INITIAL_SPEED: 1.5,  // Slower initial speed
    SPEED_INCREMENT: 0.002, // Slower speed increase
    MAX_SPEED: 8,        // Added max speed cap
    OBSTACLE_SPAWN_RATE: 0.007, // Slightly lower spawn rate
    OBSTACLE_MIN_GAP: 300, // Minimum gap between obstacles
    NIGHT_MODE_THRESHOLD: 700,
    ANIMATION_FRAME_RATE: 10, // Frames between animation updates
    PARALLAX_SPEED_RATIO: 0.5 // Speed ratio for parallax background
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
        // Position and size (scaled for larger canvas)
        this.width = 60;  // Increased from 40
        this.height = 60; // Increased from 40
        this.x = 100;     // Moved right for better visibility
        this.y = canvas.height - CONFIG.GROUND_HEIGHT - this.height;
        
        // Physics
        this.velocityY = 0;
        this.isJumping = false;
        this.groundY = canvas.height - CONFIG.GROUND_HEIGHT - this.height;
        
        // Jump mechanics
        this.jumpCount = 0;
        this.maxJumps = 2;
        this.jumpHoldTime = 0;
        this.maxJumpHoldTime = 15; // Frames to hold jump for maximum height
        
        // Animation
        this.animationFrame = 0;
        this.animationSpeed = 6; // Slower animation
        this.state = 'running';
        this.lastFrameTime = 0;
        
        // Smoothing
        this.smoothXVelocity = 0;
        this.smoothYVelocity = 0;
        this.smoothingFactor = 0.1; // Lower = smoother
    }

    jump() {
        if (this.jumpCount < this.maxJumps) {
            this.velocityY = CONFIG.JUMP_STRENGTH;
            this.isJumping = true;
            this.jumpCount++;
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
        // Setup canvas and context
        this.canvas = document.getElementById('gameCanvas');
        this.ctx = this.canvas.getContext('2d', { alpha: false }); // Disable alpha for better performance
        
        // Set canvas size from config
        this.canvas.width = CONFIG.CANVAS_WIDTH;
        this.canvas.height = CONFIG.CANVAS_HEIGHT;
        
        // Performance optimization
        this.ctx.imageSmoothingEnabled = false; // For pixel art
        this.ctx.webkitImageSmoothingEnabled = false;
        this.ctx.mozImageSmoothingEnabled = false;
        
        // Game timing
        this.lastTime = 0;
        this.accumulator = 0;
        this.timestep = 1000/60; // 60 FPS target
        this.lastFrameTime = performance.now();
        this.fps = 0;
        this.frameCount = 0;
        this.lastFpsUpdate = 0;
        this.frameTime = 0;
        
        // Game state
        this.gameState = new GameState();
        this.gameSpeed = CONFIG.INITIAL_SPEED;
        this.isGameOver = false;
        this.animationFrameId = null;
        
        // Initialize game objects
        this.player = new Player(this.canvas);
        this.obstacles = [];
        this.lastObstacleTime = 0;
        
        // Initialize systems with optimized settings
        this.particleSystem = new ParticleSystem();
        this.backgroundSystem = new BackgroundSystem(this.canvas);
        this.obstacleSystem = new ObstacleSystem(this.canvas);
        this.inputSystem = new InputSystem();
        
        // Performance monitoring
        this.fpsElement = document.createElement('div');
        this.fpsElement.style.position = 'absolute';
        this.fpsElement.style.top = '10px';
        this.fpsElement.style.right = '10px';
        this.fpsElement.style.color = 'white';
        this.fpsElement.style.fontFamily = 'monospace';
        this.fpsElement.style.backgroundColor = 'rgba(0,0,0,0.5)';
        this.fpsElement.style.padding = '5px 10px';
        this.fpsElement.style.borderRadius = '5px';
        document.body.appendChild(this.fpsElement);
        
        // Start the game loop
        this.start();
    }

    handleJump() {
        if (this.gameState.isRunning) {
            this.player.jump();
        }
    }

    restart() {
        this.gameState = new GameState();
        this.player = new Player(this.canvas);
        this.particleSystem = new ParticleSystem();
        this.backgroundSystem = new BackgroundSystem(this.canvas);
        this.obstacleSystem = new ObstacleSystem(this.canvas);
        this.gameSpeed = CONFIG.INITIAL_SPEED;
        this.isGameOver = false;
        this.lastTime = performance.now();
        this.accumulator = 0;
        this.frameCount = 0;
        this.lastFpsUpdate = 0;
        
        // Hide game over screen if visible
        const gameOverElement = document.getElementById('gameOver');
        if (gameOverElement) {
            gameOverElement.style.display = 'none';
        }
        
        // Reset night mode
        document.body.classList.remove('night-mode');
        
        // Start the game loop again
        this.start();
    }
    
    checkCollisions() {
        if (this.obstacleSystem.checkCollision(this.player)) {
            this.gameState.gameOver();
        }
    }
    
    render() {
        // Clear the canvas
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        
        // Draw background first
        this.backgroundSystem.draw(this.ctx, this.gameState);
        
        // Draw obstacles
        this.obstacleSystem.draw(this.ctx, this.gameState);
        
        // Draw player
        this.player.draw(this.ctx, this.gameState, this.inputSystem.state);
        
        // Draw particles
        this.particleSystem.draw(this.ctx, this.gameState);
        
        // Draw UI
        this.drawUI();
    }
    
    drawUI() {
        document.getElementById('score').textContent = Math.floor(this.gameState.score);
        document.getElementById('highScore').textContent = this.gameState.highScore;
    }
    
    // Start the game loop
    start() {
        this.lastTime = performance.now();
        this.animationFrameId = requestAnimationFrame((timestamp) => this.gameLoop(timestamp));
    }
    
    // Main game loop with fixed timestep
    gameLoop(timestamp) {
        // Calculate frame timing
        const currentTime = timestamp || performance.now();
        const deltaTime = currentTime - this.lastTime;
        this.lastTime = currentTime;
        
        // Update FPS counter every second
        this.frameCount++;
        if (currentTime - this.lastFpsUpdate > 1000) {
            this.fps = Math.round((this.frameCount * 1000) / (currentTime - this.lastFpsUpdate));
            if (this.fpsElement) {
                this.fpsElement.textContent = `${this.fps} FPS`;
            }
            this.frameCount = 0;
            this.lastFpsUpdate = currentTime;
        }
        
        // Fixed timestep for consistent game speed
        this.accumulator += Math.min(deltaTime, 250); // Cap delta time to avoid spiral of death
        
        // Process a fixed timestep worth of updates
        const timestep = 1000 / 60; // 60 updates per second
        while (this.accumulator >= timestep) {
            this.update(timestep);
            this.accumulator -= timestep;
        }
        
        // Render the current state
        this.render();
        
        // Continue the game loop
        if (!this.isGameOver) {
            this.animationFrameId = requestAnimationFrame(ts => this.gameLoop(ts));
        }
    }
    
    // Update game state
    update(deltaTime) {
        if (this.isGameOver) return;
        
        // Update game state
        this.gameState.update();
        
        // Update player
        this.player.update(deltaTime, this.inputSystem.state, this.particleSystem);
        
        // Update systems
        this.particleSystem.update(deltaTime);
        this.backgroundSystem.update(deltaTime, this.gameSpeed);
        this.obstacleSystem.update(deltaTime, this.gameSpeed);
        
        // Check for collisions
        this.checkCollisions();
        
        // Gradually increase game speed
        if (!this.isGameOver) {
            this.gameSpeed = Math.min(
                CONFIG.INITIAL_SPEED * 5, // Maximum speed cap
                this.gameSpeed + (CONFIG.SPEED_INCREMENT * deltaTime / 16.67) // Normalized to 60fps
            );
        }
    }

} // End of Game class

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
