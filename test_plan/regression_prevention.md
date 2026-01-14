# Test Plan: Regression Prevention & Cleanup
**Date:** 2026-01-15
**Status:** Draft / Pending Execution

This document defines the regression tests required to validate the cleanup of legacy UI elements and ensure the stability of the Overlay Z-Index fix.

## 1. Cleanup Validation (Legacy Removal)
**Context:** Verification that legacy "Guide" links have been successfully removed from the codebase.

### Test Case 1.1: Site Header
1.  **Action**: Inspect the top navigation bar.
2.  **Pass Criteria**:
    -   Navigation must **NOT** contain links labeled "Guide", "Tutorial", or "Help".
    -   Only [Home], [Random], [Categories], and [Search] links should be present.

### Test Case 1.2: Dashboard Results
1.  **Action**: Perform a search to enter Dashboard mode.
2.  **Action**: Inspect the "Reset" cluster (controls area).
3.  **Pass Criteria**:
    -   Cluster must **NOT** contain a `[?]` button.
    -   Only `[RESET]` and `RandomButton` should be visible.

## 2. Bug Verification: Z-Index Stacking
**Context:** Validating the fix for the Z-Index issue where the Overlay rendered behind the Console.

### Test Case 2.1: Overlay Layering
1.  **Action**: Open the Tutorial (Click `[?]` in Console).
2.  **Check**: Visual inspection of the "Glass" background.
3.  **Pass Criteria**:
    -   The Overlay MUST sit **ON TOP** of the Console's input fields.
    -   Input fields must appear "dimmed" and be unclickable behind the glass layer.
    -   Visual evidence: No bright/unblocked inputs visible through the overlay.

### Test Case 2.2: Code Structure
1.  **Action**: Code review of `SystemTutorial.tsx`.
2.  **Pass Criteria**: Z-Index is set to `z-[100]`.
3.  **Action**: Code review of `HomeOrchestrator.tsx`.
4.  **Pass Criteria**: The `{showTutorial && ...}` block is rendered **LAST** in the JSX return statement.

## 3. Persistence Override
**Context:** The "Recall" button must always work, even if the user has dismissed the tutorial previously.

### Regression Test
1.  **Scenario**:
    -   User completes tutorial -> `localStorage` sets `nicopedia_tutorial_seen = true`.
    -   Refresh Page -> Tutorial does not auto-show (Correct).
    -   Click `[?]` Button -> Tutorial **MUST** show.
    -   **Failure State**: Clicking the button does nothing because it checks `localStorage` again. (The logic must bypass the check).
