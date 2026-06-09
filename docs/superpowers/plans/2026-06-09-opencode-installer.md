# OpenCode Installer Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build curl-installable OpenCode installers for the `superGrill` agent and the `create-plan` and `grill-design` skills, then document usage in Thai and English.

**Architecture:** Add small platform-specific installers at the repository root. Each installer resolves the OpenCode config directory, creates the expected `agents` and `skills` directories, downloads the repository files from a configurable raw base URL, and overwrites existing files. Add Bun tests that run the installers against temporary config directories and a local HTTP fixture server.

**Tech Stack:** POSIX shell, PowerShell, Markdown, Bun built-in test runner.

---

## File Structure

- Create: `install.sh`
  - POSIX installer for macOS, Linux, and Git Bash.
  - Uses `curl` or `wget`.
  - Supports `OPENCODE_CONFIG_DIR`, `GRILL_AGENTS_REF`, and `GRILL_AGENTS_BASE_URL`.

- Create: `install.ps1`
  - PowerShell installer for Windows.
  - Uses `Invoke-WebRequest`.
  - Supports `OPENCODE_CONFIG_DIR`, `GRILL_AGENTS_REF`, and `GRILL_AGENTS_BASE_URL`.

- Create: `package.json`
  - Defines Bun scripts for tests and shell syntax checks.

- Create: `tests/install.test.ts`
  - Starts a local Bun HTTP server that serves repository files.
  - Runs each installer into a temporary config directory.
  - Verifies exact installed file contents and overwrite behavior.
  - Skips PowerShell runtime tests when `pwsh` is not installed.

- Modify: `README.md`
  - Replace minimal content with Thai and English documentation.

## Task 1: Add Installer Tests First

**Files:**

- Create: `package.json`
- Create: `tests/install.test.ts`

- [ ] **Step 1: Create Bun test script definitions**

```json
{
  "name": "grill-agents",
  "private": true,
  "type": "module",
  "scripts": {
    "test": "bun test",
    "check:sh": "sh -n install.sh",
    "check:ps": "sh -c 'if command -v pwsh >/dev/null 2>&1; then pwsh -NoProfile -Command \"$null = [System.Management.Automation.Language.Parser]::ParseFile('\"'\"'install.ps1'\"'\"', [ref]$null, [ref]$null)\"; else echo \"Skipping PowerShell syntax check: pwsh is not installed.\"; fi'",
    "check": "bun run check:sh && bun run check:ps && bun test"
  }
}
```

- [ ] **Step 2: Write tests for shell installer behavior**

```ts
import { afterEach, beforeEach, describe, expect, test } from "bun:test";
import { mkdirSync, mkdtempSync, readFileSync, rmSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";

const repoRoot = new URL("..", import.meta.url).pathname;
const files = [
  ["agents/superGrill.md", "agents/superGrill.md"],
  ["skills/create-plan/SKILL.md", "skills/create-plan/SKILL.md"],
  ["skills/grill-design/SKILL.md", "skills/grill-design/SKILL.md"],
] as const;

let server: ReturnType<typeof Bun.serve> | undefined;
let tempRoot = "";

beforeEach(() => {
  tempRoot = mkdtempSync(join(tmpdir(), "grill-agents-test-"));
  server = Bun.serve({
    port: 0,
    fetch(request) {
      const url = new URL(request.url);
      const prefix = "/sarawutwn/grill-agents/test-ref/";
      if (!url.pathname.startsWith(prefix)) {
        return new Response("Not found", { status: 404 });
      }
      const relativePath = url.pathname.slice(prefix.length);
      const file = Bun.file(join(repoRoot, relativePath));
      return new Response(file);
    },
  });
});

afterEach(() => {
  server?.stop(true);
  server = undefined;
  if (tempRoot) {
    rmSync(tempRoot, { recursive: true, force: true });
  }
});

function installedPath(configDir: string, relativePath: string) {
  return join(configDir, relativePath);
}

function writeExistingFile(path: string) {
  mkdirSync(join(path, ".."), { recursive: true });
  writeFileSync(path, "old content");
}

function assertInstalledFiles(configDir: string) {
  for (const [source, destination] of files) {
    expect(readFileSync(installedPath(configDir, destination), "utf8")).toBe(
      readFileSync(join(repoRoot, source), "utf8"),
    );
  }
}

async function runCommand(command: string[], env: Record<string, string>) {
  const proc = Bun.spawn(command, {
    cwd: repoRoot,
    env: { ...process.env, ...env },
    stdout: "pipe",
    stderr: "pipe",
  });
  const [stdout, stderr, exitCode] = await Promise.all([
    new Response(proc.stdout).text(),
    new Response(proc.stderr).text(),
    proc.exited,
  ]);
  return { stdout, stderr, exitCode };
}

describe("install.sh", () => {
  test("installs files into OPENCODE_CONFIG_DIR and overwrites old contents", async () => {
    const configDir = join(tempRoot, "opencode");
    const oldAgentPath = installedPath(configDir, "agents/superGrill.md");
    writeExistingFile(oldAgentPath);

    const result = await runCommand(["sh", "install.sh"], {
      OPENCODE_CONFIG_DIR: configDir,
      GRILL_AGENTS_REF: "test-ref",
      GRILL_AGENTS_BASE_URL: `http://127.0.0.1:${server!.port}/sarawutwn/grill-agents`,
    });

    expect(result.exitCode).toBe(0);
    expect(result.stderr).toBe("");
    expect(result.stdout).toContain(configDir);
    assertInstalledFiles(configDir);
  });
});
```

- [ ] **Step 3: Write tests for PowerShell installer behavior**

Extend `tests/install.test.ts` with:

```ts
async function hasCommand(command: string) {
  const result = await runCommand(["sh", "-c", `command -v ${command}`], {});
  return result.exitCode === 0;
}

describe("install.ps1", () => {
  test("installs files into OPENCODE_CONFIG_DIR and overwrites old contents", async () => {
    if (!(await hasCommand("pwsh"))) {
      console.warn("Skipping PowerShell installer test because pwsh is not installed.");
      return;
    }

    const configDir = join(tempRoot, "opencode-windows");
    const oldSkillPath = installedPath(configDir, "skills/create-plan/SKILL.md");
    writeExistingFile(oldSkillPath);

    const result = await runCommand(["pwsh", "-NoProfile", "-ExecutionPolicy", "Bypass", "-File", "install.ps1"], {
      OPENCODE_CONFIG_DIR: configDir,
      GRILL_AGENTS_REF: "test-ref",
      GRILL_AGENTS_BASE_URL: `http://127.0.0.1:${server!.port}/sarawutwn/grill-agents`,
    });

    expect(result.exitCode).toBe(0);
    expect(result.stderr).toBe("");
    expect(result.stdout).toContain(configDir);
    assertInstalledFiles(configDir);
  });
});
```

- [ ] **Step 4: Run tests to verify they fail before installers exist**

Run:

```bash
bun test
```

Expected: fail because `install.sh` and `install.ps1` do not exist.

## Task 2: Implement Installers

**Files:**

- Create: `install.sh`
- Create: `install.ps1`

- [ ] **Step 1: Implement `install.sh`**

```sh
#!/bin/sh
set -eu

REPO_OWNER="sarawutwn"
REPO_NAME="grill-agents"
REF="${GRILL_AGENTS_REF:-main}"
BASE_URL="${GRILL_AGENTS_BASE_URL:-https://raw.githubusercontent.com/$REPO_OWNER/$REPO_NAME}"

if [ -n "${OPENCODE_CONFIG_DIR:-}" ]; then
  CONFIG_DIR="$OPENCODE_CONFIG_DIR"
else
  CONFIG_DIR="$HOME/.config/opencode"
fi

download_file() {
  src="$1"
  dest="$2"
  url="$BASE_URL/$REF/$src"

  mkdir -p "$(dirname "$dest")"

  if command -v curl >/dev/null 2>&1; then
    curl -fsSL "$url" -o "$dest"
  elif command -v wget >/dev/null 2>&1; then
    wget -qO "$dest" "$url"
  else
    echo "Error: curl or wget is required." >&2
    exit 1
  fi
}

download_file "agents/superGrill.md" "$CONFIG_DIR/agents/superGrill.md"
download_file "skills/create-plan/SKILL.md" "$CONFIG_DIR/skills/create-plan/SKILL.md"
download_file "skills/grill-design/SKILL.md" "$CONFIG_DIR/skills/grill-design/SKILL.md"

echo "Installed grill-agents into: $CONFIG_DIR"
echo "- agents/superGrill.md"
echo "- skills/create-plan/SKILL.md"
echo "- skills/grill-design/SKILL.md"
```

- [ ] **Step 2: Implement `install.ps1`**

```powershell
$ErrorActionPreference = "Stop"

$RepoOwner = "sarawutwn"
$RepoName = "grill-agents"
$Ref = if ($env:GRILL_AGENTS_REF) { $env:GRILL_AGENTS_REF } else { "main" }
$BaseUrl = if ($env:GRILL_AGENTS_BASE_URL) { $env:GRILL_AGENTS_BASE_URL } else { "https://raw.githubusercontent.com/$RepoOwner/$RepoName" }

if ($env:OPENCODE_CONFIG_DIR) {
  $ConfigDir = $env:OPENCODE_CONFIG_DIR
} elseif ($env:APPDATA) {
  $ConfigDir = Join-Path $env:APPDATA "opencode"
} else {
  throw "APPDATA is not set. Set OPENCODE_CONFIG_DIR and try again."
}

function Install-GrillFile {
  param(
    [Parameter(Mandatory = $true)]
    [string] $Source,
    [Parameter(Mandatory = $true)]
    [string] $Destination
  )

  $DestinationDir = Split-Path -Parent $Destination
  New-Item -ItemType Directory -Path $DestinationDir -Force | Out-Null

  $Url = "$BaseUrl/$Ref/$Source"
  Invoke-WebRequest -Uri $Url -OutFile $Destination
}

Install-GrillFile -Source "agents/superGrill.md" -Destination (Join-Path $ConfigDir "agents/superGrill.md")
Install-GrillFile -Source "skills/create-plan/SKILL.md" -Destination (Join-Path $ConfigDir "skills/create-plan/SKILL.md")
Install-GrillFile -Source "skills/grill-design/SKILL.md" -Destination (Join-Path $ConfigDir "skills/grill-design/SKILL.md")

Write-Host "Installed grill-agents into: $ConfigDir"
Write-Host "- agents/superGrill.md"
Write-Host "- skills/create-plan/SKILL.md"
Write-Host "- skills/grill-design/SKILL.md"
```

- [ ] **Step 3: Run tests to verify installers pass**

Run:

```bash
bun test
```

Expected: pass.

## Task 3: Add Documentation

**Files:**

- Modify: `README.md`

- [ ] **Step 1: Rewrite README with Thai and English installation docs**

Include these sections:

```markdown
# grill-agents

## ภาษาไทย

`grill-agents` ติดตั้ง agent และ skills สำหรับ OpenCode:

- `agents/superGrill.md`
- `skills/create-plan/SKILL.md`
- `skills/grill-design/SKILL.md`

### Requirements

- ติดตั้ง OpenCode แล้ว
- macOS/Linux/Git Bash: มี `curl` หรือ `wget`
- Windows: ใช้ PowerShell
- แนะนำให้ติดตั้ง Superpowers skill เพื่อให้ workflow ทำงานเต็มประสิทธิภาพ: [obra/superpowers](https://github.com/obra/superpowers)

### Install

macOS/Linux/Git Bash:

```sh
curl -fsSL https://raw.githubusercontent.com/sarawutwn/grill-agents/main/install.sh | sh
```

Windows PowerShell:

```powershell
irm https://raw.githubusercontent.com/sarawutwn/grill-agents/main/install.ps1 | iex
```

รันคำสั่งเดิมซ้ำเพื่ออัปเดตไฟล์ที่ติดตั้งไว้ให้เป็นเวอร์ชันปัจจุบันของ git

### Configuration

- `OPENCODE_CONFIG_DIR`: เปลี่ยน path ติดตั้ง OpenCode config
- `GRILL_AGENTS_REF`: เลือก branch, tag, หรือ commit ที่ต้องการติดตั้ง

## English

`grill-agents` installs an OpenCode agent and skills:

- `agents/superGrill.md`
- `skills/create-plan/SKILL.md`
- `skills/grill-design/SKILL.md`

### Requirements

- OpenCode installed
- macOS/Linux/Git Bash: `curl` or `wget`
- Windows: PowerShell
- Recommended for the full workflow: install the Superpowers skill from [obra/superpowers](https://github.com/obra/superpowers)

### Install

macOS/Linux/Git Bash:

```sh
curl -fsSL https://raw.githubusercontent.com/sarawutwn/grill-agents/main/install.sh | sh
```

Windows PowerShell:

```powershell
irm https://raw.githubusercontent.com/sarawutwn/grill-agents/main/install.ps1 | iex
```

Re-run the same command to overwrite installed files with the current git version.

### Configuration

- `OPENCODE_CONFIG_DIR`: override the OpenCode config install path
- `GRILL_AGENTS_REF`: install from a specific branch, tag, or commit
```

Thai section must include:

- What gets installed.
- macOS/Linux/Git Bash install command.
- Windows PowerShell install command.
- Requirements: OpenCode, curl or PowerShell, and recommended Superpowers skill from `obra/superpowers`.
- Update behavior: re-run the installer to overwrite existing files with the current git version.
- Optional environment variables: `OPENCODE_CONFIG_DIR`, `GRILL_AGENTS_REF`.

English section must mirror the Thai section.

- [ ] **Step 2: Run README checks manually**

Run:

```bash
rg -n "obra/superpowers|install.sh|install.ps1|OPENCODE_CONFIG_DIR|GRILL_AGENTS_REF" README.md
```

Expected: all required topics are present.

## Task 4: Final Verification

**Files:**

- Verify: `install.sh`
- Verify: `install.ps1`
- Verify: `tests/install.test.ts`
- Verify: `README.md`

- [ ] **Step 1: Run full check**

Run:

```bash
bun run check
```

Expected: shell syntax check passes, PowerShell syntax check passes if `pwsh` is installed, and Bun tests pass.

- [ ] **Step 2: If `pwsh` is unavailable, run supported checks**

Run:

```bash
bun run check:sh
bun test
```

Expected: both pass, with PowerShell runtime test skipped.

- [ ] **Step 3: Inspect git diff**

Run:

```bash
git diff -- install.sh install.ps1 package.json tests/install.test.ts README.md
```

Expected: diff only contains installer, test, and documentation changes described in this plan.
