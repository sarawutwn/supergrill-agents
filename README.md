# Supergrill Agents for OpenCode

[Read in Thai](README.th.md)

`supergrill-agents` is an OpenCode agent and skill pack for teams and solo developers who want a Superpowers-first workflow ready to use across projects.

It installs a reusable agent profile and companion skills into your OpenCode global configuration. After installation, OpenCode can load the agent and skills from any workspace without copying files into each project.

## How To Use

1. `@superGrill` - start the planning loop: explore project context -> grill decisions -> define goals -> write the spec -> create TODO-ready implementation tasks. Expect approval or question gates at each step.
2. `@autopilot` - execute an approved `create-plan` implementation plan. It orchestrates `general` subagents, sequences dependent tasks, runs verification, and finishes with a `scrutinize` review.
3. `/retro-man` - after meaningful work, capture durable lessons, contracts, and rules into `docs/_rules` for future design reviews.

## What This Project Provides

### Agents

- `superGrill`: the main OpenCode agent profile for the workflow.
- `autopilot`: an orchestration agent for executing approved implementation plans.
- `explore`: a read-only codebase navigation subagent.
- `general`: a general-purpose subagent for parallel execution lanes.

### Skills

- `caveman`: a compact communication mode for shorter, lower-token responses.
- `create-plan`: a skill for turning approved designs into clear implementation plans.
- `grill-design`: a skill for shaping project ideas into structured designs.
- `guideline`: a skill for avoiding common LLM coding mistakes with surgical, verifiable changes.
- `retro-man`: a manual-only post-session contract writer.
- `scrutinize`: an outsider-perspective review skill for plans, PRs, diffs, designs, and code changes.

The installer places these files in your OpenCode config directory:

```text
<opencode-config>/
  agents/
    autopilot.md
    explore.md
    general.md
    superGrill.md
  skills/
    caveman/
      SKILL.md
	    create-plan/
	      SKILL.md
	      references/
	        plan-template.md
	        task-template.md
    grill-design/
      SKILL.md
    guideline/
      SKILL.md
	    retro-man/
	      SKILL.md
	      references/
	        contract-template.md
	        index-format.md
	      scripts/
	        update-rules-index.mjs
    scrutinize/
      SKILL.md
```

## Requirements

- [OpenCode](https://opencode.ai/) must be installed.
- On macOS, Linux, or Git Bash, the installer requires either `curl` or `wget`.
- On Windows, run the installer with PowerShell.
- For the full workflow, install the Superpowers skill set as well: [obra/superpowers](https://github.com/obra/superpowers).
- For local development and testing in this repository, use [Bun](https://bun.sh/).

## Installation

### macOS, Linux, or Git Bash

```sh
curl -fsSL https://raw.githubusercontent.com/sarawutwn/supergrill-agents/main/install.sh | sh
```

### Windows PowerShell

```powershell
irm https://raw.githubusercontent.com/sarawutwn/supergrill-agents/main/install.ps1 | iex
```

## Install Location

By default, the installer writes files to the global OpenCode config directory for your operating system:

- macOS, Linux, or Git Bash: `~/.config/opencode`
- Windows PowerShell: `%APPDATA%\opencode`

OpenCode loads global agents from `agents/` and global skills from `skills/<name>/SKILL.md` inside this config directory.

## Updating

Run the same installation command again to update the files. The installer downloads the selected git ref and overwrites the existing files immediately. It does not create backups.

## Configuration

### Change the OpenCode Config Directory

Use `OPENCODE_CONFIG_DIR` when you want to install into a custom OpenCode config location.

macOS, Linux, or Git Bash:

```sh
curl -fsSL https://raw.githubusercontent.com/sarawutwn/supergrill-agents/main/install.sh | OPENCODE_CONFIG_DIR="$HOME/.config/opencode" sh
```

Windows PowerShell:

```powershell
$env:OPENCODE_CONFIG_DIR="$env:APPDATA\opencode"; irm https://raw.githubusercontent.com/sarawutwn/supergrill-agents/main/install.ps1 | iex
```

### Install From a Specific Ref

Use `SUPERGRILL_AGENTS_REF` to install from a branch, tag, or commit. The old `GRILL_AGENTS_REF` variable is still accepted as a compatibility fallback.

macOS, Linux, or Git Bash:

```sh
curl -fsSL https://raw.githubusercontent.com/sarawutwn/supergrill-agents/main/install.sh | SUPERGRILL_AGENTS_REF="main" sh
```

Windows PowerShell:

```powershell
$env:SUPERGRILL_AGENTS_REF="main"; irm https://raw.githubusercontent.com/sarawutwn/supergrill-agents/main/install.ps1 | iex
```

## License

This project is distributed under the MIT License. It includes adapted MIT-licensed material from:

- [mattpocock/skills](https://github.com/mattpocock/skills) for `skills/caveman`.
- [thaitype/chief](https://github.com/thaitype/chief) for `skills/grill-design`.
- [obra/superpowers](https://github.com/obra/superpowers) for the Superpowers-first workflow and the `writing-plans` material adapted into `skills/create-plan`.

See [LICENSE](LICENSE) and [NOTICE.md](NOTICE.md) for the full license text and upstream notices.
