# DSL — the tickable list

Working checklist for the 6-month plan (15 Aug 2026 → 14 Feb 2027). Tick things here as you
do them. The full plan, with the reasoning behind each phase, is the artifact version.

Rules that apply the whole way through:

1. **Nothing goes on the website until a real test message has gone through it end to end.**
   `hello@` at a domain you didn't own, then `services@` with no routing rule. Twice is a pattern.
2. **One day a week maximum on your own site.** Everything else is client work or conversations.
3. **Every week ends with three numbers:** approaches made, conversations had, pounds invoiced.
   A week with no numbers didn't happen.

---

## Weekend 15–16 Aug — unblock

### Sat 15 — decisions (2–3 hrs)
- [ ] Decide: sole trader or limited company. This is the blocker under five other items.
- [ ] If Ltd: register at Companies House (£100 online since Feb 2026)
- [ ] Write down the business address you're willing to display publicly
- [ ] Send me the legal name / company number / address so I can fill the `[PLACEHOLDER]`
      fields in `privacy.html` and `terms.html` and add the trading details block (checklist #14)
- [ ] Decide: do prices go on the site? (6 of 7 competitors researched showed none — "from" prices
      are the middle route)

### Sun 16 — plumbing (2 hrs)
- [ ] Cloudflare → Email Routing → Routing rules → create `services` → send to `dsl-lead-router`
- [ ] Netlify → Domain management → add `digitalspectrumlabs.co.uk`, follow the DNS steps
- [ ] Netlify → Forms → notifications → add `services@digitalspectrumlabs.co.uk` as a second
      notification address, so form leads route through the Worker and become visible
- [ ] Send a real test email to `services@`. Confirm it lands in Gmail
- [ ] Submit the contact form for real. Confirm it lands in Gmail
- [ ] Push the outstanding local commit (Work-page mosaic, sitting unpushed since 13 Aug)
- [ ] Tell me when done — I verify both appear in `leads/inbox/` and confirm the chain works

---

## Week 1 — 17–21 Aug — proof and warm list

### Mon 17 — the warm list
- [ ] Build a list of 40 people from 20+ years in music and media: artists, managers, labels,
      promoters, studio owners, old colleagues, plus businesses you personally use
- [ ] Mark each: do they run a business, or do they know people who do
- [ ] Send me the list — I'll sort it by which service fits and draft a personal message for each

### Tue 18 — film the five service videos
- [ ] One setup, one day, five videos of 45–60 seconds: websites, AI, growth, video, design
- [ ] Each answers: what this is, who it's for, what it costs to start, what happens next
- [ ] Send me the files — I drop them into the placeholder slots already built on each page

### Wed 19 — case studies
- [ ] Write up Hand Made By You: what they needed, what you built, what it does now
- [ ] Write up Little VIPs: same
- [ ] Write up your own AI ops stack as the third: what it watches, what it saves you
- [ ] Send me the notes — I'll write them into the Work page properly

### Thu 20 — first contact
- [ ] Approach the first 10 people on the warm list. Personal messages, WhatsApp/DM/phone,
      **not** an email blast
- [ ] Log every one in `leads/prospects.md`

### Fri 21 — review
- [ ] Chase anyone who read and didn't reply
- [ ] Three numbers: approaches / conversations / £
- [ ] Anything you learned that changes the pitch

---

## Week 2 — 24–28 Aug — able to take money

### Mon 24
- [ ] Create the Stripe account for Digital Spectrum Labs (separate from Hand Made By You)
- [ ] Link the UK bank account for payouts
- [ ] Give me the go-ahead to build Payment Links for: Website Basic £1,200, Edit-only Basic £450,
      AI Audit £450, Retainer Light £450/mo, and a generic 50% deposit link

### Tue 25
- [ ] 10 more warm approaches
- [ ] Approve or amend the three cold prospect drafts (AIP, DeepMatter, Ground Rules)

### Wed 26
- [ ] Delivery day — Little VIPs backend, still outstanding

### Thu 27
- [ ] 10 more approaches, plus follow-ups on week 1's ten

### Fri 28
- [ ] Three numbers. First month-end is in two weeks — check you're on track for one paid job

---

## From Week 3 — the repeatable week

Same shape every week. Don't redesign it.

- **Every morning, 15 min** — stalled Izm Wear orders, new enquiries, today's one commitment
- **Mon, 2 hrs** — pipeline: chase, log, plan the week
- **Tue, 2 hrs outreach** then delivery
- **Wed** — delivery, all day, no outreach
- **Thu, 2 hrs outreach** + 1 hr content (one post, one clip)
- **Fri** — delivery, invoice anything finished, 30-min review with the three numbers

Outreach target: 15 approaches a week from week 3. Ramp down only when delivery is full.

---

## Month-end gates

Miss a gate and the fix is at the previous stage, not the next one.

### By 14 Sep (month 1)
- [ ] Domain live, both channels tested and visible
- [ ] Legal entity settled, trading details on the site, placeholders gone
- [ ] Stripe live, payment links working
- [ ] 5 service videos up
- [ ] 3 case studies written
- [ ] 40 warm approaches made
- [ ] **1 paid job of any size** — a £150 flyer counts

### By 14 Oct (month 2)
- [ ] First project delivered and invoiced
- [ ] First written testimonial
- [ ] First retainer signed (£450/mo)
- [ ] 10 live conversations in the pipeline

### By 14 Nov (month 3)
- [ ] 2 retainers running
- [ ] £2,000+ invoiced in the month
- [ ] One case study carrying a real result number, not just a description

### By 14 Feb 2027 (month 6)
- [ ] 3–4 retainers = £1,350–1,800/month recurring before any project work
- [ ] 1–2 projects a month on top
- [ ] Roughly £3,000–4,000/month, most of it repeating

---

## Standing blockers to clear when you can

- [ ] Rename the GitHub repo to `Digital-Spectrum-Labs`, repoint Netlify, update
      `GITHUB_REPO` in `email-worker/wrangler.toml` and redeploy the Worker (checklist #8)
- [ ] Real founder photo, or an honestly-labelled illustrative one (checklist #12)
- [ ] Solicitor's eye over `terms.html` before taking large payments
- [ ] Get Hand Made By You or Little VIPs actually launched — a live client URL sells harder
      than any amount of polish on your own site
