import { useLayoutEffect, useRef, useState, type CSSProperties } from 'react';

type Tone = 'lang' | 'tool' | 'other';

interface BubbleFieldProps {
  items: string[];
  tone: Tone;
}

interface BubbleStyle extends CSSProperties {
  '--dur': string;
  '--delay': string;
  '--dx': string;
  '--dy': string;
}

interface PlacedBubble {
  label: string;
  x: number;
  y: number;
  width: number;
  height: number;
  duration: number;
  delay: number;
  dx: number;
  dy: number;
}

interface Size {
  width: number;
  height: number;
}

const MIN_GAP = 10;
const MAX_ATTEMPTS = 60;

interface Box {
  x: number;
  y: number;
  width: number;
  height: number;
}

function overlaps(a: Box, b: Box, gap: number) {
  return (
    a.x < b.x + b.width + gap &&
    a.x + a.width + gap > b.x &&
    a.y < b.y + b.height + gap &&
    a.y + a.height + gap > b.y
  );
}

/** Renders each label with the real bubble styling to get its true pixel size, avoiding guesswork. */
function measureSizes(container: HTMLElement, items: string[]): Size[] {
  const holder = document.createElement('div');
  holder.style.position = 'absolute';
  holder.style.visibility = 'hidden';
  holder.style.pointerEvents = 'none';
  holder.style.top = '0';
  holder.style.left = '0';

  const spans = items.map((label) => {
    const span = document.createElement('span');
    span.className = 'skill-bubble';
    span.style.position = 'static';
    span.style.animation = 'none';
    span.textContent = label;
    holder.appendChild(span);
    return span;
  });

  container.appendChild(holder);
  const sizes = spans.map((span) => ({ width: span.offsetWidth, height: span.offsetHeight }));
  container.removeChild(holder);

  return sizes;
}

function layoutBubbles(
  items: string[],
  sizes: Size[],
  containerWidth: number,
  containerHeight: number,
): PlacedBubble[] {
  const placed: PlacedBubble[] = [];

  items.forEach((label, index) => {
    const { width, height } = sizes[index];
    const maxX = Math.max(0, containerWidth - width);
    const maxY = Math.max(0, containerHeight - height);

    let chosen: { x: number; y: number } | null = null;
    let leastCollisions = Infinity;

    for (let attempt = 0; attempt < MAX_ATTEMPTS; attempt++) {
      const x = Math.random() * maxX;
      const y = Math.random() * maxY;
      const candidate: Box = { x, y, width, height };

      const collisions = placed.reduce((sum, p) => (overlaps(candidate, p, MIN_GAP) ? sum + 1 : sum), 0);

      if (collisions === 0) {
        chosen = { x, y };
        break;
      }
      if (collisions < leastCollisions) {
        leastCollisions = collisions;
        chosen = { x, y };
      }
    }

    const { x, y } = chosen ?? { x: Math.random() * maxX, y: Math.random() * maxY };

    placed.push({
      label,
      x,
      y,
      width,
      height,
      duration: 7 + Math.random() * 6,
      delay: -(Math.random() * 6),
      dx: Math.round((Math.random() - 0.5) * 18),
      dy: Math.round((Math.random() - 0.5) * 18),
    });
  });

  return placed;
}

export default function BubbleField({ items, tone }: BubbleFieldProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [layout, setLayout] = useState<PlacedBubble[]>([]);

  useLayoutEffect(() => {
    const el = containerRef.current;
    if (!el) return;

    const recompute = () => {
      const sizes = measureSizes(el, items);
      setLayout(layoutBubbles(items, sizes, el.clientWidth, el.clientHeight));
    };
    recompute();

    const observer = new ResizeObserver(recompute);
    observer.observe(el);
    return () => observer.disconnect();
  }, [items]);

  return (
    <div className="bubble-field" ref={containerRef}>
      {layout.map((b) => {
        const style: BubbleStyle = {
          top: `${b.y}px`,
          left: `${b.x}px`,
          '--dur': `${b.duration}s`,
          '--delay': `${b.delay}s`,
          '--dx': `${b.dx}px`,
          '--dy': `${b.dy}px`,
        };
        return (
          <span key={b.label} className={`skill-bubble skill-bubble--${tone}`} style={style}>
            {b.label}
          </span>
        );
      })}
    </div>
  );
}
