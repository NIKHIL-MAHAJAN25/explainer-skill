#!/bin/bash
# macOS installer: the /explainer skill + Diagram Hub, exact copy. Run: bash install.sh
set -e
SRC="$(cd "$(dirname "$0")" && pwd)"
HUB="$HOME/Documents/diagram-hub"
SKILL="$HOME/.claude/skills/explainer"

command -v node >/dev/null || { echo "Node.js is not installed. Get it from https://nodejs.org (or: brew install node)"; exit 1; }

for d in "$HUB" "$SKILL"; do
  if [ -e "$d" ]; then echo "Backing up $d to $d.backup"; rm -rf "$d.backup"; mv "$d" "$d.backup"; fi
done

mkdir -p "$HOME/Documents" "$HOME/.claude/skills"
cp -R "$SRC/diagram-hub" "$HUB"
cp -R "$SRC/skill/explainer" "$SKILL"
chmod +x "$HUB/Open Diagram Hub.command"
ln -sf "$HUB/Open Diagram Hub.command" "$HOME/Desktop/Diagram Hub"

echo
echo "Installed:"
echo "  Skill: $SKILL/SKILL.md"
echo "  Hub:   $HUB"
echo "  Desktop shortcut: Diagram Hub"
echo
echo "Restart Claude Code, then try:  /explainer <topic>"
