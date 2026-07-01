# Rules Index Format

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

## Compact Index Entry

```md
<!-- retro-man:index:start -->
- [POS Unit Dropdown Must Stay Enabled](contracts/202606290509-pos-unit-dropdown-always-enabled.md)  
  `active` | `2026-06-29T05:09Z` | scope: `pos`, `ui-select`, `pos-units`  
  Normal-unit POS products keep the unit dropdown enabled; single-option selects stay clickable; special/no-unit products render a dash.
<!-- retro-man:index:end -->
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

## Summary Guidance

- Prefer `index_summary` when available.
- Combine frontmatter `summary` bullets into one sentence only when `index_summary` is absent.
- Keep the index summary under about 30 words.
- Prefer domain keywords in index scope over long file paths.
- Keep concrete file paths in the contract body and frontmatter.

If the helper script is unavailable, update the marker block manually using this format only after reading every markdown file under `docs/_rules/contracts/`. Manual fallback must include every parseable contract with `title` and `created_at`, not just newly created files.
