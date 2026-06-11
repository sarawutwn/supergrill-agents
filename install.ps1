$ErrorActionPreference = "Stop"

$RepoOwner = "sarawutwn"
$RepoName = "grill-agents"
$Ref = if ($env:GRILL_AGENTS_REF) { $env:GRILL_AGENTS_REF } else { "main" }
$BaseUrl = if ($env:GRILL_AGENTS_BASE_URL) { $env:GRILL_AGENTS_BASE_URL.TrimEnd("/") } else { "https://raw.githubusercontent.com/$RepoOwner/$RepoName" }

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
Install-GrillFile -Source "skills/caveman/SKILL.md" -Destination (Join-Path $ConfigDir "skills/caveman/SKILL.md")
Install-GrillFile -Source "skills/create-plan/SKILL.md" -Destination (Join-Path $ConfigDir "skills/create-plan/SKILL.md")
Install-GrillFile -Source "skills/grill-design/SKILL.md" -Destination (Join-Path $ConfigDir "skills/grill-design/SKILL.md")

Write-Host "Installed grill-agents into: $ConfigDir"
Write-Host "- agents/superGrill.md"
Write-Host "- skills/caveman/SKILL.md"
Write-Host "- skills/create-plan/SKILL.md"
Write-Host "- skills/grill-design/SKILL.md"
