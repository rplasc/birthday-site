"use client";

import { useState, useRef, useEffect, useLayoutEffect, useCallback } from "react";

type Phase = "prompt" | "celebrating";
type NoState = "default" | "wiggling" | "sliding" | "gone";

interface Decoration {
  id: number;
  type: "balloon" | "star" | "confetti";
  x: number;
  y: number;
  delay: number;
  duration: number;
  color: string;
  rotate: number;
  size: number;
  dx: number;
}

const COLORS = ["#dc2626", "#2563eb", "#16a34a", "#f59e0b", "#ec4899", "#8b5cf6"];

function rand(min: number, max: number) {
  return min + Math.random() * (max - min);
}

function buildShareUrl(nameVal: string): string {
  if (typeof window === "undefined") return "";
  const base = `${window.location.origin}${window.location.pathname}`;
  const trimmed = nameVal.trim();
  return trimmed ? `${base}?name=${encodeURIComponent(trimmed)}` : base;
}

function generateDecorations(): Decoration[] {
  const list: Decoration[] = [];
  let id = 0;
  const color = () => COLORS[Math.floor(Math.random() * COLORS.length)];

  for (let i = 0; i < 6; i++) {
    list.push({
      id: id++, type: "balloon",
      x: rand(5, 95), y: 0,
      delay: rand(0, 2), duration: rand(7, 11),
      color: color(), rotate: rand(-20, 20), size: rand(42, 68), dx: 0,
    });
  }
  for (let i = 0; i < 8; i++) {
    list.push({
      id: id++, type: "star",
      x: rand(2, 98), y: rand(10, 85),
      delay: rand(0, 1.5), duration: rand(3, 7),
      color: color(), rotate: 0, size: rand(20, 42), dx: 0,
    });
  }
  for (let i = 0; i < 12; i++) {
    list.push({
      id: id++, type: "confetti",
      x: rand(0, 100), y: -2,
      delay: rand(0, 3.5), duration: rand(4, 8),
      color: color(), rotate: rand(0, 360), size: rand(8, 16), dx: rand(-80, 80),
    });
  }
  return list;
}

// "Happy Birthday to You" — C major
const NOTES: [number, number][] = [
  [392, 0.375], [392, 0.125], [440, 0.5], [392, 0.5], [523.25, 0.5], [493.88, 1],
  [392, 0.375], [392, 0.125], [440, 0.5], [392, 0.5], [587.33, 0.5], [523.25, 1],
  [392, 0.375], [392, 0.125], [783.99, 0.5], [659.25, 0.5], [523.25, 0.5], [493.88, 0.5], [440, 1],
  [698.46, 0.375], [698.46, 0.125], [659.25, 0.5], [523.25, 0.5], [587.33, 0.5], [523.25, 1.5],
];

const SONG_DURATION = NOTES.reduce((s, [, d]) => s + d, 0);

function playSong(ctx: AudioContext): () => void {
  const master = ctx.createGain();
  master.gain.value = 0.22;
  master.connect(ctx.destination);
  const oscs: OscillatorNode[] = [];
  let t = ctx.currentTime + 0.05;

  for (const [freq, dur] of NOTES) {
    const osc = ctx.createOscillator();
    const g = ctx.createGain();
    osc.type = "triangle";
    osc.frequency.value = freq;
    g.gain.setValueAtTime(0, t);
    g.gain.linearRampToValueAtTime(0.4, t + 0.02);
    g.gain.linearRampToValueAtTime(0, t + dur * 0.88);
    osc.connect(g);
    g.connect(master);
    osc.start(t);
    osc.stop(t + dur);
    oscs.push(osc);
    t += dur;
  }

  return () => {
    oscs.forEach((o) => { try { o.stop(0); } catch { /* already stopped */ } });
    master.disconnect();
  };
}

function startLoop(ctx: AudioContext): () => void {
  let stopped = false;
  let stopCurrent: (() => void) | null = null;
  let timer: ReturnType<typeof setTimeout> | null = null;

  const loop = () => {
    if (stopped) return;
    stopCurrent = playSong(ctx);
    timer = setTimeout(loop, SONG_DURATION * 1000);
  };
  loop();

  return () => {
    stopped = true;
    if (timer) clearTimeout(timer);
    if (stopCurrent) stopCurrent();
  };
}

const MARQUEE_PARTY = "🎉 HAPPY BIRTHDAY! 🎉   ".repeat(24);
const MARQUEE_TEASE = "✨  It's that time of year...  ✨     ".repeat(24);

export default function Home() {
  const [phase, setPhase] = useState<Phase>("prompt");
  const [noState, setNoState] = useState<NoState>("default");
  const [decorations, setDecorations] = useState<Decoration[]>([]);
  const [isPlaying, setIsPlaying] = useState(false);
  const [showBurst, setShowBurst] = useState(false);
  const [name, setName] = useState<string | null>(null);
  useLayoutEffect(() => {
    const n = new URLSearchParams(window.location.search).get("name")?.trim();
    // eslint-disable-next-line react-hooks/set-state-in-effect
    if (n) setName(n);
  }, []);

  const [showShare, setShowShare] = useState(false);
  const [shareName, setShareName] = useState("");
  const [copied, setCopied] = useState(false);

  const ctxRef = useRef<AudioContext | null>(null);
  const stopLoopRef = useRef<(() => void) | null>(null);

  const startSong = useCallback(() => {
    if (!ctxRef.current) ctxRef.current = new AudioContext();
    const ctx = ctxRef.current;
    if (ctx.state === "suspended") ctx.resume();
    stopLoopRef.current?.();
    stopLoopRef.current = startLoop(ctx);
    setIsPlaying(true);
  }, []);

  const stopSong = useCallback(() => {
    stopLoopRef.current?.();
    stopLoopRef.current = null;
    setIsPlaying(false);
  }, []);

  const handleYes = useCallback(() => {
    setDecorations(generateDecorations());
    setPhase("celebrating");
    setShowBurst(true);
    startSong();
    setTimeout(() => setShowBurst(false), 900);
  }, [startSong]);

  const handleNo = useCallback(() => {
    if (noState !== "default") return;
    setNoState("wiggling");
    setTimeout(() => setNoState("sliding"), 650);
    setTimeout(() => setNoState("gone"), 1100);
  }, [noState]);

  const toggleMusic = useCallback(() => {
    if (isPlaying) stopSong();
    else startSong();
  }, [isPlaying, startSong, stopSong]);

  const handleCopy = useCallback(async () => {
    try {
      await navigator.clipboard.writeText(buildShareUrl(shareName));
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // clipboard not available
    }
  }, [shareName]);

  useEffect(() => () => { stopSong(); }, [stopSong]);

  /* ── Prompt screen ── */
  if (phase === "prompt") {
    return (
      <div className="bg-party min-h-screen flex flex-col overflow-hidden">
        {/* Marquee bar */}
        <div
          className="overflow-hidden"
          style={{ background: "var(--red)", padding: "8px 0" }}
        >
          <div
            className="anim-marquee whitespace-nowrap font-bold tracking-widest text-sm"
            style={{ color: "var(--cream)" }}
          >
            {MARQUEE_TEASE}
          </div>
        </div>

        {/* Center card */}
        <div className="flex flex-1 items-center justify-center px-6 py-12">
          <div className="card-panel anim-card-rise max-w-sm w-full text-center">
            <h1
              className="leading-tight mb-8"
              style={{
                fontFamily: "var(--font-lilita, sans-serif)",
                fontSize: "clamp(2rem, 8vw, 3.25rem)",
                color: "var(--ink)",
              }}
            >
              {name ? <>{name},<br />is it your birthday?</> : <>Is it your<br />birthday?</>}
            </h1>
            <div className="flex items-center justify-center gap-5 flex-wrap">
              <button onClick={handleYes} className="btn-yes">
                Yes
              </button>
              {noState !== "gone" && (
                <button
                  onClick={handleNo}
                  aria-live="polite"
                  className={[
                    "btn-no",
                    noState === "wiggling" ? "anim-wiggle" : "",
                    noState === "sliding" ? "anim-slide-away pointer-events-none" : "",
                  ]
                    .filter(Boolean)
                    .join(" ")}
                >
                  {noState === "sliding" ? "Birthday-specific page." : "No"}
                </button>
              )}
            </div>
          </div>
        </div>
        <button onClick={() => setShowShare(true)} className="music-btn" style={{ position: "fixed", bottom: "1.25rem", left: "1.25rem", background: "var(--ink)" }}>
          🔗 Share a link
        </button>
        {showShare && (
          <div className="modal-backdrop" onClick={() => { setShowShare(false); setCopied(false); }}>
            <div className="card-panel modal-card" onClick={(e) => e.stopPropagation()}>
              <button className="modal-close" onClick={() => { setShowShare(false); setCopied(false); }} aria-label="Close">✕</button>
              <h2 className="modal-title">Send the party! 🎉</h2>
              <label className="modal-label" htmlFor="share-name">Who&apos;s celebrating?</label>
              <input
                id="share-name"
                className="share-input"
                type="text"
                placeholder="Their name (optional)"
                value={shareName}
                onChange={(e) => setShareName(e.target.value)}
                maxLength={40}
              />
              {shareName.trim() && (
                <p className="modal-preview">
                  They&apos;ll see: <em>Happy Birthday, {shareName.trim()}! 🎂</em>
                </p>
              )}
              <button
                className="btn-copy-link"
                onClick={handleCopy}
                style={copied ? { background: "var(--green)" } : undefined}
              >
                {copied ? "✓ Copied! Now send it 🎉" : "🔗 Copy link"}
              </button>
              <button className="btn-maybe-later" onClick={() => { setShowShare(false); setCopied(false); }}>
                maybe later
              </button>
            </div>
          </div>
        )}
      </div>
    );
  }

  /* ── Celebration screen ── */
  return (
    <div
      className="relative min-h-screen overflow-hidden flex flex-col items-center justify-center"
      style={{ background: "var(--bg)" }}
    >
      {/* Marquee bar */}
      <div
        className="absolute top-0 left-0 right-0 overflow-hidden z-20"
        style={{ background: "var(--red)", padding: "8px 0" }}
      >
        <div
          className="anim-marquee whitespace-nowrap font-bold text-base tracking-widest"
          style={{ color: "var(--cream)" }}
        >
          {MARQUEE_PARTY}
        </div>
      </div>

      {/* Decorations */}
      <div
        className="absolute inset-0 z-0 pointer-events-none"
        aria-hidden="true"
      >
        {decorations.map((d) => {
          if (d.type === "balloon") {
            return (
              <span
                key={d.id}
                className="absolute select-none anim-float-up"
                style={{
                  left: `${d.x}%`,
                  top: "100%",
                  fontSize: `${d.size}px`,
                  animationDuration: `${d.duration}s`,
                  animationDelay: `${d.delay}s`,
                  "--rot": `${d.rotate}deg`,
                } as React.CSSProperties}
              >
                🎈
              </span>
            );
          }
          if (d.type === "star") {
            return (
              <span
                key={d.id}
                className="absolute select-none anim-spin-slow"
                style={{
                  left: `${d.x}%`,
                  top: `${d.y}%`,
                  fontSize: `${d.size}px`,
                  animationDuration: `${d.duration}s`,
                  animationDelay: `${d.delay}s`,
                } as React.CSSProperties}
              >
                ⭐
              </span>
            );
          }
          return (
            <div
              key={d.id}
              className="absolute anim-confetti-fall"
              style={{
                left: `${d.x}%`,
                top: `${d.y}%`,
                width: `${d.size}px`,
                height: `${Math.ceil(d.size * 0.4)}px`,
                background: d.color,
                borderRadius: "2px",
                animationDuration: `${d.duration}s`,
                animationDelay: `${d.delay}s`,
                "--rot": `${d.rotate}deg`,
                "--dx": `${d.dx}px`,
              } as React.CSSProperties}
            />
          );
        })}
      </div>

      {/* Burst ring */}
      {showBurst && (
        <div
          className="absolute inset-0 flex items-center justify-center z-10 pointer-events-none"
          aria-hidden="true"
        >
          <div className="burst-ring" />
        </div>
      )}

      {/* Main content */}
      <div className="relative z-10 flex flex-col items-center text-center px-6 pt-20 pb-10">
        <span
          className="anim-bounce-cake select-none mb-4 block"
          style={{ fontSize: "clamp(4rem, 15vw, 6rem)" }}
          role="img"
          aria-label="Birthday cake"
        >
          🎂
        </span>
        <h1
          className="anim-pop-in leading-none mb-5"
          style={{
            fontFamily: "var(--font-lilita, sans-serif)",
            fontSize: "clamp(3.5rem, 15vw, 7rem)",
            color: "var(--ink)",
            textShadow: "4px 4px 0 var(--red)",
          }}
        >
          {name ? <>Happy Birthday,<br />{name}!</> : <>Happy<br />Birthday!</>}
        </h1>
        <p
          className="text-lg font-semibold tracking-wide"
          style={{ color: "var(--ink)", opacity: 0.75 }}
        >
          Certified party mode activated.
        </p>
      </div>

      {/* Music toggle */}
      <button
        onClick={toggleMusic}
        aria-label={isPlaying ? "Pause music" : "Play music"}
        className="music-btn fixed bottom-5 right-5 z-30"
      >
        {isPlaying ? "♫ Pause" : "♪ Play"}
      </button>
    </div>
  );
}
