/**
 * Figma → GitHub webhook proxy.
 *
 * Deploy this as a Vercel serverless function.
 * It receives Figma FILE_UPDATE webhooks and forwards them to GitHub
 * as a repository_dispatch event, which triggers the token-sync workflow.
 *
 * Required environment variables (set in Vercel project settings):
 *   FIGMA_WEBHOOK_PASSCODE  — the passcode you set when registering the Figma webhook
 *   GITHUB_TOKEN            — a GitHub PAT with repo scope (or a fine-grained token
 *                             with "Actions: write" + "Contents: write" permissions)
 *   GITHUB_REPO             — owner/repo  e.g. "sumit-sharrma/ai-ds"
 */

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const body = typeof req.body === 'string' ? JSON.parse(req.body) : req.body;

  // ── Verify the Figma webhook passcode ──────────────────────────────────────
  if (body.passcode !== process.env.FIGMA_WEBHOOK_PASSCODE) {
    console.error('Invalid passcode');
    return res.status(401).json({ error: 'Unauthorized' });
  }

  // ── Only act on events that indicate variable/token changes ──────────────
  // FILE_UPDATE fires on any file save; LIBRARY_PUBLISH fires when a library
  // is published (variables included). Both can carry token changes.
  const relevantEvents = ['FILE_UPDATE', 'LIBRARY_PUBLISH'];
  if (!relevantEvents.includes(body.event_type)) {
    return res.status(200).json({ ignored: true, event_type: body.event_type });
  }

  // ── Forward to GitHub repository_dispatch ────────────────────────────────
  const githubRes = await fetch(
    `https://api.github.com/repos/${process.env.GITHUB_REPO}/dispatches`,
    {
      method: 'POST',
      headers: {
        Accept: 'application/vnd.github+json',
        Authorization: `Bearer ${process.env.GITHUB_TOKEN}`,
        'X-GitHub-Api-Version': '2022-11-28',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        event_type: 'figma-variables-updated',
        client_payload: {
          figma_event: body.event_type,
          file_key: body.file_key,
          file_name: body.file_name,
          triggered_at: new Date().toISOString(),
        },
      }),
    }
  );

  if (!githubRes.ok) {
    const text = await githubRes.text();
    console.error('GitHub dispatch failed:', githubRes.status, text);
    return res.status(502).json({ error: 'Failed to trigger GitHub workflow' });
  }

  return res.status(200).json({ dispatched: true });
}
