# 🦕 Dino Dash - Chrome Dinosaur Runner Clone

A faithful recreation of the classic Chrome Dinosaur Runner game with enhanced movement mechanics, built using only HTML, CSS, and vanilla JavaScript.

![Game Preview](https://img.shields.io/badge/Game-Playable-brightgreen) ![HTML5](https://img.shields.io/badge/HTML5-E34F26?logo=html5&logoColor=white) ![CSS3](https://img.shields.io/badge/CSS3-1572B6?logo=css3&logoColor=white) ![JavaScript](https://img.shields.io/badge/JavaScript-F7DF1E?logo=javascript&logoColor=black)

## 🎮 Game Features

### Core Gameplay
- **Pixelated T-Rex Character** - Authentic retro sprite-style dinosaur with animated running legs
- **Endless Desert Landscape** - Scrolling ground with clouds and desert atmosphere
- **Dynamic Obstacles** - Randomly generated cacti with intelligent spacing
- **Progressive Difficulty** - Game speed increases continuously over time
- **Collision Detection** - Precise hit detection for fair gameplay
- **Score System** - Points increment over time with high score tracking

### Enhanced Movement System
- **🦘 Double Jump** - Press Space/Up Arrow twice for aerial maneuvers
- **🪶 Float Mechanic** - Hold Space/Up Arrow during descent to slow fall speed
- **⚡ Responsive Controls** - Smooth physics with gravity and jump mechanics
- **👀 Visual Feedback** - T-Rex changes color when floating for clear indication

### Visual & Audio Experience
- **🌙 Night Mode** - Automatic dark theme activation after score threshold (700 points)
- **✨ Retro Pixel Art** - Crisp, blocky graphics with authentic 8-bit aesthetic
- **💫 Blinking Game Over** - Animated game over screen with CSS effects
- **📱 Mobile Responsive** - Touch controls and responsive design for all devices

### Quality of Life Features
- **💾 High Score Storage** - Persistent high scores using localStorage
- **🔄 Instant Restart** - Quick game restart with Space/Tap after game over
- **📱 Touch Support** - Full mobile compatibility with tap-to-jump
- **⌨️ Multiple Input Methods** - Spacebar, Up Arrow, or touch controls

## 🚀 Quick Start

### Option 1: Direct Play
1. Download or clone this repository
2. Open `index.html` in any modern web browser
3. Start playing immediately!

### Option 2: Local Server (Recommended)
```bash
# Navigate to the project directory
cd dino-dash

# Start a local server (Python 3)
python3 -m http.server 8000

# Or using Python 2
python -m SimpleHTTPServer 8000

# Or using Node.js
npx http-server

# Open browser to http://localhost:8000
```

## 🎯 How to Play

### Basic Controls
- **Jump**: Press `Spacebar` or `↑ Arrow Key`
- **Mobile**: Tap anywhere on screen or use the jump button

### Advanced Techniques
1. **Double Jump**: Press jump key twice to reach higher obstacles
2. **Float Control**: Hold jump key during descent to slow fall speed
3. **Combo Moves**: Combine double jump + float for precise landings

### Game Progression
- **Score**: Increases automatically over time
- **Speed**: Gradually increases for added challenge
- **Night Mode**: Unlocks at 700 points with dark theme
- **High Score**: Automatically saved and displayed

## 🛠️ Technical Implementation

### Architecture
- **Single File Design** - Everything contained in one HTML file for easy deployment
- **Vanilla JavaScript** - No external dependencies or frameworks
- **Canvas Rendering** - Smooth 60fps animations using HTML5 Canvas
- **Responsive CSS** - Mobile-first design with flexible layouts

### Key Components
```javascript
// Core game systems
- Game Loop (requestAnimationFrame)
- Physics Engine (gravity, collision detection)
- Input Handling (keyboard + touch events)
- Rendering System (canvas 2D context)
- State Management (game state, player state)
```

### Performance Features
- **Optimized Rendering** - Efficient canvas drawing with minimal redraws
- **Memory Management** - Proper cleanup of off-screen objects
- **Smooth Animations** - 60fps target with requestAnimationFrame
- **Responsive Design** - Adapts to different screen sizes automatically

## 📁 Project Structure

```
dino-dash/
├── index.html          # Complete game (HTML + CSS + JS)
├── README.md          # This file
└── .git/              # Git repository
```

## 🎨 Customization

The game is highly customizable through constants at the top of the JavaScript section:

```javascript
// Physics constants
const GRAVITY = 0.6;           // Fall speed
const FLOAT_GRAVITY = 0.25;    // Reduced gravity when floating
const JUMP_FORCE = -15;        // Jump strength

// Gameplay constants
const INITIAL_SPEED = 3;       // Starting game speed
const SPEED_INCREMENT = 0.005; // Speed increase rate
const OBSTACLE_SPAWN_RATE = 0.007; // Obstacle frequency
const NIGHT_MODE_THRESHOLD = 700;  // Score for night mode
```

## 🌟 Features Comparison

| Feature | Original Chrome Dino | Dino Dash |
|---------|---------------------|-----------|
| Basic Jump | ✅ | ✅ |
| Obstacle Avoidance | ✅ | ✅ |
| Score System | ✅ | ✅ |
| Night Mode | ✅ | ✅ |
| **Double Jump** | ❌ | ✅ |
| **Float Mechanic** | ❌ | ✅ |
| **Visual Feedback** | ❌ | ✅ |
| **Mobile Touch** | ❌ | ✅ |
| **High Score Storage** | ❌ | ✅ |

## 🔧 Development

### Code Structure
The game follows a clean, modular structure:

1. **HTML Structure** - Semantic markup with game container
2. **CSS Styling** - Responsive design with night mode support
3. **JavaScript Logic** - Object-oriented game architecture

### Key Functions
- `initGame()` - Initialize game state and objects
- `gameLoop()` - Main game loop with rendering and updates
- `updatePlayer()` - Handle player physics and movement
- `checkCollisions()` - Detect collisions between player and obstacles
- `drawPlayer()` - Render T-Rex with visual feedback

## 🚀 Deployment

### GitHub Pages
1. Push to GitHub repository
2. Enable GitHub Pages in repository settings
3. Share the generated URL

### Netlify/Vercel
1. Connect repository to hosting platform
2. Deploy automatically on push
3. Get custom domain if desired

### Local Sharing
Simply share the `index.html` file - it contains everything needed!

## 🎯 Future Enhancements

Potential features for future versions:
- [ ] Power-ups and special abilities
- [ ] Multiple obstacle types (birds, rocks)
- [ ] Sound effects and background music
- [ ] Particle effects for jumps and collisions
- [ ] Leaderboard system
- [ ] Achievement system
- [ ] Different T-Rex skins/characters

## 🤝 Contributing

This is a single-file project, making contributions simple:

1. Fork the repository
2. Make changes to `index.html`
3. Test thoroughly in multiple browsers
4. Submit a pull request with description

## 📄 License

This project is open source and available under the [MIT License](LICENSE).

## 🙏 Acknowledgments

- Inspired by the original Chrome Dinosaur Runner game
- Built as a learning exercise in vanilla web technologies
- Enhanced with modern gameplay mechanics

---

**Enjoy playing Dino Dash! 🦕** 

*Jump, float, and dash your way to the highest score!*
