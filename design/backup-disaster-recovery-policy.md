# Backup & Disaster Recovery Policy

What actually happens to DSL's data if something breaks, gets deleted, or a service goes
down — written down so it's a real policy, not just "it's probably fine."

## What's already covered

**Website code and content** — the entire site lives in a Git repository, pushed to GitHub
(`github.com/movesmakemoves-online/digitalspectrum` — renamed from `Izm-Studio` on 2026-09-01
to match the brand). Every
change is versioned, so any file can be restored to any previous state via git history. This
is a genuine, working backup as long as changes are actually committed and pushed regularly
— which, as of 2026-08-30, is now up to date.

**Hosting** — the live site is served by Netlify, which builds automatically from the GitHub
repo. If Netlify's hosting had an outage, the source code is still safe in GitHub and could
be redeployed elsewhere.

**Domain & DNS** — `digitalspectrumlabs.co.uk` is registered through Cloudflare, with DNS
also managed there. Cloudflare is a large, established provider — low risk of them
disappearing, but the domain renewal itself needs watching (see Gaps below).

**Leads and enquiries** — every contact form and quote submission is forwarded by the
`dsl-lead-router` Cloudflare Worker to Gmail AND logged as a file in the `leads/inbox/`
folder of the GitHub repo. This means leads survive even if a Gmail issue caused an email to
be missed — there's a second copy in the repo.

**Payment records** — once Stripe is live, all transaction and invoice history lives in
Stripe's own systems, which handle their own backups (this is not something DSL needs to
back up separately).

## Gaps — not yet covered

- **No calendar reminder for domain renewal.** If `digitalspectrumlabs.co.uk` lapses, the
  site and email both go down. Set a reminder well before the renewal date each year.
- **No documented recovery steps if Netlify or GitHub access is lost** (e.g. account locked,
  password lost). Store recovery emails/2FA backup codes somewhere safe and accessible.
- **Client work not on GitHub** (e.g. raw video footage, source design files, anything in
  local folders like `images/` that isn't part of the live site) has no offsite backup right
  now — only exists on this machine. Worth adding a cheap cloud backup (Google Drive,
  Backblaze, OneDrive) for anything that would be genuinely painful to lose and can't be
  recreated from Git.
- **No written incident response plan** — if a client's site went down or a data issue
  happened, there's no step-by-step "what do I do first" document yet. Worth writing once the
  business has more active client sites in production (Hand Made By You, Little VIPs).

## The one habit that matters most

Commit and push regularly. The backup only works if changes are actually saved to GitHub —
a week of local, uncommitted work (as happened before 2026-08-25) is a week that only exists
on one machine, with no real backup at all.
