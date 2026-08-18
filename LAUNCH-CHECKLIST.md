# Digital Spectrum Labs — Path to Launch

(renamed from Izm Media Services / Izm Studio — see design/what-we-built-and-why.md style notes if that history matters later)

## Done
- [x] Full site built: home, services, packages, work, about, contact
- [x] New brand: name, logo (prism/spectrum mark), full site rename
- [x] Growth & Marketing added as a 5th service line (SEO, email marketing, social retainers, CRM setup)
- [x] Monthly Retainer tier added to Packages, alongside Basic/Standard/Enhanced and Custom Web Applications
- [x] Services reordered site-wide: Websites/Apps/Games, AI for Business, Growth & Marketing, Video Production (renamed from Music Video & Film Editing), Graphic Design
- [x] Committed to git, pushed to GitHub (currently under repo name "Izm-Studio" — needs renaming to match)
- [x] Deployed to Vercel (currently on a "Pro Trial" — needs migrating to Netlify instead, since Vercel's free tier bans commercial use and Netlify's allows it)
- [x] **Fixed a real bug (2026-08-04): the contact form had no code behind it at all** — "Send Request" did nothing. Now wired as a Netlify Form (works automatically once deployed on Netlify, zero backend needed) with a JS fallback message if it ever fails. Also fixed the visible contact email, which pointed at hello@digitalspectrumlabs.com — a mailbox that doesn't exist yet since the domain isn't purchased — now points at movesmakemoves@gmail.com until real business email exists.
- [x] **Deployed to Netlify (2026-08-04)** — live at digitalspectrum.netlify.app, deploying from the GitHub repo. Made public (was gated behind Netlify's team-login wall at first). Form notifications wired to movesmakemoves@gmail.com and verified end-to-end with a real test submission — email arrived. The contact form is fully functional in production, not just in theory.

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
8. **Rename the GitHub repo** — go to github.com/movesmakemoves-online/Izm-Studio/settings,
   change the repo name field to `Digital-Spectrum-Labs`, click Rename. (Netlify's deploy
   source will need repointing to the new repo URL after — check Netlify still builds
   correctly once this is done, GitHub renames usually auto-redirect but worth confirming.)
   Also update `GITHUB_REPO` in `email-worker/wrangler.toml` and redeploy the Worker after,
   or the lead logging will break.
9. ~~Move hosting from Vercel to Netlify~~ — **done 2026-08-04**, see above.

### Legal — required before promoting to customers
13. **Privacy policy and terms** — **drafted 2026-08-12**: `privacy.html` and `terms.html`
    added and linked in the footer of every page. UK GDPR requires a privacy policy because
    the contact form collects personal data. **Both contain `[PLACEHOLDER]` fields you must
    fill in** (your legal name, business address, publish date, sole trader vs limited
    company). These are solid working drafts, not legal advice — worth a solicitor's eye
    before you take real money, especially the terms.
14. **Trading details must be displayed** — UK law requires a sole trader to show their full
    name and a business address on the website (limited companies must also show company
    number and registered office). Currently the site only says "United Kingdom" — this needs
    your real details adding, most naturally on the Contact page footer or the policy pages.
15. **Cookie banner** — not needed right now: the site runs no analytics or advertising
    trackers, and strictly-necessary cookies are exempt. **If you add Google Analytics or any
    marketing pixel later, a consent banner becomes legally required** and the privacy policy
    needs updating first.

### Content — in progress
16. **Film a short video for each of the five service pages** — each page
    (`service-websites`, `service-ai`, `service-growth`, `service-video`,
    `service-design`) currently shows a dashed "Video placeholder" box at the top where the
    video goes. Each one should explain what that service is and how easy it is to get
    started. Once filmed, send them over and they get dropped straight in — the slot is
    already built and styled.
17. ~~Create `services@digitalspectrumlabs.co.uk` in Cloudflare Email Routing~~ — **done
    2026-08-18**, routes to `dsl-lead-router`, same as `support@`. See item 7 above.

10. **Real portfolio content** — done for Hand Made By You and Little VIPs (added as real,
    honestly-labeled "in development" case studies). Flyer design, CD covers, and AI
    integration samples still placeholder — add when available.
11. **About page** — rewritten with a real founder story (20+ years media background,
    "needed it for myself, now sharing it") — currently marked as a placeholder draft in
    the HTML for you to edit with concrete specifics when ready.
12. **Team/founder photo** — flagged: an AI-generated *illustrative* image is fine to use;
    an AI image presented as a literal photo of a specific real person or team that
    doesn't exist risks misleading-advertising territory. Real photo is the safest bet
    when you have one.

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
