# kh-mini — React + Vite

A React project conversion of the original `kh-mini.html` game.

## Requirements
- Node.js 18+ (Node.js 20 LTS recommended)
- npm

## Run locally

```bash
npm install
npm run dev
```

Open the local URL printed by Vite (usually http://localhost:5173).

## Production build

```bash
npm run build
npm run preview
```

## Project structure

```text
src/
  components/
    HomeScreen.jsx
    PlayerSelectionScreen.jsx
    GameSelectionScreen.jsx
    RandomGameScreen.jsx
    GameScreen.jsx
    ResultsScreen.jsx
    LeaderboardScreen.jsx
    SharedOverlays.jsx
    OrientationNotice.jsx
  game/
    gameEngine.js
  App.jsx
  main.jsx
  index.css
  kh-mini.css
index.html
vite.config.js
```

## Notes about the conversion

- React owns the application entry point and renders each screen as a separate component.
- The original canvas game engine is isolated in `src/game/gameEngine.js`. Keeping the frame loop and canvas drawing imperative is intentional: it avoids forcing high-frequency canvas updates through React state.
- The game engine still uses DOM-based screen transitions and delegated input handling internally. This preserves the original gameplay behavior, local leaderboard/settings storage, sound, keyboard controls, and touch pads.
- The original game has three playable mini-games: Teanh Prot, Bos Angkunh, and Oum Touk.
- This is a complete runnable React/Vite project, but it is a staged migration rather than a full rewrite of every canvas drawing routine into React components.
