# Know Your Archetype 🔮

> Discover your dominant magnetic profile and hybrid wings through 18 realistic everyday scenarios across Social, Workplace, and Crisis dynamics.

[![License: MIT](https://img.shields.io/badge/License-MIT-amber.svg)](LICENSE)
[![Design: Obsidian Luminary](https://img.shields.io/badge/Design-Obsidian_Luminary-111827.svg)](DESIGN.md)
[![Zero-Dependency](https://img.shields.io/badge/Dependencies-Zero-emerald.svg)](web/)

---

## 🌟 Overview

True charisma isn’t loud performance—it’s how you handle spontaneous dinner debates, hijacked meetings, and high-stakes emergencies. **Know Your Archetype** replaces self-aggrandizing personality quizzes with an empirical, indirect behavioral assessment engine.

Respondents navigate **18 everyday situational scenarios** to uncover their dominant archetype and secondary hybrid blend:

| Archetype | Symbol | Domain & Core Magnetism | Signature Color |
|---|---|---|---|
| **The Lion** | 🦁 | Commanding authority, solar presence, resolute leadership | `#F59E0B` (Amber Gold) |
| **The Fox** | 🦊 | Strategic wit, rapid agility, perceptive adaptability | `#F97316` (Copper Tangerine) |
| **The Dolphin** | 🐬 | Empathetic resonance, fluid sociability, warm connectivity | `#06B6D4` (Radiant Teal) |
| **The Owl** | 🦉 | Intellectual depth, architectural contemplation, quiet precision | `#6366F1` (Royal Indigo) |
| **The Peacock** | 🦚 | Unapologetic expression, charismatic pull, bold storytelling | `#D946EF` (Magnetic Fuchsia) |
| **The Bear / Wolf** | 🐻 | Grounded stability, steady calm, unconditional trust | `#10B981` (Anchor Emerald) |

---

## ✨ Key Features

- **18 Indirect Scenarios**: Realistic everyday choices testing micro-behaviors (tonality, stillness, empathy, lateral reframing, emotional containment).
- **Multidimensional Continuous Vector Math**: Calculates 4 continuous trait axes (Presence, Authority, Assertiveness, Cooperativeness) combined with 6-dimensional centroid distance mapping.
- **Dynamic Trait Radar Chart**: Web-rendered SVG radar chart displaying your interpersonal vector coordinates with custom glow effects.
- **Stress Shadow Diagnostics**: Pinpoints specific behavioural breakdowns under acute pressure and provides tactical re-centering advice.
- **Tactical Implications Breakdown**: Clear analysis across *How You Influence*, *Where You Thrive*, and *Your Hybrid Dynamic*.
- **Self-Reported Accuracy Calibration**: Interactive 1–10 slider logging directly to Google Sheets for psychometric refinement.
- **Obsidian Luminary Design System**:
  - Editorial authority typography pairing (`Playfair Display` serif headlines + `Plus Jakarta Sans` UI).
  - Commanding Amber (`#F59E0B`) primary CTA pills.
  - Smoked glass elevation tiers with backdrop blur.
  - Seamless dark / light mode toggle with zero invisible text.
- **Serverless Google Sheets Persistence**: Zero-backend architecture dispatching assessment results and accuracy ratings directly to a private Google Sheet via Apps Script webhook.

---

## 🚀 Getting Started

### Local Development

The web app is 100% vanilla HTML, CSS, and JavaScript with zero build steps or npm installations required.

1. **Clone the repository**:
   ```bash
   git clone https://github.com/Prashant1873/KnowYourArchetype.git
   cd KnowYourArchetype
   ```

2. **Serve the static web folder**:
   ```bash
   # Python 3
   python -m http.server 8080 --directory web

   # Or Node.js npx serve
   npx serve web
   ```

3. **Open in browser**:
   Navigate to `http://localhost:8080` (or `http://localhost:3000`).

---

## 📊 Google Sheets Webhook Setup

To store assessment submissions in your own Google Sheet without a backend database:

1. Create a new Google Sheet.
2. Open **Extensions** > **Apps Script**.
3. Paste the lightweight handler provided in [`GOOGLE_SHEETS_SETUP.md`](GOOGLE_SHEETS_SETUP.md).
4. Click **Deploy** > **New Deployment** > **Web App** (Access: *Anyone*).
5. Paste your deployment URL into `web/app.js` under `GOOGLE_SHEET_WEBHOOK_URL`.

See [`GOOGLE_SHEETS_SETUP.md`](GOOGLE_SHEETS_SETUP.md) for step-by-step instructions.

---

## 📁 Project Structure

```
KnowYourArchetype/
├── web/                           # Client-side web application
│   ├── index.html                 # Semantic HTML5 single-page application
│   ├── app.css                    # Obsidian Luminary design system tokens & styles
│   ├── app.js                     # State machine, theme toggle & sheets dispatcher
│   ├── scoring.js                 # Euclidean vector math & SVG radar chart generator
│   ├── data.js                    # 18 scenario items & archetype centroid coordinates
│   ├── logo.svg                   # Calibrated 6-archetype geometric prism logo
│   └── logo.png                   # High-resolution raster logo
├── questionnaire/                 # Scenario database & Python validation tools
│   ├── full_questionnaire.json    # Complete 18-question psychometric bank
│   ├── scoring_engine.py          # Python reference scoring implementation
│   └── test_validation.py         # Test suites for centroids & scoring
├── six_charisma_archetypes_and_traits/ # Deep psychometric research & trait reports
├── DESIGN.md                      # Obsidian Luminary design system specification
├── GOOGLE_SHEETS_SETUP.md         # Guide for setting up Google Sheets webhook
├── great_ideas.md                 # Product direction & conceptual record
└── neural_map.md                  # System architecture & logic map
```

---

## 📄 License

MIT License © 2026 Know Your Archetype.
