---
name: create-plan
description: Use when grill agent ends loop question for create task, before touching code
---

# Create Plans

## Overview

Write comprehensive implementation plans assuming the engineer has zero context for our codebase and questionable taste. Document everything they need to know: which files to touch for each task, code, testing, docs they might need to check, how to test it. Give them the whole plan as bite-sized tasks. DRY. YAGNI. TDD. Frequent commits.

Assume they are a skilled developer, but know almost nothing about our toolset or problem domain. Assume they don't know good test design very well.

**Announce at start:** "I'm using the create-plans skill to create the implementation plan."

**Context:** If working in an isolated worktree, it should have been created via the `superpowers:using-git-worktrees` skill at execution time.

**Save plans to:** `docs/superpowers/plans/YYYY-MM-DD-<feature-name>.md`

- (User preferences for plan location override this default)

## Scope Check

If the spec covers multiple independent subsystems, it should have been broken into sub-project specs during brainstorming. If it wasn't, suggest breaking this into separate plans — one per subsystem. Each plan should produce working, testable software on its own.

## File Structure

Before defining tasks, map out which files will be created or modified and what each one is responsible for. This is where decomposition decisions get locked in.

- Design units with clear boundaries and well-defined interfaces. Each file should have one clear responsibility.
- You reason best about code you can hold in context at once, and your edits are more reliable when files are focused. Prefer smaller, focused files over large ones that do too much.
- Files that change together should live together. Split by responsibility, not by technical layer.
- In existing codebases, follow established patterns. If the codebase uses large files, don't unilaterally restructure - but if a file you're modifying has grown unwieldy, including a split in the plan is reasonable.

This structure informs the task decomposition. Each task should produce self-contained changes that make sense independently.

## Bite-Sized Task Granularity

**Each step is one action (2-5 minutes):**

- "Write the failing test" - step
- "Run it to make sure it fails" - step
- "Implement the minimal code to make the test pass" - step
- "Run the tests and make sure they pass" - step

## Plan Document Header

**Every plan MUST start with this header:**

Write the header for human readers first: use plain language, short paragraphs, and concrete examples from the current problem. The header should be easy for a reviewer, product owner, or engineer to skim before they read the task list. Implementation details can be more task-oriented in the sections after the header.

```markdown
# [Feature Name] Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** [One sentence describing what this builds]

**Estimated tasks:** N | **Estimated time:** ~X min | **Touches:** [layers e.g. API / DB / Frontend]

## Current Problem / Current Solution

[Describe the current problem, current behavior, or current solution in human-readable language. Focus on what exists today and why it is not enough.]

## Proposed Approach

[Describe the new behavior, new flow, or new solution in human-readable language. Focus on what will change and why this approach is better.]

## Side by Side

| Scenario | Before | After |
| -------- | ------ | ----- |
| [Briefly describe a scenario or flow] | [Current behavior] | [New behavior] |

## Assumptions & Risks

- **Assumed:** [Something the plan takes as true without verifying]
- **Assumed:** [Another assumption]
- **Risk:** [What could go wrong if an assumption is wrong]
- **Risk:** [Another potential failure point]

## Impact

- [Short impact 1]
- [Short impact 2]
- [Short impact 3]
- [Short impact 4]

---
```

The `Side by Side` section uses a three-column table: `Scenario`, `Before`, and `After`. `Scenario` describes the rough case or action. `Before` and `After` describe the behavior change. This format works for all feature types, not just access control.

## Task Overview

After the header, add a brief task index before the full task list. This lets a reviewer understand the full scope in under 30 seconds without scrolling through every task.

```markdown
## Task Overview

1. **[Task Name]** — [One-line description]
2. **[Task Name]** — [One-line description]
3. **[Task Name]** — [One-line description]

---
```

## Task Structure

````markdown
### Task N: [Component Name]

**Files:**

- Create: `exact/path/to/file.py`
- Modify: `exact/path/to/existing.py:123-145`
- Test: `tests/exact/path/to/test.py`

- [ ] **Step 1: Write the failing test**

```python
def test_specific_behavior():
    result = function(input)
    assert result == expected
```

- Batch execution with checkpoints for review
````