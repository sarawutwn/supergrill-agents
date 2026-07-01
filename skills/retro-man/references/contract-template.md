# Contract Template

Use this template for every `docs/_rules/contracts/*.md` file.

```md
---
title: Usecase Writing Contract
slug: usecase
created_at: 2026-06-29T07:25:00Z
session_type: feature
scope:
  - usecases
  - transaction.db
summary:
  - Usecases describe user-visible behavior before implementation details.
  - Transaction boundaries must be stated when a usecase writes to transaction.db.
index_summary: Usecases define user-visible behavior and must state transaction boundaries when writing transaction.db.
status: active
---

# Session Contract: Usecase Writing

## Context

Shortly explain what was completed and why this contract exists.

## Rules

### Rule: Usecases Describe Behavior

Usecases must describe user-visible behavior before implementation details.

#### Why

Explain why this rule matters and what future confusion it prevents.

#### Contract

- State the durable requirement.
- Name concrete modules, files, commands, data stores, or API boundaries when relevant.
- Keep the rule specific enough that future agents can compare new requirements against it.

#### Applies when

- Describe the future work situations where this rule should be considered.

## Evidence

- `path/to/relevant-file.ext`
- `path/to/changed-doc.md`

## Uncertainties

- None
```

## Required Frontmatter

- `title`: readable contract title.
- `slug`: filename/grouping slug.
- `created_at`: UTC ISO8601 timestamp.
- `session_type`: one of `feature`, `bugfix`, `refactor`, `architecture`, `process`, or another clear category when needed.
- `scope`: keywords, paths, modules, data stores, or domain concepts that help future skills match relevant contracts.
- `summary`: one to three concise bullets for the index.
- `status`: usually `active`.

## Optional Frontmatter

- `index_summary`: one compact routing sentence for `docs/_rules/index.md`; preferred when summary bullets are too long.
- `supersedes`: list of older contract paths this new contract replaces or changes.
- `related`: list of related contract paths.

Use append-only supersession in v1. If a new session changes or replaces an older contract, write a new contract file and add:

```yaml
supersedes:
  - contracts/202606290725-usecase.md
```

Do not automatically edit the old contract's `status`. Changing older contract status is a team decision or a separate workflow.

## Writing Rules

- Start each rule with a direct normative statement.
- Prefer concrete file paths, identifiers, data stores, API names, or commands over vague references.
- Explain `Why` so future agents understand the tradeoff, not just the command.
- Keep `Contract` bullets testable or reviewable.
- Use `Applies when` to prevent over-broad interpretation.
- Use `Evidence` to ground the rule in repository artifacts.
- Use `Uncertainties` when evidence is incomplete. Do not invent confident rules.

The record should be short enough for future agents to read, but precise enough to trigger discussion when a later requirement conflicts with it.
