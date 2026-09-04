import { mkdir, writeFile } from 'node:fs/promises';
import { extname, join } from 'node:path';

const root = new URL('../', import.meta.url);
const response = await fetch('https://addwisors.ru/faces');
if (!response.ok) throw new Error(`addwisors.ru/faces: ${response.status}`);
const html = await response.text();
const clean = (value = '') => value.replace(/<br\s*\/?\s*>/gi, '; ').replace(/<[^>]+>/g, '').replace(/&nbsp;/g, ' ').replace(/&quot;/g, '"').replace(/&amp;/g, '&').replace(/\s+/g, ' ').trim();
const groupNames = ['Члены Правления', 'Экспертный совет', 'Исполнительная дирекция', 'Инициаторы и амбассадоры', 'Члены ассоциации 2026 года'];
const groupPositions = groupNames.map((name) => ({ name, position: html.indexOf(name) })).filter((item) => item.position >= 0);
const cards = [...html.matchAll(/<li class="t524__col[\s\S]*?<\/li>/g)];
const experts = [];

async function downloadAsset(sourceUrl, folder, stem) {
  const assetResponse = await fetch(sourceUrl);
  if (!assetResponse.ok) return null;
  const contentType = assetResponse.headers.get('content-type') || '';
  const extension = contentType.includes('png') ? '.png' : contentType.includes('webp') ? '.webp' : contentType.includes('gif') ? '.gif' : extname(new URL(sourceUrl).pathname).toLowerCase() || '.jpg';
  const fileName = `${stem}${extension}`;
  await mkdir(new URL(`../assets/${folder}/`, import.meta.url), { recursive: true });
  await writeFile(new URL(`../assets/${folder}/${fileName}`, import.meta.url), Buffer.from(await assetResponse.arrayBuffer()));
  return fileName;
}

for (const [index, match] of cards.entries()) {
  const block = match[0];
  const nameMatch = block.match(/field="li_persname__[^"]+"[^>]*>([\s\S]*?)<\/div>/);
  const roleMatch = block.match(/field="li_persdescr__[^"]+"[^>]*>([\s\S]*?)<\/div>/);
  const imageMatch = block.match(/data-original="(https:\/\/static\.tildacdn\.[^"]+)"/);
  if (!nameMatch) continue;
  const popupMatch = nameMatch[1].match(/href="#popup:([^"]+)"/);
  const sourceUrl = imageMatch?.[1];
  const expertNumber = String(experts.length + 1).padStart(2, '0');
  const image = sourceUrl ? await downloadAsset(sourceUrl, 'experts', `expert-${expertNumber}`) : null;
  const profileCards = [];
  if (popupMatch) {
    const hook = `data-tooltip-hook="#popup:${popupMatch[1]}"`;
    const popupStart = html.indexOf(hook);
    const popupEnd = html.indexOf('data-tooltip-hook="#popup:', popupStart + hook.length);
    const popupBlock = html.slice(popupStart, popupEnd > popupStart ? popupEnd : popupStart + 30000);
    const urls = [...new Set([...popupBlock.matchAll(/data-original="(https:\/\/static\.tildacdn\.[^"]+)"/g)].map((item) => item[1]))];
    for (const [cardIndex, url] of urls.entries()) {
      const file = await downloadAsset(url, 'expert-profiles', `expert-${expertNumber}-profile-${cardIndex + 1}`);
      if (file) profileCards.push(file);
    }
  }
  const group = groupPositions.filter((item) => item.position < match.index).at(-1)?.name || 'Участники НАСС';
  experts.push({ name: clean(nameMatch[1]), role: clean(roleMatch?.[1]), group, image, profileCards });
}

await writeFile(new URL('../experts-data.js', import.meta.url), `window.NASS_EXPERTS = ${JSON.stringify(experts, null, 2)};\n`);
await writeFile(new URL('../experts-data.json', import.meta.url), `${JSON.stringify(experts, null, 2)}\n`);
console.log(`Synced ${experts.length} experts; ${experts.filter((item) => item.image).length} photos; ${experts.reduce((sum, item) => sum + item.profileCards.length, 0)} profile cards.`);
