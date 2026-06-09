if (Bun.which("pwsh") === null) {
  console.log("Skipping PowerShell syntax check: pwsh is not installed.");
  process.exit(0);
}

const command = [
  "$tokens = $null;",
  "$errors = $null;",
  "$null = [System.Management.Automation.Language.Parser]::ParseFile('install.ps1', [ref]$tokens, [ref]$errors);",
  "if ($errors.Count -gt 0) { $errors | ForEach-Object { Write-Error $_ }; exit 1 }",
].join(" ");

const proc = Bun.spawn(["pwsh", "-NoProfile", "-Command", command], {
  stdout: "inherit",
  stderr: "inherit",
});

process.exit(await proc.exited);
