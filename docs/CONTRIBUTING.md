# Contributing to Dino Dash

Thank you for your interest in contributing to Dino Dash! This document provides guidelines for contributing to the project.

## 🚀 Getting Started

### Prerequisites
- Modern web browser (Chrome, Firefox, Safari, Edge)
- Basic knowledge of HTML, CSS, and JavaScript
- Text editor or IDE
- Git for version control

### Development Setup
1. Fork the repository
2. Clone your fork locally
3. Navigate to the project directory
4. Start a local server:
   ```bash
   npm start
   # or
   python3 -m http.server 8080
   ```
5. Open `http://localhost:8080/index-new.html` in your browser

## 📁 Project Structure

```
dino-dash/
├── index-new.html          # Main HTML file
├── src/                    # Source code
│   ├── css/               # Stylesheets
│   │   └── style.css      # Main CSS file
│   ├── js/                # JavaScript files
│   │   └── script.js      # Main game logic
│   └── sw.js              # Service worker
├── assets/                # Static assets
│   └── images/            # Image files
├── docs/                  # Documentation
│   └── CONTRIBUTING.md    # This file
├── package.json           # Project metadata
├── README.md              # Main documentation
└── .gitignore            # Git ignore rules
```

## 🛠️ Development Guidelines

### Code Style
- Use consistent indentation (2 spaces)
- Follow ES6+ JavaScript standards
- Use meaningful variable and function names
- Add comments for complex logic
- Keep functions small and focused

### CSS Guidelines
- Use CSS custom properties for theming
- Follow mobile-first responsive design
- Use semantic class names
- Organize styles logically

### JavaScript Guidelines
- Use classes for game entities
- Follow the existing architecture patterns
- Handle errors gracefully
- Optimize for performance

## 🎮 Adding New Features

### Game Mechanics
1. Create a new class in the appropriate section
2. Integrate with the main game loop
3. Add configuration options to CONFIG object
4. Update documentation

### Visual Features
1. Add new drawing functions to appropriate classes
2. Consider performance impact
3. Ensure night mode compatibility
4. Test on mobile devices

### UI Improvements
1. Update HTML structure if needed
2. Add CSS styles with responsive design
3. Ensure accessibility compliance
4. Test keyboard navigation

## 🧪 Testing

### Manual Testing Checklist
- [ ] Game starts correctly
- [ ] All controls work (keyboard and touch)
- [ ] Collision detection is accurate
- [ ] Score system functions properly
- [ ] Night mode activates correctly
- [ ] Game over and restart work
- [ ] Mobile responsiveness
- [ ] Performance is smooth (60fps)

### Browser Testing
Test in multiple browsers:
- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)

## 📝 Pull Request Process

1. Create a feature branch from `main`
2. Make your changes
3. Test thoroughly
4. Update documentation if needed
5. Submit a pull request with:
   - Clear description of changes
   - Screenshots/GIFs if visual changes
   - Testing notes

## 🐛 Bug Reports

When reporting bugs, please include:
- Browser and version
- Operating system
- Steps to reproduce
- Expected vs actual behavior
- Screenshots if applicable

## 💡 Feature Requests

For new features, please:
- Check existing issues first
- Describe the feature clearly
- Explain the use case
- Consider implementation complexity

## 📄 License

By contributing, you agree that your contributions will be licensed under the MIT License.

## 🙏 Recognition

Contributors will be recognized in the README.md file and release notes.

Thank you for helping make Dino Dash better! 🦕
