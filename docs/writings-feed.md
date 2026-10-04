# Substack writing list

`npm run sync:writings` imports https://workdone0.substack.com/feed into
`src/data/writings.json`. Both the writing page and homepage use this snapshot;
visitors make no requests to Substack to render the list. Local development and
ordinary builds use the saved snapshot; run the sync command to refresh locally.

The Pages workflow refreshes the feed before building on pushes to main and
manual runs. There is no scheduled job or inactivity timer to maintain.

## After publishing an article

1. Open the repository's **Actions** tab.
2. Select **Refresh writings and deploy site**.
3. Click **Run workflow**, select **main**, and click **Run workflow** again.
4. Wait for the Build and Deploy jobs to finish. The writing page and homepage
   will then show the refreshed list.

The workflow changes must be merged into the default branch before the manual
run button is available. No new commit is needed for subsequent article refreshes.
If an article does not appear, check the **Refresh Substack articles** step's log;
Substack may not have included it in the RSS feed yet. Run the workflow again once
it appears in the feed.

GitHub Actions restores the latest cached snapshot before refreshing and saves it
for subsequent builds. If Substack fails or returns malformed/empty data, the
import keeps the saved articles. If the cache is unavailable, the checked-in
snapshot is the fallback. No automated commits or write access to repository
contents are required.

Entries are deduplicated by canonical article URL and sorted newest first.
Previously imported entries stay in the list if they fall out of Substack's
recent feed. This also means deleted Substack posts need to be removed from the
snapshot and the `writings-v1-` Actions caches manually. A feed refresh updates
existing titles, descriptions, and dates.

Run `npm run test:rss` for parsing, merging, validation, and outage fallback tests.
