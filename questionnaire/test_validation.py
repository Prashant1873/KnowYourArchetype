#!/usr/bin/env python3
"""
Validation and Test Suite for Charisma Archetype Scoring Engine
Verifies classification accuracy on pure and blended response profiles.
"""

import sys
from scoring_engine import score_assessment

def run_tests():
    print("=== Starting Charisma Assessment Validation Suite ===\n")
    all_passed = True

    # 1. Pure Archetype Personas
    pure_cases = [
        ("Dolphin Pure", "A", "dolphin"),
        ("Fox Pure", "B", "fox"),
        ("Lion Pure", "C", "lion"),
        ("Owl Pure", "D", "owl"),
        ("Peacock Pure", "E", "peacock"),
        ("Bear/Wolf Pure", "F", "bear_wolf")
    ]

    for name, letter, expected_arch in pure_cases:
        answers = {f"Q{i:02d}": letter for i in range(1, 19)}
        result = score_assessment(answers)
        primary = result["primary_archetype"]["key"]
        pct = result["primary_archetype"]["score_percentage"]
        passed = (primary == expected_arch) and (pct >= 65.0)
        
        status = "[PASS]" if passed else "[FAIL]"
        print(f"{status} {name}: Classified as '{primary}' with {pct}% (Target >= 65.0%)")
        if not passed:
            all_passed = False

    # 2. Hybrid / Blended Personas
    hybrid_cases = [
        (
            "Fox-Owl Hybrid (Analytical Tactician)",
            {f"Q{i:02d}": ("B" if i % 2 == 1 else "D") for i in range(1, 19)},
            {"fox", "owl"}
        ),
        (
            "Dolphin-Peacock Hybrid (Radiant Inspirer)",
            {f"Q{i:02d}": ("A" if i % 2 == 1 else "E") for i in range(1, 19)},
            {"dolphin", "peacock"}
        ),
        (
            "Lion-Bear Hybrid (Protector King)",
            {f"Q{i:02d}": ("C" if i % 2 == 1 else "F") for i in range(1, 19)},
            {"lion", "bear_wolf"}
        )
    ]

    print("\n--- Hybrid Blend Tests ---")
    for name, answers, expected_set in hybrid_cases:
        result = score_assessment(answers)
        primary = result["primary_archetype"]["key"]
        secondary = result["secondary_wing"]["key"] if result["secondary_wing"] else None
        detected_set = {primary, secondary} if secondary else {primary}

        passed = (primary in expected_set) and (secondary in expected_set)
        status = "[PASS]" if passed else "[FAIL]"
        print(f"{status} {name}: Primary='{primary}', Secondary='{secondary}', Title='{result['hybrid_profile_title']}'")
        if not passed:
            all_passed = False

    # 3. Numerical Vector Integrity
    print("\n--- Numerical Integrity Checks ---")
    sample = {f"Q{i:02d}": ["A", "B", "C", "D", "E", "F"][(i - 1) % 6] for i in range(1, 19)}
    sample_res = score_assessment(sample)
    
    total_pct = sum(sample_res["all_percentages"].values())
    pct_valid = abs(total_pct - 100.0) <= 0.5
    print(f"[{'PASS' if pct_valid else 'FAIL'}] Percentage Sum Test: Total is {total_pct:.1f}% (Expected ~100.0%)")

    vec_valid = all(-1.0 <= val <= 1.0 for val in sample_res["trait_vector"].values())
    print(f"[{'PASS' if vec_valid else 'FAIL'}] Trait Range Test: Coordinates are within [-1.0, 1.0]")

    if not (pct_valid and vec_valid):
        all_passed = False

    print("\n=======================================================")
    if all_passed:
        print("ALL TESTS PASSED: Scoring engine is mathematically sound and verified.")
        sys.exit(0)
    else:
        print("TEST FAILURES DETECTED.")
        sys.exit(1)

if __name__ == "__main__":
    run_tests()
