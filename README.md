# Martaflix 🎬

A modern React Native movie discovery app built with Expo, featuring The Movie Database (TMDB) integration, favorites management, and beautiful UI components.

## 📱 Features

- 🎯 **Movie Discovery**: Browse popular and trending movies
- 🔍 **Smart Search**: Find movies with real-time search functionality  
- ❤️ **Favorites Management**: Save and manage your favorite movies
- 🎭 **Cast Profiles**: Detailed actor/actress information with biography and filmography
- 🌙 **Dark/Light Theme**: Automatic theme switching support
- 📱 **Cross-Platform**: Works on iOS, Android, and web
- ⚡ **Performance Optimized**: Built with React Query for efficient data caching
- 🎨 **Modern UI**: Beautiful interface using Gluestack UI components

## 🚀 API Key Setup

To use the movie discovery features, you need to obtain a TMDB API key:

### Steps:

1. Go to [The Movie Database (TMDB)](https://www.themoviedb.org/)
2. Create an account or sign in
3. Navigate to Settings > API
4. Request an API key (choose "Developer" option)
5. Fill out the required information

### Configuration:

Create a `.env` file in the project root and add:

```bash
EXPO_PUBLIC_TMDB_API_KEY=your_actual_api_key_here
```

**Important:** 
- The `.env` file is gitignored for security
- Never commit your actual API key to version control
- If you prefer, you can directly edit `lib/api-config.ts` and replace `YOUR_TMDB_API_KEY_HERE` with your actual API key

## 🛠️ Setup Instructions

### Prerequisites

- Node.js (version 18 or higher)
- npm or yarn
- Expo CLI (`npm install -g @expo/cli`)
- For iOS development: Xcode (macOS only)
- For Android development: Android Studio with SDK
- Watchman (recommended for macOS)

### Environment Setup

1. **Install Node.js**: Download from [nodejs.org](https://nodejs.org/)
2. **Install Watchman** (macOS only):
   ```bash
   brew install watchman
   ```
3. **Install Expo CLI**:
   ```bash
   npm install -g @expo/cli
   ```

### Installation

1. **Clone the repository**:
   ```bash
   git clone <repository-url>
   cd martaflix
   ```

2. **Install dependencies**:
   ```bash
   npm install
   ```

3. **Set up environment variables**:
   ```bash
   cp .env.example .env
   # Edit .env and add your TMDB API key
   ```

4. **Start the development server**:
   ```bash
   npm start
   ```

### Running on Different Platforms

#### For Device Simulators/Emulators:

1. **Prebuild native projects** (required for simulators):
   ```bash
   npx expo prebuild --clean
   ```

2. **Run on platforms**:
   - **iOS Simulator**: `npm run ios`
   - **Android Emulator**: `npm run android`

#### For Development and Testing:

- **Web Browser**: `npm run web`
- **Physical Device**: Use Expo Go app and scan the QR code

### Testing

```bash
# Run unit tests
npm test

# Run tests in watch mode
npm run test:watch

# Generate coverage report
npm run test:coverage
```

## 🏗️ Architectural Choices

### State Management
- **Zustand**: Chosen for its simplicity and excellent TypeScript support. Provides clean, minimal boilerplate for global state management. Stores are organized in the `store/` directory with MMKV persistence.
- **React Query**: Used for server state management, providing automatic caching, background updates, and optimistic updates.

### Navigation
- **Expo Router**: File-based routing system that provides type-safe navigation and follows modern React patterns.

### UI Framework
- **Gluestack UI**: Modern component library with excellent customization and accessibility features.
- **NativeWind**: Tailwind CSS for React Native, providing utility-first styling with theme support.

### Data Storage
- **MMKV**: Fast, secure key-value storage for persisting favorites and user preferences.
- **Async Storage**: Backup storage solution for broader compatibility.

### Code Organization
- **Modular Architecture**: Components are broken down into single-responsibility units
- **Centralized State Management**: Global stores organized in `store/` directory with corresponding hook wrappers in `hooks/`
- **Absolute Imports**: Clean import paths using `@/` prefix
- **Type Safety**: Comprehensive TypeScript types for all data structures

### Store Architecture
- **Theme Store** (`store/theme-store.ts`): Manages light/dark mode with system theme detection and MMKV persistence
- **Favorites Store** (`store/favorites-store.ts`): Handles movie favorites with optimistic updates and persistent storage
- **Hook Wrappers**: Each store has a corresponding hook in `hooks/` for better abstraction (e.g., `useTheme()`, `useFavorites()`)
- **Testing**: Comprehensive unit tests for all stores in `store/__tests__/`

## 📋 Assumptions Made

1. **API Reliability**: Assumed TMDB API has good uptime and consistent response format
2. **Image Availability**: Assumed movie posters and backdrops are generally available from TMDB
3. **Network Connectivity**: App assumes basic internet connectivity for core functionality
4. **Device Capabilities**: Targeted modern devices with adequate memory and processing power
5. **User Behavior**: Assumed users will primarily browse and save favorites rather than detailed movie management
6. **Platform Support**: Focused on iOS and Android with web as bonus platform

## 🚧 Challenges Faced

### 1. **Theme Management**
- **Challenge**: Implementing consistent dark/light theme across all components
- **Solution**: Created centralized theme store with Zustand and used NativeWind's dark mode utilities

### 2. **Image Loading Performance**
- **Challenge**: Movie posters loading slowly and consuming memory
- **Solution**: Implemented proper image caching with Expo Image and skeleton loading states

### 3. **State Persistence**
- **Challenge**: Maintaining favorites across app restarts
- **Solution**: Integrated MMKV with Zustand middleware for automatic persistence

### 4. **Search Debouncing**
- **Challenge**: Avoiding excessive API calls during search
- **Solution**: Implemented custom debounce hook with 300ms delay

### 5. **Testing Complex Components**
- **Challenge**: Testing components with API dependencies and navigation
- **Solution**: Created comprehensive mocks and used React Native Testing Library best practices

## ✅ Requirements Met

### Core Requirements
- ✅ **Movie Listing**: Display popular and trending movies with posters
- ✅ **Movie Details**: Show detailed information including cast, overview, and ratings
- ✅ **Search Functionality**: Real-time movie search with debouncing
- ✅ **Favorites Management**: Add/remove movies from favorites with persistence
- ✅ **Responsive Design**: Works across different screen sizes
- ✅ **Navigation**: Intuitive tab-based navigation structure
- ✅ **Error Handling**: Graceful error states and user feedback
- ✅ **Loading States**: Skeleton loaders and activity indicators

### Technical Requirements
- ✅ **TypeScript**: Fully typed codebase with strict configuration
- ✅ **State Management**: Zustand for global state, React Query for server state
- ✅ **Component Architecture**: Modular, reusable components under 80 lines
- ✅ **Testing**: Unit tests for utilities and complex components
- ✅ **Code Quality**: ESLint configuration with consistent formatting

## 🌟 Bonus Requirements Attempted/Met

- ✅ **Theme Support**: Complete dark/light mode implementation
- ✅ **Offline Capabilities**: Favorite movies available offline
- ✅ **Performance Optimization**: Image caching, memo usage, and query optimization
- ✅ **Accessibility**: ARIA labels and native accessibility props
- ✅ **Animation**: Smooth transitions with React Native Reanimated
- ✅ **Web Support**: Full web compatibility with responsive design
- ✅ **Test Coverage**: Comprehensive unit test suite with coverage reporting
- ✅ **Error Boundaries**: Graceful error handling throughout the app
- ✅ **Cast Detail Screen**: Interactive cast member profiles with comprehensive actor/actress information
  - Biography, personal details (birth date, place of birth, known for department)
  - Movie filmography with "Known For" section showing their popular movies
  - Seamless navigation from movie details to cast profiles and back to movies
  - Custom loading skeleton component for optimal user experience
  - Consistent card heights and proper spacing in horizontal movie lists
  - Full theme support and accessibility features throughout

## ⏱️ Time Spent

**Total Estimated Time: ~13 hours**

### Breakdown:
- **Initial Setup & Configuration**: 2 hours
- **API Integration & Types**: 2 hours
- **Core Components Development**: 1 hour
- **Navigation & Routing**: 2 hours
- **State Management Setup**: 1 hour
- **UI/UX Polish & Theming**: 2 hours
- **Testing Implementation**: 2 hours
- **Documentation & Refinement**: 1 hour

## 📁 Folder Structure

```
├── api/                  # API functions and TMDB integration
├── app/                  # Expo Router screens and navigation
│   ├── (tabs)/          # Tab-based navigation screens
│   ├── movie/           # Movie detail screens
│   └── cast/            # Cast detail screens
├── components/          # Reusable UI components
│   ├── ui/             # Core UI components (buttons, inputs)
│   └── *.tsx           # Feature-specific components
├── store/              # Zustand stores for global state management
│   ├── favorites-store.ts  # Favorites management with MMKV persistence
│   ├── theme-store.ts     # Theme management with MMKV persistence
│   └── __tests__/        # Store unit tests
├── hooks/              # Custom React hooks and store wrappers
├── lib/                # Utilities, storage, and configuration
├── types/              # TypeScript type definitions
├── constants/          # App constants and configuration
├── examples/           # Perfect styling examples and patterns
└── assets/             # Images, fonts, and static assets
```

## 📚 Tech Stack

- **Framework**: Expo (React Native)
- **Language**: TypeScript
- **UI Library**: Gluestack UI
- **Styling**: NativeWind (Tailwind CSS for RN)
- **Navigation**: Expo Router
- **State Management**: Zustand + React Query
- **Storage**: MMKV + Async Storage
- **Testing**: Jest + React Native Testing Library
- **API Client**: Axios
- **Icons**: Lucide React Native
- **Cursor**: Cursor rules to keep maintain the knowledge of the project

## 📱 Usage

### Commands

```bash
# Development
npm start                 # Start Expo development server
npx expo prebuild --clean # Generate native projects (required for simulators)
npm run ios              # Run on iOS simulator (after prebuild)
npm run android          # Run on Android emulator (after prebuild)
npm run web              # Run in web browser

# Testing
npm test                 # Run unit tests
npm run test:watch       # Run tests in watch mode
npm run test:coverage    # Generate coverage report

# Quality
npm run lint             # Run ESLint
```


## 📄 License

This project is licensed under the MIT License.

---

Built with ❤️ using React Native and Expo
