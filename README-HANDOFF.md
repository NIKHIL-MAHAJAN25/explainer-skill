# Handoff: `/explainer` skill + Diagram Hub (exact copy)

This bundle is the same setup the author uses: the skill, the Diagram Hub, the explainer engine (step-by-step animations, themes, code peeks, "Files ▾" dropdown), and all existing diagrams.

## Why the skill alone wasn't enough
The skill only *writes* a JSON description of the diagram. The animations, layout and themes come from **`diagram-hub/explainers/engine.html`**, and `build-explainers.mjs` turns each JSON into a page using that engine. Without the hub, Claude improvises its own HTML, which is why it looked different.

## What's inside
```
explainer-bundle/
├── install.sh                  ← run this on Mac (bash install.sh)
├── INSTALL.bat                 ← run this on Windows
├── skill/explainer/SKILL.md    ← the skill (personal paths made portable, teaching style built in)
└── diagram-hub/                ← the hub, exact copy
    ├── Open Diagram Hub.command  (Mac) / .bat (Windows): rebuilds the list and opens the hub
    ├── index.html / build.mjs   the hub page and its list builder
    ├── explainers/
    │   ├── engine.html          the step-by-step animation engine (exact copy)
    │   ├── build-explainers.mjs JSON → diagrams/NN-name.html
    │   └── 03…09-*.json         the existing explainers (good examples)
    └── diagrams/                every built diagram, ready to open
```

## Install (2 minutes)
1. Install **Node.js** if you don't have it (`node -v` should print a version; on Mac: `brew install node`).
2. Unzip the bundle anywhere, then:
   - **Mac:** open Terminal in the unzipped folder and run `bash install.sh`
   - **Windows:** double-click **`INSTALL.bat`**

   Either one:
   - copies the hub to `~/Documents/diagram-hub`
   - copies the skill to `~/.claude/skills/explainer/SKILL.md`
   - backs up any existing copy of either to `*.backup`
   - adds a **Diagram Hub** shortcut to the Desktop
3. **Restart Claude Code** (the desktop app or the terminal).
4. Double-click the Diagram Hub shortcut. You should see all the existing diagrams; open 04 to see the step animations.

## Use
- In Claude Code, inside your repo: `/explainer <topic>` (e.g. `/explainer how a push reaches TapInvest`).
- Claude reads the real code, writes `explainers/NN-name.json`, builds it, screenshot-checks it, and tells you the title.
- Open the hub and pick it. Controls:
  - ← → move between steps
  - click a `</> code` row, its arrow or its number to see the code
  - `Esc` closes the code
  - `F` opens the Files list
  - "Open in VS Code" jumps to the file

## Notes
- If the Desktop shortcut doesn't open on Mac, run `chmod +x ~/Documents/diagram-hub/"Open Diagram Hub.command"` once.
- The existing explainers point at the author's repo paths (`D:/Flutter/mobile_apps`, etc.). Their pages are already built, so they open fine. When the build can't find those repos on your machine, it skips them and keeps the built page. New explainers use your own repo path.
- Claude's screenshot check needs Google Chrome in its default place (`/Applications/Google Chrome.app` on Mac). If it's elsewhere, Claude will still build; just tell it where Chrome is.
- Results also depend on the model: use the same model as the author for the closest output.
