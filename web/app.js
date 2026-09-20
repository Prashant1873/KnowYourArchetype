/**
 * Know Your Archetype - Application Controller
 * Zero-dependency state machine, fluid card navigation, and dynamic results visualization.
 */

(function() {
  'use strict';

  // State
  let questions = [];
  let centroids = {};
  let currentIndex = 0;
  let userAnswers = {}; // { 'Q01': 'A', ... }
  let lastResult = null;

  // DOM Elements
  const screens = {
    welcome: document.getElementById('screen-welcome'),
    wizard: document.getElementById('screen-wizard'),
    loader: document.getElementById('screen-loader'),
    results: document.getElementById('screen-results')
  };

  const brandLogoBtn = document.getElementById('brand-logo-btn');
  const btnStart = document.getElementById('btn-start');
  const btnBack = document.getElementById('btn-back');
  const btnNext = document.getElementById('btn-next');
  const btnNextText = document.getElementById('btn-next-text');
  const btnRetake = document.getElementById('btn-retake');
  const btnCopyResult = document.getElementById('btn-copy-result');

  const progressBar = document.getElementById('wizard-progress-bar');
  const stepLabel = document.getElementById('wizard-step-label');
  const domainPill = document.getElementById('wizard-domain-pill');
  const scenarioLabel = document.getElementById('scenario-label');
  const scenarioText = document.getElementById('scenario-text');
  const optionsContainer = document.getElementById('options-container');

  // Archetype Hex Theme Map from DESIGN.md (Obsidian Luminary)
  const THEME_COLORS = {
    lion: { primary: '#f59e0b', glow: 'rgba(245, 158, 11, 0.32)' },
    fox: { primary: '#f97316', glow: 'rgba(249, 115, 22, 0.32)' },
    dolphin: { primary: '#06b6d4', glow: 'rgba(6, 182, 212, 0.32)' },
    owl: { primary: '#6366f1', glow: 'rgba(99, 102, 241, 0.32)' },
    peacock: { primary: '#d946ef', glow: 'rgba(217, 70, 239, 0.32)' },
    bear_wolf: { primary: '#10b981', glow: 'rgba(16, 185, 129, 0.32)' }
  };

  const ARCHETYPE_EMOJIS = {
    dolphin: '🐬',
    fox: '🦊',
    lion: '🦁',
    owl: '🦉',
    peacock: '🦚',
    bear_wolf: '🐻'
  };

  function getArchetypeEmoji(key) {
    return ARCHETYPE_EMOJIS[key] || '';
  }

  // Behavioral & Tactical Implications Mapping
  const ARCHETYPE_IMPLICATIONS = {
    dolphin: {
      influence: 'You disarm rooms through authentic warmth, active listening, and psychological validation. People naturally open up to you because they feel zero threat, zero judgment, and completely heard.',
      thrive: 'Cross-functional consensus building, culture turnarounds, one-on-one team mentoring, and de-escalating tense interpersonal conflicts.'
    },
    fox: {
      influence: 'You read the unwritten power dynamics and social subtext in seconds. You influence through strategic agility, lateral reframing, and sharp wit that dissolves organizational deadlock.',
      thrive: 'High-stakes negotiation, fast-moving creative crises, navigating ambiguous workplace politics, and turning stalemates into unexpected wins.'
    },
    lion: {
      influence: 'You project commanding physical stillness, crisp economy of speech, and unambiguous authority. When stakes escalate, people instinctively stop debating and look to you for direction.',
      thrive: 'Crisis triage, executive command, turnaround execution, and high-pressure operational environments where endless debate would be fatal.'
    },
    owl: {
      influence: 'You command undeniable respect through intellectual detachment, rigorous questioning, and bulletproof logical foresight. You spot hidden risks and systemic flaws long before others do.',
      thrive: 'High-risk strategic auditing, complex systems architecture, objective forensic post-mortems, and truth-telling to executive leadership.'
    },
    peacock: {
      influence: 'You captivate rooms through infectious vitality, vivid narrative elevation, and magnetic enthusiasm. You don\'t just communicate an idea; you make an audience feel and believe in it.',
      thrive: 'Keynote pitching, rallying disengaged teams, vision casting to investors, creative launches, and creating momentum out of thin air.'
    },
    bear_wolf: {
      influence: 'You anchor rooms through immovable physical presence, steadfast loyalty, and quiet emotional containment. While others panic, your calm absorbs room anxiety and steadies everyone.',
      thrive: 'Turbulent organizational storms, defending team boundaries against external bullies, high-stress endurance challenges, and long-haul execution.'
    }
  };

  const HYBRID_IMPLICATIONS = {
    'fox+lion': 'The Strategic Commander blend grants a rare dual edge: the nimble tactical wit of the Fox backed by the decisive teeth and authority of the Lion. You can negotiate playfully, but strike definitively when required.',
    'lion+fox': 'The Strategic Commander blend grants commanding executive presence softened by sharp lateral wit. You enforce goals without breaking relationships, reading the room while maintaining absolute control.',
    'dolphin+bear_wolf': 'The Empathetic Anchor blend fuses warm psychological safety with an unshakeable protective spine. You are loved for your empathy and deeply respected for your immovable loyalty.',
    'bear_wolf+dolphin': 'The Empathetic Anchor blend grounds high-stress groups with stoic calm while ensuring nobody feels left behind or ignored.',
    'peacock+dolphin': 'The Radiant Inspirer blend pairs electrifying visionary showmanship with authentic personal warmth. Your charisma feels inspiring on a stage and genuinely intimate one-on-one.',
    'dolphin+peacock': 'The Radiant Inspirer blend brings joyful social momentum and communal celebration, making everyone around you feel energized and included.',
    'owl+lion': 'The Sovereign Architect blend unites ruthless analytical foresight with commanding executive authority. You architect the master plan and possess the unyielding will to see it built.',
    'lion+owl': 'The Sovereign Architect blend ensures your bold directives are backed by flawless logic and objective risk mitigation. Decisive, calculated, and virtually impossible to derail.',
    'fox+owl': 'The Analytical Tactician blend pairs sharp social reading with deep empirical rigor. You dissect human motives and data models simultaneously, making you virtually impossible to bluff.',
    'owl+fox': 'The Analytical Tactician blend gives deep intellect a sharp conversational edge, using Socratic wit to disarm opponents and dismantle weak arguments.',
    'peacock+fox': 'The Magnetic Charmer blend combines irresistible enthusiasm with razor-sharp tactical reading. You can sell anything to anyone while staying three steps ahead of the room.',
    'fox+peacock': 'The Magnetic Charmer blend uses theatrical storytelling and charm as a brilliant smokescreen for deep strategic moves.',
    'bear_wolf+lion': 'The Protector King blend fuses unwavering commanding authority with deep loyalty to your people. You lead from the front and defend your circle fiercely.',
    'lion+bear_wolf': 'The Protector King blend pairs executive decisiveness with emotional containment, keeping your team focused and shielded from external chaos.',
    'bear_wolf+owl': 'The Stoic Sage blend unites quiet emotional grounding with deep objective foresight. You rarely speak first, but when you do, the entire room goes silent to listen.',
    'owl+bear_wolf': 'The Stoic Sage blend ensures your deep analytical rigor is anchored in patient, immovable calmness.'
  };

  /**
   * Initializes questions array by flattening categories.
   */
  function initData() {
    if (!window.QUESTIONNAIRE_DATA || !window.CENTROIDS_DATA) {
      console.error('Questionnaire or Centroids data not loaded.');
      return;
    }

    centroids = window.CENTROIDS_DATA.centroids;
    questions = [];

    window.QUESTIONNAIRE_DATA.categories.forEach(cat => {
      cat.questions.forEach(q => {
        questions.push({
          ...q,
          category_title: cat.category_title,
          category_key: cat.category
        });
      });
    });
  }

  /**
   * Switches visible screen with smooth transition.
   */
  function showScreen(screenKey) {
    Object.keys(screens).forEach(key => {
      if (key === screenKey) {
        screens[key].classList.add('active');
        screens[key].setAttribute('aria-hidden', 'false');
      } else {
        screens[key].classList.remove('active');
        screens[key].setAttribute('aria-hidden', 'true');
      }
    });

    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  /**
   * Renders the current question and options into the wizard.
   */
  function renderCurrentQuestion() {
    const q = questions[currentIndex];
    if (!q) return;

    // Progress percentage
    const progressPct = ((currentIndex + 1) / questions.length) * 100;
    progressBar.style.width = `${progressPct}%`;
    stepLabel.textContent = currentIndex + 1;

    // Category title & scenario
    if (domainPill) domainPill.textContent = q.category_title || 'Interpersonal Scenario';
    if (scenarioLabel) scenarioLabel.textContent = `Scenario ${q.id} &bull; ${q.category_title}`;
    scenarioText.textContent = q.scenario;

    // Render Options
    optionsContainer.innerHTML = '';
    const selectedLetter = userAnswers[q.id] || null;

    q.options.forEach((opt, idx) => {
      const btn = document.createElement('button');
      btn.type = 'button';
      btn.className = 'option-btn';
      if (selectedLetter === opt.letter.toUpperCase()) {
        btn.classList.add('selected');
      }

      btn.dataset.letter = opt.letter.toUpperCase();
      btn.dataset.index = idx;

      btn.innerHTML = `
        <div class="option-badge">${opt.letter.toUpperCase()}</div>
        <div class="option-text">${opt.text}</div>
      `;

      btn.addEventListener('click', () => {
        handleOptionSelection(opt.letter.toUpperCase(), btn);
      });

      optionsContainer.appendChild(btn);
    });

    // Update Back button state
    btnBack.disabled = (currentIndex === 0);

    // Update Next button state & text
    const isAnswered = Boolean(selectedLetter);
    if (btnNext) {
      btnNext.disabled = !isAnswered;
      if (btnNextText) {
        btnNextText.textContent = (currentIndex === questions.length - 1) ? 'See Results' : 'Next Scenario';
      }
    }
  }

  /**
   * Handles user selection of an option.
   */
  function handleOptionSelection(letter, clickedBtn) {
    const q = questions[currentIndex];
    userAnswers[q.id] = letter;

    // Highlight selected button
    const allBtns = optionsContainer.querySelectorAll('.option-btn');
    allBtns.forEach(b => b.classList.remove('selected'));
    if (clickedBtn) {
      clickedBtn.classList.add('selected');
    }

    // Enable Next button now that an option is selected
    if (btnNext) {
      btnNext.disabled = false;
    }
  }

  /**
   * Advances to the next question or triggers calculation on the last question.
   */
  function advanceToNextQuestion() {
    const q = questions[currentIndex];
    if (!userAnswers[q.id]) return;

    if (currentIndex < questions.length - 1) {
      currentIndex++;
      renderCurrentQuestion();
    } else {
      // All 18 completed -> show calculation loader and compute results
      showScreen('loader');
      setTimeout(calculateAndRenderResults, 900);
    }
  }

  /**
   * Executes the scoring engine and renders the full results dashboard.
   */
  function calculateAndRenderResults() {
    try {
      lastResult = window.CharismaScoring.scoreAssessment(
        userAnswers,
        window.QUESTIONNAIRE_DATA,
        centroids
      );

      const res = lastResult;
      const primary = res.primary_archetype;
      const theme = THEME_COLORS[primary.key] || { primary: '#38bdf8', glow: 'rgba(56, 189, 248, 0.25)' };

      // Update Hero Banner
      const heroBanner = document.getElementById('res-hero-banner');
      heroBanner.style.setProperty('--hero-accent', theme.primary);
      heroBanner.style.setProperty('--hero-glow', theme.glow);

      const userBadge = document.getElementById('res-user-badge');
      if (userBadge) {
        if (participantName && participantName !== 'Anonymous') {
          userBadge.style.display = 'inline-block';
          userBadge.textContent = participantName;
        } else {
          userBadge.style.display = 'none';
        }
      }

      const primaryEmoji = getArchetypeEmoji(primary.key);
      const secondaryEmoji = res.secondary_wing ? getArchetypeEmoji(res.secondary_wing.key) : '';

      const primaryBadge = document.getElementById('res-primary-badge');
      primaryBadge.textContent = `Primary Archetype ${primaryEmoji}`.trim();
      primaryBadge.style.backgroundColor = theme.primary;

      const hybridPill = document.getElementById('res-hybrid-pill');
      if (res.secondary_wing) {
        hybridPill.style.display = 'inline-block';
        hybridPill.textContent = `Hybrid: ${res.hybrid_profile_title} [${primary.name.replace('The ', '')} ${primaryEmoji} + ${res.secondary_wing.name.replace('The ', '')} ${secondaryEmoji}]`;
      } else {
        hybridPill.textContent = `${res.hybrid_profile_title} ${primaryEmoji}`;
      }

      document.getElementById('res-archetype-name').textContent = `${primary.name} ${primaryEmoji}`;
      document.getElementById('res-archetype-subtitle').textContent = primary.subtitle;
      document.getElementById('res-superpower').textContent = primary.superpower;

      // Render Archetype Implications & Meaning Text
      const impData = ARCHETYPE_IMPLICATIONS[primary.key] || {
        influence: 'You hold distinct interpersonal magnetism that shapes room dynamics.',
        thrive: 'Dynamic collaborative and high-stakes environments.'
      };

      document.getElementById('res-implication-influence').textContent = impData.influence;
      document.getElementById('res-implication-thrive').textContent = impData.thrive;

      // Determine hybrid blend explanation
      const hybridElem = document.getElementById('res-implication-blend');
      if (res.secondary_wing) {
        const pairKey = `${primary.key}+${res.secondary_wing.key}`;
        const hybridText = HYBRID_IMPLICATIONS[pairKey] ||
          `Your dominant ${primary.name} style is modulated by strong traits from ${res.secondary_wing.name} (${res.secondary_wing.score_percentage}%), providing you situational flexibility between different interpersonal challenges.`;
        hybridElem.textContent = hybridText;
      } else {
        hybridElem.textContent = `High Stylistic Consistency: You exhibit a focused, pure expression of ${primary.name}. Your interpersonal presence remains steady, predictable, and unmistakable across both casual and high-stress scenarios.`;
      }

      // Render Archetype Distribution Bars
      const distContainer = document.getElementById('distribution-bars');

      distContainer.innerHTML = '';

      // Order by percentage descending
      const sortedArchetypes = Object.entries(res.all_percentages).sort((a, b) => b[1] - a[1]);

      sortedArchetypes.forEach(([key, pct]) => {
        const archMeta = centroids[key];
        const archTheme = THEME_COLORS[key] || { primary: '#38bdf8' };
        const emoji = getArchetypeEmoji(key);

        const item = document.createElement('div');
        item.className = 'dist-item';
        item.innerHTML = `
          <div class="dist-item-header">
            <span class="dist-label">
              <span class="dist-color-dot" style="background-color: ${archTheme.primary};"></span>
              ${archMeta.name} ${emoji}
            </span>
            <span class="dist-val">${pct}%</span>
          </div>
          <div class="dist-track">
            <div class="dist-fill" data-pct="${pct}" style="background-color: ${archTheme.primary}; width: 0%;"></div>
          </div>
        `;
        distContainer.appendChild(item);
      });

      // Animate progress bars
      setTimeout(() => {
        const fills = distContainer.querySelectorAll('.dist-fill');
        fills.forEach(fill => {
          fill.style.width = `${fill.dataset.pct}%`;
        });
      }, 100);

      // Render SVG Trait Radar Chart
      const radarContainer = document.getElementById('radar-container');
      radarContainer.innerHTML = window.CharismaScoring.generateRadarSvg(res.trait_vector, theme.primary);

      // Render Stress Shadow
      document.getElementById('res-shadow-title').textContent = `${primary.name} ${primaryEmoji} Stress Shadow & Calibration`;
      document.getElementById('res-shadow-desc').textContent = primary.shadow_alert;

      // Display results view
      showScreen('results');

      // Asynchronously persist to backend (non-blocking)
      persistAssessmentSubmission();
    } catch (err) {
      console.error('Scoring calculation error:', err);
      alert('An error occurred calculating results: ' + err.message);
      showScreen('wizard');
    }
  }

  /**
   * Persists assessment data to optional Google Sheets Webhook.
   */
  let currentSessionId = 'sess_' + Date.now() + '_' + Math.random().toString(36).substr(2, 7);
  let participantName = 'Anonymous';
  let participantEmail = '';
  let accuracyRating = 8;

  const ACCURACY_LABELS = {
    1: 'Way off / Not me',
    2: 'Mostly inaccurate',
    3: 'Slightly off',
    4: 'Somewhat neutral',
    5: 'Moderate match',
    6: 'Noticeable overlap',
    7: 'Quite accurate',
    8: 'Very accurate',
    9: 'Extremely accurate',
    10: 'Spot on / Hits close to home!'
  };

  // Set your Google Apps Script Web App URL here to write directly to Google Sheets:
  const GOOGLE_SHEET_URL = 'https://script.google.com/macros/s/AKfycbysjkg8QGQzvZsQEu8IE43UhDm2HUH51Y2GdpC-vpoOKNpY-J1OtBF3-2w2M9ihYMeN/exec'; 

  function persistAssessmentSubmission(isExplicit = false) {
    if (!lastResult) return;

    const savedStatusMsg = document.getElementById('accuracy-saved-status');

    const pEmoji = getArchetypeEmoji(lastResult.primary_archetype.key);
    const sEmoji = lastResult.secondary_wing ? getArchetypeEmoji(lastResult.secondary_wing.key) : '';

    const payload = {
      session_id: currentSessionId,
      timestamp: new Date().toISOString(),
      participant_name: participantName || 'Anonymous',
      participant_email: participantEmail || '',
      primary_archetype: `${lastResult.primary_archetype.name} ${pEmoji}`.trim(),
      primary_score: lastResult.primary_archetype.score_percentage + '%',
      secondary_wing: lastResult.secondary_wing ? `${lastResult.secondary_wing.name} ${sEmoji}`.trim() : 'None',
      secondary_score: lastResult.secondary_wing ? lastResult.secondary_wing.score_percentage + '%' : 'N/A',
      hybrid_title: lastResult.hybrid_profile_title,
      dolphin_pct: lastResult.all_percentages.dolphin + '%',
      fox_pct: lastResult.all_percentages.fox + '%',
      lion_pct: lastResult.all_percentages.lion + '%',
      owl_pct: lastResult.all_percentages.owl + '%',
      peacock_pct: lastResult.all_percentages.peacock + '%',
      bear_wolf_pct: lastResult.all_percentages.bear_wolf + '%',
      accuracy_rating: `${accuracyRating} / 10 (${ACCURACY_LABELS[accuracyRating] || 'Rated'})`,
      result: lastResult,
      answers: userAnswers
    };

    // Send to Google Sheets if configured
    if (GOOGLE_SHEET_URL) {
      fetch(GOOGLE_SHEET_URL, {
        method: 'POST',
        mode: 'no-cors',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      }).then(() => {
        if (isExplicit && savedStatusMsg) {
          savedStatusMsg.textContent = '✓ Rating logged to your Google Sheet!';
          setTimeout(() => { savedStatusMsg.textContent = ''; }, 3500);
        }
      }).catch(err => {
        console.warn('Google Sheet send failed:', err);
      });
    } else if (isExplicit && savedStatusMsg) {
      savedStatusMsg.textContent = '✓ Rating saved locally in session.';
      setTimeout(() => { savedStatusMsg.textContent = ''; }, 3500);
    }
  }


  /**
   * Keyboard shortcuts handler.
   */
  function handleKeyDown(e) {
    // Only active during Wizard screen
    if (!screens.wizard.classList.contains('active')) return;

    const key = e.key.toUpperCase();

    // Hotkeys A - F
    const letterMap = {
      'A': 0, '1': 0,
      'B': 1, '2': 1,
      'C': 2, '3': 2,
      'D': 3, '4': 3,
      'E': 4, '5': 4,
      'F': 5, '6': 5
    };

    if (letterMap[key] !== undefined) {
      const optionIndex = letterMap[key];
      const btns = optionsContainer.querySelectorAll('.option-btn');
      if (btns[optionIndex]) {
        e.preventDefault();
        btns[optionIndex].click();
      }
      return;
    }

    // Enter or Right Arrow advances to next question if enabled
    if ((e.key === 'Enter' || e.key === 'ArrowRight') && btnNext && !btnNext.disabled) {
      e.preventDefault();
      advanceToNextQuestion();
      return;
    }

    // Left Arrow for previous question
    if (e.key === 'ArrowLeft' && currentIndex > 0) {
      e.preventDefault();
      currentIndex--;
      renderCurrentQuestion();
      return;
    }
  }

  /**
   * Copies formatted results summary to clipboard.
   */
  function copyResultsSummary() {
    if (!lastResult) return;

    const res = lastResult;
    const pEmoji = getArchetypeEmoji(res.primary_archetype.key);
    const sEmoji = res.secondary_wing ? getArchetypeEmoji(res.secondary_wing.key) : '';

    const summary = [
      `🌟 Know Your Archetype Assessment Results`,
      participantName !== 'Anonymous' ? `Participant: ${participantName}` : '',
      `Primary Archetype: ${res.primary_archetype.name} ${pEmoji} (${res.primary_archetype.score_percentage}%)`,
      `Archetype Role: ${res.primary_archetype.subtitle}`,
      `Composite Profile: ${res.hybrid_profile_title}`,
      res.secondary_wing ? `Secondary Wing: ${res.secondary_wing.name} ${sEmoji} (${res.secondary_wing.score_percentage}%)` : '',
      ``,
      `Superpower:`,
      `${res.primary_archetype.superpower}`,
      ``,
      `Stress Shadow Alert:`,
      `${res.primary_archetype.shadow_alert}`,
      ``,
      `Archetype Breakdown:`,
      ...Object.entries(res.all_percentages)
        .sort((a, b) => b[1] - a[1])
        .map(([k, v]) => `• ${centroids[k].name} ${getArchetypeEmoji(k)}: ${v}%`)
    ].filter(Boolean).join('\n');

    navigator.clipboard.writeText(summary).then(() => {
      const originalText = btnCopyResult.innerHTML;
      btnCopyResult.innerHTML = `
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
          <polyline points="20 6 9 17 4 12"></polyline>
        </svg>
        Copied to Clipboard!
      `;
      setTimeout(() => {
        btnCopyResult.innerHTML = originalText;
      }, 2000);
    }).catch(err => {
      console.warn('Clipboard write failed:', err);
      alert('Assessment summary:\n\n' + summary);
    });
  }

  /**
   * Event Listeners & Bootstrapping
   */
  function initEvents() {
    if (brandLogoBtn) {
      brandLogoBtn.addEventListener('click', (e) => {
        e.preventDefault();
        showScreen('welcome');
      });
    }

    btnStart.addEventListener('click', () => {
      const nameInput = document.getElementById('start-input-name');
      const emailInput = document.getElementById('start-input-email');
      const nameVal = nameInput ? nameInput.value.trim() : '';
      const emailVal = emailInput ? emailInput.value.trim() : '';

      participantName = nameVal || 'Anonymous';
      participantEmail = emailVal || '';

      currentIndex = 0;
      userAnswers = {};
      showScreen('wizard');
      renderCurrentQuestion();
    });

    btnBack.addEventListener('click', () => {
      if (currentIndex > 0) {
        currentIndex--;
        renderCurrentQuestion();
      }
    });

    if (btnNext) {
      btnNext.addEventListener('click', advanceToNextQuestion);
    }

    btnRetake.addEventListener('click', () => {
      currentIndex = 0;
      userAnswers = {};
      participantName = 'Anonymous';
      participantEmail = '';
      currentSessionId = 'sess_' + Date.now() + '_' + Math.random().toString(36).substr(2, 7);
      
      const nameInput = document.getElementById('start-input-name');
      const emailInput = document.getElementById('start-input-email');
      if (nameInput) nameInput.value = '';
      if (emailInput) emailInput.value = '';

      accuracyRating = 8;
      const slider = document.getElementById('accuracy-slider');
      const valDisp = document.getElementById('accuracy-score-val');
      const statDisp = document.getElementById('accuracy-status-text');
      const savedMsg = document.getElementById('accuracy-saved-status');
      if (slider) slider.value = 8;
      if (valDisp) valDisp.textContent = '8';
      if (statDisp) statDisp.textContent = ACCURACY_LABELS[8];
      if (savedMsg) savedMsg.textContent = '';
      
      showScreen('welcome');
    });

    // Accuracy Slider Listeners
    const accuracySlider = document.getElementById('accuracy-slider');
    const accuracyValDisplay = document.getElementById('accuracy-score-val');
    const accuracyStatusDisplay = document.getElementById('accuracy-status-text');
    const btnSaveAccuracy = document.getElementById('btn-save-accuracy');

    if (accuracySlider) {
      accuracySlider.addEventListener('input', () => {
        accuracyRating = parseInt(accuracySlider.value, 10);
        if (accuracyValDisplay) accuracyValDisplay.textContent = accuracyRating;
        if (accuracyStatusDisplay) accuracyStatusDisplay.textContent = ACCURACY_LABELS[accuracyRating] || '';
      });

      // Auto-save update to sheet on slider release
      accuracySlider.addEventListener('change', () => {
        persistAssessmentSubmission(true);
      });
    }

    if (btnSaveAccuracy) {
      btnSaveAccuracy.addEventListener('click', () => {
        persistAssessmentSubmission(true);
      });
    }

    btnCopyResult.addEventListener('click', copyResultsSummary);

    window.addEventListener('keydown', handleKeyDown);
  }

  /**
   * Dark / Light Theme Controller
   */
  function initTheme() {
    const savedTheme = localStorage.getItem('charisma_theme') || 'dark';
    document.documentElement.setAttribute('data-theme', savedTheme);

    const btnThemeToggle = document.getElementById('btn-theme-toggle');
    if (btnThemeToggle) {
      btnThemeToggle.addEventListener('click', () => {
        const current = document.documentElement.getAttribute('data-theme') || 'dark';
        const next = current === 'dark' ? 'light' : 'dark';
        document.documentElement.setAttribute('data-theme', next);
        localStorage.setItem('charisma_theme', next);
        btnThemeToggle.setAttribute('aria-label', next === 'dark' ? 'Switch to light mode' : 'Switch to dark mode');
      });
    }
  }

  // Self-start
  document.addEventListener('DOMContentLoaded', () => {
    initTheme();
    initData();
    initEvents();
  });

})();

