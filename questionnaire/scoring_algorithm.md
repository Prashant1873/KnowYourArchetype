# Scoring Algorithm & Archetype Blend Classification Engine

## 1. Overview
The Charisma Archetype Assessment utilizes an indirect, multi-dimensional vector aggregation model. Rather than forcing respondents into a flat, single-label categorization, the engine measures micro-behavioral choices across 18 everyday dilemmas to compute a continuous trait profile and determine:
1. **Primary Dominant Archetype** (Core behavioral operating system)
2. **Secondary Hybrid Wing** (Sub-dominant situational adaptation)
3. **5-Axis Trait Radar Scores** (Normalized behavioral coordinates)
4. **Stress Shadow Risk Advisory** (Specific overextension warnings)

---

## 2. Mathematical Formulation

### Step 1: Trait Vector Aggregation
Each response option chosen by the user imparts a predefined weight vector across 4 continuous dimensions:
$$ \vec{v}_i = \begin{bmatrix} \text{energy\_presence}_i \\ \text{warmth\_vs\_authority}_i \\ \text{conflict\_assertiveness}_i \\ \text{conflict\_cooperativeness}_i \end{bmatrix} $$

Across $N = 18$ questions, the user's composite trait vector $\vec{U}$ is calculated as the mean:
$$ \vec{U} = \frac{1}{N} \sum_{i=1}^{N} \vec{v}_i $$

### Step 2: Archetype Choice Frequency
The engine tallies the raw count of selections aligning with each archetype $a \in \{\text{Dolphin, Fox, Lion, Owl, Peacock, Bear/Wolf}\}$:
$$ f_a = \frac{\text{count}(a)}{N} $$

### Step 3: Centroid Distance & Similarity
Let $\vec{C}_a$ be the benchmark centroid vector for archetype $a$ defined in `archetype_centroids.json`. The Euclidean distance $d_a$ is:
$$ d_a = \|\vec{U} - \vec{C}_a\| = \sqrt{\sum_{k} (U_k - C_{a,k})^2} $$

The proximity similarity $s_a$ is:
$$ s_a = \frac{1}{1 + d_a} $$
Normalized similarity:
$$ \tilde{s}_a = \frac{s_a}{\sum_{j} s_j} $$

### Step 4: Hybrid Composite Weighting
The final match score $M_a$ for archetype $a$ combines direct choice frequency (60% weight) and multidimensional trait proximity (40% weight):
$$ M_a = 0.60 \cdot f_a + 0.40 \cdot \tilde{s}_a $$

Normalized match percentage:
$$ P_a = \left( \frac{M_a}{\sum_{j} M_j} \right) \times 100\% $$

---

## 3. Classification Rules

1. **Primary Archetype:**
   $$\text{Primary} = \arg\max_{a} (P_a)$$
2. **Secondary Hybrid Wing:**
   The runner-up archetype with the second highest $P_a$. If the runner-up score satisfies $P_{\text{secondary}} \ge 15\%$, it is formally declared as the user's hybrid wing (e.g., "The Strategist-Commander" for Fox-Lion, or "The Empathetic Anchor" for Dolphin-Bear).
3. **Shadow Advisory Activation:**
   Activated when $P_{\text{primary}} \ge 35\%$ or when extreme trait coordinates are observed ($|\text{warmth\_vs\_authority}| > 0.70$ or $|\text{energy\_presence}| > 0.75$).

---

## 4. Benchmark Centroid Reference Table

| Archetype | Energy & Presence | Warmth vs. Authority | Conflict Assertiveness | Conflict Cooperativeness |
| :--- | :---: | :---: | :---: | :---: |
| **The Dolphin** | +0.50 | +0.85 | -0.60 | +0.90 |
| **The Fox** | +0.60 | +0.10 | +0.20 | -0.30 |
| **The Lion** | -0.70 | -0.85 | +0.90 | -0.50 |
| **The Owl** | -0.80 | -0.65 | +0.10 | +0.30 |
| **The Peacock** | +0.90 | +0.70 | +0.40 | +0.60 |
| **The Bear / Wolf** | -0.75 | +0.20 | 0.00 | +0.85 |
