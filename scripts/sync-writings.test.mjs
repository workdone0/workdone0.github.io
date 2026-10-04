import { test } from 'node:test';
import assert from 'node:assert/strict';
import { mkdtemp, readFile, writeFile, rm } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { parseFeed, mergePosts, syncWritings } from './sync-writings.mjs';
const article = `<item><title><![CDATA[Math &amp; code]]></title><link>https://workdone0.substack.com/p/example</link><pubDate>Wed, 17 Jun 2026 13:06:18 GMT</pubDate><description><![CDATA[<p>It&#8217;s interesting.</p>]]></description></item>`;
const feed = `<rss><channel>${article}</channel></rss>`;
test('parses a single RSS item, CDATA, entities, and dates', () => {
  const [post] = parseFeed(feed);
  assert.equal(post.title, 'Math & code');
  assert.equal(post.description, 'It’s interesting.');
  assert.equal(post.date, '2026-06-17T13:06:18.000Z');
});
test('rejects malformed, empty, and unsafe feeds', () => {
  for (const xml of ['<rss>', '<rss><channel/></rss>', feed.replace('https://workdone0.substack.com/p/example', 'javascript:alert(1)')]) assert.throws(() => parseFeed(xml));
});
test('merges edits without duplicates and retains older articles', () => {
  const [post] = parseFeed(feed);
  const old = { ...post, url: post.url + '-old', date: '2020-01-01T00:00:00.000Z' };
  assert.deepEqual(mergePosts([old, post], [{ ...post, title: 'Updated' }]), [{ ...post, title: 'Updated' }, old]);
});
test('updates saved articles and preserves them on network or invalid-feed failures', async () => {
  const dir = await mkdtemp(join(tmpdir(), 'portfolio-rss-'));
  const snapshot = join(dir, 'posts.json');
  try {
    await writeFile(snapshot, '[]\n');
    await syncWritings({ snapshot, fetchFeed: async () => new Response(feed) });
    const saved = await readFile(snapshot, 'utf8');
    for (const fetchFeed of [async () => { throw new Error('offline'); }, async () => new Response('<html>unavailable</html>'), async () => new Response('', {status:503})]) {
      await syncWritings({ snapshot, fetchFeed });
      assert.equal(await readFile(snapshot, 'utf8'), saved);
    }
  } finally { await rm(dir, { recursive: true }); }
});
