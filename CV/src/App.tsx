import { useState } from 'react';
import Sidebar from './components/Sidebar';
import Main from './components/Main';
import LivelyPage from './components/lively/LivelyPage';
import './App.css';

type Mode = 'lively' | 'cv';

function App() {
  const [mode, setMode] = useState<Mode>('lively');

  const handlePrint = () => {
    setMode('cv');
    requestAnimationFrame(() => requestAnimationFrame(() => window.print()));
  };

  return (
    <>
      <div className="mode-bar">
        <button
          type="button"
          className="mode-toggle"
          onClick={() => setMode((m) => (m === 'lively' ? 'cv' : 'lively'))}
        >
          {mode === 'lively' ? 'Vue CV' : 'Vue vivante'}
        </button>
        <button type="button" className="print-btn" onClick={handlePrint}>
          Exporter en PDF
        </button>
      </div>

      {mode === 'lively' ? (
        <LivelyPage />
      ) : (
        <div className="cv">
          <Sidebar />
          <Main />
        </div>
      )}
    </>
  );
}

export default App;
