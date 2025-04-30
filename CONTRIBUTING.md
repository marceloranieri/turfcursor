# 🤝 Contributing to Turf

Thanks for your interest in contributing! This document provides guidelines and instructions for contributing to the project.

## 🚀 Getting Started

1. **Clone the repo**
```bash
git clone https://github.com/yourusername/turf-app.git
cd turf-app
```

2. **Install dependencies**
```bash
npm install
```

3. **Start development server**
```bash
npm run dev
```

## 📝 Commit Style

We follow [Conventional Commits](https://www.conventionalcommits.org/) for clear and structured commit messages:

```bash
type(scope): description

# Examples:
feat(auth): add GitHub OAuth login
fix(ui): resolve dark mode toggle issue
docs(readme): update installation steps
```

### Types
- `feat`: New feature
- `fix`: Bug fix
- `docs`: Documentation changes
- `style`: Code style changes (formatting, etc.)
- `refactor`: Code changes that neither fix bugs nor add features
- `test`: Adding or modifying tests
- `chore`: Changes to build process or auxiliary tools

## 🌿 Branch Strategy

- `main`: Production-ready code
- `dev`: Active development branch
- Feature branches: `feature/your-feature-name`
- Bug fixes: `fix/issue-description`

## 🔄 Pull Request Process

1. Create a new branch from `dev`
2. Make your changes
3. Update documentation if needed
4. Ensure tests pass
5. Submit PR to `dev` branch
6. Wait for review

## 🧪 Testing

Run tests before submitting:
```bash
npm run test
npm run lint
npm run type-check
```

## 📚 Documentation

- Update `README.md` if you add new features
- Add JSDoc comments for new functions
- Update `CHANGELOG.md` for significant changes

## ❓ Questions?

Feel free to:
- Open an issue
- Start a discussion
- Ask in pull request comments

Thank you for contributing! 🚀 