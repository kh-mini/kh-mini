import { useEffect } from 'react';
import HomeScreen from './components/HomeScreen';
import PlayerSelectionScreen from './components/PlayerSelectionScreen';
import GameSelectionScreen from './components/GameSelectionScreen';
import RandomGameScreen from './components/RandomGameScreen';
import GameScreen from './components/GameScreen';
import ResultsScreen from './components/ResultsScreen';
import LeaderboardScreen from './components/LeaderboardScreen';
import SharedOverlays from './components/SharedOverlays';
import OrientationNotice from './components/OrientationNotice';
import { initGame } from './game/gameEngine';

export default function App() {
  useEffect(() => {
    // The canvas game engine attaches input handlers after React has rendered
    // all screen elements. It remains mounted for the lifetime of the app.
    initGame();
  }, []);

  return (
    <>
      <div id="wrap">
        <div id="stage">
          <HomeScreen />
          <PlayerSelectionScreen />
          <GameSelectionScreen />
          <RandomGameScreen />
          <GameScreen />
          <ResultsScreen />
          <LeaderboardScreen />
          <SharedOverlays />
        </div>
      </div>
      <OrientationNotice />
    </>
  );
}
