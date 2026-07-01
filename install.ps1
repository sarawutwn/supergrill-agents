$ErrorActionPreference = "Stop"

$RepoOwner = "sarawutwn"
$RepoName = "supergrill-agents"
$Ref = if ($env:SUPERGRILL_AGENTS_REF) {
  $env:SUPERGRILL_AGENTS_REF
} elseif ($env:GRILL_AGENTS_REF) {
  $env:GRILL_AGENTS_REF
} else {
  "main"
}
$BaseUrl = if ($env:SUPERGRILL_AGENTS_BASE_URL) {
  $env:SUPERGRILL_AGENTS_BASE_URL.TrimEnd("/")
} elseif ($env:GRILL_AGENTS_BASE_URL) {
  $env:GRILL_AGENTS_BASE_URL.TrimEnd("/")
} else {
  "https://raw.githubusercontent.com/$RepoOwner/$RepoName"
}

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
Install-GrillFile -Source "agents/autopilot.md" -Destination (Join-Path $ConfigDir "agents/autopilot.md")
Install-GrillFile -Source "agents/explore.md" -Destination (Join-Path $ConfigDir "agents/explore.md")
Install-GrillFile -Source "agents/general.md" -Destination (Join-Path $ConfigDir "agents/general.md")
Install-GrillFile -Source "skills/caveman/SKILL.md" -Destination (Join-Path $ConfigDir "skills/caveman/SKILL.md")
Install-GrillFile -Source "skills/create-plan/SKILL.md" -Destination (Join-Path $ConfigDir "skills/create-plan/SKILL.md")
Install-GrillFile -Source "skills/create-plan/references/plan-template.md" -Destination (Join-Path $ConfigDir "skills/create-plan/references/plan-template.md")
Install-GrillFile -Source "skills/create-plan/references/task-template.md" -Destination (Join-Path $ConfigDir "skills/create-plan/references/task-template.md")
Install-GrillFile -Source "skills/grill-design/SKILL.md" -Destination (Join-Path $ConfigDir "skills/grill-design/SKILL.md")
Install-GrillFile -Source "skills/guideline/SKILL.md" -Destination (Join-Path $ConfigDir "skills/guideline/SKILL.md")
Install-GrillFile -Source "skills/retro-man/SKILL.md" -Destination (Join-Path $ConfigDir "skills/retro-man/SKILL.md")
Install-GrillFile -Source "skills/retro-man/references/contract-template.md" -Destination (Join-Path $ConfigDir "skills/retro-man/references/contract-template.md")
Install-GrillFile -Source "skills/retro-man/references/index-format.md" -Destination (Join-Path $ConfigDir "skills/retro-man/references/index-format.md")
Install-GrillFile -Source "skills/retro-man/scripts/update-rules-index.mjs" -Destination (Join-Path $ConfigDir "skills/retro-man/scripts/update-rules-index.mjs")
Install-GrillFile -Source "skills/scrutinize/SKILL.md" -Destination (Join-Path $ConfigDir "skills/scrutinize/SKILL.md")

Write-Host "Installed supergrill-agents into: $ConfigDir"
Write-Host "- agents/superGrill.md"
Write-Host "- agents/autopilot.md"
Write-Host "- agents/explore.md"
Write-Host "- agents/general.md"
Write-Host "- skills/caveman/SKILL.md"
Write-Host "- skills/create-plan/SKILL.md"
Write-Host "- skills/create-plan/references/plan-template.md"
Write-Host "- skills/create-plan/references/task-template.md"
Write-Host "- skills/grill-design/SKILL.md"
Write-Host "- skills/guideline/SKILL.md"
Write-Host "- skills/retro-man/SKILL.md"
Write-Host "- skills/retro-man/references/contract-template.md"
Write-Host "- skills/retro-man/references/index-format.md"
Write-Host "- skills/retro-man/scripts/update-rules-index.mjs"
Write-Host "- skills/scrutinize/SKILL.md"
