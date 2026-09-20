# Frontend Implementation Plan: Charisma Archetype Assessment Platform

## Target Mode: Experience & Operate
## Design Read: "Reading this as: Experience/Operate assessment platform for self-discovery seekers, communicators, and leaders, with an editorial psychology aesthetic (deep midnight obsidian `#0c0e14`, warm gold accents, luminous archetype jewel tones), clean modern typography (Outfit / Plus Jakarta Sans), and Apple fluid spring transitions."
## Active Dials: Variance: 7 | Motion: 7 | Density: 4

---

### Chunk 1: Visual Foundation & Design Tokens (`app.css`)
- [ ] Establish design tokens: Dark obsidian background (`#0a0c10`), elevated surface cards (`#121620`, `#1a202c`), border sub-pixels (`rgba(255,255,255,0.08)`).
- [ ] Archetype color tokens:
  * Dolphin: Cyan / Aquamarine (`#06b6d4`, `#22d3ee`)
  * Fox: Warm Sunset Amber / Copper (`#f97316`, `#fb923c`)
  * Lion: Imperial Gold / Crimson (`#eab308`, `#f59e0b`)
  * Owl: Emerald Sage (`#10b981`, `#34d399`)
  * Peacock: Electric Violet / Magenta (`#a855f7`, `#c084fc`)
  * Bear / Wolf: Nordic Steel Slate (`#64748b`, `#94a3b8`)
- [ ] Typography scale with Google Fonts (Outfit for headings, Plus Jakarta Sans for UI and copy).
- [ ] Smooth spring physics curves (`cubic-bezier(0.16, 1, 0.3, 1)`).

### Chunk 2: Semantic HTML5 Scaffolding (`index.html`)
- [ ] Accessible container structure:
  * Screen 1: Hero Welcome & Briefing (Domain overview, ~4 min expectation, Begin button).
  * Screen 2: Question Card Wizard (Progress tracker, domain pill, question card, 6 option buttons with keyboard badges).
  * Screen 3: Calculation Loader (Smooth spring micro-animation while computing vectors).
  * Screen 4: Results Dashboard (Hero reveal, hybrid badge, percentage bars, SVG radar chart, shadow advisory, retake & share buttons).
- [ ] Semantic elements, ARIA attributes, keyboard accessibility markers.

### Chunk 3: Client-Side State Machine & Question Wizard (`app.js`)
- [ ] State store: Current question index, responses dictionary, navigation history.
- [ ] Step-by-step transition logic: Smooth card exit and entrance on option selection.
- [ ] Back button functionality: Allow reviewing or modifying past choices.
- [ ] Keyboard shortcuts: Pressing `A`-`F` or `1`-`6` immediately selects the option and advances.

### Chunk 4: Client-Side Scoring Engine & Vector Math (`scoring.js`)
- [ ] Port the mathematical vector aggregation and centroid distance formula from Python to vanilla JavaScript.
- [ ] Calculate:
  * User trait vector across the 4 continuous dimensions.
  * Normalized match percentages for all 6 archetypes.
  * Primary archetype & Secondary hybrid wing detection.
  * Dynamic SVG Trait Radar Chart generation.

### Chunk 5: Dynamic Results Dashboard & Hybrid Blend Presentation
- [ ] Primary Archetype Hero Card with badge, score percentage, subtitle, and signature superpower.
- [ ] Hybrid Wing pill (e.g. "The Strategic Commander [Fox + Lion]").
- [ ] Complete 6-Archetype Distribution Bar with animated progress fills.
- [ ] Actionable Strengths and Stress Shadow Advisory warning box.
- [ ] Copy summary to clipboard & Retake test functionality.

### Chunk 6: Apple Fluid Motion, Keyboard Navigation & Polish Pass
- [ ] Micro-interactions: Hover scale (`scale(1.015)`), active press depth, subtle glowing ring focus.
- [ ] Smooth progress bar fill and step indicator countup.
- [ ] Cross-device responsiveness (mobile touch targets $\ge 48\text{px}$, responsive desktop cards).
- [ ] Final WCAG contrast and keyboard navigation audit.
