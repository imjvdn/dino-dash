# 🦕 Dino Dash - Professional Chrome Dinosaur Runner Clone

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![JavaScript](https://img.shields.io/badge/JavaScript-ES6+-yellow.svg)](https://developer.mozilla.org/en-US/docs/Web/JavaScript)
[![HTML5](https://img.shields.io/badge/HTML5-Canvas-orange.svg)](https://developer.mozilla.org/en-US/docs/Web/API/Canvas_API)
[![PWA Ready](https://img.shields.io/badge/PWA-Ready-blue.svg)](https://web.dev/progressive-web-apps/)
[![Live Demo](https://img.shields.io/badge/Live-Demo-brightgreen)](https://imjvdn.github.io/dino-dash/)

A professionally organized, feature-rich Chrome Dinosaur Runner clone built with vanilla JavaScript, HTML5 Canvas, and modern web technologies. This project showcases clean code architecture, enhanced graphics, and smooth animations.

## 🎮 Live Demo

🎮 [Play Dino Dash Now](https://imjvdn.github.io/dino-dash/)

Try to beat the high score! The game features:
- 🦘 Double jump ability
- 🪶 Float control (hold jump while falling)
- 🌙 Night mode at 700 points
- 📱 Mobile-friendly controls
- 🏆 Persistent high scores

## ✨ Features

### 🎯 Core Gameplay
- **Smooth T-Rex Movement** - Realistic physics with gravity and jump mechanics
- **Double Jump Ability** - Jump twice while airborne for advanced gameplay
- **Float Control** - Hold jump key while falling to slow descent
- **Progressive Difficulty** - Game speed increases over time
- **Collision Detection** - Precise hitbox-based collision system
- **High Score Tracking** - Persistent localStorage-based scoring

### 🎨 Enhanced Graphics & Animation
- **Detailed T-Rex Sprite** - Better proportioned pixel art with realistic features
- **Animation States** - Different sprites for running and jumping
- **Particle Effects** - Dust clouds on landing and jump trails
- **Parallax Background** - Three-layer depth with mountains, hills, and bushes
- **Night Mode** - Automatic dark theme activation at 700 points
- **Smooth Animations** - Frame-based animation system

### 📱 Modern Features
- **Responsive Design** - Works on desktop, tablet, and mobile
- **Touch Controls** - Tap to jump on mobile devices
- **PWA Ready** - Offline functionality with service worker
- **Accessibility** - ARIA labels and keyboard navigation
- **Professional UI** - Clean, modern interface with visual feedback

## 🏗️ Project Structure

```
dino-dash/
├── src/                      # Source code
│   ├── css/                  # Stylesheets
│   │   └── style.css        # Main CSS file
│   ├── js/                   # JavaScript files
│   │   └── script.js        # Main game logic
│   └── sw.js                # Service worker for PWA
├── assets/                   # Static assets
│   └── images/              # Image files (if any)
├── docs/                    # Documentation
│   ├── CONTRIBUTING.md      # Contribution guidelines
│   └── ARCHITECTURE.md      # Technical architecture (future)
├── index-new.html           # Main HTML file
├── README.md                # This file
├── CHANGELOG.md             # Version history
├── CONTRIBUTORS.md          # List of contributors
├── CODE_OF_CONDUCT.md       # Community guidelines
├── SECURITY.md              # Security policy
├── LICENSE                  # MIT License
├── package.json             # Project metadata and scripts
└── .gitignore              # Git ignore rules
```

### File Descriptions

- **`src/`** - Contains all source code
  - `css/` - Stylesheets for the application
  - `js/` - JavaScript files with game logic
  - `sw.js` - Service worker for offline functionality

- **`assets/`** - Static assets like images, sounds, etc.
  - `images/` - Image files used in the game

- **`docs/`** - Documentation files
  - `CONTRIBUTING.md` - Guidelines for contributors
  - `ARCHITECTURE.md` - Technical architecture (future)

- **Root Directory** - Configuration and documentation files
  - `index-new.html` - Main entry point
  - `README.md` - Project documentation
  - `CHANGELOG.md` - Version history
  - `CONTRIBUTORS.md` - List of contributors
  - `CODE_OF_CONDUCT.md` - Community guidelines
  - `SECURITY.md` - Security policy and reporting
  - `LICENSE` - MIT License
  - `package.json` - Project metadata and scripts
  - `.gitignore` - Git ignore rules

## 🚀 Quick Start

### Option 1: Simple Setup
1. Clone or download the repository
2. Open `index-new.html` in a modern web browser
3. Start playing!

### Option 2: Local Server (Recommended)
```bash
# Clone the repository
git clone https://github.com/your-username/dino-dash.git
cd dino-dash

# Start local server
npm start
# or
python3 -m http.server 8080

# Open http://localhost:8080/index-new.html
```

## 🎮 How to Play

### Controls
- **Desktop**: Press `SPACEBAR` or `↑` (Up Arrow) to jump
- **Mobile**: Tap the screen or use the JUMP button
- **Float**: Hold jump key while falling to slow descent
- **Double Jump**: Press jump again while airborne
- **Restart**: Press `SPACEBAR`, `↑`, or `ENTER` after game over

### Gameplay Tips
- 🦕 Avoid the green cacti to survive
- ⭐ Use double jump for high obstacles
- 🌙 Night mode activates at 700 points
- 🎯 Beat your high score and challenge friends!

## 🛠️ Technical Implementation

### Architecture
The project uses a modern, class-based architecture with clear separation of concerns:

- **Game Class** - Main game loop and coordination
- **GameState Class** - State management and scoring
- **Player Class** - T-Rex character logic and rendering
- **ParticleSystem Class** - Visual effects management
- **BackgroundSystem Class** - Parallax layers and environment
- **ObstacleSystem Class** - Cactus generation and collision
- **InputSystem Class** - Keyboard and touch input handling

### Key Technologies
- **HTML5 Canvas** - 2D rendering and game graphics
- **Vanilla JavaScript (ES6+)** - Modern JavaScript features
- **CSS3** - Responsive design and animations
- **Service Worker** - PWA functionality and offline support
- **LocalStorage** - Persistent high score tracking

### Performance Features
- **RequestAnimationFrame** - Smooth 60fps game loop
- **Object Pooling** - Efficient particle management
- **Optimized Rendering** - Minimal canvas operations
- **Responsive Canvas** - Adaptive sizing for all devices

## 🎨 Customization

### Game Configuration
Edit the `CONFIG` object in `script.js`:

```javascript
const CONFIG = {
    CANVAS_WIDTH: 800,           // Game canvas width
    CANVAS_HEIGHT: 200,          // Game canvas height
    GRAVITY: 0.6,               // Gravity strength
    JUMP_STRENGTH: -12,         // Jump power
    INITIAL_SPEED: 2,           // Starting game speed
    SPEED_INCREMENT: 0.005,     // Speed increase rate
    OBSTACLE_SPAWN_RATE: 0.01,  // Obstacle frequency
    NIGHT_MODE_THRESHOLD: 700   // Night mode activation score
};
```

### Visual Customization
- **Colors**: Modify CSS variables in `style.css`
- **Sprites**: Update drawing functions in Player class
- **Particles**: Adjust particle properties in ParticleSystem
- **Background**: Modify BackgroundSystem layer properties

## 📦 Deployment

### GitHub Pages
1. Push your code to a GitHub repository
2. Go to Settings → Pages
3. Select source branch (usually `main`)
4. Your game will be available at `https://username.github.io/repository-name`

### Netlify
1. Connect your GitHub repository to Netlify
2. Set build command: `echo "No build needed"`
3. Set publish directory: `./`
4. Deploy automatically on push

### Vercel
1. Import your GitHub repository
2. No build configuration needed
3. Deploy with zero configuration

## 🔧 Development

### Available Scripts
```bash
npm start          # Start development server
npm run dev        # Same as start
npm run build      # No build process (vanilla JS)
npm test           # Run tests (not implemented)
npm run lint       # Code linting (not configured)
```

### Adding Features
The modular architecture makes it easy to add new features:

1. **New Obstacle Types**: Extend ObstacleSystem class
2. **Power-ups**: Create new PowerUpSystem class
3. **Sound Effects**: Add AudioSystem class
4. **Multiplayer**: Implement NetworkSystem class

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- Inspired by the original Chrome Dinosaur Game
- Built with modern web technologies and best practices
- Designed for educational and entertainment purposes

## 🐛 Known Issues

- None currently reported

## 🔮 Future Enhancements

- [ ] Sound effects and background music
- [ ] Multiple obstacle types (flying pterodactyls)
- [ ] Power-up system
- [ ] Leaderboard functionality
- [ ] Achievement system
- [ ] Multiple T-Rex skins
- [ ] Level system with different environments

---

**Made with ❤️ and modern JavaScript**

*Star ⭐ this repository if you found it helpful!*
