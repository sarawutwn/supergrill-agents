# Supergrill Agents for OpenCode

[Read in Thai](README.th.md)

`supergrill-agents` is an OpenCode agent and skill pack for teams and solo developers who want a Superpowers-first workflow ready to use across projects.

It installs a reusable agent profile and companion skills into your OpenCode global configuration. After installation, OpenCode can load the agent and skills from any workspace without copying files into each project.

## What This Project Provides

- `superGrill`: the main OpenCode agent profile for the workflow.
- `create-plan`: a skill for turning approved designs into clear implementation plans.
- `grill-design`: a skill for shaping project ideas into structured designs.
- `caveman`: a compact communication mode for shorter, lower-token responses.

The installer places these files in your OpenCode config directory:

```text
<opencode-config>/
  agents/
    superGrill.md
  skills/
    caveman/
      SKILL.md
    create-plan/
      SKILL.md
    grill-design/
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
