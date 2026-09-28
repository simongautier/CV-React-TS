import { useEffect, useRef, useState } from 'react';
import Sidebar from './components/Sidebar';
import Main from './components/Main';
import LivelyPage from './components/lively/LivelyPage';
import { profile } from './data/cv';
import './App.css';
import './print.css';

type Mode = 'lively' | 'cv';

const A4_WIDTH_MM = 210;
const A4_HEIGHT_MM = 297;
const MM_TO_PX = 96 / 25.4;
const PRINT_FONT_MAX_PX = 16;
const PRINT_FONT_MIN_PX = 8;

const nextFrame = () => new Promise<void>((resolve) => requestAnimationFrame(() => resolve()));

// Finds the largest font-size (in the [MIN, MAX] range) that still lets the
// CV's natural content height fit within one A4 page — starting big and
// shrinking only as needed means a short CV fills the page with readable
// text instead of sitting cramped at a fixed small size with the .cv block's
// min-height (297mm, print.css) just padding out the rest with blank
// background. A long CV still shrinks down (never scaled/transformed, so no
// blank side margins) until it fits, down to MIN as a last resort.
// Returns the CV's true (unclamped) content height in px at whatever
// font-size the search settles on, for callers that need to know how many
// pages the content actually needs.
function fitPrintContent(el: HTMLElement): number {
  const root = document.documentElement;
  // A couple of px of slack so sub-pixel rounding in the canvas capture
  // (html2canvas scales everything by 2x, see handleDownloadPdf) can never
  // push the result a hair past the page and spill onto a second page.
  const pageHeightPx = A4_HEIGHT_MM * MM_TO_PX - 2;

  // print.css's `.cv { min-height: 297mm }` (so a short CV's sidebar/main
  // backgrounds still fill the page) clamps scrollHeight to one page's
  // worth from the very first size tried, so the "does it fit?" check below
  // would never see the content shrink — it'd just run to PRINT_FONT_MIN_PX
  // every time. Suspending it here exposes the real content height for the
  // search; it's restored right after so the page still gets filled.
  //
  // It's also why callers must use THIS return value, not a later
  // `el.scrollHeight` read — once min-height is restored, scrollHeight is
  // clamped to ~297mm even for content that comfortably fits, and browsers
  // round scrollHeight up to the nearest px, so that clamped value can land
  // a hair above one page's worth in mm and make a later page-count
  // calculation think a second page is genuinely needed.
  el.style.setProperty('min-height', '0', 'important');
  let contentHeightPx = el.scrollHeight;
  for (let size = PRINT_FONT_MAX_PX; size >= PRINT_FONT_MIN_PX; size -= 0.5) {
    root.style.setProperty('--print-font-size', `${size}px`);
    contentHeightPx = el.scrollHeight;
    if (contentHeightPx <= pageHeightPx) break;
  }
  el.style.removeProperty('min-height');
  return contentHeightPx;
}

function App() {
  const [mode, setMode] = useState<Mode>('lively');
  const cvRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const applyPrintFit = () => {
      const el = cvRef.current;
      if (el) fitPrintContent(el);
    };
    const resetPrintFit = () => {
      document.documentElement.style.removeProperty('--print-font-size');
    };

    window.addEventListener('beforeprint', applyPrintFit);
    window.addEventListener('afterprint', resetPrintFit);
    return () => {
      window.removeEventListener('beforeprint', applyPrintFit);
      window.removeEventListener('afterprint', resetPrintFit);
    };
  }, []);

  const handleDownloadPdf = async () => {
    const el = cvRef.current;
    const printPage = el?.parentElement;
    if (!el || !printPage) return;

    const previousMode = mode;
    if (previousMode !== 'cv') {
      setMode('cv');
      // A single rAF isn't reliably enough here: switching mode unmounts the
      // whole LivelyPage tree (its own effects/observers included) and
      // un-offscreens the CV block in the same commit, and that settling
      // can still be in progress one frame later — fitPrintContent would
      // then measure a transitional layout instead of the final one. Two
      // frames (the standard "wait for layout to actually settle" pattern)
      // reliably lands after the browser has painted the committed change.
      await nextFrame();
      await nextFrame();
    }

    // Fonts loading after the fit/measure step below (e.g. mid-swap when the
    // button is clicked early, or finishing during the html2pdf.js dynamic
    // import further down) reflow the text taller *after* it was already
    // measured and clamped to one page — html2canvas then captures that
    // taller, since-grown content and it spills onto a second page.
    await document.fonts.ready;

    // html2canvas renders the live DOM and never applies @media print, so the
    // A4 layout (full width, tightened spacing to fit one page) has to be
    // forced onto the CV block by hand — mirrors what the print stylesheet
    // does for native printing.
    document.documentElement.classList.add('pdf-capture');
    await nextFrame();
    await nextFrame();
    const contentHeightPx = fitPrintContent(el);

    try {
      const { default: html2pdf } = await import('html2pdf.js');
      // On mobile the print page (forced to A4 width) is wider than the
      // actual browser viewport. Without explicit window dimensions,
      // html2canvas captures relative to window.innerWidth/innerHeight and
      // misaligns/clips the wide, tall element.
      const pageWidthPx = A4_WIDTH_MM * MM_TO_PX;
      // html2pdf.js supports `pagebreak` at runtime but its bundled types omit
      // it, so this is assembled as a plain object rather than inlined into
      // `.set()` to avoid TS's excess-property check on object literals.
      const pdfOptions = {
        margin: 0,
        image: { type: 'jpeg', quality: 0.98 },
        html2canvas: {
          scale: 2,
          useCORS: true,
          windowWidth: pageWidthPx,
          windowHeight: el.scrollHeight,
          scrollX: 0,
          scrollY: 0,
        },
        jsPDF: { unit: 'mm', format: 'a4', orientation: 'portrait' },
        pagebreak: { mode: ['css', 'legacy'] },
      } as const;
      const pdf = await html2pdf()
        .set(pdfOptions)
        .from(printPage)
        .toPdf()
        .get('pdf');

      // Sub-pixel rounding in the canvas capture can push the content just
      // past a page boundary, leaving a near-blank trailing page — drop it,
      // but only if it's genuinely beyond what the content needs. Uses the
      // unclamped height fitPrintContent measured, not el.scrollHeight here
      // (see that function's comment for why that would misfire).
      const contentHeightMM = contentHeightPx / MM_TO_PX;
      const expectedPages = Math.max(1, Math.ceil(contentHeightMM / A4_HEIGHT_MM));
      const totalPages = pdf.internal.getNumberOfPages();
      if (totalPages > expectedPages) pdf.deletePage(totalPages);

      pdf.save(`CV_${profile.name.replace(/\s+/g, '_')}.pdf`);
    } finally {
      document.documentElement.classList.remove('pdf-capture');
      document.documentElement.style.removeProperty('--print-font-size');
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
