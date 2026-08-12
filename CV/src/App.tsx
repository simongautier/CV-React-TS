import { useEffect, useRef, useState } from 'react';
import Sidebar from './components/Sidebar';
import Main from './components/Main';
import LivelyPage from './components/lively/LivelyPage';
import { profile } from './data/cv';
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

  const handleDownloadPdf = async () => {
    const el = cvRef.current;
    const printPage = el?.parentElement;
    if (!el || !printPage) return;

    const previousMode = mode;
    if (previousMode !== 'cv') {
      setMode('cv');
      await new Promise((resolve) => requestAnimationFrame(resolve));
    }

    // html2canvas renders the live DOM and never applies @media print, so the
    // A4 single-page layout has to be forced onto the CV block by hand
    // (mirrors what the 'beforeprint' listener above does for real printing).
    document.body.classList.add('pdf-capture');
    const pageHeightPx = A4_HEIGHT_MM * MM_TO_PX;
    const scale = Math.min(1, pageHeightPx / el.scrollHeight);
    el.style.setProperty('--print-scale', String(scale));
    await new Promise((resolve) => requestAnimationFrame(resolve));

    try {
      const { default: html2pdf } = await import('html2pdf.js');
      const pdf = await html2pdf()
        .set({
          margin: 0,
          image: { type: 'jpeg', quality: 0.98 },
          html2canvas: { scale: 2, useCORS: true },
          jsPDF: { unit: 'mm', format: 'a4', orientation: 'portrait' },
        })
        .from(printPage)
        .toPdf()
        .get('pdf');

      // Sub-pixel rounding in the canvas capture can push the content just
      // past 297mm, leaving a near-blank trailing page — drop it.
      const totalPages = pdf.internal.getNumberOfPages();
      if (totalPages > 1) pdf.deletePage(totalPages);

      pdf.save(`CV_${profile.name.replace(/\s+/g, '_')}.pdf`);
    } finally {
      document.body.classList.remove('pdf-capture');
      if (previousMode !== 'cv') setMode(previousMode);
    }
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
        <button type="button" className="print-btn" onClick={handleDownloadPdf}>
          Télécharger en PDF
        </button>
      </div>

      {mode === 'lively' && <LivelyPage />}

      {/* Always mounted (off-screen when not the active view, positioned in
          place for print/PDF export) so native printing (Ctrl+P) works
          without flipping the visible mode — it just reveals this and hides
          the lively page. The PDF download button briefly switches to this
          mode itself, since html2canvas needs the block on-screen to render it. */}
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
