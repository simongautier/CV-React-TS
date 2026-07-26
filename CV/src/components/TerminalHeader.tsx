import { useEffect, useState } from 'react';
import { profile } from '../data/cv';

interface Command {
  cmd: string;
  output: string;
  variant: 'name' | 'role' | 'summary';
}

interface TerminalHeaderProps {
  /** Set to false for a static, instantly-rendered header (used by the printable CV view). */
  animate?: boolean;
}

const commands: Command[] = [
  { cmd: 'whoami', output: profile.name, variant: 'name' },
  { cmd: 'cat role.txt', output: profile.title, variant: 'role' },
  { cmd: 'cat summary.txt', output: profile.summary, variant: 'summary' },
];

const CHAR_DELAY = 28;
const OUTPUT_DELAY = 250;
const LINE_GAP = 350;

export default function TerminalHeader({ animate = true }: TerminalHeaderProps) {
  const prefersReducedMotion =
    typeof window !== 'undefined' &&
    window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const skipAnimation = !animate || prefersReducedMotion;

  const [step, setStep] = useState(skipAnimation ? commands.length : 0);
  const [typed, setTyped] = useState('');
  const [outputShown, setOutputShown] = useState(commands.map(() => skipAnimation));
  const [done, setDone] = useState(skipAnimation);

  useEffect(() => {
    if (skipAnimation || step >= commands.length) {
      if (step >= commands.length) setDone(true);
      return;
    }

    const cmd = commands[step].cmd;

    if (typed.length < cmd.length) {
      const t = setTimeout(() => setTyped(cmd.slice(0, typed.length + 1)), CHAR_DELAY);
      return () => clearTimeout(t);
    }

    const revealTimer = setTimeout(() => {
      setOutputShown((prev) => prev.map((v, i) => (i === step ? true : v)));
    }, OUTPUT_DELAY);

    const advanceTimer = setTimeout(() => {
      setStep((s) => s + 1);
      setTyped('');
    }, OUTPUT_DELAY + LINE_GAP);

    return () => {
      clearTimeout(revealTimer);
      clearTimeout(advanceTimer);
    };
  }, [step, typed, skipAnimation]);

  return (
    <header className="header">
      <div className="terminal-window">
        <div className="terminal-bar">
          <span className="dot dot-red" />
          <span className="dot dot-yellow" />
          <span className="dot dot-green" />
          <span className="terminal-title">simon@security:~</span>
        </div>
        <div className="terminal-body">
          {commands.map((c, i) => {
            if (i > step) return null;
            const isTyping = i === step && !skipAnimation && typed.length < c.cmd.length;
            const cmdText = i === step && !skipAnimation ? typed : c.cmd;

            return (
              <div className="terminal-line" key={c.cmd}>
                <p className="terminal-cmd">
                  <span className="prompt">$</span> {cmdText}
                  {isTyping && <span className="cursor" />}
                </p>
                {outputShown[i] && (
                  <p
                    className={`terminal-output terminal-output--${c.variant} ${
                      animate ? 'terminal-output--enter' : ''
                    }`}
                  >
                    {c.output}
                  </p>
                )}
              </div>
            );
          })}
          {done && animate && <span className="cursor cursor-standalone" />}
        </div>
      </div>
    </header>
  );
}
