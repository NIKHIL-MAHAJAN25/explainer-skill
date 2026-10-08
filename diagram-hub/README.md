# Diagram Hub

One page that lists every standalone HTML diagram in `diagrams\`.

## Open it

Double-click `Open Diagram Hub.bat` (or the "Diagram Hub" shortcut on the Desktop).
It rebuilds the list (`node build.mjs` writes `diagrams.js`) and opens `index.html`.

## Add a diagram

1. Drop the `.html` file into `diagrams\`.
2. Optional: add `diagrams\<same-name>.meta.json`:

   ```json
   {
     "title": "Shown on the card",
     "description": "One line about it",
     "tags": ["lesson", "architecture"],
     "order": 3
   }
   ```

   Without it, the title comes from the file's `<title>` tag (or the file name).
3. Double-click `Open Diagram Hub.bat`.

Cards sort by `order`, then file name. Keys: `/` focuses search, `Esc` closes the viewer.
