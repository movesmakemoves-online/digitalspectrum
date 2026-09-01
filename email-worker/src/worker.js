import PostalMime from 'postal-mime';

const ALLOWED_ORIGINS = new Set([
  'https://digitalspectrumlabs.co.uk',
  'https://www.digitalspectrumlabs.co.uk',
  'https://digitalspectrum.netlify.app',
]);

async function logToGitHub(env, record, commitMessage) {
  const safeStamp = record.receivedAt.replace(/[:.]/g, '-');
  const path = `leads/inbox/${safeStamp}.json`;
  const content = btoa(unescape(encodeURIComponent(JSON.stringify(record, null, 2))));

  const res = await fetch(
    `https://api.github.com/repos/${env.GITHUB_OWNER}/${env.GITHUB_REPO}/contents/${path}`,
    {
      method: 'PUT',
      headers: {
        Authorization: `Bearer ${env.GITHUB_TOKEN}`,
        'User-Agent': 'dsl-lead-router',
        Accept: 'application/vnd.github+json',
      },
      body: JSON.stringify({
        message: commitMessage,
        content,
      }),
    }
  );

  if (!res.ok) {
    console.error('GitHub log failed:', res.status, await res.text());
  }
  return res.ok;
}

function corsHeaders(origin) {
  const headers = { Vary: 'Origin' };
  if (ALLOWED_ORIGINS.has(origin)) {
    headers['Access-Control-Allow-Origin'] = origin;
    headers['Access-Control-Allow-Methods'] = 'POST, OPTIONS';
    headers['Access-Control-Allow-Headers'] = 'Content-Type';
  }
  return headers;
}

// Cap every field so a malformed or abusive payload can't blow up the GitHub log with a huge file.
function clip(value, max) {
  return typeof value === 'string' ? value.slice(0, max) : '';
}

export default {
  async email(message, env, ctx) {
    // 1. Forward a copy first, always — this guarantees the human never loses an email even
    // if parsing or the GitHub logging step below fails for any reason.
    try {
      await message.forward(env.FORWARD_TO);
    } catch (err) {
      console.error('Forward failed:', err);
    }

    // 2. Parse it and log it to GitHub, so Claude (and anyone else) can see new leads without
    // needing access to the inbox itself.
    try {
      const email = await PostalMime.parse(message.raw);
      const receivedAt = new Date().toISOString();
      const subject = email.subject || '(no subject)';
      const body = (email.text || email.html || '').slice(0, 20000);

      const record = {
        source: 'email',
        receivedAt,
        from: message.from,
        to: message.to,
        subject,
        body,
      };

      await logToGitHub(env, record, `New lead: ${subject}`);
    } catch (err) {
      // Don't reject the email over a logging failure — the forward above already succeeded.
      console.error('Lead logging failed (email was still forwarded):', err);
    }
  },

  // Gives the chat widget's "Get a quote" flow the same GitHub-log backup the email channel has.
  // The widget's Netlify Form submission (chatbot-lead) still fires first and is the primary
  // record — this is a redundant copy, best-effort, mirroring how the email path always forwards
  // before it logs.
  async fetch(request, env, ctx) {
    const origin = request.headers.get('Origin') || '';

    if (request.method === 'OPTIONS') {
      return new Response(null, { headers: corsHeaders(origin) });
    }

    if (request.method !== 'POST' || !new URL(request.url).pathname.startsWith('/chatbot-lead')) {
      return new Response('Not found', { status: 404, headers: corsHeaders(origin) });
    }

    if (!ALLOWED_ORIGINS.has(origin)) {
      return new Response('Forbidden', { status: 403, headers: corsHeaders(origin) });
    }

    let body;
    try {
      body = await request.json();
    } catch {
      return new Response('Bad request', { status: 400, headers: corsHeaders(origin) });
    }

    const record = {
      source: 'chatbot',
      receivedAt: new Date().toISOString(),
      requestType: clip(body.request_type, 40),
      name: clip(body.name, 200),
      email: clip(body.email, 200),
      business: clip(body.business, 200),
      goal: clip(body.goal, 200),
      hasWebsite: clip(body.has_website, 20),
      hasSocial: clip(body.has_social, 20),
      sellsOnline: clip(body.sells_online, 20),
      recommendedServices: clip(body.recommended_services, 300),
      message: clip(body.message, 4000),
      page: clip(body.page, 100),
    };

    const label = record.name || record.business || record.email || 'chat lead';
    const ok = await logToGitHub(env, record, `New chat lead: ${label}`);

    return new Response(JSON.stringify({ ok }), {
      status: ok ? 200 : 502,
      headers: { ...corsHeaders(origin), 'Content-Type': 'application/json' },
    });
  },
};
