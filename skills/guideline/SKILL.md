---
name: guideline
description: Guardrails for careful coding work. Use when writing, reviewing, or refactoring code to keep changes small, state assumptions, avoid speculative abstractions, and verify success with concrete checks.
---

# Guideline

Use this as a preflight and completion gate for coding work.

## 1. Preflight

Before implementing:

- State the goal in one sentence.
- Name assumptions that affect behavior, data, security, or user-visible output.
- If multiple interpretations exist, present the options instead of choosing silently.
- If a simpler approach would satisfy the request, recommend it before coding.
- If a blocking ambiguity remains, ask the smallest question that resolves it.

Completion criterion: the next edit is tied to a goal, an assumption, or an explicit user decision.

## 2. Simplicity First

**Minimum code that solves the problem. Nothing speculative.**

- No features beyond what was asked.
- No abstractions for single-use code.
- No "flexibility" or "configurability" that wasn't requested.
- No error handling for impossible scenarios.
- If you write 200 lines and it could be 50, rewrite it.

Ask: "Would a senior engineer say this is overcomplicated?" If yes, simplify.

## 3. Surgical Changes

**Touch only what you must. Clean up only your own mess.**

When editing existing code:
- Don't "improve" adjacent code, comments, or formatting.
- Don't refactor things that aren't broken.
- Match existing style, even if you'd do it differently.
- If you notice unrelated dead code, mention it - don't delete it.

When your changes create orphans:
- Remove imports/variables/functions that YOUR changes made unused.
- Don't remove pre-existing dead code unless asked.

Completion criterion: every changed line traces to the user's request, a failing check, or cleanup made necessary by your own edit.

## 4. Goal-Driven Execution

**Define success criteria. Loop until verified.**

Transform tasks into verifiable goals:
- "Add validation" → "Write tests for invalid inputs, then make them pass"
- "Fix the bug" → "Write a test that reproduces it, then make it pass"
- "Refactor X" → "Ensure tests pass before and after"

For multi-step tasks, state a brief plan:
```
1. [Step] → verify: [check]
2. [Step] → verify: [check]
3. [Step] → verify: [check]
```

Final gate: report what changed, what verification ran, and any residual risk. Do not claim success without a matching check.
