# Lead Router — Setup Reference

What this does: any email sent to `support@digitalspectrumlabs.co.uk` or
`services@digitalspectrumlabs.co.uk` gets (1) forwarded to Gmail immediately, no matter what, and
(2) logged as a file in the GitHub repo (`leads/inbox/`) so Claude can see new leads without
needing access to the inbox. Free — the only cost is the domain, which is already bought.

**This is already built and deployed.** This doc is a reference for how it works and how to
change it, not a first-time setup walkthrough — that's done.

## Current live configuration (verified 2026-09-01)

- **Domain:** `digitalspectrumlabs.co.uk`, on Cloudflare, DNS + Email Routing both live
- **Addresses routed to the Worker:** `support@digitalspectrumlabs.co.uk` and
  `services@digitalspectrumlabs.co.uk` — both rules enabled, confirmed via
  `wrangler email routing rules list digitalspectrumlabs.co.uk`
- **Destination address:** `movesmakemoves@gmail.com`, verified in Cloudflare since 2026-08-05
- **Worker:** `dsl-lead-router`, deployed, receives mail cleanly (`outcome: ok`, no exceptions)
- **GitHub logging:** confirmed working — every test email has logged to `leads/inbox/` within
  seconds, correct sender/recipient/subject/body captured every time

## Known open question (as of 2026-09-01)

Three test emails sent **from `movesmakemoves@gmail.com` itself** did not arrive back in Gmail as
forwarded copies, despite the Worker reporting success with no errors. This is most likely a
Gmail-side deliverability quirk specific to self-addressed test emails (a message claiming to be
"from" `@gmail.com`, arriving via a non-Google relay, commonly fails spoofing checks) — **not**
necessarily a sign the forward is broken for real enquiries from other domains. Needs one real
test from a non-Gmail address to confirm either way. Until confirmed, treat the GitHub log
(`leads/inbox/`) as the reliable source for whether a lead came in, not the Gmail forward alone.

## How to check it's working

```bash
cd email-worker
npx wrangler whoami                                          # confirm you're logged in
npx wrangler email routing addresses list                    # check destination is verified
npx wrangler email routing rules list digitalspectrumlabs.co.uk   # check routing rules
npx wrangler tail dsl-lead-router --format json               # watch live traffic
```

Send a real test email (ideally from a non-Gmail address) to `support@` or `services@`, then
check:
- **Gmail** — the forwarded copy should arrive within a minute or two
- **The GitHub repo** — a new file should appear under `leads/inbox/`

If GitHub logging works but the Gmail forward doesn't, the lead is not lost — it's sitting in
`leads/inbox/` regardless. Check Worker logs (`npx wrangler tail`) for the specific error if the
GitHub log stops working, since that's the more critical of the two paths.

## How to change things

- **Add another routed address** (e.g. a new `hello@`):
  `npx wrangler email routing rules create digitalspectrumlabs.co.uk` (or via the Cloudflare
  dashboard → Email → Email Routing → Routing rules → Create address)
- **Change where it forwards to:** edit `FORWARD_TO` in `wrangler.toml`, then
  `npx wrangler deploy`
- **Change which GitHub repo it logs to:** edit `GITHUB_OWNER` / `GITHUB_REPO` in
  `wrangler.toml` — **this needs updating once the GitHub repo is renamed** from `Izm-Studio` to
  match the brand, or lead logging will silently break
- **Rotate the GitHub token:** generate a new fine-grained token (Contents: Read and write,
  scoped to this one repo only), then `npx wrangler secret put GITHUB_TOKEN`

## The GitHub token, if it ever needs recreating

github.com → profile photo → Settings → Developer settings → Personal access tokens →
Fine-grained tokens → Generate new token.
- Repository access: **Only select repositories** → the Digital Spectrum Labs repo
- Permissions → Contents → **Read and write**
- Copy the token immediately — GitHub only shows it once, starts with `github_pat_`
- Set it: `npx wrangler secret put GITHUB_TOKEN` (paste when prompted — this keeps it out of
  git entirely, it lives only in Cloudflare)

This token can only touch the one repo it's scoped to, nothing else in the GitHub account.
