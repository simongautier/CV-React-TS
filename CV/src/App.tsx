import { useEffect, useRef, useState } from 'react';
import Sidebar from './components/Sidebar';
import Main from './components/Main';
import LivelyPage from './components/lively/LivelyPage';
import './App.css';

type Mode = 'lively' | 'cv';

const A4_HEIGHT_MM = 297;
const MM_TO_PX = 96 / 25.4;

function App() {
  const [mode, setMode] = useState<Mode>('lively');
  const cvRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const applyPrintScale = () => {
      const el = cvRef.current;
      if (!el) return;
      const pageHeightPx = A4_HEIGHT_MM * MM_TO_PX;
      const scale = Math.min(1, pageHeightPx / el.scrollHeight);
      el.style.setProperty('--print-scale', String(scale));
    };

    window.addEventListener('beforeprint', applyPrintScale);
    return () => window.removeEventListener('beforeprint', applyPrintScale);
  }, []);

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
        <button type="button" className="print-btn" onClick={() => window.print()}>
          Exporter en PDF
        </button>
      </div>

      {mode === 'lively' && <LivelyPage />}

      {/* Always mounted (off-screen when not the active view, positioned in
          place for print) so the PDF export never has to flip the visible
          screen mode — printing just reveals this and hides the lively page. */}
      <div className={`print-page ${mode === 'cv' ? '' : 'print-page--offscreen'}`}>
        <div className="cv" ref={cvRef}>
          <Sidebar />
          <Main />
        </div>
      </div>
    </>
  );
}

export default App;
