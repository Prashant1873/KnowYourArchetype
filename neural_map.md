# Neural Logic Map: Know Your Archetype

```mermaid
graph TD
    Research["Empirical Research (25 Verified DPs in results/)"] --> ItemBank["18 Indirect Scenarios (full_questionnaire.json)"]
    ItemBank --> WebApp["Interactive Web Assessment Platform"]
    
    subgraph FrontendPlatform ["Frontend Architecture (Vanilla HTML/CSS/ES6)"]
        ThemeToggle["Theme Controller (OLED Black / Porcelain Light Mode)"]
        Welcome["Hero Screen (Briefing, Identity Capture & Anon Mode)"]
        Wizard["Sequential Question Card Engine (One-at-a-Time)"]
        KeyboardNav["Keyboard Handler (A-F Keys, Arrow Navigation)"]
        State["Client State Store (Responses, Step, Progress, Theme)"]
        ScoringJS["Scoring Algorithm in JS (Centroid Distance, Vector Aggregation)"]
        Results["Dynamic Results View (Primary + Secondary Blend, Radar Chart, Shadow Advisory, Implications Card, Accuracy Slider)"]
    end
    
    subgraph PersistenceLayer ["Persistence Layer (Direct Google Sheets Webhook)"]
        Sheets["Google Sheets (Appends Row via doPost Apps Script)"]
        OwnerView["Google Sheet Dashboard (Live Results, Accuracy Rating Column, Zero Server)"]
    end
    
    WebApp --> ThemeToggle
    WebApp --> Welcome
    Welcome --> Wizard
    Wizard <--> KeyboardNav
    Wizard --> State
    State --> ScoringJS
    ScoringJS --> Results
    Results -.->|POST mode:no-cors (Initial + Accuracy Update)| Sheets
    Sheets --> OwnerView
```

## System Topology & State
- **Active Module**: `serverless_assessment_platform`
- **Design System**: Obsidian Luminary (`DESIGN.md`)
  - Headlines: `Playfair Display` serif
  - Body & UI: `Plus Jakarta Sans`
  - Primary CTA: Commanding Amber (`#F59E0B`) pill with dark text
  - Eyebrows: Removed throughout platform for pure editorial minimalism
- **Themes**:
  - Obsidian Midnight Dark (`#0B0F17`) with smoked glassmorphism cards and archetype radial glows.
  - High-Contrast Porcelain Light (`#F8FAFC`) with deep obsidian typography (`#090D16`), fixing previous white text issues.
- **Features**:
  - Name / Email capture with "Stay anonymous" option on welcome screen.
  - 18 sequential question cards with Next / Previous buttons and keyboard shortcuts (A–F, Enter ↵, Arrow keys).
  - "What Your Result Implies" breakdown (How You Influence, Where You Thrive, Hybrid Dynamic).
  - 1-10 Accuracy slider logging directly to Google Sheets column `Accuracy Rating (1-10)`.
- **Persistence**: Google Sheets Webhook via Google Apps Script (`doPost`). Real-time spreadsheet entry on completion.
- **Hosting**: Zero-server static hosting on GitHub Pages or Vercel.


