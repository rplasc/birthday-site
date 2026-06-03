# Birthday Site

A single-page birthday greeting app. Send someone a link; they click Yes, confetti falls, "Happy Birthday!" appears, and a chiptune plays.

## Features

- Shareable links with name, theme, and language in the URL (`?name=Ana&theme=pink&lang=es`)
- 4 themes: Default, Pink, Mint, Lavender
- English and Spanish, auto-detected from the browser and overridable in the share modal
- Birthday song via Web Audio API (no audio files)
- `prefers-reduced-motion` collapses all animations and transitions

## Getting started

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## URL parameters

- `name`: recipient's name, up to 40 characters
- `theme`: `default`, `pink`, `mint`, or `lavender`
- `lang`: `en` or `es`

## Stack

Next.js 16, React 19, TypeScript, Tailwind CSS v4, react-intl.
