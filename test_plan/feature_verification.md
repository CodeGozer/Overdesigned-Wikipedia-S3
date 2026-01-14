# Test Plan: Correlation & Guidance Systems
**Date:** 2026-01-15
**Status:** Draft / Pending Execution

This document outlines the test strategy and acceptance criteria for the upcoming "Correlation Modes & Grid Tutorial" feature sprint.

## 1. Feature: Correlation Modes
**Location:** `FinderConsole.tsx`, `interest_engine.ts`
**Objective:** Verify that users can choose between independent search vectors (Parallel) or combined queries (Synthesis).

### Test Case 1.1: UI Availability
1.  **Action**: Navigate to root URL.
2.  **Check**: Verify the **Processing Mode** toggle exists next to the Signal Depth slider.
3.  **Check**: Ensure default state is **|| PARALLEL** (Neon Green).
4.  **Action**: Click **∩ SYNTHESIS**.
5.  **Pass Criteria**: Toggle turns Hot Pink and status text updates to `> CROSS-VECTOR INTERSECTION`.

### Test Case 1.2: Synthesis Logic
1.  **Action**: Enter vectors `Star Wars` and `Lego` in Synthesis Mode.
2.  **Action**: Click `Calculate Correlations`.
3.  **Pass Criteria**:
    -   Loading Screen text displays: `/// CALCULATING_CROSS_VECTOR_INTERSECTION ///`.
    -   Results Grid returns intersection items (e.g., "Lego Star Wars").
    -   Results are a mix of Wikipedia and Fandom sources.

### Test Case 1.3: Fallback Logic
1.  **Action**: Enter non-overlapping vectors (e.g., `Toaster`, `Gandalf`) in Synthesis Mode.
2.  **Action**: Click `Calculate Correlations`.
3.  **Pass Criteria**: System logs warning and falls back to independent (Parallel) search results.

## 2. Feature: System Tutorial (Glass HUD)
**Location:** `SystemTutorial.tsx`, `FinderConsole.tsx`, `HomeOrchestrator.tsx`
**Objective:** An overlay that guides the user through the complex "Discovery Engine" UI.

### Verification Steps
1.  **Styling Check (The "Glass" Effect)**:
    -   Click the **[?]** button (Top-Right of Console) or ensure it triggers on first visit.
    -   **Critical**: The background must be **Transparent Black (`bg-black/50`)** with a **Blur (`backdrop-blur-sm`)**.
    -   You MUST be able to see the Console Inputs *through* the overlay.
    -   The Z-Index must be higher than the inputs (Overlay `z-[100]` vs Console `z-40`).

2.  **Content Check**:
    -   Verify 5 distinct targets are highlighted with Neon Green lines/text:
        1.  `/// INJECT SEARCH VECTORS` (Input)
        2.  `/// CALIBRATE SIGNAL DEPTH` (Slider)
        3.  `/// SELECT PROCESSING MODE` (Toggle - *New*)
        4.  `/// MULTI-THREADING ACTIVE` (Slots)
        5.  `/// SUGGESTED PRESETS` (Suggestions Ticker - *New*)

3.  **Dismissal**:
    -   Press **ENTER** or click "ACKNOWLEDGE PROTOCOL".
    -   Overlay should vanish completely.

## 3. Feature: Persistent Guide Button
**Location:** `FinderConsole.tsx` (Top-Right Absolute)
**Objective:** A "Recall" button to bring the tutorial back at any time.

### Verification Steps
1.  **Visibility**:
    -   Look at the top-right corner of the Finder Console container.
    -   Verify a `[?]` button exists.
    -   Hover over it: Verification label `/// INITIALIZE_GUIDE` should slide in.

2.  **Functionality**:
    -   Click the button.
    -   **Expected Result**: The System Tutorial overlay reappears immediately, overriding any `localStorage` "seen" state.

## 4. Future Scope: Federated Autocomplete
**Status:** Planned / Not Started

The input field upgrade for Federated Autocomplete (Wiki + Fandom suggestions) is out of scope for this test plan and will be covered in a subsequent document.
