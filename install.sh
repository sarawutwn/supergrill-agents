#!/bin/sh
set -eu

REPO_OWNER="sarawutwn"
REPO_NAME="supergrill-agents"
REF="${SUPERGRILL_AGENTS_REF:-${GRILL_AGENTS_REF:-main}}"
BASE_URL="${SUPERGRILL_AGENTS_BASE_URL:-${GRILL_AGENTS_BASE_URL:-https://raw.githubusercontent.com/$REPO_OWNER/$REPO_NAME}}"
BASE_URL="${BASE_URL%/}"

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
download_file "agents/autopilot.md" "$CONFIG_DIR/agents/autopilot.md"
download_file "agents/explore.md" "$CONFIG_DIR/agents/explore.md"
download_file "agents/general.md" "$CONFIG_DIR/agents/general.md"
download_file "skills/caveman/SKILL.md" "$CONFIG_DIR/skills/caveman/SKILL.md"
download_file "skills/create-plan/SKILL.md" "$CONFIG_DIR/skills/create-plan/SKILL.md"
download_file "skills/grill-design/SKILL.md" "$CONFIG_DIR/skills/grill-design/SKILL.md"
download_file "skills/guideline/SKILL.md" "$CONFIG_DIR/skills/guideline/SKILL.md"
download_file "skills/retro-man/SKILL.md" "$CONFIG_DIR/skills/retro-man/SKILL.md"
download_file "skills/retro-man/scripts/update-rules-index.mjs" "$CONFIG_DIR/skills/retro-man/scripts/update-rules-index.mjs"
download_file "skills/scrutinize/SKILL.md" "$CONFIG_DIR/skills/scrutinize/SKILL.md"

echo "Installed supergrill-agents into: $CONFIG_DIR"
echo "- agents/superGrill.md"
echo "- agents/autopilot.md"
echo "- agents/explore.md"
echo "- agents/general.md"
echo "- skills/caveman/SKILL.md"
echo "- skills/create-plan/SKILL.md"
echo "- skills/grill-design/SKILL.md"
echo "- skills/guideline/SKILL.md"
echo "- skills/retro-man/SKILL.md"
echo "- skills/retro-man/scripts/update-rules-index.mjs"
echo "- skills/scrutinize/SKILL.md"
