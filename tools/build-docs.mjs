import { promises as fs } from 'node:fs';
import path from 'node:path';
import process from 'node:process';
import { marked } from 'marked';

const root = path.resolve(process.cwd());
const outputRoot = path.resolve(root, '_book');
if (path.dirname(outputRoot) !== root || path.basename(outputRoot) !== '_book') {
  throw new Error('Refusing to write outside the xpoint-docs _book directory.');
}

const privateNames = new Set([
  '.bookignore', '.git', '.github', '.gitignore', '.gitbook.yaml', '.nvmrc',
  'AGENTS.md', 'SUMMARY.md', '_book', 'node_modules', 'package-lock.json',
  'package.json', 'tools',
]);

const escapeHtml = (value) => String(value)
  .replaceAll('&', '&amp;')
  .replaceAll('<', '&lt;')
  .replaceAll('>', '&gt;')
  .replaceAll('"', '&quot;')
  .replaceAll("'", '&#39;');

marked.use({
  gfm: true,
  renderer: {
    html(token) {
      return escapeHtml(token.text ?? '');
    },
  },
});

const toPosix = (value) => value.split(path.sep).join('/');
const markdownOutput = (relativeSource) => {
  const normalized = path.posix.normalize(toPosix(relativeSource));
  const directory = path.posix.dirname(normalized);
  const name = path.posix.basename(normalized);
  if (name.toLowerCase() === 'readme.md') {
    return path.posix.join(directory === '.' ? '' : directory, 'index.html');
  }
  return normalized.replace(/\.md$/i, '.html');
};

const splitSuffix = (target) => {
  const match = /^(?<pathname>[^?#]*)(?<suffix>[?#].*)?$/.exec(target);
  return [match?.groups?.pathname ?? target, match?.groups?.suffix ?? ''];
};

const isExternal = (target) => /^(?:[a-z][a-z0-9+.-]*:|\/\/)/i.test(target);

function rewriteTarget(target, sourceRelative, outputRelative) {
  if (!target || target.startsWith('#') || isExternal(target)) return target;
  const [pathname, suffix] = splitSuffix(target);
  if (!pathname) return target;
  const decoded = decodeURIComponent(pathname);
  const sourceDirectory = path.posix.dirname(toPosix(sourceRelative));
  const resolvedSource = path.posix.normalize(path.posix.join(sourceDirectory, decoded));
  if (resolvedSource.startsWith('../') || path.posix.isAbsolute(resolvedSource)) {
    throw new Error(`Link escapes documentation root: ${sourceRelative} -> ${target}`);
  }
  const resolvedOutput = /\.md$/i.test(resolvedSource)
    ? markdownOutput(resolvedSource)
    : resolvedSource;
  const outputDirectory = path.posix.dirname(toPosix(outputRelative));
  let relative = path.posix.relative(outputDirectory, resolvedOutput);
  if (!relative) relative = path.posix.basename(resolvedOutput);
  return `${relative}${suffix}`;
}

function rewriteLinks(html, sourceRelative, outputRelative) {
  return html.replace(/\b(href|src)="([^"]*)"/g, (_match, attribute, target) =>
    `${attribute}="${escapeHtml(rewriteTarget(target, sourceRelative, outputRelative))}"`);
}

async function collectMarkdown(directory = root) {
  const result = [];
  const entries = await fs.readdir(directory, { withFileTypes: true });
  for (const entry of entries) {
    if (privateNames.has(entry.name)) continue;
    const absolute = path.join(directory, entry.name);
    if (entry.isDirectory()) result.push(...await collectMarkdown(absolute));
    else if (entry.isFile() && entry.name.toLowerCase().endsWith('.md')) result.push(absolute);
  }
  return result.sort((left, right) => left.localeCompare(right, 'en'));
}

const style = `
:root{color-scheme:light dark;font-family:Inter,ui-sans-serif,system-ui,-apple-system,"Segoe UI",sans-serif;line-height:1.58}
*{box-sizing:border-box}body{margin:0;background:#f7f8fb;color:#18202b}a{color:#1769aa}a:hover{text-decoration-thickness:2px}
.layout{display:grid;grid-template-columns:minmax(240px,300px) minmax(0,900px);gap:42px;max-width:1280px;margin:auto;padding:28px}
nav{position:sticky;top:20px;align-self:start;max-height:calc(100vh - 40px);overflow:auto;padding:20px;background:#fff;border:1px solid #dde2ea;border-radius:14px}
nav h1{font-size:1.05rem;margin-top:0}nav ul{padding-left:1.15rem}nav li{margin:.38rem 0}main{min-width:0;padding:34px 42px;background:#fff;border:1px solid #dde2ea;border-radius:14px;box-shadow:0 8px 30px #1b27351a}
h1,h2,h3{line-height:1.22;margin-top:1.8em}h1{margin-top:0}pre{overflow:auto;padding:16px;border-radius:10px;background:#111827;color:#e5e7eb}code{font-family:"Cascadia Code",Consolas,monospace;font-size:.92em}p code,li code{padding:.12em .32em;border-radius:4px;background:#e8edf4}table{display:block;overflow:auto;border-collapse:collapse}th,td{padding:.55rem .75rem;border:1px solid #cfd6e0}img{max-width:100%;height:auto}blockquote{margin-left:0;padding-left:1rem;border-left:4px solid #8ca5bd;color:#48586a}
@media(max-width:820px){.layout{display:block;padding:12px}nav{position:static;max-height:none;margin-bottom:12px}main{padding:24px 20px}}
@media(prefers-color-scheme:dark){body{background:#0e141b;color:#dbe4ee}a{color:#76bdf2}nav,main{background:#151e28;border-color:#2c3a48;box-shadow:none}p code,li code{background:#263443}}
`;

const summarySource = await fs.readFile(path.join(root, 'SUMMARY.md'), 'utf8');
const pages = await collectMarkdown();
if (pages.length === 0) throw new Error('No public Markdown pages were found.');

await fs.rm(outputRoot, { recursive: true, force: true });
await fs.mkdir(path.join(outputRoot, 'assets'), { recursive: true });
await fs.writeFile(path.join(outputRoot, 'assets', 'site.css'), style, 'utf8');

for (const sourcePath of pages) {
  const sourceRelative = toPosix(path.relative(root, sourcePath));
  const outputRelative = markdownOutput(sourceRelative);
  const outputPath = path.join(outputRoot, ...outputRelative.split('/'));
  const markdown = await fs.readFile(sourcePath, 'utf8');
  const title = /^#\s+(.+)$/m.exec(markdown)?.[1]?.trim() ?? 'Deep и XPoint';
  const navigation = rewriteLinks(await marked.parse(summarySource), 'SUMMARY.md', outputRelative);
  const content = rewriteLinks(await marked.parse(markdown), sourceRelative, outputRelative);
  const cssTarget = path.posix.relative(path.posix.dirname(outputRelative), 'assets/site.css');
  const document = `<!doctype html>\n<html lang="ru"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><meta http-equiv="Content-Security-Policy" content="default-src 'self'; img-src 'self' data:; style-src 'self'; object-src 'none'; base-uri 'none'; frame-ancestors 'none'"><title>${escapeHtml(title)} — Deep/XPoint</title><link rel="stylesheet" href="${escapeHtml(cssTarget)}"></head><body><div class="layout"><nav aria-label="Документация">${navigation}</nav><main>${content}</main></div></body></html>\n`;
  await fs.mkdir(path.dirname(outputPath), { recursive: true });
  await fs.writeFile(outputPath, document, 'utf8');
}

const assetRoot = path.join(root, '.gitbook', 'assets');
try {
  await fs.cp(assetRoot, path.join(outputRoot, '.gitbook', 'assets'), { recursive: true });
} catch (error) {
  if (error?.code !== 'ENOENT') throw error;
}

process.stdout.write(`Rendered ${pages.length} documentation pages to ${outputRoot}\n`);
