/**
 * Know Your Archetype - Client Scoring Engine
 * Mathematical parity with questionnaire/scoring_engine.py
 */

(function(root) {
  'use strict';

  const HYBRID_TITLES = {
    'fox+lion': 'The Strategic Commander',
    'lion+fox': 'The Strategic Commander',
    'dolphin+bear_wolf': 'The Empathetic Anchor',
    'bear_wolf+dolphin': 'The Empathetic Anchor',
    'peacock+dolphin': 'The Radiant Inspirer',
    'dolphin+peacock': 'The Radiant Inspirer',
    'owl+lion': 'The Sovereign Architect',
    'lion+owl': 'The Sovereign Architect',
    'fox+owl': 'The Analytical Tactician',
    'owl+fox': 'The Analytical Tactician',
    'peacock+fox': 'The Magnetic Charmer',
    'fox+peacock': 'The Magnetic Charmer',
    'bear_wolf+lion': 'The Protector King',
    'lion+bear_wolf': 'The Protector King',
    'bear_wolf+owl': 'The Stoic Sage',
    'owl+bear_wolf': 'The Stoic Sage'
  };

  const ARCHETYPE_COLORS = {
    lion: '#f59e0b',
    fox: '#f97316',
    dolphin: '#06b6d4',
    owl: '#6366f1',
    peacock: '#d946ef',
    bear_wolf: '#10b981'
  };

  const ARCHETYPE_EMOJIS = {
    dolphin: '🐬',
    fox: '🦊',
    lion: '🦁',
    owl: '🦉',
    peacock: '🦚',
    bear_wolf: '🐻'
  };

  /**
   * Score assessment answers.
   * @param {Object} answers - Map of { questionId: chosenLetter }, e.g. { 'Q01': 'A', 'Q02': 'C' }
   * @param {Object} questionnaire - Master questionnaire object with categories & questions
   * @param {Object} centroids - Centroid data dictionary
   * @returns {Object} Complete assessment score & profile
   */
  function scoreAssessment(answers, questionnaire, centroids) {
    const totalQuestions = Object.keys(answers).length;
    if (totalQuestions === 0) {
      throw new Error('No answers provided for evaluation.');
    }

    // Build question lookup map
    const qMap = {};
    questionnaire.categories.forEach(cat => {
      cat.questions.forEach(q => {
        qMap[q.id] = {};
        q.options.forEach(opt => {
          qMap[q.id][opt.letter.toUpperCase()] = opt;
        });
      });
    });

    // Trait vector accumulator
    const traitAccum = {
      energy_presence: 0.0,
      warmth_vs_authority: 0.0,
      conflict_assertiveness: 0.0,
      conflict_cooperativeness: 0.0
    };

    const archetypeCounts = {};
    Object.keys(centroids).forEach(key => {
      archetypeCounts[key] = 0;
    });

    // Iterate through submitted answers (supports both array of letters e.g. ['A', 'C'] and single letter 'A')
    Object.entries(answers).forEach(([qId, val]) => {
      const letters = Array.isArray(val) ? val : [val];
      if (letters.length === 0) return;

      const weightPerChoice = 1.0 / letters.length;

      letters.forEach(letter => {
        const upperLetter = String(letter).trim().toUpperCase();
        if (!qMap[qId] || !qMap[qId][upperLetter]) return;

        const opt = qMap[qId][upperLetter];
        const arch = opt.archetype;
        if (archetypeCounts[arch] !== undefined) {
          archetypeCounts[arch] += weightPerChoice;
        }

        if (opt.trait_impact) {
          Object.entries(opt.trait_impact).forEach(([dim, impactVal]) => {
            if (traitAccum[dim] !== undefined) {
              traitAccum[dim] += (impactVal * weightPerChoice);
            }
          });
        }
      });
    });

    // Compute user mean trait vector
    const userVector = {};
    Object.keys(traitAccum).forEach(dim => {
      userVector[dim] = Number((traitAccum[dim] / totalQuestions).toFixed(4));
    });

    // Archetype selection frequencies
    const frequencies = {};
    Object.keys(archetypeCounts).forEach(arch => {
      frequencies[arch] = archetypeCounts[arch] / totalQuestions;
    });

    // Euclidean distance and similarity to centroids
    const similarities = {};
    let totalSim = 0.0;

    Object.entries(centroids).forEach(([arch, data]) => {
      const cVec = data.vector;
      let distSq = 0.0;
      Object.keys(userVector).forEach(dim => {
        const diff = userVector[dim] - cVec[dim];
        distSq += diff * diff;
      });
      const dist = Math.sqrt(distSq);
      const sim = 1.0 / (1.0 + dist);
      similarities[arch] = sim;
      totalSim += sim;
    });

    const normSim = {};
    Object.keys(similarities).forEach(arch => {
      normSim[arch] = similarities[arch] / (totalSim || 1.0);
    });

    // Hybrid composite score: 60% frequency + 40% proximity
    const rawScores = {};
    let totalScore = 0.0;
    Object.keys(centroids).forEach(arch => {
      const score = (0.60 * frequencies[arch]) + (0.40 * normSim[arch]);
      rawScores[arch] = score;
      totalScore += score;
    });

    const percentages = {};
    Object.keys(rawScores).forEach(arch => {
      percentages[arch] = Number(((rawScores[arch] / (totalScore || 1.0)) * 100).toFixed(1));
    });

    // Sort descending by percentage
    const ranked = Object.entries(percentages).sort((a, b) => b[1] - a[1]);
    const primaryKey = ranked[0][0];
    const secondaryKey = (ranked.length > 1 && ranked[1][1] >= 15.0) ? ranked[1][0] : null;

    const hybridKey = secondaryKey ? `${primaryKey}+${secondaryKey}` : null;
    const hybridTitle = hybridKey && HYBRID_TITLES[hybridKey]
      ? HYBRID_TITLES[hybridKey]
      : `${centroids[primaryKey].name} Dominant`;

    return {
      primary_archetype: {
        key: primaryKey,
        name: centroids[primaryKey].name,
        emoji: ARCHETYPE_EMOJIS[primaryKey] || '',
        subtitle: centroids[primaryKey].subtitle,
        score_percentage: percentages[primaryKey],
        superpower: centroids[primaryKey].superpower,
        shadow_alert: centroids[primaryKey].shadow_alert,
        color: ARCHETYPE_COLORS[primaryKey] || '#38bdf8'
      },
      secondary_wing: secondaryKey ? {
        key: secondaryKey,
        name: centroids[secondaryKey].name,
        emoji: ARCHETYPE_EMOJIS[secondaryKey] || '',
        subtitle: centroids[secondaryKey].subtitle,
        score_percentage: percentages[secondaryKey],
        color: ARCHETYPE_COLORS[secondaryKey] || '#a855f7'
      } : null,
      hybrid_profile_title: hybridTitle,
      all_percentages: percentages,
      trait_vector: userVector,
      composite_trait_vector: computeWeightedCentroidVector(percentages, centroids),
      choice_frequencies: archetypeCounts,
      ranked_keys: ranked.map(r => r[0])
    };
  }

  /**
   * Computes a weighted composite trait vector by blending all archetype centroid
   * vectors weighted by their final score percentages.
   * e.g. if Lion = 40%, Fox = 30%, Dolphin = 30%, the composite is:
   *   (0.4 * Lion_centroid) + (0.3 * Fox_centroid) + (0.3 * Dolphin_centroid)
   * This reveals precisely where the user sits in 4D interpersonal trait space.
   *
   * @param {Object} percentages - { lion: 42.3, fox: 28.1, ... }
   * @param {Object} centroids   - centroid data dictionary
   * @returns {Object} weighted composite vector, each value in [-1, 1]
   */
  function computeWeightedCentroidVector(percentages, centroids) {
    const dims = ['energy_presence', 'warmth_vs_authority', 'conflict_assertiveness', 'conflict_cooperativeness'];
    const composite = {};
    dims.forEach(d => { composite[d] = 0.0; });

    let totalWeight = 0.0;
    Object.entries(percentages).forEach(([arch, pct]) => {
      const weight = pct / 100.0;
      totalWeight += weight;
      const cVec = centroids[arch] && centroids[arch].vector;
      if (!cVec) return;
      dims.forEach(d => {
        composite[d] += weight * (cVec[d] || 0.0);
      });
    });

    if (totalWeight > 0) {
      dims.forEach(d => {
        composite[d] = Number((composite[d] / totalWeight).toFixed(4));
      });
    }
    return composite;
  }

  /**
   * Generates a sleek, high-contrast SVG Trait Radar chart.
   * Visualizes the 4 calibrated continuous dimensions:
   * 1. Energy & Presence (Top)
   * 2. Warmth vs Authority (Right)
   * 3. Conflict Assertiveness (Bottom)
   * 4. Conflict Cooperativeness (Left)
   * Values mapped from [-1.0, +1.0] -> [0.1, 0.9] of radius.
   * 
   * @param {Object} userVector - Vector with 4 dimensions
   * @param {string} accentColor - Hex color for user polygon fill/stroke
   * @returns {string} SVG HTML string
   */
  function generateRadarSvg(userVector, accentColor = '#38bdf8') {
    const size = 300;
    const center = size / 2;
    const maxRadius = 100;

    // 4 Axes configuration
    const axes = [
      { key: 'energy_presence', label: 'Energy / Presence', angle: -Math.PI / 2 },
      { key: 'warmth_vs_authority', label: 'Warmth / Relational', angle: 0 },
      { key: 'conflict_assertiveness', label: 'Assertiveness', angle: Math.PI / 2 },
      { key: 'conflict_cooperativeness', label: 'Cooperativeness', angle: Math.PI }
    ];

    // Function to map a value from [-1.0, 1.0] to a radius length
    function valToRadius(val) {
      // Clamped to [-1, 1]
      const clamped = Math.max(-1.0, Math.min(1.0, val || 0));
      // Map [-1, 1] to normalized [0.15, 0.95]
      const normalized = 0.55 + (clamped * 0.40);
      return normalized * maxRadius;
    }

    // Grid circles / polygons
    let gridSvg = '';
    const levels = [0.25, 0.5, 0.75, 1.0];
    levels.forEach(level => {
      const r = level * maxRadius;
      const points = axes.map(axis => {
        const x = center + r * Math.cos(axis.angle);
        const y = center + r * Math.sin(axis.angle);
        return `${x.toFixed(1)},${y.toFixed(1)}`;
      }).join(' ');

      gridSvg += `<polygon points="${points}" fill="none" stroke="currentColor" stroke-opacity="0.12" stroke-width="1" />`;
    });

    // Axis lines and label placements
    let axesSvg = '';
    let labelsSvg = '';
    axes.forEach(axis => {
      const xEnd = center + maxRadius * Math.cos(axis.angle);
      const yEnd = center + maxRadius * Math.sin(axis.angle);
      axesSvg += `<line x1="${center}" y1="${center}" x2="${xEnd.toFixed(1)}" y2="${yEnd.toFixed(1)}" stroke="currentColor" stroke-opacity="0.18" stroke-width="1" stroke-dasharray="2,3" />`;

      // Label positions offset outside the radar
      const labelRadius = maxRadius + 24;
      const xLab = center + labelRadius * Math.cos(axis.angle);
      const yLab = center + labelRadius * Math.sin(axis.angle);

      let textAnchor = 'middle';
      let dominantBaseline = 'middle';
      if (axis.angle === 0) textAnchor = 'start';
      else if (axis.angle === Math.PI) textAnchor = 'end';
      else if (axis.angle === -Math.PI / 2) dominantBaseline = 'auto';
      else if (axis.angle === Math.PI / 2) dominantBaseline = 'hanging';

      labelsSvg += `<text x="${xLab.toFixed(1)}" y="${yLab.toFixed(1)}" text-anchor="${textAnchor}" dominant-baseline="${dominantBaseline}" fill="currentColor" fill-opacity="0.75" font-size="10" font-weight="600" font-family="'Plus Jakarta Sans', sans-serif">${axis.label}</text>`;
    });

    // User polygon points
    const userPoints = axes.map(axis => {
      const r = valToRadius(userVector[axis.key]);
      const x = center + r * Math.cos(axis.angle);
      const y = center + r * Math.sin(axis.angle);
      return `${x.toFixed(1)},${y.toFixed(1)}`;
    }).join(' ');

    // User vertices dots
    let dotsSvg = '';
    axes.forEach(axis => {
      const r = valToRadius(userVector[axis.key]);
      const x = center + r * Math.cos(axis.angle);
      const y = center + r * Math.sin(axis.angle);
      dotsSvg += `<circle cx="${x.toFixed(1)}" cy="${y.toFixed(1)}" r="4.5" fill="${accentColor}" stroke="var(--bg-card, #000)" stroke-width="2" />`;
    });


    return `
      <svg class="radar-svg" viewBox="0 0 ${size} ${size}" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="Charisma Trait Coordinates Radar Chart">
        <defs>
          <radialGradient id="radarFillGrad" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stop-color="${accentColor}" stop-opacity="0.45" />
            <stop offset="100%" stop-color="${accentColor}" stop-opacity="0.08" />
          </radialGradient>
          <filter id="radarGlow" x="-20%" y="-20%" width="140%" height="140%">
            <feGaussianBlur stdDeviation="3" result="blur" />
            <feComposite in="SourceGraphic" in2="blur" operator="over" />
          </filter>
        </defs>
        <g class="radar-grid">${gridSvg}</g>
        <g class="radar-axes">${axesSvg}</g>
        <polygon points="${userPoints}" fill="url(#radarFillGrad)" stroke="${accentColor}" stroke-width="2.5" filter="url(#radarGlow)" />
        <g class="radar-dots">${dotsSvg}</g>
        <g class="radar-labels">${labelsSvg}</g>
      </svg>
    `.trim();
  }

  // Export to window or module
  root.CharismaScoring = {
    scoreAssessment: scoreAssessment,
    generateRadarSvg: generateRadarSvg,
    computeWeightedCentroidVector: computeWeightedCentroidVector,
    ARCHETYPE_COLORS: ARCHETYPE_COLORS
  };

})(typeof window !== 'undefined' ? window : this);
