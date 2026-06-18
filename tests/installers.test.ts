import { describe, expect, test } from "bun:test";
import { readdirSync } from "node:fs";

const skillFiles = readdirSync("skills", { withFileTypes: true })
  .filter((entry) => entry.isDirectory())
  .map((entry) => `skills/${entry.name}/SKILL.md`)
  .sort();
const installedFiles = ["agents/superGrill.md", ...skillFiles].sort();

function matchAll(source: string, pattern: RegExp) {
  return Array.from(source.matchAll(pattern), (match) => match[1]).sort();
}

describe("installers", () => {
  test("Unix installer downloads every skill", async () => {
    const source = await Bun.file("install.sh").text();

    expect(matchAll(source, /download_file "([^"]+)"/g)).toEqual(installedFiles);

    for (const skillFile of skillFiles) {
      expect(source).toContain(`download_file "${skillFile}" "$CONFIG_DIR/${skillFile}"`);
      expect(source).toContain(`echo "- ${skillFile}"`);
    }
  });

  test("PowerShell installer downloads every skill", async () => {
    const source = await Bun.file("install.ps1").text();

    expect(matchAll(source, /Install-GrillFile -Source "([^"]+)"/g)).toEqual(installedFiles);

    for (const skillFile of skillFiles) {
      expect(source).toContain(`Install-GrillFile -Source "${skillFile}" -Destination (Join-Path $ConfigDir "${skillFile}")`);
      expect(source).toContain(`Write-Host "- ${skillFile}"`);
    }
  });
});
