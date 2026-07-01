import { describe, expect, test } from "bun:test";

const installedFiles = [
  "agents/autopilot.md",
  "agents/explore.md",
  "agents/general.md",
  "agents/superGrill.md",
  "skills/caveman/SKILL.md",
  "skills/create-plan/SKILL.md",
  "skills/create-plan/references/plan-template.md",
  "skills/create-plan/references/task-template.md",
  "skills/grill-design/SKILL.md",
  "skills/guideline/SKILL.md",
  "skills/retro-man/SKILL.md",
  "skills/retro-man/references/contract-template.md",
  "skills/retro-man/references/index-format.md",
  "skills/retro-man/scripts/update-rules-index.mjs",
  "skills/scrutinize/SKILL.md",
].sort();

function matchAll(source: string, pattern: RegExp) {
  return Array.from(source.matchAll(pattern), (match) => match[1]).sort();
}

describe("installers", () => {
  test("Unix installer downloads the curated agent and skill files", async () => {
    const source = await Bun.file("install.sh").text();

    expect(matchAll(source, /download_file "([^"]+)"/g)).toEqual(installedFiles);

    for (const installedFile of installedFiles) {
      expect(source).toContain(`download_file "${installedFile}" "$CONFIG_DIR/${installedFile}"`);
      expect(source).toContain(`echo "- ${installedFile}"`);
    }

    expect(source).not.toContain("certify-man");
    expect(source).not.toContain("evals/evals.json");
  });

  test("PowerShell installer downloads the curated agent and skill files", async () => {
    const source = await Bun.file("install.ps1").text();

    expect(matchAll(source, /Install-GrillFile -Source "([^"]+)"/g)).toEqual(installedFiles);

    for (const installedFile of installedFiles) {
      expect(source).toContain(`Install-GrillFile -Source "${installedFile}" -Destination (Join-Path $ConfigDir "${installedFile}")`);
      expect(source).toContain(`Write-Host "- ${installedFile}"`);
    }

    expect(source).not.toContain("certify-man");
    expect(source).not.toContain("evals/evals.json");
  });
});
