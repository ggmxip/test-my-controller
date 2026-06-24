import { useState } from 'react';
import useGamepad from './hooks/useGamepad';
import ControllerSelector from './components/ControllerSelector';
import ControllerInfo from './components/ControllerInfo';
import ControllerDiagram from './components/ControllerDiagram';
import ButtonGrid from './components/ButtonGrid';
import StickVisualizer from './components/StickVisualizer';
import TriggerBar from './components/TriggerBar';
import VibrationTester from './components/VibrationTester';
import PollingRate from './components/PollingRate';
import RawDataPanel from './components/RawDataPanel';
import './App.css';

const DRIFT_SAMPLE_COUNT = 60;

function detectDrift(samples) {
  if (!samples || samples.length < 30) return { offsetX: 0, offsetY: 0, severity: 'none' };
  const avgX = samples.reduce((s, p) => s + p.x, 0) / samples.length;
  const avgY = samples.reduce((s, p) => s + p.y, 0) / samples.length;
  const dist = Math.sqrt(avgX * avgX + avgY * avgY);
  let severity = 'none';
  if (dist > 0.05) severity = 'severe';
  else if (dist > 0.03) severity = 'moderate';
  else if (dist > 0.015) severity = 'noticeable';
  return { offsetX: avgX, offsetY: avgY, severity };
}

function App() {
  const { gamepads, activeGamepad, connectedCount, activeIndex, setActiveIndex } = useGamepad();
  const [driftData, setDriftData] = useState({});

  const handleDriftUpdate = (stickIndex, x, y) => {
    setDriftData(prev => {
      const key = `${activeIndex}-${stickIndex}`;
      const existing = prev[key] || [];
      const samples = [...existing, { x, y }];
      if (samples.length > DRIFT_SAMPLE_COUNT) samples.shift();
      return { ...prev, [key]: samples };
    });
  };

  const getDriftFor = (stickIndex) => {
    const key = `${activeIndex}-${stickIndex}`;
    return detectDrift(driftData[key]);
  };

  return (
    <div className="app">
      <header className="app-header">
        <h1>Test My Controller</h1>
        <p>
          {connectedCount > 0
            ? `${connectedCount} controller${connectedCount > 1 ? 's' : ''} connected`
            : 'Connect a controller and press any button'}
        </p>
      </header>

      <main className="app-main">
        <ControllerSelector
          gamepads={gamepads}
          activeIndex={activeIndex}
          onSelect={setActiveIndex}
        />

        {connectedCount > 0 ? (
          <>
            <ControllerInfo gamepad={activeGamepad} />
            <ControllerDiagram gamepad={activeGamepad} />
            <ButtonGrid gamepad={activeGamepad} />
            <StickVisualizer
              gamepad={activeGamepad}
              driftData={{
                0: getDriftFor(0),
                1: getDriftFor(1),
              }}
              onDriftUpdate={handleDriftUpdate}
            />
            <TriggerBar gamepad={activeGamepad} />
            <VibrationTester gamepad={activeGamepad} />
            <PollingRate gamepad={activeGamepad} />
            <RawDataPanel gamepad={activeGamepad} />
          </>
        ) : (
          <div className="no-controller">
            <div className="no-controller-icon">🎮</div>
            <h2>No Controller Detected</h2>
            <p>Connect your controller via USB or Bluetooth, then press any button to begin.</p>
            <div className="tips">
              <div className="tip">
                <strong>Compatible with:</strong>
                <span>Xbox, PlayStation, Switch Pro, and most standard gamepads</span>
              </div>
              <div className="tip">
                <strong>Browsers:</strong>
                <span>Chrome, Edge, Firefox recommended</span>
              </div>
              <div className="tip">
                <strong>Troubleshooting:</strong>
                <span>If not detected, try refreshing the page or reconnecting your controller</span>
              </div>
            </div>
          </div>
        )}
      </main>

      <footer className="app-footer">
        Built with the Gamepad API — all processing happens locally in your browser
      </footer>
    </div>
  );
}

export default App;
