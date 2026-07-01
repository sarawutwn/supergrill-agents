---
name: create-plan
description: Plan implementation after a design or spec is approved. Use when the user asks to create or write an implementation plan, when grill/superGrill is ready to transition resolved decisions into code tasks, or when another skill needs TODO-ready, TDD-shaped, parallelizable task slices before implementation.
---

# Create Plan

Create an implementation plan, not code. The plan should let a skilled worker with little project context execute safely, test each slice, and avoid inventing scope.

Announce at the start:

```text
I'm using the create-plan skill to create the implementation plan.
```

## Inputs

Start only when the design, spec, or decision thread is resolved enough to plan. If a decision is still open, return to `grill-design` or ask the smallest blocking question.

Use repository evidence before writing tasks:

1. Inspect the current structure, relevant docs, and established patterns.
2. Identify the files or areas each task will create, modify, or test.
3. Name assumptions and risks that the plan depends on.

Completion criterion: every task in the plan can point to concrete files, behavior, or verification, or the unresolved gap is explicitly listed as a blocker.

## Output

Save plans to:

```text
docs/superpowers/plans/YYYY-MM-DD-<feature-name>.md
```

User preferences override this path. Follow the repository date policy when choosing the date. Do not commit or push from this skill.

## Planning Workflow

1. **Map the file structure** - list files to create, modify, and test. Prefer local patterns over new abstractions. Completion criterion: each file has one clear responsibility and each task owns a non-overlapping write scope unless a dependency says otherwise.
2. **Write the human header** - load [references/plan-template.md](references/plan-template.md) and fill the header with the current problem, proposed approach, assumptions, risks, and impact. Completion criterion: a reviewer can understand the plan's goal and tradeoffs before reading the task list.
3. **Create the task overview** - make it `Parallel-first:` by default. `Spawn separate sub-agents` for independent lanes. Every task row must include `Can run together`, `Must wait for`, and `TDD slice:`.
4. **Write task slices** - load [references/task-template.md](references/task-template.md). Each implementation task must include `REQUIRED SUB-SKILL: Use superpowers:test-driven-development`, RED -> GREEN -> REFACTOR steps, files, race risk, and exact verification commands.
5. **Validate the plan** - check that broad phases were not used where a behavior slice is possible. Do not parallelize tasks that can race on the same files, migrations, generated artifacts, fixtures, or shared state.

## Scope Control

If the requested work spans independent subsystems, split it into separate plans unless one plan can still produce working, testable software without cross-lane ambiguity.

Avoid speculative tasks. Every changed line requested by a task should trace back to the approved design or a verification need.

## Final Gate

Before handing off:

- The plan file exists at the selected path.
- Every implementation task has a test-first path or a documented docs/config-only exception.
- Every task names files, dependencies, race risks, and verification.
- No task asks workers to commit or push.
- Any unresolved decision is called out instead of hidden inside a task.
