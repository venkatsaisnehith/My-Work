import test from 'node:test';
import assert from 'node:assert/strict';
import { existsSync, readFileSync, readdirSync, statSync, mkdtempSync, cpSync, writeFileSync, rmSync } from 'node:fs';
import { resolve, join, relative } from 'node:path';
import { tmpdir } from 'node:os';
import { execFileSync } from 'node:child_process';
import { runInNewContext } from 'node:vm';

const root = resolve(import.meta.dirname, '..');
const output = join(root, 'dist');
const basePath = new URL(process.env.SITE_URL || 'http://localhost:4321').pathname.replace(/\/$/, '');
const routes = ['', 'about', 'writing', 'projects', 'research', 'notes', 'contact', 'preferences', 'writing/building-a-research-portfolio'];
const htmlFiles = (directory) => readdirSync(directory, { withFileTypes: true }).flatMap((entry) => {
  const file = join(directory, entry.name);
  return entry.isDirectory() ? htmlFiles(file) : entry.name.endsWith('.html') ? [file] : [];
});

test('all public destinations have accessible document structure', () => {
  for (const route of routes) {
    const file = join(output, route, 'index.html');
    assert.ok(existsSync(file), `Missing route: /${route}`);
    const html = readFileSync(file, 'utf8');
    assert.match(html, /<html\b[^>]*lang=["']en["']/i, `Missing language: ${route}`);
    assert.match(html, /<title>[^<]+<\/title>/i, `Missing title: ${route}`);
    assert.match(html, /<main\b/i, `Missing main landmark: ${route}`);
    assert.match(html, /<nav\b/i, `Missing navigation: ${route}`);
    assert.match(html, /<h1\b/i, `Missing page heading: ${route}`);
  }
});

test('generated links and local assets resolve inside the build', () => {
  for (const file of htmlFiles(output)) {
    const html = readFileSync(file, 'utf8');
    for (const match of html.matchAll(/\b(?:href|src)=["']([^"']+)["']/gi)) {
      const target = match[1];
      if (/^(?:[a-z][a-z\d+.-]*:|\/\/|#)/i.test(target)) continue;
      let pathname = decodeURIComponent(target.split(/[?#]/)[0]);
      if (basePath && pathname.startsWith('/')) {
        assert.ok(pathname.startsWith(basePath + '/'), `Link missing deployment prefix: ${target}`);
        pathname = pathname.slice(basePath.length);
      }
      if (!pathname) continue;
      const candidate = pathname.startsWith('/') ? resolve(output, `.${pathname}`) : resolve(file, '..', pathname);
      assert.ok(candidate === output || candidate.startsWith(`${output}/`), `Link escapes build: ${target}`);
      const destination = existsSync(candidate) && statSync(candidate).isFile() ? candidate : join(candidate, 'index.html');
      assert.ok(existsSync(destination) && statSync(destination).isFile(), `${relative(output, file)} has a broken link: ${target}`);
    }
  }
});

test('portable publishing and discovery files are generated', () => {
  for (const name of ['feed.xml', 'sitemap.xml', 'robots.txt', '.nojekyll']) {
    assert.ok(existsSync(join(output, name)), `Missing ${name}`);
  }
  assert.match(readFileSync(join(output, 'feed.xml'), 'utf8'), /<(?:rss|feed)\b/);
  assert.match(readFileSync(join(output, 'sitemap.xml'), 'utf8'), /<urlset\b/);
});

test('unpublishing an article removes its old page and discovery entries', () => {
  const fixture = mkdtempSync(join(tmpdir(), 'portfolio-build-'));
  try {
    for (const directory of ['scripts', 'data', 'public']) cpSync(join(root, directory), join(fixture, directory), { recursive: true });
    const article = { slug: 'private-regression-fixture', title: 'Private regression fixture', summary: 'Not a real article', date: '2026-11-15', tags: [], body: [{ type: 'paragraph', text: 'Fixture text' }], status: 'published' };
    const source = join(fixture, 'data/writing.json');
    writeFileSync(source, JSON.stringify([article]));
    const build = () => execFileSync(process.execPath, ['scripts/build.mjs'], { cwd: fixture, stdio: 'pipe' });
    build();
    const page = join(fixture, 'dist/writing', article.slug, 'index.html');
    assert.ok(existsSync(page), 'Published fixture must first exist');
    article.status = 'draft';
    writeFileSync(source, JSON.stringify([article]));
    build();
    assert.ok(!existsSync(page), 'An unpublished article must not survive a rebuild');
    for (const name of ['feed.xml', 'sitemap.xml', 'writing/index.html', 'index.html']) {
      assert.ok(!readFileSync(join(fixture, 'dist', name), 'utf8').includes(`/writing/${article.slug}/`), `Draft leaked into ${name}`);
    }
  } finally {
    rmSync(fixture, { recursive: true, force: true });
  }
});

function element(dataset = {}) {
  const listeners = new Map();
  const attributes = new Map();
  const classes = new Set();
  return {
    dataset, hidden: false, value: '', textContent: '',
    classList: { add: name => classes.add(name), remove: name => classes.delete(name), toggle: (name, on) => on ? classes.add(name) : classes.delete(name) },
    addEventListener: (name, callback) => listeners.set(name, callback),
    setAttribute: (name, value) => attributes.set(name, value),
    getAttribute: name => attributes.get(name),
    dispatch: name => listeners.get(name)?.({}),
  };
}

function clientFixture({ saved = {}, brokenStorage = false } = {}) {
  const entries = [element({ title: 'Evaluation baselines', tags: 'Research practice,Evaluation' }), element({ title: 'Shipping a service', tags: 'Deployment' })];
  const search = element();
  const filters = [element({ filter: 'all' }), element({ filter: 'Research practice' }), element({ filter: 'Deployment' })];
  const width = element();
  const size = element();
  const count = element();
  const empty = element();
  const documentElement = element();
  const selectors = new Map([['#content-search', search], ['#result-count', count], ['#no-results', empty]]);
  const storage = new Map(Object.entries(saved));
  const document = {
    documentElement,
    querySelector: selector => selectors.get(selector) ?? null,
    querySelectorAll: selector => selector === '[data-entry]' ? entries : selector === '[data-filter]' ? filters : [],
    getElementById: id => id === 'reading-width' ? width : id === 'font-size' ? size : null,
  };
  const localStorage = {
    getItem(key) { if (brokenStorage) throw new Error('Storage disabled'); return storage.get(key) ?? null; },
    setItem(key, value) { if (brokenStorage) throw new Error('Storage disabled'); storage.set(key, value); },
  };
  runInNewContext(readFileSync(join(root, 'public/app.js'), 'utf8'), { document, localStorage });
  return { entries, search, filters, width, size, count, empty, documentElement, storage };
}

test('multi-word topic filters combine with search and expose an empty state', () => {
  const ui = clientFixture();
  ui.filters[1].dispatch('click');
  assert.equal(ui.entries[0].hidden, false, 'Multi-word topic must match the complete tag');
  assert.equal(ui.entries[1].hidden, true);
  assert.equal(ui.count.textContent, '1 entry');
  assert.equal(ui.filters[1].getAttribute('aria-pressed'), 'true');
  ui.search.value = 'unknown query';
  ui.search.dispatch('input');
  assert.equal(ui.count.textContent, '0 entries');
  assert.equal(ui.empty.hidden, false);
  ui.search.value = 'evaluation baselines';
  ui.search.dispatch('input');
  assert.equal(ui.empty.hidden, true);
  assert.equal(ui.entries[0].hidden, false);
});

test('reading preferences restore, validate, and persist locally', () => {
  const ui = clientFixture({ saved: { 'portfolio-readingWidth': 'wide', 'portfolio-fontSize': 'untrusted-value' } });
  assert.equal(ui.width.value, 'wide');
  assert.equal(ui.documentElement.dataset.readingWidth, 'wide');
  assert.equal(ui.size.value, 'default');
  ui.size.value = 'large';
  ui.size.dispatch('change');
  assert.equal(ui.documentElement.dataset.fontSize, 'large');
  assert.equal(ui.storage.get('portfolio-fontSize'), 'large');
  const blocked = clientFixture({ brokenStorage: true });
  blocked.width.value = 'comfortable';
  assert.doesNotThrow(() => blocked.width.dispatch('change'));
  assert.equal(blocked.documentElement.dataset.readingWidth, 'comfortable');
});

test('production metadata uses the configured public URL', () => {
  const base = (process.env.SITE_URL || 'http://localhost:4321').replace(/\/$/, '');
  assert.ok(readFileSync(join(output, 'index.html'), 'utf8').includes(`rel="canonical" href="${base}/"`));
  for (const file of ['feed.xml', 'sitemap.xml']) {
    const text = readFileSync(join(output, file), 'utf8');
    assert.ok(text.includes(`${base}/writing/building-a-research-portfolio/`));
    if (base.startsWith('https://')) assert.ok(!text.includes('localhost'));
  }
});
