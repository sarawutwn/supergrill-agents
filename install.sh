#!/bin/sh
set -eu

REPO_OWNER="sarawutwn"
REPO_NAME="grill-agents"
REF="${GRILL_AGENTS_REF:-main}"
BASE_URL="${GRILL_AGENTS_BASE_URL:-https://raw.githubusercontent.com/$REPO_OWNER/$REPO_NAME}"
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
download_file "skills/create-plan/SKILL.md" "$CONFIG_DIR/skills/create-plan/SKILL.md"
download_file "skills/grill-design/SKILL.md" "$CONFIG_DIR/skills/grill-design/SKILL.md"

echo "Installed grill-agents into: $CONFIG_DIR"
echo "- agents/superGrill.md"
echo "- skills/create-plan/SKILL.md"
echo "- skills/grill-design/SKILL.md"
