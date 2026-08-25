# CLAUDE.md — Digital Spectrum Labs

Root rules in `../CLAUDE.md` apply here too. This file is what's specific to this project.

## What this is

The user's own web/design/video/AI agency site. **Static HTML, no build step, no framework** —
`index.html`, `services.html`, `service-*.html` etc. live directly in this folder. Preview via
`preview_start {name: "dsl"}` (reads `.claude/launch.json` at the project root, serves this
folder on port 5182 — do not start it with raw Bash/python, python doesn't work on this machine).

## Brand — don't improvise new colours

Warm off-white background `#faf8f3`, deep teal primary `#0f766e`, amber for emphasis/badges
`#f59e0b`, warm charcoal text `#1e2a28` — never pure black/white. Logo is a prism/spectrum mark at
`assets/dsl-mark.svg`. This replaced an earlier dark/neon theme deliberately (reads "scary to
spend money on") — don't reintroduce it from old screenshots or habit.

## Hosting

**Netlify, not Vercel** — Vercel's free tier bans commercial use, Netlify's doesn't. Both
platforms' dashboards are hard-blocked from Claude in Chrome browser automation (no permission
prompt, just a refusal) — any dashboard click-through has to be the user, walked through live.

## Lead capture

`email-worker/` is a Cloudflare Worker (`dsl-lead-router`) forwarding `support@`/`services@` to
Gmail and logging to `leads/inbox/` in this repo. **Cloudflare Email Routing has two separate
on/off switches** — the routing rule AND the zone-level `enabled` status. A rule existing does not
mean routing is on; check both before ever reporting this as working. It was silently broken for
13 days (2026-08-05 to 2026-08-18) exactly this way.

## Payments

Plan is Stripe Payment Links (site is static, no backend — right fit). Stripe's dashboard is also
blocked from browser automation; any Stripe-side clicking is the user's, not Claude's.

## Full reference

`LAUNCH-CHECKLIST.md` and `PLAN-CHECKLIST.md` in this folder for current build status —
read those directly, they change fast and this file won't be kept in sync with them.
`guides/digitalspectrumlabsservices.md` and `guides/SOPdigitalspectrumlabs.md` (at the project
root) for services, pricing and operating procedures.
