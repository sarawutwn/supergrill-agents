# Plan Template

Use this template for the top of every implementation plan. Keep the prose human-readable; the task list can be more mechanical.

```markdown
# [Feature Name] Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** [One sentence describing what this builds]

**Estimated tasks:** N | **Estimated time:** ~X min | **Touches:** [layers e.g. API / DB / Frontend]

## Current Problem / Current Solution

[Describe the current problem, current behavior, or current solution. Focus on what exists today and why it is not enough.]

## Proposed Approach

[Describe the new behavior, new flow, or new solution. Focus on what will change and why this approach is better.]

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

## Task Overview

Add a short task index after the header so a reviewer can understand the scope quickly.

```markdown
## Task Overview

> **For implementation tasks:** REQUIRED SUB-SKILL: Use superpowers:test-driven-development before editing production code. Each task is a RED -> GREEN -> REFACTOR slice.
> **Parallel-first:** Spawn separate sub-agents for independent lanes. Do not parallelize tasks that can race on the same files, migrations, generated artifacts, or shared state.

1. **[Task Name]** - Lane A | Can run together: [Task N, Task M] | Must wait for: [none/task] | TDD slice: [failing test] -> [minimal code] -> [verification]
2. **[Task Name]** - Lane B | Can run together: [Task N] | Must wait for: [none/task] | TDD slice: [failing test] -> [minimal code] -> [verification]
3. **[Task Name]** - Sequential if needed | Can run together: [none] | Must wait for: [task/reason] | TDD slice: [failing test] -> [minimal code] -> [verification]

---
```

The `Side by Side` table works for any behavior change. `Scenario` names the rough case or action; `Before` and `After` name the observable change.
