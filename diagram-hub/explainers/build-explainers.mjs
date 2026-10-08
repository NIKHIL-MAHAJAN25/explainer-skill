// Builds step-by-step explainer pages: engine.html + each NN-name.json → ../diagrams/NN-name.html (+ .meta.json).
// Run: node explainers/build-explainers.mjs   (then node build.mjs refreshes the hub list)
//
// Code peeks: a message may carry
//   "code": { "path": "packages/…/file.dart", "from": 47, "to": 61, "focus": [53], "notes": { "53": "…" }, "ref": "…" }
// The lines are read from the real repo at build time (never pasted into the JSON), from the
// explainer's top-level "repo", at "ref" (a commit; per-code "ref" overrides it, "working" = files on disk).
import { readFileSync, writeFileSync, readdirSync } from 'node:fs';
import { execFileSync } from 'node:child_process';
import { dirname, join, basename } from 'node:path';
import { fileURLToPath } from 'node:url';

const here = dirname(fileURLToPath(import.meta.url));
const engine = readFileSync(join(here, 'engine.html'), 'utf8');
const out = join(here, '..', 'diagrams');
const escapeHtml = s => s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');

const sources = new Map();
function source(repo, ref, path) {
  const key = `${repo}|${ref}|${path}`;
  if (!sources.has(key)) {
    const text = ref === 'working'
      ? readFileSync(join(repo, path), 'utf8')
      : execFileSync('git', ['-C', repo, 'show', `${ref}:${path}`], { encoding: 'utf8', maxBuffer: 1 << 26 });
    sources.set(key, text.replace(/\r\n/g, '\n').split('\n'));
  }
  return sources.get(key);
}

function resolveCode(page, code, where) {
  // A peek may name its own repo (e.g. a package in the pub cache); it then
  // reads files on disk unless it also gives a ref.
  const repo = code.repo || page.repo;
  const ref = code.ref || (code.repo ? 'working' : page.ref) || 'working';
  if (!repo) throw new Error(`${where}: "code" needs a top-level "repo"`);
  const lines = source(repo, ref, code.path);
  const from = Math.max(1, code.from);
  const to = Math.min(lines.length, code.to ?? code.from);
  if (to < from) throw new Error(`${where}: ${code.path} has ${lines.length} lines, asked for ${code.from}-${code.to}`);
  for (const n of [...(code.focus || []), ...Object.keys(code.notes || {}).map(Number)]) {
    if (n < from || n > to) console.warn(`  ! ${where}: line ${n} is outside ${from}-${to}`);
  }
  const jump = (code.focus && code.focus[0]) || from;
  return {
    ...code,
    ref,
    name: basename(code.path),
    lines: lines.slice(from - 1, to).map((t, i) => ({ n: from + i, t: t.replace(/\t/g, '    ') })),
    open: `vscode://file/${repo.replace(/\\/g, '/')}/${code.path}:${jump}`,
  };
}

for (const file of readdirSync(here).filter(f => /^\d+-.+\.json$/.test(f)).sort()) {
  try { buildOne(file); } catch (e) {
    // Another machine may not have this explainer's repo; keep its already-built page.
    console.warn(`  ! skipped ${file}: ${e.message.split(String.fromCharCode(10))[0]}`);
  }
}

function buildOne(file) {
  const data = JSON.parse(readFileSync(join(here, file), 'utf8'));
  const name = file.replace(/\.json$/, '');
  const { meta = {}, ...page } = data;
  let peeks = 0;
  page.steps.forEach((step, s) =>
    (step.messages || []).forEach((m, k) => {
      if (!m.code) return;
      m.code = resolveCode(page, m.code, `${name} step ${s} arrow ${k + 1}`);
      peeks++;
    }),
  );
  // `</` must not appear inside the inline <script>.
  const json = JSON.stringify(page).replace(/<\//g, '<\\/');
  const html = engine.replace('__TITLE__', () => escapeHtml(page.title)).replace('__DATA__', () => json);
  writeFileSync(join(out, `${name}.html`), html);
  writeFileSync(join(out, `${name}.meta.json`), JSON.stringify({ title: page.title, ...meta }, null, 2) + '\n');
  console.log(`explainer: ${name}.html (${page.steps.length - 1} steps, ${page.actors.length} players, ${peeks} code peeks)`);
}
