---
name: retro-man
description: Manual-only post-session contract writer. Invoke only when the user explicitly names retro-man or asks to run retro-man; then record durable rules, contracts, and short specs into docs/_rules for future grill-design review.
license: MIT
compatibility: opencode
metadata:
  tags: retrospective,contracts,rules,specs,project-memory
  invocation: manual-only
---

# Retro-Man

`retro-man` records durable project contracts after meaningful work. It writes grounded records that future `grill-design` sessions can read before proposing changes.

Do not infer this skill from phrases like "finish up", "close the session", or "write docs" unless the user explicitly names `retro-man` or directly asks to run it.

Conflict detection belongs to design/review skills such as `grill-design`. `retro-man` only records evidence-backed contracts and uncertainties.

## Core Workflow

When invoked:

1. Inspect `git status --short`.
2. Inspect relevant diffs or changed files.
3. Read source/docs files that support the potential contract.
4. Decide whether the completed work produced a durable rule, contract, or short spec.
5. If nothing durable exists, create no files and respond exactly:

   ```text
   No durable contract to record.
   ```

6. If a durable contract exists, create one file under `docs/_rules/contracts/`.
7. Regenerate the full marked contract list in `docs/_rules/index.md` from every existing contract file.
8. Report changed paths. Do not commit or push.

Completion criterion: every recorded rule is supported by repository evidence, has a clear scope, and is specific enough for a future agent to compare new requirements against it.

## Durable Filter

Record:

- Behavior rules future features must not violate.
- Contracts around data storage, transaction boundaries, APIs, permissions, events, or file ownership.
- Short specs for recurring domains or workflows.
- Decisions that should trigger discussion if later requirements conflict.

Do not record:

- Ordinary changelog entries.
- Every file changed in the session.
- Temporary implementation notes.
- Refactors that do not establish future constraints.
- Typos, small test-only changes, or cleanup with no durable rule.

## Repository Structure

Use this structure:

```text
docs/
  _rules/
    index.md
    contracts/
      YYYYMMDDHHMM-slug.md
```

Create missing directories only when there is a durable contract to write. If no durable contract exists, leave `docs/_rules` unchanged.

## Contract File

Name each contract file:

```text
docs/_rules/contracts/YYYYMMDDHHMM-slug.md
```

Rules:

- Use UTC time only.
- Use `YYYYMMDDHHMM` with no separators.
- Use a short lowercase slug with hyphens.
- Do not add random IDs or hashes by default.
- If the target filename already exists, ask before choosing a suffix or replacing the file.

Follow the repository's date policy. If the repository requires `dayjs`, use `dayjs.utc()` with the UTC plugin and do not use native JavaScript `Date`. If no approved way to compute the UTC timestamp is available, ask the user for the UTC timestamp rather than guessing.

Load [references/contract-template.md](references/contract-template.md) before writing the contract body.

## Index Update

After writing a contract file, regenerate `docs/_rules/index.md` from all contract metadata, not just the current session's file.

Before updating the index, list `docs/_rules/contracts/*.md` from the filesystem. Do not rely only on `git status`, codegraph, or diff output because ignored contract files still belong in the index.

Use the helper script whenever it is available. Resolve it in this order:

1. Project install: `.opencode/skills/retro-man/scripts/update-rules-index.mjs`
2. Global OpenCode install: `$HOME/.config/opencode/skills/retro-man/scripts/update-rules-index.mjs`

Run the helper from the repository root:

```bash
bun .opencode/skills/retro-man/scripts/update-rules-index.mjs
```

or:

```bash
bun "$HOME/.config/opencode/skills/retro-man/scripts/update-rules-index.mjs"
```

Load [references/index-format.md](references/index-format.md) if the helper is unavailable or if you need to inspect the expected compact index format.

After the helper runs, compare its reported output count with the filesystem count of `docs/_rules/contracts/*.md`. If the helper output count is lower, stop and investigate before reporting success.

The helper is fail-closed. If any markdown file under `docs/_rules/contracts/` has missing frontmatter or required metadata, fix the metadata or ask the user before continuing; do not delete or ignore an invalid contract to make the index update pass.

## Ask Only When Needed

Ask a targeted question only when ambiguity could make the contract wrong:

- The title or slug is unclear.
- The rule would be broader than the completed work supports.
- Evidence is insufficient for an important rule.
- A filename collision exists.
- The session appears to supersede an older contract and the user must decide how to handle it.

Otherwise, write autonomously and record uncertainty in the contract.

## Final Response

If a contract was recorded:

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
