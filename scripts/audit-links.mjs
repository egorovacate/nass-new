import { readFile, readdir, access } from 'node:fs/promises';
import { dirname, resolve } from 'node:path';

const root = resolve(import.meta.dirname, '..');
const pages = (await readdir(root)).filter((name) => name.endsWith('.html'));
const problems = [];
const external = new Set();

for (const page of pages) {
  const html = await readFile(resolve(root, page), 'utf8');
  for (const [, href] of html.matchAll(/href="([^"]+)"/g)) {
    if (href.startsWith('http')) {
      if (!['https://fonts.googleapis.com', 'https://fonts.gstatic.com'].includes(href)) external.add(href.replaceAll('&amp;', '&'));
      continue;
    }
    if (href.startsWith('mailto:') || href.startsWith('#')) {
      if (href.startsWith('#') && href !== '#' && !html.includes(`id="${href.slice(1)}"`)) problems.push(`${page}: missing anchor ${href}`);
      if (href === '#') problems.push(`${page}: empty link`);
      continue;
    }
    const [file, anchor] = href.replace(/^\.\//, '').split('#');
    try { await access(resolve(dirname(resolve(root, page)), file)); } catch { problems.push(`${page}: missing ${href}`); continue; }
    if (anchor) {
      const target = await readFile(resolve(root, file), 'utf8');
      if (!target.includes(`id="${anchor}"`)) problems.push(`${page}: missing anchor ${href}`);
    }
  }
}

const expertData = JSON.parse(await readFile(resolve(root, 'experts-data.json'), 'utf8'));
for (const expert of expertData) for (const link of expert.profile?.links || []) external.add(link.url);

for (const url of external) {
  try {
    const response = await fetch(url, { method: 'HEAD', redirect: 'follow', signal: AbortSignal.timeout(12000) });
    if (response.status >= 400) problems.push(`${response.status}: ${url}`);
  } catch (error) { problems.push(`network: ${url} (${error.message})`); }
}

console.log(`${pages.length} pages, ${external.size} external links checked.`);
if (problems.length) { console.error(problems.join('\n')); process.exit(1); }
console.log('All links passed.');
