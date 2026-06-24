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

function App() {
  const { gamepads, activeGamepad, connectedCount, activeIndex, setActiveIndex } = useGamepad();

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
            <StickVisualizer gamepad={activeGamepad} />
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
