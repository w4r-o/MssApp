# Markville App (Dark Mode)

## Overview
A React Native/Expo application for Markville Secondary School students to access their TeachAssist grades, course information, and school resources.

## Directory Structure
```
/app                 # Main application screens and navigation
  /(tabs)           # Tab-based navigation screens
  /(auth)           # Authentication related screens
/src
  /components       # Reusable UI components
  /screens          # Screen components
  /utils           # Utility functions and helpers
  /lib             # Core business logic
  /services        # API and external service integrations
  /types           # TypeScript type definitions
/assets            # Static assets (images, fonts)
```

## Setup Instructions

### Prerequisites
- Node.js (v16 or higher)
- Yarn package manager
- Expo CLI (`npm install -g expo-cli`)

### Installation
1. Clone the repository
```bash
git clone [repository-url]
cd MarkvilleApp-Dark
```

2. Install dependencies
```bash
yarn install
```

3. Start the development server
```bash
yarn start
```

## Development Guidelines

### Code Style
- Use TypeScript for type safety
- Follow ESLint configuration
- Use Prettier for code formatting
- Follow React Native best practices

### Naming Conventions
- Components: PascalCase (e.g., `LoginScreen.tsx`)
- Functions: camelCase (e.g., `handleSubmit`)
- Files: PascalCase for components, camelCase for utilities
- Constants: UPPER_SNAKE_CASE

### Git Workflow
1. Create feature branch from main
   ```bash
   git checkout -b feature/your-feature-name
   ```
2. Make changes and commit using conventional commits
   ```bash
   git commit -m "feat: add new feature"
   ```
3. Push changes and create pull request
   ```bash
   git push origin feature/your-feature-name
   ```

### Testing
- Run tests: `yarn test`
- Update snapshots: `yarn test -u`
- Check coverage: `yarn test --coverage`

## Available Scripts
- `yarn start`: Start the Expo development server
- `yarn android`: Run on Android emulator
- `yarn ios`: Run on iOS simulator
- `yarn web`: Run in web browser
- `yarn test`: Run test suite
- `yarn lint`: Run ESLint
- `yarn format`: Run Prettier

## Contributing
1. Fork the repository
2. Create your feature branch
3. Commit your changes
4. Push to the branch
5. Create a Pull Request

## License
[Add your license information here]
