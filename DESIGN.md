# Design Brief — QTrack

## Purpose
Academic question tracking app for JEE preparation. Users solve question banks grouped by chapters/levels and track progress through color-coded status cells.

## Visual Direction
**Tone**: Brutalist restraint. Zero decoration. Data density prioritized over whitespace. Function shapes every pixel.
**Differentiation**: The question grid IS the interface. Header minimal, detail panel contextual. Status colors are the only visual language.
**Theme**: Dark mode with neutral greys and precise semantic accent colors.

## Color Palette

| Token | Light | Dark | OKLCH |
| --- | --- | --- | --- |
| Background | - | #0F1419 | 0.08 0 0 |
| Card | - | #1A1F28 | 0.12 0 0 |
| Foreground | - | #EDEEF2 | 0.93 0 0 |
| Border | - | #2A3038 | 0.2 0 0 |
| Primary (accent) | - | #7367E7 | 0.65 0.14 260 |
| Status: Solved | - | #6FD863 | 0.58 0.24 132 |
| Status: Incorrect | - | #F85959 | 0.6 0.21 18 |
| Status: Revisit | - | #E8D359 | 0.75 0.28 88 |
| Status: Unattempted | - | #505A6F | 0.35 0 0 |

## Typography
- **Display**: Space Grotesk (clean, modern geometric sans)
- **Body**: Nunito (readable, friendly, optimized for small sizes)
- **Mono**: JetBrains Mono (code, metadata, timestamps)

## Elevation & Depth
- Card backgrounds rise 1 layer on page (0.12 L vs 0.08 L bg)
- Subtle shadows for bottom panels / modals (0 4px 12px rgba(0,0,0,0.15))
- No glows, no gradients

## Structural Zones

| Zone | Treatment | Purpose |
| --- | --- | --- |
| Header | Minimal bar, border-bottom, 0.12 bg | App title + filter toggle + quick stats |
| Grid Container | Full-width scrollable, 0.08 bg | Question cells in responsive rows |
| Detail Panel | Right panel (web) / full-screen (mobile), 0.12 bg | Question notes, tags, metadata |
| Footer | Minimal if needed, border-top | Context/help hints |

## Spacing & Rhythm
- Grid gap: 8px (compact, touch-friendly on mobile)
- Padding: 12px (header), 16px (panels)
- No large whitespace; density communicates urgency

## Component Patterns
- Question cells: colored background with number text, no border (color is enough)
- Progress bars: segmented by status (green%, red%, yellow%, grey%)
- Filter chips: toggles, active = primary color
- Detail panel: scrollable stack of input fields + tags

## Motion
- Tap → cell highlight + panel slide-in (0.2s ease-out)
- Status change → subtle color shift + brief scale pulse (0.15s)
- No entrance animations on page load

## Constraints
- No animations on question grid (performance on mobile)
- Touch targets ≥48px
- Color contrast ≥4.5:1 foreground on all backgrounds

## Signature Detail
Status colors are the ONLY visual feedback. No badges, no icons. Grid simplicity is the differentiator.
