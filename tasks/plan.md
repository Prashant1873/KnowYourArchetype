# Implementation Plan: Interactive Charisma Assessment Web Platform

## Overview
Build a sleek, responsive, zero-dependency client-side web application to deliver the 18-scenario charisma assessment. The platform guides the user one question at a time with smooth micro-animations and keyboard shortcuts (A-F), runs the mathematical scoring engine directly in the browser, and renders a rich Results Dashboard with the Primary Archetype, Secondary Hybrid Wing, full 6-archetype percentage breakdown, dynamic SVG trait radar chart, and stress-induced shadow warning.

## Architecture Decisions
1. **Zero-Dependency Vanilla Web Stack (HTML5 + Modern CSS + ES6 JavaScript)**:
   - Eliminates build step fragility, npm vulnerabilities, and complex dev server setup.
   - Instantly runnable in any modern web browser via direct file opening or local static server.
   - Extreme performance: <50ms load time, 60fps hardware-accelerated CSS animations.
2. **Editorial Dark Aesthetic (Midnight Obsidian & Luminous Jewel Tones)**:
   - Deep obsidian background (`#0a0c10`), high-contrast typographic hierarchy using Google Fonts (*Outfit* for headings, *Plus Jakarta Sans* for body).
   - Bespoke color tokens for each of the 6 archetypes (Cyan, Amber, Imperial Gold, Emerald, Violet, Slate).
3. **One-Question-At-A-Time Step Flow (Card Wizard)**:
   - Single active question in view to maintain complete cognitive focus.
   - Dynamic top bar with live progress fill, question counter, and domain badge ("Social & Casual", "Workplace Dynamics", "Crisis Dilemmas").
   - Instant auto-advance with a smooth spring transition upon option selection.
   - Keyboard navigation support (`A`-`F` / `1`-`6` keys and Back arrow).
4. **Client-Side Mathematical Scoring Engine**:
   - Direct translation of the verified Python vector aggregation algorithm to JavaScript (`scoring.js`).
   - Generates primary/secondary classification, full percentage distribution, and inline SVG trait radar without external charting libraries.

## Task Breakdown (Chunkwise Execution)

### Chunk 1: Visual Design Tokens & Foundation (`app.css`)
- [ ] Establish HSL variables, dark mode palette, archetype accents, and typography tokens.
- [ ] Build spring animation keyframes (`slideIn`, `fadeIn`, `pulseBadge`, `fillBar`).

### Chunk 2: Semantic HTML5 Structure (`index.html`)
- [ ] Hero Welcome screen with assessment briefing and Start CTA.
- [ ] Question Wizard screen with progress bar, domain badge, scenario card, and 6 option buttons with keyboard badges.
- [ ] Calculation transition screen.
- [ ] Results Dashboard container (hero archetype banner, hybrid pill, breakdown bars, SVG radar chart, shadow alert box, action buttons).

### Chunk 3: Assessment State Machine & Wizard (`app.js`)
- [ ] Embed the 18 questions and centroids directly into client data store.
- [ ] Implement card transition, progress update, back navigation, and response history.
- [ ] Add keyboard listeners for rapid single-stroke selection (`A`-`F` / `1`-`6`).

### Chunk 4: Client-Side Scoring Engine & Vector Aggregator (`scoring.js`)
- [ ] Implement multi-dimensional vector averaging, centroid distance, and weighted percentage normalization.
- [ ] Generate dynamic SVG radar polygon coordinates based on the user's 4 trait axes.

### Chunk 5: Dynamic Results Rendering & Interaction
- [ ] Render primary archetype hero reveal with signature superpower and score percentage.
- [ ] Render secondary hybrid wing badge (e.g. "The Strategic Commander [Fox + Lion]").
- [ ] Render animated distribution bars for all 6 archetypes.
- [ ] Render tailored Stress Shadow warning.
- [ ] Add "Copy Result Summary" and "Retake Assessment" features.

### Chunk 6: Apple Fluid Motion & Verification
- [ ] Polish hover, active, and focus-visible states.
- [ ] Validate across screen widths (desktop, tablet, mobile).
- [ ] Test end-to-end user completion flow in browser.

## Verification Plan
- Launch local static server and test end-to-end assessment completion.
- Verify that selecting pure persona answers (e.g. all C's) produces expected results (>70% Lion).
- Verify keyboard navigation works smoothly.
- Test responsive viewports on desktop and mobile.
