# Digital Spectrum Labs — Path to Launch

(renamed from Digital Spectrum Labs / Izm Studio — see design/what-we-built-and-why.md style notes if that history matters later)

## ⚠️ Critical blocker as of 2026-08-25
**Nothing built since 2026-08-19 is live.** The last commit to GitHub was 2026-08-19 — 9 commits
plus a large set of uncommitted changes (the entire pricing/payments restructure, Platinum
packages, packages.html removal, homepage rewrite, discount code removal, about page values,
team photos, all 5 service videos, the chat widget) have never been pushed. Netlify only builds
from GitHub, so the live site at `digitalspectrum.netlify.app` is still serving the Aug 19
version. **This must be committed and pushed before any other launch step matters.**

## Done (verified live in the files 2026-08-25, pending the push above)
- [x] Full site built: home, services, pricing, work, about, contact
- [x] New brand: name, logo (prism/spectrum mark), full site rename
- [x] Growth & Marketing added as a 5th service line (SEO, email marketing, social retainers, CRM setup)
- [x] Services reordered site-wide: Websites/Apps/Games, AI for Business, Growth & Marketing, Video Production (renamed from Music Video & Film Editing), Graphic Design
- [x] Committed to git, pushed to GitHub. Repo renamed `Izm-Studio` → `digitalspectrum` on
  2026-09-01 — local remote, `wrangler.toml`, and the deployed Worker all updated the same day,
  verified with a real end-to-end lead test after the redeploy
- [x] Deployed to Vercel (currently on a "Pro Trial" — needs migrating to Netlify instead, since Vercel's free tier bans commercial use and Netlify's allows it)
- [x] **Fixed a real bug (2026-08-04): the contact form had no code behind it at all** — "Send Request" did nothing. Now wired as a Netlify Form (works automatically once deployed on Netlify, zero backend needed) with a JS fallback message if it ever fails. Also fixed the visible contact email, which pointed at hello@digitalspectrumlabs.com — a mailbox that doesn't exist yet since the domain isn't purchased — now points at movesmakemoves@gmail.com until real business email exists.
- [x] **Deployed to Netlify (2026-08-04)** — live at digitalspectrum.netlify.app, deploying from the GitHub repo. Made public (was gated behind Netlify's team-login wall at first). Form notifications wired to movesmakemoves@gmail.com and verified end-to-end with a real test submission — email arrived. The contact form is fully functional in production, not just in theory.
- [x] **Pricing fully restructured (2026-08-25)** — `packages.html` (Basic/Standard/Enhanced) retired.
  New `pricing.html` is the site-wide "view all prices" page; `payments.html` is now pure
  how-to-pay content (methods, Stripe invoicing, timing) with zero prices on it. Every service
  page now has its own real Pricing section, plus its own Platinum package (£799–£4,499
  depending on service, individually calculated) and its own Retainer (£450/mo). All expired
  discount codes (AUG2026, the £799 bundle deal) removed site-wide.
- [x] **Team photos and all 5 service page videos are live** — not placeholders any more (the
  Aug-dated "still to film/add" notes below are stale, kept only until this is pushed and
  confirmed live in production).
- [x] **Chat assistant widget built** (`js/chatbot.js`, `js/chatbot-data.js`, `css/chatbot.css`)
  — rule-based, no AI API cost. Live on all pages, not yet pushed (see blocker above).

## What's left — grouped by what's needed from you

### To accept payments on the site
1. **Stripe account for Digital Spectrum Labs** (separate from the Hand Made By You one) — not created yet
2. **Pricing model decision**: confirmed — want *both* fixed-price checkout for standard packages AND a deposit option for custom/larger work. Not yet built — needs Stripe Payment Links once the account exists
3. **UK bank account** linked in Stripe for payouts — part of Stripe's own signup
4. **Legal business details** — registered business name (sole trader or limited company?), address — needed for Stripe compliance, not yet provided
5. **VAT status** — decided: not registering yet (turnover nowhere near the £90k threshold). Revisit if turnover approaches that.

### To make the site live and findable
6. ~~Domain name~~ — **done**: `digitalspectrumlabs.co.uk` bought through Cloudflare Registrar
   (at cost, no markup, free WHOIS privacy included).
7. ~~Business email + automatic lead capture~~ — **done 2026-08-18** (corrected — this was
   marked done on 2026-08-05 but wasn't): Gmail was verified as a destination and the
   `support@` rule existed, but **Email Routing was never switched on at the zone level**
   (`enabled: false, status: unconfigured` in Cloudflare), so no mail to `support@` was ever
   actually routed anywhere the whole time this said "done." Found and fixed 2026-08-18 via
   the Cloudflare API (read-only checks first, then enabled with the user's go-ahead):
   Email Routing is now `enabled: true, status: ready`, and both `support@` and `services@`
   route to the deployed `dsl-lead-router` Worker, which forwards every email to Gmail AND
   logs it to `leads/inbox/` in the GitHub repo. Worker deployed, `GITHUB_TOKEN` secret set.
   **Still to do here:** point the custom domain at the Netlify site (Netlify → Domain
   management → add `digitalspectrumlabs.co.uk`), and send one real test email to
   `support@digitalspectrumlabs.co.uk` (or `services@`) to confirm the whole chain works
   end to end now that routing is actually live.
8. ~~Rename the GitHub repo~~ — **done 2026-09-01**: renamed `Izm-Studio` → `digitalspectrum`.
   Local git remote, `email-worker/wrangler.toml` (`GITHUB_REPO`), and the deployed
   `dsl-lead-router` Worker were all updated the same day and the Worker was redeployed.
   Verified with a real end-to-end test email — new lead logged correctly under the new repo
   name.
9. ~~Move hosting from Vercel to Netlify~~ — **done 2026-08-04**, see above.

### Legal — required before promoting to customers
13. **Privacy policy and terms** — **drafted 2026-08-12, still not filled in (checked
    2026-08-25)**: `privacy.html` and `terms.html` added and linked in the footer of every
    page. UK GDPR requires a privacy policy because the contact form collects personal data.
    **Both still contain bracketed placeholders** — `[sole trader / limited company — DELETE
    AS APPROPRIATE]`, `[ADD YOUR FULL LEGAL NAME OR REGISTERED COMPANY NAME]`, `[ADD YOUR
    BUSINESS ADDRESS]`, `[If a limited company, add: Company number 00000000]` — you need to
    fill these in with real details. These are solid working drafts, not legal advice — worth
    a solicitor's eye before you take real money, especially the terms.
14. **Trading details must be displayed** — UK law requires a sole trader to show their full
    name and a business address on the website (limited companies must also show company
    number and registered office). Currently the site only says "United Kingdom" — this needs
    your real details adding, most naturally on the Contact page footer or the policy pages.
15. **Cookie banner** — not needed right now: the site runs no analytics or advertising
    trackers, and strictly-necessary cookies are exempt. **If you add Google Analytics or any
    marketing pixel later, a consent banner becomes legally required** and the privacy policy
    needs updating first.

### Content — in progress
16. ~~Film a short video for each of the five service pages~~ — **done**: real videos are wired
    into all 5 service pages (`assets/service-websites-video.mp4` etc.), confirmed loading.
    Not yet pushed to production — see blocker at the top of this file.
17. ~~Create `services@digitalspectrumlabs.co.uk` in Cloudflare Email Routing~~ — **done
    2026-08-18**, routes to `dsl-lead-router`, same as `support@`. See item 7 above.

10. **Real portfolio content** — done for Hand Made By You and Little VIPs (added as real,
    honestly-labeled "in development" case studies). Flyer design, CD covers, and AI
    integration samples still placeholder — add when available.
11. **About page** — rewritten with a real founder story (20+ years media background,
    "needed it for myself, now sharing it"), plus a "What We Believe" values section added
    2026-08-25. Jenny and Donna still need job titles (only Tim's "CEO" is confirmed).
12. ~~Team/founder photo~~ — **done**: real team photos live (`assets/team-group.png`,
    `team-tim.png`, `team-jenny.png`, `team-donna.png`) on the About page. Not yet pushed —
    see blocker at the top of this file.

### New since the 2026-08-18 email routing fix
18. **Send a real test email to `support@digitalspectrumlabs.co.uk` or `services@...`** —
    from any other email account. Email Routing is now correctly configured (fixed
    2026-08-18, see item 7) but nothing has actually landed yet, so it's proven-correct on
    paper, not proven-working in practice. Check for it arriving in Gmail and as a new file
    under `leads/inbox/` in the repo — both should show up within a minute or two.
19. **Point the custom domain at the Netlify site** — Netlify → Domain management → add
    `digitalspectrumlabs.co.uk`. The domain is bought and DNS is on Cloudflare, but the live
    site is still only reachable at `digitalspectrum.netlify.app`, so outreach links and the
    Contact page's own email domain don't match where the site actually lives yet.
20. **Decide: should Claude read Gmail directly going forward, not just the GitHub relay?**
    A Gmail connector was confirmed working 2026-08-18 (read/search/label/draft/send,
    authenticated for movesmakemoves@gmail.com) — separate from the Gmail *website*, which
    stays blocked from browser automation. Reading/searching directly would have caught the
    routing outage days sooner than the relay did. Sending would stay gated regardless. Your
    call whether to approve standing read access for the ops-agent's checks.

## What's NOT blocking launch
Design, copy, structure, all 5 services, and all 4 package tiers are real and ready.
The site could go live (on a free subdomain, no custom domain yet) as soon as #8 is
done. Payments (#1-5) and the custom domain (#6-7) can follow once you've gathered
the account details above — none of it blocks getting the site itself live and
viewable.
