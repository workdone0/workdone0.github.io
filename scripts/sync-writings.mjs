import { XMLParser, XMLValidator } from 'fast-xml-parser';
import { readFile, writeFile } from 'node:fs/promises';
import { pathToFileURL } from 'node:url';

const feedURL = 'https://workdone0.substack.com/feed';
const snapshotURL = new URL('../src/data/writings.json', import.meta.url);

function plainText(value) {
  if (typeof value !== 'string') return '';
  const named = { amp: '&', lt: '<', gt: '>', quot: '"', apos: "'", nbsp: ' ' };
  return value.replace(/<[^>]*>/g, ' ').replace(/&(#x[\da-f]+|#\d+|amp|lt|gt|quot|apos|nbsp);/gi, (match, entity) => {
    if (entity[0] !== '#') return named[entity.toLowerCase()] ?? match;
    const code = entity[1].toLowerCase() === 'x' ? parseInt(entity.slice(2), 16) : Number(entity.slice(1));
    return code > 0 && code <= 0x10ffff ? String.fromCodePoint(code) : '';
  }).replace(/\s+/g, ' ').trim();
}

export function parseFeed(xml) {
  if (XMLValidator.validate(xml) !== true) throw new Error('Invalid RSS XML');
  const channel = new XMLParser({ parseTagValue: false, processEntities: false }).parse(xml)?.rss?.channel;
  const items = channel?.item;
  if (!items) throw new Error('RSS contains no articles');
  const posts = (Array.isArray(items) ? items : [items]).map(item => {
    const url = new URL(item.link);
    if (url.origin !== 'https://workdone0.substack.com' || !url.pathname.startsWith('/p/')) throw new Error('Unexpected article URL');
    url.search = ''; url.hash = '';
    const title = plainText(item.title);
    const timestamp = Date.parse(item.pubDate);
    if (!title || !Number.isFinite(timestamp)) throw new Error('Article is missing a title or date');
    return { title, url: url.href, date: new Date(timestamp).toISOString(), description: plainText(item.description).slice(0, 300) };
  });
  return mergePosts([], posts);
}

export function mergePosts(previous, incoming) {
  // Feeds can contain only recent posts. Keep articles already imported.
  return [...new Map([...previous, ...incoming].map(post => [post.url, post])).values()]
    .sort((a, b) => Date.parse(b.date) - Date.parse(a.date) || a.url.localeCompare(b.url));
}

export async function syncWritings({ fetchFeed = fetch, snapshot = snapshotURL } = {}) {
  const saved = await readFile(snapshot, 'utf8');
  const previous = JSON.parse(saved);
  try {
    const response = await fetchFeed(feedURL, { signal: AbortSignal.timeout(15000) });
    if (!response.ok) throw new Error(`RSS returned HTTP ${response.status}`);
    const posts = mergePosts(previous, parseFeed(await response.text()));
    const next = JSON.stringify(posts, null, 2) + '\n';
    if (next !== saved) await writeFile(snapshot, next);
    console.log(`RSS: ${posts.length} articles available${next === saved ? ' (unchanged)' : ' (updated)'}.`);
  } catch (error) {
    if (!previous.length) throw error;
    console.warn(`RSS refresh failed; keeping ${previous.length} saved articles. ${error.message}`);
  }
}

if (process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href) await syncWritings();
