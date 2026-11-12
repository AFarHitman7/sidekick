# Sidekick landing page

A single-page concept site for the Sidekick companion display. React 19 + Vite + Tailwind v4 + Motion, with a real Blender export in a React Three Fiber hero.

## Run

```bash
cd web
npm install
npm run dev
```

Production build:

```bash
npm run build
npm run preview
```

## Rebuild the product assets

The 3D model and image plates are generated from the design source, not hand-drawn.

```bash
# GLB for the interactive hero (from the repo root)
blender -b design/sidekick.blend --python tools/export_glb.py
# writes web/public/models/sidekick.glb

# Web image plates and the social card
python tools/make_web_images.py
# writes web/public/renders/*.webp
```

The four colourway plates share one object-fitted crop so the lookbook grid reads at a consistent scale.

## Structure

- `src/components/Hero.tsx`: asymmetric hero, finish state, 3D stage
- `src/components/StageCanvas.tsx`: lazy-loaded R3F scene, materials, lighting
- `src/components/ProductStage.tsx`: stage shell, finish switch, loader, WebGL fallback
- `src/components/WindowSection.tsx`: scroll-linked ninety-second window
- `src/components/ObjectSection.tsx`: front render with interactive anatomy hotspots
- `src/components/RefusalSection.tsx`: the published refusal list
- `src/components/FinishesSection.tsx`: four material stories
- `src/components/PriceSection.tsx`: price, promises, full-width spec grid
- `src/components/WaitlistSection.tsx`: validated demo waitlist with loading, error, success
- `src/lib/palettes.ts`: the four colourways shared by the DOM and the 3D materials

## Decisions

- **One theme.** The page is locked to the warm studio palette. A dark mode would fight the product's material identity and the studio renders, so the theme is deliberately single.
- **No backend.** The waitlist validates and stores only in `localStorage`; the success state says so. Nothing is sent.
- **3D is progressive.** The R3F chunk is lazy. A WebGL probe, an error boundary, and a render poster cover no-WebGL and load failure.
- **Reduced motion.** The model intro, autorotation, reveals, and the scroll-linked window all collapse or stop under `prefers-reduced-motion`.
