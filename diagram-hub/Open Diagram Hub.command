#!/bin/bash
# macOS: rebuild the diagram list, then open the hub in the default browser.
cd "$(dirname "$0")"
node build.mjs || { echo "Build failed. Is Node.js installed?"; read -r; exit 1; }
open index.html
