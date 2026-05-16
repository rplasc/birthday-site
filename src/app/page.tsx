"use client";

import { useState, useRef, useEffect, useLayoutEffect, useCallback } from "react";
import { FormattedMessage, useIntl } from "react-intl";
import { THEMES, THEME_KEYS, isTheme, type Theme, type MusicConfig } from "./themes";
import { DEFAULT_LOCALE, type Locale } from "./i18n/config";
import { useLocale } from "./i18n/useLocale";
import { MESSAGES } from "./i18n/bundles";
import { LanguageSwitcher } from "./components/LanguageSwitcher";

function formatTemplate(template: string, values: Record<string, string>): string {
  return template.replace(/\{(\w+)\}/g, (_, key) => values[key] ?? `{${key}}`);
}

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
  celebrateBottomMarquee: string;
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

function buildShareUrl(nameVal: string, themeVal: Theme, localeVal: Locale): string {
  if (typeof window === "undefined") return "";
  const base = `${window.location.origin}${window.location.pathname}`;
  const params = new URLSearchParams();
  const trimmed = nameVal.trim();
  if (trimmed) params.set("name", trimmed);
  if (themeVal !== "default") params.set("theme", themeVal);
  if (localeVal !== DEFAULT_LOCALE) params.set("lang", localeVal);
  const qs = params.toString();
  return qs ? `${base}?${qs}` : base;
}

// Bias static decorations to the left and right thirds so they frame
// the centered headline instead of stacking on top of it.
function edgeX() {
  return Math.random() < 0.5 ? rand(2, 28) : rand(72, 98);
}
function edgeY() {
  return Math.random() < 0.5 ? rand(6, 32) : rand(58, 88);
}

function generateDecorations(palette: string[], surprises: string[]): Decoration[] {
  const list: Decoration[] = [];
  let id = 0;
  const color = () => palette[Math.floor(Math.random() * palette.length)];

  // Counts kept lean — edge-bias and motion variance carry the chaos,
  // not raw quantity. More decorations past this point becomes noise.
  for (let i = 0; i < 5; i++) {
    list.push({
      id: id++, type: "balloon",
      x: rand(4, 96), y: 0,
      delay: rand(0, 2.2), duration: rand(7, 11),
      color: color(), rotate: rand(-20, 20), size: rand(42, 68), dx: 0,
    });
  }
  for (let i = 0; i < 4; i++) {
    list.push({
      id: id++, type: "star",
      x: edgeX(), y: edgeY(),
      delay: rand(0, 1.5), duration: rand(6, 12),
      color: color(), rotate: 0, size: rand(22, 44), dx: 0,
    });
  }
  for (let i = 0; i < 10; i++) {
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
      x: edgeX(), y: edgeY(),
      delay: rand(0, 2), duration: rand(8, 14),
      color: "", rotate: 0, size: rand(52, 76), dx: 0,
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
  const intl = useIntl();
  const { locale, themeCopy } = useLocale();

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
  const themeCopyCurrent = themeCopy[theme];

  const [variations, setVariations] = useState<Variations>(() => ({
    balloon: themeDef.balloons[0],
    star: themeDef.stars[0],
    hero: themeDef.heroes[0],
    teaseText: themeCopyCurrent.teaseTexts[0],
    celebrateMarquee: themeCopyCurrent.celebrateMarquees[0],
    celebrateBottomMarquee: themeCopyCurrent.celebrateBottomMarquees[0],
    celebrateCaption: themeCopyCurrent.celebrateCaptions[0],
    surprises: themeDef.surpriseStickers.slice(0, 1),
  }));

  useEffect(() => {
    const def = THEMES[theme];
    const copy = themeCopy[theme];
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setVariations({
      balloon: pickOne(def.balloons),
      star: pickOne(def.stars),
      hero: pickOne(def.heroes),
      teaseText: pickOne(copy.teaseTexts),
      celebrateMarquee: pickOne(copy.celebrateMarquees),
      celebrateBottomMarquee: pickOne(copy.celebrateBottomMarquees),
      celebrateCaption: pickOne(copy.celebrateCaptions),
      surprises: pickN(def.surpriseStickers, Math.random() < 0.5 ? 1 : 2),
    });
  }, [theme, themeCopy]);

  const marqueeTease = variations.teaseText.repeat(24);
  const marqueeCelebrate = variations.celebrateMarquee.repeat(24);
  const marqueeCelebrateBottom = variations.celebrateBottomMarquee.repeat(24);

  const [showShare, setShowShare] = useState(false);
  const [shareName, setShareName] = useState("");
  const [shareTheme, setShareTheme] = useState<Theme>(theme);
  const [shareLocale, setShareLocale] = useState<Locale>(locale);
  const [copied, setCopied] = useState(false);

  const openShare = useCallback(() => {
    setShareTheme(theme);
    setShareLocale(locale);
    setShowShare(true);
  }, [theme, locale]);

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
      setNoState(nextCount <= themeCopyCurrent.noEgg.length ? "default" : "gone");
    }, 1100);
  }, [noState, noPressCount, themeCopyCurrent.noEgg.length]);

  const toggleMusic = useCallback(() => {
    if (isPlaying) stopSong();
    else startSong(themeDef.music);
  }, [isPlaying, startSong, stopSong, themeDef.music]);

  const handleCopy = useCallback(async () => {
    try {
      await navigator.clipboard.writeText(buildShareUrl(shareName, shareTheme, shareLocale));
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // clipboard not available
    }
  }, [shareName, shareTheme, shareLocale]);

  useEffect(() => () => { stopSong(); }, [stopSong]);

  const renderThemePicker = (selected: Theme, onPick: (t: Theme) => void, label = "") => (
    <div className="theme-picker" role="radiogroup" aria-label={intl.formatMessage({ id: "theme.aria" })}>
      {label && <span className="theme-picker-label">{label}</span>}
      {THEME_KEYS.map((k) => (
        <button
          key={k}
          type="button"
          role="radio"
          aria-checked={selected === k}
          aria-label={themeCopy[k].name}
          title={themeCopy[k].name}
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

        {/* Center card — intentionally surrounded by empty dotted space.
            The party is "off" here. All sticker chaos lives on the celebration screen. */}
        <div className="flex flex-1 items-center justify-center px-6 py-12 relative z-10">
          <div className="card-tilt">
            <div className="card-panel anim-card-rise max-w-sm w-full text-center">
              <h1 className="headline-prompt">
                {name ? (
                  <>
                    <FormattedMessage id="prompt.title.named.line1" values={{ name }} />
                    <br />
                    <FormattedMessage id="prompt.title.named.line2" />
                  </>
                ) : (
                  <>
                    <FormattedMessage id="prompt.title.anon.line1" />
                    <br />
                    <FormattedMessage id="prompt.title.anon.line2" />
                  </>
                )}
              </h1>
              <div className="prompt-actions">
                <button type="button" onClick={handleYes} className="btn-yes">
                  <FormattedMessage id="prompt.yes" />
                </button>
                {noState !== "gone" && (
                  <button
                    type="button"
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
                      ? intl.formatMessage({ id: "prompt.wrongDevice" })
                      : noPressCount > 0
                        ? themeCopyCurrent.noEgg[noPressCount - 1]
                        : intl.formatMessage({ id: "prompt.no" })}
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Bottom-left: theme picker (hidden for ?theme= recipients) */}
        {!themeIsFixed && (
          <div className="corner-bl">
            {renderThemePicker(theme, pickTheme)}
          </div>
        )}

        {/* Bottom-right: share — author's primary action, sticker-styled to
            stay in the party-store aesthetic without competing with Yes. */}
        <button
          type="button"
          onClick={openShare}
          className="btn-share-trigger corner-br"
        >
          <FormattedMessage id="share.button" />
        </button>
        {showShare && (
          <div className="modal-backdrop" onClick={() => { setShowShare(false); setCopied(false); }}>
            <div className="card-panel modal-card" onClick={(e) => e.stopPropagation()}>
              <button
                type="button"
                className="modal-close"
                onClick={() => { setShowShare(false); setCopied(false); }}
                aria-label={intl.formatMessage({ id: "share.modal.close" })}
              >
                ✕
              </button>
              <h2 className="modal-title">{themeCopy[shareTheme].modalTitle}</h2>
              <div className="modal-vibe">
                <label className="modal-label">
                  <FormattedMessage id="share.modal.vibeLabel" />
                </label>
                {renderThemePicker(shareTheme, setShareTheme)}
              </div>
              <div className="modal-lang">
                <label className="modal-label">
                  <FormattedMessage id="share.modal.langLabel" />
                </label>
                <LanguageSwitcher value={shareLocale} onChange={setShareLocale} />
              </div>
              <label className="modal-label" htmlFor="share-name">
                <FormattedMessage id="share.modal.nameLabel" />
              </label>
              <input
                id="share-name"
                className="share-input"
                type="text"
                placeholder={intl.formatMessage({ id: "share.modal.namePlaceholder" })}
                value={shareName}
                onChange={(e) => setShareName(e.target.value)}
                maxLength={40}
              />
              {shareName.trim() && (
                <div className="modal-preview-card">
                  <span className="modal-preview-stamp">
                    <FormattedMessage id="share.modal.previewStamp" />
                  </span>
                  <em
                    key={`${shareLocale}-${shareTheme}`}
                    className="modal-preview-greeting"
                  >
                    {formatTemplate(MESSAGES[shareLocale]["share.modal.previewGreeting"], {
                      name: shareName.trim(),
                      hero: THEMES[shareTheme].heroes[0],
                    })}
                  </em>
                </div>
              )}
              <button
                type="button"
                className="btn-copy-link"
                onClick={handleCopy}
                style={copied ? { background: "var(--green)" } : undefined}
              >
                <FormattedMessage id={copied ? "share.modal.copied" : "share.modal.copy"} />
              </button>
              <button
                type="button"
                className="btn-maybe-later"
                onClick={() => { setShowShare(false); setCopied(false); }}
              >
                <FormattedMessage id="share.modal.maybeLater" />
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
      {/* Top marquee — red, right-scrolling, 14s. */}
      <div className="marquee-bar absolute top-0 left-0 right-0 z-20">
        <div className="anim-marquee marquee-text whitespace-nowrap">
          {marqueeCelebrate}
        </div>
      </div>

      {/* Bottom marquee — blue (theme accent-2), left-scrolling, 18s.
          Frames the centered hero stack between two motion bands so the
          celebration reads as edge-to-edge, not just "centered column." */}
      <div className="marquee-bar marquee-bar--bottom">
        <div className="anim-marquee-reverse marquee-text whitespace-nowrap">
          {marqueeCelebrateBottom}
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
        {/* 8-point starburst — 90s greeting-card POW badge framing the headline.
            Tinted with the theme's dominant accent, rotates slowly. */}
        <svg
          className="hero-starburst"
          viewBox="0 0 200 200"
          aria-hidden="true"
          focusable="false"
        >
          <polygon points="100,5 114.5,64.9 167.2,32.8 135.1,85.4 195,100 135.1,114.6 167.2,167.2 114.5,135.1 100,195 85.5,135.1 32.8,167.2 64.9,114.6 5,100 64.9,85.4 32.8,32.8 85.5,64.9" />
        </svg>
        <span
          className="hero-glyph anim-bounce-cake select-none mb-1 block"
          role="img"
          aria-label={intl.formatMessage(
            { id: "celebrate.heroAria" },
            { themeName: themeCopyCurrent.name },
          )}
        >
          {variations.hero}
        </span>
        <h1 className="anim-pop-in headline-celebrate">
          {name ? (
            <>
              <FormattedMessage id="celebrate.title.named.line1" />
              <br />
              <FormattedMessage id="celebrate.title.named.line2" values={{ name }} />
            </>
          ) : (
            <>
              <FormattedMessage id="celebrate.title.anon.line1" />
              <br />
              <FormattedMessage id="celebrate.title.anon.line2" />
            </>
          )}
        </h1>
        <p className="anim-caption-rise celebrate-caption">
          {variations.celebrateCaption}
        </p>
      </div>

      {/* Bottom-left: theme picker (hidden for ?theme= recipients) */}
      {!themeIsFixed && (
        <div className="corner-bl">
          {renderThemePicker(theme, pickTheme)}
        </div>
      )}

      {/* Music toggle */}
      <button
        type="button"
        onClick={toggleMusic}
        aria-label={intl.formatMessage({ id: isPlaying ? "music.pauseLabel" : "music.playLabel" })}
        className="music-btn corner-br"
      >
        <FormattedMessage id={isPlaying ? "music.pause" : "music.play"} />
      </button>
    </div>
  );
}
