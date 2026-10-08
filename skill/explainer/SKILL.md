---
name: explainer
description: Explain a code flow or concept to the user as a step-by-step diagram in their Diagram Hub (full-screen, one stage at a time, plain-English "why" notes, and clickable code peeks into the real files). Use when they ask to understand, learn, or be walked through how something works ("explain X", "help me understand Y", "/explainer Z"), or when a new concept in a task needs teaching before the code.
---

# Explainer: a step-by-step diagram in the Diagram Hub

The hub is at `~/Documents/diagram-hub/` (shell: `"$HOME/Documents/diagram-hub"`, works on macOS and in Git Bash on Windows). Its Desktop shortcut "Diagram Hub" (`Open Diagram Hub.command` on macOS, `Open Diagram Hub.bat` on Windows) rebuilds it and opens it.

## 0. Who you're teaching
The user is a Flutter developer with an Android/Kotlin background who learns best when things are built up from zero:
- **Plain English first.** Explain every new term from scratch, with an everyday analogy, *before* using it. Never drop jargon and move on.
- **Use Android/Kotlin analogies** to bridge Flutter/Dart ideas (ViewModel ↔ Cubit, Hilt ↔ get_it/injectable, Application.onCreate ↔ main(), Service ↔ plugin service, etc.).
- **Motivate before naming.** Show the problem first, then the thing that solves it. Don't open with the finished, sophisticated version.
- **One idea per step**, with at most one new term per step.
- **Anchor everything to real files and line numbers** in the repo, never abstract lectures.
- **Trace runtime flows as numbered chains:** what calls what, in order.
- Separate what was observed (read in code, seen in logs) from reasoning, and say "reasoning" when something wasn't observed.

## 1. Pick the scope and the theme
- **One topic per explainer.** Use 4–8 players (actors) and 3–7 steps, with 2–6 arrows per step. If it needs more, make two explainers.
- **Theme by app** (`"theme"`, top level and in `meta`):
  - `neutral`, grey: a concept that is true for any app (how push works, what DI is)
  - `bonds`, blue tint: BondScanner-specific code
  - `ultra`, black/white premium: TapInvest-specific code
  - If one explainer covers shared `packages/` code as used by one app, pick that app's theme. If it is not app-specific, use `neutral`.
- **Kind** (`meta.kind`), which drives the hub filters:
  - `flow`: a journey through our apps' real code
  - `concept`: a general Android/Flutter idea, not tied to our code

  The hub's filters are fixed (All, App flows, BondScanner, TapInvest (ultra), Android concepts) and computed only from `theme` + `kind`, so set both every time.
- **Concept first, then the real code:** a `neutral` concept explainer, then an app explainer of the same journey through real classes (like 03 → 04).

## 2. Read the code before writing anything
Every arrow that names code must point at lines you have actually read.
- `"repo"` is the repo's absolute path with forward slashes. Get it with `git rev-parse --show-toplevel`.
- Pin app explainers to a commit: `git rev-parse --short HEAD` gives you `"ref"`.

## 3. Write `explainers/NN-name.json`
NN is the next free number; check `diagrams/`. Copy an existing one (e.g. `04-push-tapinvest.json`) as the model for tone and density.

```json
{
  "title": "…", "subtitle": "… Lines from commit <ref>.", "theme": "ultra",
  "repo": "<absolute repo path, forward slashes>", "ref": "<commit or working>",
  "meta": { "description": "…", "tags": ["…"], "order": NN, "theme": "ultra", "kind": "flow" },
  "actors": [ { "id": "fcm", "name": "FcmService", "about": "Dart · token only", "icon": "key",
                "tone": "you", "explain": "one plain sentence", "file": "fcm_service.dart:25-61" } ],
  "steps": [
    { "short": "The cast", "title": "Who's who", "summary": "…", "oneliner": "…", "boardHint": "Press Next →" },
    { "short": "Token", "title": "…", "summary": "…", "oneliner": "…",
      "messages": [
        { "from": "fcm", "to": "os", "label": "getToken()", "kind": "main",
          "why": "plain-English reason", "file": "fcm_service.dart:53",
          "code": { "path": "packages/services/lib/src/fcm/fcm_service.dart", "from": 47, "to": 62,
                    "focus": [53], "notes": { "53": "what this line does, in plain words" } } }
      ] }
  ]
}
```

- **Field values:**
  - `icon`: person, app, os, cloud, server, bell, door, route, key, inbox
  - `tone`: you (our code), platform (Android/iOS/SDK), server, person
  - `kind`: main (call), return (answer back), async (happens later on its own)
- **Step 0 is always "The cast"**, with no messages. It lists the actors.
- **Code peeks** (`code`): 5–25 lines, 1–3 `focus` lines, notes only on lines that matter. Never paste code into the JSON; the build reads it from git. Per-code `"ref": "working"` reads uncommitted files.
- **The header's "Files ▾" dropdown** (key F) is built automatically from each message's `code.path`, or else from a file name in its `file` string. It lists them per step in arrow order. So give every arrow that runs in our code a `file` or `code`, or the file is missing from the chain.
- **Writing style:** one new term per step at most, defined in its `why`. Use Android/Kotlin analogies. Say "reasoning" when something wasn't observed.

## 4. Build and check
```bash
cd "$HOME/Documents/diagram-hub" && node explainers/build-explainers.mjs && node build.mjs
```
- The build warns if a note or focus line falls outside its range. Fix every warning.
- Explainers whose repo isn't on this machine are skipped, and their already-built pages are kept. That's fine.

Screenshot at least the cast step and one code peek, and look at them before telling the user it's done:
```bash
# macOS
"/Applications/Google Chrome.app/Contents/MacOS/Google Chrome" --headless=new --window-size=1600,900 --virtual-time-budget=4000 --screenshot=<scratchpad>/x.png "file://$HOME/Documents/diagram-hub/diagrams/NN-name.html#step=1&code=1"
# Windows (Git Bash)
"/c/Program Files/Google/Chrome/Application/chrome.exe" --headless=new --window-size=1600,900 --virtual-time-budget=4000 --screenshot=<scratchpad>/x.png "file:///$(cygpath -m "$HOME")/Documents/diagram-hub/diagrams/NN-name.html#step=1&code=1"
```
Then read the PNG to look at it.

## 5. Hand it over
Tell the user its title in the hub, which step to start on, and the controls:
- ← → move between steps
- click a `</> code` row, its arrow, or its number to see the code
- Esc closes the code
- "Open in VS Code" jumps to the file

Keep the chat reply short. The explainer carries the lesson.
