# OpenCode Installer Design

## Goal

Add curl-installable scripts that install the `superGrill` OpenCode agent and the `create-plan` and `grill-design` skills into a user's global OpenCode config directory.

## Context

The repository currently contains:

- `agents/superGrill.md`
- `skills/create-plan/SKILL.md`
- `skills/grill-design/SKILL.md`
- a minimal `README.md`

OpenCode loads global Markdown agents from an `agents` directory under the global config path, and global skills from `skills/<name>/SKILL.md` under the same config path. The installer should place this repository's files into those locations.

## Confirmed Decisions

- Default macOS/Linux target: `~/.config/opencode`
- Default Windows target: `%APPDATA%\opencode`
- Both installers should allow `OPENCODE_CONFIG_DIR` to override the target directory.
- Existing installed files should be overwritten immediately.
- Windows should have a native PowerShell installer instead of requiring Git Bash or WSL.
- The README should include Thai and English sections.
- The README should recommend installing the `obra/superpowers` skill for best results.

## Proposed Files

- `install.sh`
  - POSIX shell installer for macOS, Linux, and Git Bash.
  - Supports `GRILL_AGENTS_REF` to choose the git ref, defaulting to `main`.
  - Downloads files from GitHub raw URLs and writes them into the OpenCode config directory.

- `install.ps1`
  - PowerShell installer for Windows.
  - Supports `GRILL_AGENTS_REF`, defaulting to `main`.
  - Uses `$env:OPENCODE_CONFIG_DIR` when set, otherwise `$env:APPDATA\opencode`.
  - Downloads the same files as `install.sh`.

- `README.md`
  - Explains what gets installed.
  - Shows macOS/Linux and Windows commands.
  - Documents environment overrides.
  - Includes Thai and English sections.
  - Includes the Superpowers recommendation and reference link.

## Install Layout

```text
<opencode-config>/
  agents/
    superGrill.md
  skills/
    create-plan/
      SKILL.md
    grill-design/
      SKILL.md
```

## Error Handling

- Stop on failed downloads.
- Create destination directories before writing files.
- Print the target config directory and installed files.
- Do not create backups before overwriting.

## Testing

- Run shell syntax validation for `install.sh`.
- Run PowerShell syntax validation if PowerShell is available in the local environment.
- Run installers against a temporary `OPENCODE_CONFIG_DIR` to verify file placement and overwrite behavior without touching the user's real OpenCode config.

## Scope

This change only installs files from this repository. It does not install OpenCode itself, install Superpowers automatically, modify `opencode.json`, or prompt users before overwriting files.
