import { afterEach, beforeEach, describe, expect, test } from "bun:test";
import { mkdirSync, mkdtempSync, readFileSync, rmSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const repoRoot = fileURLToPath(new URL("..", import.meta.url));
const installFiles = [
  ["agents/superGrill.md", "agents/superGrill.md"],
  ["skills/caveman/SKILL.md", "skills/caveman/SKILL.md"],
  ["skills/create-plan/SKILL.md", "skills/create-plan/SKILL.md"],
  ["skills/grill-design/SKILL.md", "skills/grill-design/SKILL.md"],
] as const;

let server: ReturnType<typeof Bun.serve> | undefined;
let tempRoot = "";

beforeEach(() => {
  tempRoot = mkdtempSync(join(tmpdir(), "grill-agents-test-"));
  server = Bun.serve({
    port: 0,
    async fetch(request) {
      const url = new URL(request.url);
      const prefix = "/sarawutwn/grill-agents/test-ref/";
      if (!url.pathname.startsWith(prefix)) {
        return new Response("Not found", { status: 404 });
      }

      const relativePath = url.pathname.slice(prefix.length);
      const file = Bun.file(join(repoRoot, relativePath));
      if (!(await file.exists())) {
        return new Response("Not found", { status: 404 });
      }

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
  mkdirSync(dirname(path), { recursive: true });
  writeFileSync(path, "old content");
}

function assertInstalledFiles(configDir: string) {
  for (const [source, destination] of installFiles) {
    expect(readFileSync(installedPath(configDir, destination), "utf8")).toBe(
      readFileSync(join(repoRoot, source), "utf8"),
    );
  }
}

async function runCommand(command: string[], env: Record<string, string> = {}) {
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

describe("install.ps1", () => {
  test("installs files into OPENCODE_CONFIG_DIR and overwrites old contents", async () => {
    if (Bun.which("pwsh") === null) {
      console.warn("Skipping PowerShell installer test: pwsh is not installed.");
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
