"use client";

import { useState, useRef, useEffect, useLayoutEffect, useCallback } from "react";
import { THEMES, THEME_KEYS, isTheme, type Theme, type MusicConfig } from "./themes";

type Phase = "prompt" | "celebrating";
type NoState = "default" | "wiggling" | "sliding" | "gone";

interface Decoration {
  id: number;
  type: "balloon" | "star" | "confetti" | "surprise";
  x: number;
  y: number;
  delay: number;
  duration: number;
  color: string;
  rotate: number;
  size: number;
  dx: number;
  glyph?: string;
}

interface Variations {
  balloon: string;
  star: string;
  hero: string;
  teaseText: string;
  celebrateMarquee: string;
  celebrateCaption: string;
  surprises: string[];
}

function rand(min: number, max: number) {
  return min + Math.random() * (max - min);
}

function pickOne<T>(arr: readonly T[]): T {
  return arr[Math.floor(Math.random() * arr.length)];
}

function pickN<T>(arr: readonly T[], n: number): T[] {
  if (arr.length <= n) return [...arr];
  const pool = [...arr];
  const out: T[] = [];
  for (let i = 0; i < n; i++) {
    const idx = Math.floor(Math.random() * pool.length);
    out.push(pool.splice(idx, 1)[0]);
  }
  return out;
}

function buildShareUrl(nameVal: string, themeVal: Theme): string {
  if (typeof window === "undefined") return "";
  const base = `${window.location.origin}${window.location.pathname}`;
  const params = new URLSearchParams();
  const trimmed = nameVal.trim();
  if (trimmed) params.set("name", trimmed);
  if (themeVal !== "default") params.set("theme", themeVal);
  const qs = params.toString();
  return qs ? `${base}?${qs}` : base;
}

function generateDecorations(palette: string[], surprises: string[]): Decoration[] {
  const list: Decoration[] = [];
  let id = 0;
  const color = () => palette[Math.floor(Math.random() * palette.length)];

  for (let i = 0; i < 6; i++) {
    list.push({
      id: id++, type: "balloon",
      x: rand(5, 95), y: 0,
      delay: rand(0, 2), duration: rand(7, 11),
      color: color(), rotate: rand(-20, 20), size: rand(42, 68), dx: 0,
    });
  }
  for (let i = 0; i < 4; i++) {
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
  const surpriseCount = Math.random() < 0.5 ? 1 : 2;
  for (const glyph of pickN(surprises, surpriseCount)) {
    list.push({
      id: id++, type: "surprise",
      x: rand(10, 90), y: rand(15, 75),
      delay: rand(0, 2), duration: rand(8, 14),
      color: "", rotate: 0, size: rand(48, 72), dx: 0,
      glyph,
    });
  }
  return list;
}

// "Happy Birthday to You" — C major base frequencies
const NOTES: [number, number][] = [
  [392, 0.375], [392, 0.125], [440, 0.5], [392, 0.5], [523.25, 0.5], [493.88, 1],
  [392, 0.375], [392, 0.125], [440, 0.5], [392, 0.5], [587.33, 0.5], [523.25, 1],
  [392, 0.375], [392, 0.125], [783.99, 0.5], [659.25, 0.5], [523.25, 0.5], [493.88, 0.5], [440, 1],
  [698.46, 0.375], [698.46, 0.125], [659.25, 0.5], [523.25, 0.5], [587.33, 0.5], [523.25, 1.5],
];

function playSong(ctx: AudioContext, config: MusicConfig): () => void {
  const master = ctx.createGain();
  master.gain.value = config.masterGain;
  master.connect(ctx.destination);
  const oscs: OscillatorNode[] = [];
  const freqMul = 2 ** (config.transpose / 12);
  const harmonyMul = config.harmonyInterval != null ? 2 ** (config.harmonyInterval / 12) : null;
  let t = ctx.currentTime + 0.05;

  for (const [freq, dur] of NOTES) {
    const scaledDur = dur * config.tempoMul;
    const mFreq = freq * freqMul;

    const osc = ctx.createOscillator();
    const g = ctx.createGain();
    osc.type = config.waveType;
    osc.frequency.value = mFreq;
    g.gain.setValueAtTime(0, t);
    g.gain.linearRampToValueAtTime(0.4, t + 0.02);
    g.gain.linearRampToValueAtTime(0, t + scaledDur * 0.88);
    osc.connect(g);
    g.connect(master);
    osc.start(t);
    osc.stop(t + scaledDur);
    oscs.push(osc);

    if (harmonyMul != null && config.harmonyGain != null) {
      const hosc = ctx.createOscillator();
      const hg = ctx.createGain();
      hosc.type = config.waveType;
      hosc.frequency.value = mFreq * harmonyMul;
      hg.gain.setValueAtTime(0, t);
      hg.gain.linearRampToValueAtTime(config.harmonyGain, t + 0.02);
      hg.gain.linearRampToValueAtTime(0, t + scaledDur * 0.88);
      hosc.connect(hg);
      hg.connect(master);
      hosc.start(t);
      hosc.stop(t + scaledDur);
      oscs.push(hosc);
    }

    t += scaledDur;
  }

  return () => {
    oscs.forEach((o) => { try { o.stop(0); } catch { /* already stopped */ } });
    master.disconnect();
  };
}

function startLoop(ctx: AudioContext, config: MusicConfig): () => void {
  const loopDuration = NOTES.reduce((s, [, d]) => s + d * config.tempoMul, 0) * 1000;
  let stopped = false;
  let stopCurrent: (() => void) | null = null;
  let timer: ReturnType<typeof setTimeout> | null = null;

  const loop = () => {
    if (stopped) return;
    stopCurrent = playSong(ctx, config);
    timer = setTimeout(loop, loopDuration);
  };
  loop();

  return () => {
    stopped = true;
    if (timer) clearTimeout(timer);
    if (stopCurrent) stopCurrent();
  };
}

export default function Home() {
  const [phase, setPhase] = useState<Phase>("prompt");
  const [noState, setNoState] = useState<NoState>("default");
  const [noPressCount, setNoPressCount] = useState(0);
  const [decorations, setDecorations] = useState<Decoration[]>([]);
  const [isPlaying, setIsPlaying] = useState(false);
  const [showBurst, setShowBurst] = useState(false);
  const [name, setName] = useState<string | null>(null);
  const [theme, setTheme] = useState<Theme>("default");
  const [themeIsFixed, setThemeIsFixed] = useState(false);
  useLayoutEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const n = params.get("name")?.trim();
    // eslint-disable-next-line react-hooks/set-state-in-effect
    if (n) setName(n);
    const t = params.get("theme");
    if (isTheme(t)) {
      setTheme(t);
      setThemeIsFixed(true);
    }
  }, []);

  useEffect(() => {
    document.documentElement.dataset.theme = theme;
    return () => { delete document.documentElement.dataset.theme; };
  }, [theme]);

  const themeDef = THEMES[theme];

  const [variations, setVariations] = useState<Variations>(() => ({
    balloon: themeDef.balloons[0],
    star: themeDef.stars[0],
    hero: themeDef.heroes[0],
    teaseText: themeDef.teaseTexts[0],
    celebrateMarquee: themeDef.celebrateMarquees[0],
    celebrateCaption: themeDef.celebrateCaptions[0],
    surprises: themeDef.surpriseStickers.slice(0, 1),
  }));

  useEffect(() => {
    const def = THEMES[theme];
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setVariations({
      balloon: pickOne(def.balloons),
      star: pickOne(def.stars),
      hero: pickOne(def.heroes),
      teaseText: pickOne(def.teaseTexts),
      celebrateMarquee: pickOne(def.celebrateMarquees),
      celebrateCaption: pickOne(def.celebrateCaptions),
      surprises: pickN(def.surpriseStickers, Math.random() < 0.5 ? 1 : 2),
    });
  }, [theme]);

  const marqueeTease = variations.teaseText.repeat(24);
  const marqueeCelebrate = variations.celebrateMarquee.repeat(24);

  const [showShare, setShowShare] = useState(false);
  const [shareName, setShareName] = useState("");
  const [shareTheme, setShareTheme] = useState<Theme>(theme);
  const [copied, setCopied] = useState(false);

  const openShare = useCallback(() => {
    setShareTheme(theme);
    setShowShare(true);
  }, [theme]);

  const pickTheme = useCallback((next: Theme) => {
    setTheme(next);
    if (typeof window !== "undefined") {
      const params = new URLSearchParams(window.location.search);
      if (next === "default") params.delete("theme");
      else params.set("theme", next);
      const qs = params.toString();
      const url = `${window.location.pathname}${qs ? `?${qs}` : ""}`;
      window.history.replaceState(null, "", url);
    }
  }, []);

  const ctxRef = useRef<AudioContext | null>(null);
  const stopLoopRef = useRef<(() => void) | null>(null);

  // Restart music when theme changes mid-play
  useEffect(() => {
    if (!isPlaying || !ctxRef.current) return;
    stopLoopRef.current?.();
    stopLoopRef.current = startLoop(ctxRef.current, THEMES[theme].music);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [theme]);

  const startSong = useCallback((config: MusicConfig) => {
    if (!ctxRef.current) ctxRef.current = new AudioContext();
    const ctx = ctxRef.current;
    if (ctx.state === "suspended") ctx.resume();
    stopLoopRef.current?.();
    stopLoopRef.current = startLoop(ctx, config);
    setIsPlaying(true);
  }, []);

  const stopSong = useCallback(() => {
    stopLoopRef.current?.();
    stopLoopRef.current = null;
    setIsPlaying(false);
  }, []);

  const handleYes = useCallback(() => {
    setDecorations(generateDecorations(themeDef.confettiColors, variations.surprises));
    setPhase("celebrating");
    setShowBurst(true);
    startSong(themeDef.music);
    setTimeout(() => setShowBurst(false), 900);
  }, [startSong, themeDef.confettiColors, themeDef.music, variations.surprises]);

  const handleNo = useCallback(() => {
    if (noState !== "default") return;
    const nextCount = noPressCount + 1;
    setNoPressCount(nextCount);
    setNoState("wiggling");
    setTimeout(() => setNoState("sliding"), 650);
    setTimeout(() => {
      setNoState(nextCount <= themeDef.noEgg.length ? "default" : "gone");
    }, 1100);
  }, [noState, noPressCount, themeDef.noEgg.length]);

  const toggleMusic = useCallback(() => {
    if (isPlaying) stopSong();
    else startSong(themeDef.music);
  }, [isPlaying, startSong, stopSong, themeDef.music]);

  const handleCopy = useCallback(async () => {
    try {
      await navigator.clipboard.writeText(buildShareUrl(shareName, shareTheme));
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // clipboard not available
    }
  }, [shareName, shareTheme]);

  useEffect(() => () => { stopSong(); }, [stopSong]);

  const renderThemePicker = (selected: Theme, onPick: (t: Theme) => void, label = "Vibe") => (
    <div className="theme-picker" role="radiogroup" aria-label="Theme">
      {label && <span className="theme-picker-label">{label}</span>}
      {THEME_KEYS.map((k) => (
        <button
          key={k}
          type="button"
          role="radio"
          aria-checked={selected === k}
          aria-label={THEMES[k].name}
          title={THEMES[k].name}
          onClick={() => onPick(k)}
          className={`theme-swatch${selected === k ? " theme-swatch--active" : ""}`}
          style={{ background: THEMES[k].swatch }}
        />
      ))}
    </div>
  );

  /* ── Prompt screen ── */
  if (phase === "prompt") {
    return (
      <div className="bg-party min-h-screen flex flex-col overflow-hidden relative">
        {/* Marquee bar */}
        <div className="marquee-bar">
          <div className="anim-marquee marquee-text whitespace-nowrap">
            {marqueeTease}
          </div>
        </div>

        {/* Static stickers — telegraph the party in the empty vertical space */}
        <span className="prompt-sticker prompt-sticker--top" aria-hidden="true">
          {variations.star}
        </span>
        <span className="prompt-sticker prompt-sticker--bot" aria-hidden="true">
          {variations.balloon}
        </span>

        {/* Center card */}
        <div className="flex flex-1 items-center justify-center px-6 py-12 relative z-10">
          <div className="card-tilt">
            <div className="card-panel anim-card-rise max-w-sm w-full text-center">
              <h1 className="headline-prompt">
                {name ? <>{name},<br />is it your birthday?</> : <>Is it your<br />birthday?</>}
              </h1>
              <div className="prompt-actions">
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
                    {noState === "sliding"
                      ? "Wrong device."
                      : noPressCount > 0
                        ? themeDef.noEgg[noPressCount - 1]
                        : "No"}
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Bottom-left: theme picker (matches celebration screen layout) */}
        {!themeIsFixed && (
          <div className="corner-bl">
            {renderThemePicker(theme, pickTheme, "")}
          </div>
        )}

        {/* Bottom-right: share */}
        <button
          onClick={openShare}
          className="music-btn corner-br"
          style={{ background: "var(--ink)", color: "var(--cream)" }}
        >
          🔗 Share a link
        </button>
        {showShare && (
          <div className="modal-backdrop" onClick={() => { setShowShare(false); setCopied(false); }}>
            <div className="card-panel modal-card" onClick={(e) => e.stopPropagation()}>
              <button className="modal-close" onClick={() => { setShowShare(false); setCopied(false); }} aria-label="Close">✕</button>
              <h2 className="modal-title">{THEMES[shareTheme].modalTitle}</h2>
              <div className="modal-vibe">
                <label className="modal-label">Pick their vibe</label>
                {renderThemePicker(shareTheme, setShareTheme, "")}
              </div>
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
                  They&apos;ll see: <em>Happy Birthday, {shareName.trim()}! {THEMES[shareTheme].heroes[0]}</em>
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
    <div className="bg-celebrate relative min-h-screen overflow-hidden flex flex-col items-center justify-center">
      {/* Marquee bar */}
      <div className="marquee-bar absolute top-0 left-0 right-0 z-20">
        <div className="anim-marquee marquee-text whitespace-nowrap">
          {marqueeCelebrate}
        </div>
      </div>

      {/* Decorations */}
      <div
        className="absolute inset-0 z-0 pointer-events-none anim-decorations-enter"
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
                {variations.balloon}
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
                {variations.star}
              </span>
            );
          }
          if (d.type === "surprise") {
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
                {d.glyph}
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
          className="anim-bounce-cake select-none mb-1 block"
          style={{ fontSize: "clamp(4rem, 15vw, 6rem)" }}
          role="img"
          aria-label={`${themeDef.name} celebration`}
        >
          {variations.hero}
        </span>
        <h1 className="anim-pop-in headline-celebrate">
          {name ? <>Happy Birthday,<br />{name}!</> : <>Happy<br />Birthday!</>}
        </h1>
        <p className="anim-caption-rise celebrate-caption">
          {variations.celebrateCaption}
        </p>
      </div>

      {/* Theme picker — hidden for recipients who arrived with a ?theme= link */}
      {!themeIsFixed && (
        <div className="corner-bl">
          {renderThemePicker(theme, pickTheme, "")}
        </div>
      )}

      {/* Music toggle */}
      <button
        onClick={toggleMusic}
        aria-label={isPlaying ? "Pause music" : "Play music"}
        className="music-btn corner-br"
      >
        {isPlaying ? "♫ Pause" : "♪ Play"}
      </button>
    </div>
  );
}
