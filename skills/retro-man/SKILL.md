---
name: retro-man
description: Manual-only post-session contract writer. Use this skill only when the user explicitly names retro-man or directly asks to run retro-man. Do not infer usage from phrases like closing a session, finishing work, or creating docs unless retro-man is explicitly requested. When manually invoked, record durable rules, contracts, and short specs into docs/_rules for future grill-design review.
license: MIT
compatibility: opencode
metadata:
  tags: retrospective,contracts,rules,specs,project-memory
  invocation: manual-only
---

# Retro-Man

`retro-man` is a manual-only post-session contract writer. Its job is to preserve durable rules, contracts, and short specs from completed work so future sessions can discover and discuss them.

Do not use this skill unless the user explicitly invokes `retro-man` by name or directly asks to run `retro-man`.

This skill does not detect or argue about conflicts. Conflict detection belongs to a separate design/review skill such as `grill-design`. `retro-man` only writes clear, grounded records that make later conflict detection possible.

## Core responsibilities

When invoked after meaningful work:

1. Inspect the repository state lightly so the record is grounded in artifacts, not memory alone.
2. Decide whether the completed session produced any durable rule, contract, or short spec.
3. If there is no durable contract to record, do not create a file.
4. If there is a durable contract, create one session contract file under `docs/_rules/contracts/`.
5. Regenerate the marked contract list in `docs/_rules/index.md`.
6. Report changed paths. Do not commit.

## What counts as durable

Record constraints that future agents must respect, such as:

- A behavior rule that future features must not violate.
- A contract around data storage, transaction boundaries, APIs, permissions, events, or file ownership.
- A short spec that establishes how future work should approach a recurring domain or workflow.
- A decision that should trigger discussion if a later requirement conflicts with it.

Do not record:

- Ordinary changelog entries.
- Every file changed in the session.
- Temporary implementation notes.
- Refactors that do not establish future constraints.
- Typos, small test-only changes, or cleanup with no durable rule.

If no durable rule, contract, or short spec exists, respond with:

```text
No durable contract to record.
```

Do not create a contract file or update the index in that case.

## Repository structure

Use this structure:

```text
docs/
  _rules/
    index.md
    contracts/
      YYYYMMDDHHMM-slug.md
```

If `docs/_rules/index.md` or `docs/_rules/contracts/` does not exist, create the missing structure before writing a contract.

Bootstrap `docs/_rules/index.md` with:

```md
# Rules Index

This index lists durable session contracts that future agents should read before changing related behavior.

## Contracts

<!-- retro-man:index:start -->
_No session contracts recorded yet._
<!-- retro-man:index:end -->
```

Only edit content between:

```md
<!-- retro-man:index:start -->
<!-- retro-man:index:end -->
```

Preserve all manual content outside those markers.

## File naming

Name each contract file:

```text
docs/_rules/contracts/YYYYMMDDHHMM-slug.md
```

Rules:

- Use UTC time only.
- Use `YYYYMMDDHHMM` with no separators.
- Use a short lowercase slug with hyphens.
- Do not add random IDs or hashes by default.
- If the target filename already exists, do not overwrite it silently. Ask before choosing a suffix or replacing the file.

Follow the repository's date policy. If the repository requires `dayjs`, use `dayjs.utc()` with the UTC plugin and do not use native JavaScript `Date`. If no approved way to compute the UTC timestamp is available, ask the user for the UTC timestamp rather than guessing.

## Contract file template

Each contract file must start with YAML frontmatter:

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

Required frontmatter fields:

- `title`: readable contract title.
- `slug`: filename/grouping slug.
- `created_at`: UTC ISO8601 timestamp.
- `session_type`: one of `feature`, `bugfix`, `refactor`, `architecture`, `process`, or another clear category when needed.
- `scope`: keywords, paths, modules, data stores, or domain concepts that help future skills match relevant contracts.
- `summary`: one to three concise bullets for the index.
- `status`: usually `active`.

Optional frontmatter fields:

- `index_summary`: one compact routing sentence for `docs/_rules/index.md`; preferred when the full summary bullets are too long.
- `supersedes`: list of older contract paths this new contract replaces or changes.
- `related`: list of related contract paths.

## Writing rules

Write contract records in a decision-oriented style:

- Start each rule with a direct normative statement.
- Prefer concrete file paths, identifiers, data stores, API names, or commands over vague references.
- Explain `Why` so future agents understand the tradeoff, not just the command.
- Keep `Contract` bullets testable or reviewable.
- Use `Applies when` to prevent over-broad interpretation.
- Use `Evidence` to ground the rule in repository artifacts.
- Use `Uncertainties` when evidence is incomplete. Do not invent confident rules.

The record should be short enough for future agents to read, but precise enough to trigger discussion when a later requirement conflicts with it.

## Supersession policy

Use append-only supersession in v1.

If a new session changes or replaces an older contract, write a new contract file and add:

```yaml
supersedes:
  - contracts/202606290725-usecase.md
```

Do not automatically edit the old contract's `status`. Changing older contract status is a team decision or a separate workflow.

## Grounding workflow

Before writing:

1. Inspect `git status --short`.
2. Inspect relevant diffs or changed files.
3. Read source/docs files that support the contract.
4. Identify durable rules and scopes.
5. If evidence is weak, either ask a targeted question or record the uncertainty.

Ask only when ambiguity could make the contract wrong, such as:

- The title or slug is unclear.
- The rule would be broader than the completed work supports.
- Evidence is insufficient for an important rule.
- A filename collision exists.
- The session appears to supersede an older contract and the user must decide how to handle it.

Otherwise, write autonomously.

## Index update

After writing a contract file, regenerate `docs/_rules/index.md` from contract metadata.

If this skill is installed at `.opencode/skills/retro-man/`, run:

```bash
bun .opencode/skills/retro-man/scripts/update-rules-index.mjs
```

The index should:

- Be a compact routing table, not a mini contract.
- Preserve manual content outside the marker block.
- Show `active` contracts first.
- Show other statuses after active contracts.
- Sort newest first by `created_at` within each status group.
- Use one bullet entry per contract.
- Show the contract title as a link.
- Show status, compact created timestamp, and compact scope inline on the next line.
- Show one short routing summary sentence on the next line.
- Keep detailed rules, evidence, and full summaries inside the contract file.
- Show `supersedes:` inline only when present.

Use this compact index format:

```md
<!-- retro-man:index:start -->
- [POS Unit Dropdown Must Stay Enabled](contracts/202606290509-pos-unit-dropdown-always-enabled.md)  
  `active` | `2026-06-29T05:09Z` | scope: `pos`, `ui-select`, `pos-units`  
  Normal-unit POS products keep the unit dropdown enabled; single-option selects stay clickable; special/no-unit products render a dash.
<!-- retro-man:index:end -->
```

Index summary guidance:

- Prefer `index_summary` when available.
- Combine frontmatter `summary` bullets into one sentence only when `index_summary` is absent.
- Keep the index summary under about 30 words.
- Prefer domain keywords in index scope over long file paths.
- Keep concrete file paths in the contract body and frontmatter.

If the helper script is unavailable, update the marker block manually using the same format.

## Git policy

Never commit or push. `retro-man` creates or updates files only. The user or team decides commit scope and timing.

## Final response

End with a concise report:

```text
Recorded durable session contract.

Created:
- docs/_rules/contracts/YYYYMMDDHHMM-slug.md

Updated:
- docs/_rules/index.md

No commit was created.
```

If nothing durable was recorded:

```text
No durable contract to record.
No files changed.
```
