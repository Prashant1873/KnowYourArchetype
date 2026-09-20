#!/usr/bin/env python3
"""
Scoring Engine for Charisma Archetype Assessment
Zero-dependency Python implementation of the multi-dimensional vector aggregation
and archetype classification algorithm.
"""

import json
import math
from pathlib import Path

BASE_DIR = Path(__file__).resolve().parent

def load_questionnaire():
    with open(BASE_DIR / "full_questionnaire.json", "r", encoding="utf-8") as f:
        return json.load(f)

def load_centroids():
    with open(BASE_DIR / "archetype_centroids.json", "r", encoding="utf-8") as f:
        return json.load(f)["centroids"]

def score_assessment(answers):
    """
    Evaluates answers dictionary: {'Q01': 'A', 'Q02': 'C', ...}
    Returns complete profile dictionary with primary, secondary, and percentages.
    """
    questionnaire = load_questionnaire()
    centroids = load_centroids()

    # Index questions and options
    q_map = {}
    for cat in questionnaire["categories"]:
        for q in cat["questions"]:
            q_map[q["id"]] = {opt["letter"].upper(): opt for opt in q["options"]}

    total_questions = len(answers)
    if total_questions == 0:
        raise ValueError("No answers provided.")

    # Initialize trait vector accumulator
    trait_accum = {
        "energy_presence": 0.0,
        "warmth_vs_authority": 0.0,
        "conflict_assertiveness": 0.0,
        "conflict_cooperativeness": 0.0
    }
    archetype_counts = {arch: 0 for arch in centroids.keys()}

    # Aggregate chosen options
    for q_id, chosen_letter in answers.items():
        chosen_letter = chosen_letter.upper()
        if q_id not in q_map or chosen_letter not in q_map[q_id]:
            continue

        opt = q_map[q_id][chosen_letter]
        arch = opt["archetype"]
        if arch in archetype_counts:
            archetype_counts[arch] += 1

        for dim, val in opt["trait_impact"].items():
            if dim in trait_accum:
                trait_accum[dim] += val

    # Mean user vector
    user_vector = {dim: round(val / total_questions, 4) for dim, val in trait_accum.items()}

    # Choice frequencies
    frequencies = {arch: count / total_questions for arch, count in archetype_counts.items()}

    # Calculate Euclidean distance and similarity to centroids
    similarities = {}
    for arch, data in centroids.items():
        c_vec = data["vector"]
        dist_sq = sum((user_vector[dim] - c_vec[dim]) ** 2 for dim in user_vector.keys())
        dist = math.sqrt(dist_sq)
        similarities[arch] = 1.0 / (1.0 + dist)

    total_sim = sum(similarities.values())
    norm_sim = {arch: sim / total_sim for arch, sim in similarities.items()}

    # Hybrid composite match score (60% choice frequency, 40% trait vector proximity)
    raw_scores = {}
    for arch in centroids.keys():
        raw_scores[arch] = (0.60 * frequencies[arch]) + (0.40 * norm_sim[arch])

    total_score = sum(raw_scores.values())
    percentages = {arch: round((score / total_score) * 100, 1) for arch, score in raw_scores.items()}

    # Rank archetypes
    ranked = sorted(percentages.items(), key=lambda x: x[1], reverse=True)
    primary_arch = ranked[0][0]
    secondary_arch = ranked[1][0] if len(ranked) > 1 and ranked[1][1] >= 15.0 else None

    # Hybrid Archetype Title Formulation
    hybrid_titles = {
        ("fox", "lion"): "The Strategic Commander",
        ("lion", "fox"): "The Strategic Commander",
        ("dolphin", "bear_wolf"): "The Empathetic Anchor",
        ("bear_wolf", "dolphin"): "The Empathetic Anchor",
        ("peacock", "dolphin"): "The Radiant Inspirer",
        ("dolphin", "peacock"): "The Radiant Inspirer",
        ("owl", "lion"): "The Sovereign Architect",
        ("lion", "owl"): "The Sovereign Architect",
        ("fox", "owl"): "The Analytical Tactician",
        ("owl", "fox"): "The Analytical Tactician",
        ("peacock", "fox"): "The Magnetic Charmer",
        ("fox", "peacock"): "The Magnetic Charmer",
        ("bear_wolf", "lion"): "The Protector King",
        ("lion", "bear_wolf"): "The Protector King",
        ("bear_wolf", "owl"): "The Stoic Sage",
        ("owl", "bear_wolf"): "The Stoic Sage"
    }
    
    pair = (primary_arch, secondary_arch) if secondary_arch else None
    title = hybrid_titles.get(pair, f"{centroids[primary_arch]['name']} Dominant")

    result = {
        "primary_archetype": {
            "key": primary_arch,
            "name": centroids[primary_arch]["name"],
            "subtitle": centroids[primary_arch]["subtitle"],
            "score_percentage": percentages[primary_arch],
            "superpower": centroids[primary_arch]["superpower"],
            "shadow_alert": centroids[primary_arch]["shadow_alert"]
        },
        "secondary_wing": {
            "key": secondary_arch,
            "name": centroids[secondary_arch]["name"],
            "subtitle": centroids[secondary_arch]["subtitle"],
            "score_percentage": percentages[secondary_arch]
        } if secondary_arch else None,
        "hybrid_profile_title": title,
        "all_percentages": percentages,
        "trait_vector": user_vector,
        "choice_frequencies": archetype_counts
    }

    return result

if __name__ == "__main__":
    # Self-test with balanced mock responses
    sample_answers = {f"Q{i:02d}": "C" for i in range(1, 19)}
    res = score_assessment(sample_answers)
    print(json.dumps(res, indent=2))
