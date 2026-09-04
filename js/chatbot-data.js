/*
 * Digital Spectrum Labs — chat assistant knowledge base.
 *
 * This is the ONLY place prices, services and FAQs live for the chatbot. Edit here, not in
 * chatbot.js, when a price or answer changes on the site.
 *
 * Pricing source of truth (updated 2026-08-25): each service-*.html page's own Pricing section,
 * plus pricing.html for the full list. payments.html no longer carries any prices — it's pure
 * "how to pay" content now. packages.html no longer exists — Basic/Standard/Enhanced tiers were
 * retired; every service now has its own Platinum package and its own Retainer instead. If you
 * update a price here, update the matching live page too (and vice versa) or the assistant and
 * the site will contradict each other again.
 */

window.DSL_CHATBOT_DATA = {

  brand: {
    name: 'Digital Spectrum Labs',
    email: 'services@digitalspectrumlabs.co.uk',
    responseTime: 'within 24 hours — usually within a few hours',
  },

  // ---------------------------------------------------------------------------------------
  // Services — descriptions from each service-*.html page. Keep "covers" short; it's shown
  // as a bullet list in chat.
  // ---------------------------------------------------------------------------------------
  services: {
    websites: {
      label: 'Websites, Apps & Games',
      url: 'service-websites.html',
      pricingUrl: 'service-websites.html#pricing',
      covers: [
        'Business & portfolio websites',
        'E-commerce & web apps',
        'Mobile app builds',
        'Custom / indie game development',
        'Ongoing updates, backups and maintenance',
      ],
      pricing: [
        { name: 'Landing Page', price: '£199', detail: 'Info, pictures, contact details and products — a simple online presence' },
        { name: 'Business Website', price: '£1,199+', detail: 'Starting from — built around whatever your business needs' },
        { name: 'E-commerce Site', price: '£500 / £1,499+', detail: '£500 for a Shopify setup, or a custom build from £1,499' },
        { name: 'Custom App / Game', price: '£500–£3,000', detail: 'E.g. a booking app for a personal trainer and their clients' },
      ],
      platinum: { price: '£3,499 starting', detail: 'Full VIP build — unlimited deliverables (scoped), unlimited revisions, rush available, 30 days post-launch support, dedicated project lead' },
      retainer: { price: '£450/month starting', detail: 'Ongoing website/app support — set monthly hours, rolls over one month, cancel anytime' },
      customWebApps: {
        price: '£2,500–£15,000+',
        detail: 'Membership sites, apps with logins and payments, or anything with real backend infrastructure — scoped and quoted individually.',
      },
    },
    ai: {
      label: 'AI for Your Business',
      url: 'service-ai.html',
      pricingUrl: 'service-ai.html#pricing',
      covers: [
        'AI chatbots & assistants',
        'Workflow automation',
        'AI content & creative tools',
        'AI strategy consulting',
      ],
      pricing: [
        { name: 'AI Audit', price: '£450', detail: 'Process review, opportunities identified' },
        { name: 'Automation Setup', price: '£450+', detail: '1–3 workflows built, training included' },
        { name: 'Chatbot Build', price: '£999', detail: 'Bot design, platform setup, integration & testing' },
        { name: 'Full System', price: '£2,500+', detail: 'Multiple automations, chatbot + CRM' },
      ],
      platinum: { price: '£3,999 starting', detail: 'Full-scope AI/automation build with ongoing support — a complete, white-glove rollout' },
      retainer: { price: '£450/month starting', detail: 'Ongoing AI/automation support — set monthly hours, rolls over one month, cancel anytime' },
    },
    growth: {
      label: 'Growth & Marketing',
      url: 'service-growth.html',
      pricingUrl: 'service-growth.html#pricing',
      covers: [
        'SEO & search visibility',
        'Email marketing & automation',
        'Social media management retainers',
        'CRM & marketing tech setup',
      ],
      pricing: [
        { name: 'SEO Audit', price: '£350', detail: 'Full site audit, recommendations' },
        { name: 'Email Marketing Setup', price: '£350', detail: 'Sequence, automation, list management' },
        { name: 'SEO (Monthly)', price: '£350–£1,200/month', detail: 'Ongoing optimisation, monthly reports' },
        { name: 'Social Media Setup', price: '£199/month', detail: '2 platforms, content calendar' },
      ],
      platinum: { price: '£1,999 starting', detail: 'A big one-off launch bundle — SEO, email and social all set up together with ongoing support' },
      retainer: { price: '£450/month starting', detail: 'Ongoing SEO/email/social support — set monthly hours, rolls over one month, cancel anytime' },
    },
    video: {
      label: 'Video Production',
      url: 'service-video.html',
      pricingUrl: 'service-video.html#pricing',
      covers: [
        'Music video editing',
        'Film & short-form edits',
        'Colour grading',
        'Motion graphics & titles',
      ],
      pricing: [
        { name: 'Content Creation (short-form)', price: '£99', detail: 'Photos, video and captions, branded to you' },
        { name: 'Custom Edit', price: '£250', detail: 'AI-prompted edit' },
        { name: 'Music Video', price: '£350–£2,500', detail: 'From AI-generated to full film crew, script writing and storyboard' },
        { name: 'Promo Video', price: '£500–£3,000', detail: 'From AI-generated to full 8K cameras and crew' },
        { name: 'Filming (day rate)', price: '£750/day (£99/hour)', detail: 'Camera operator, lighting & sound' },
      ],
      platinum: { price: '£4,499 starting', detail: 'Full-scope production with ongoing support — the complete VIP treatment from concept to final cut' },
      retainer: { price: '£450/month starting', detail: 'Ongoing filming/editing support — set monthly hours, rolls over one month, cancel anytime' },
    },
    design: {
      label: 'Graphic Design',
      url: 'service-design.html',
      pricingUrl: 'service-design.html#pricing',
      covers: [
        'Event flyers & posters',
        'CD / album / single cover art',
        'Logo & brand identity systems',
        'Business cards & print collateral',
        'Social media graphic kits',
      ],
      pricing: [
        { name: 'Flyer Design', price: '£99', detail: 'Print-ready PDF' },
        { name: 'Cover Art', price: '£125+', detail: 'All formats' },
        { name: 'Logo Design', price: '£99+', detail: 'All variations' },
        { name: 'Brand Starter', price: '£450', detail: 'Logo, brand guidelines and social graphics, 3 rounds of revisions' },
      ],
      platinum: { price: '£799 starting', detail: 'Full-scope design build with ongoing support — the complete VIP treatment for a brand that needs to make an impression' },
      retainer: { price: '£450/month starting', detail: 'Ongoing design support — set monthly hours, rolls over one month, cancel anytime' },
    },
  },

  // Custom, bigger-than-standard project ranges — from pricing.html's Custom Projects section.
  customProjects: [
    { name: 'Websites', price: '£1,200–£4,500+' },
    { name: 'Apps', price: '£500–£5,000+' },
    { name: 'Video Production', price: '£350–£5,500+', detail: 'can go higher for full crews and specific requests' },
    { name: 'Full Campaigns', price: 'Custom quote' },
  ],

  process: [
    'Tell us what you need — a couple of lines is enough to begin with.',
    'We come back with a written quote covering what is included, the price and rough timings.',
    'Once you are happy, work begins. Projects over £500 start with a 50% deposit.',
    'When it is finished it is yours. Keep us on to look after it, or take it and run it yourself.',
  ],

  policies: {
    quoteValidity: 'Quotes are valid for 30 days.',
    deposit: 'Projects over £500 start with a 50% deposit; the rest is due on completion. Smaller fixed-price packages are payable in full up front.',
    refund: "You have a legal right to cancel within 14 days. If work hasn't started yet, that's a full refund. Once we've begun at your request, UK law lets us deduct a fair amount for the time and admin already spent, and refund the rest — never a blanket no-refund, but not always the full amount back either once work is under way.",
    resultsGuarantee: 'No guarantee of specific traffic, sales or rankings — those depend on your market too. We set up the system properly; the results compound from there.',
    contact: 'No phone line — everything runs through services@digitalspectrumlabs.co.uk (within 24 hours, usually a few hours) or a booked strategy call: https://calendly.com/movesmakemoves/30min',
    vat: 'Not VAT registered, so prices shown are not subject to VAT.',
  },

  // No active discount codes or bundle deals as of 2026-08-25 (all cancelled). Do NOT invent
  // one if asked — the FAQ below says so plainly.

  // ---------------------------------------------------------------------------------------
  // FAQs — real questions/answers pulled from services.html, service-*.html, about.html,
  // payments.html and packages.html. Keywords are used for free-text matching; keep them
  // lowercase.
  // ---------------------------------------------------------------------------------------
  faqs: [
    {
      q: 'Which service should I start with?',
      a: "Most businesses start with a website or brand identity. Tell me a bit about what you're building and I can point you the right way — or use the recommendation tool above.",
      keywords: ['start', 'begin', 'which service', 'where do i start'],
    },
    {
      q: 'Can I combine services?',
      a: "Yes — many clients bundle services. Tell us what you're building and we'll put together one combined quote.",
      keywords: ['combine', 'bundle', 'multiple services', 'together'],
    },
    {
      q: 'How do we get started?',
      a: 'Tell us what you need — a couple of lines is enough. We come back with a written quote covering scope, price and rough timings. Once you approve it, work begins (50% deposit on projects over £500).',
      keywords: ['get started', 'how do i start', 'process', 'how it works', 'kick off'],
    },
    {
      q: "What's the typical timeline?",
      a: 'Most projects take 2–4 weeks. Websites specifically: 2–4 weeks depending on scope, with express builds available. Video edits: 5–10 days standard, 10–15 days for promos. Custom work varies — we give a realistic schedule upfront in the quote.',
      keywords: ['timeline', 'how long', 'turnaround', 'how many days', 'how many weeks'],
    },
    {
      q: 'Do you offer retainers?',
      a: 'Yes — every service has its own monthly retainer, from £450/month starting, for ongoing support once a project is live. Unused hours roll over one month, month-to-month with no long-term contract.',
      keywords: ['retainer', 'ongoing', 'monthly support', 'subscription'],
    },
    {
      q: 'Do you work with small businesses / startups?',
      a: 'Yes. We work with startups, freelancers, small businesses and larger companies — every project gets the same direct attention, no account managers.',
      keywords: ['small business', 'startup', 'freelancer', 'solo'],
    },
    {
      q: 'Who is on your team?',
      a: "A small, experienced team — 20+ years in media between design, development, filmmaking and strategy. You work directly with the person doing the work, not an account manager.",
      keywords: ['team', 'who are you', 'about you', 'experience', 'how long have you'],
    },
    {
      q: "What's your process?",
      a: 'We listen first, diagnose the real need, then design and build to solve it — grey-box first (function before polish), design and refinement after.',
      keywords: ['process', 'how do you work', 'methodology', 'grey-box', 'grey box'],
    },
    {
      q: 'Can we schedule a call?',
      a: 'Yes — book a free 30-minute strategy call here: https://calendly.com/movesmakemoves/30min. No purchase required.',
      keywords: ['call', 'strategy call', 'book a call', 'schedule', 'meeting', 'phone'],
    },
    {
      q: 'Is my payment secure?',
      a: 'Yes — payments run through Stripe (PCI-DSS Level 1 certified, used by millions of businesses). Your card details never touch our servers.',
      keywords: ['payment secure', 'safe to pay', 'stripe', 'card details'],
    },
    {
      q: 'Can I use a discount code?',
      a: null, // filled at runtime from promoSchedule
      keywords: ['discount', 'promo', 'promo code', 'coupon', 'code'],
    },
    {
      q: 'How do you handle scope changes?',
      a: "We always ask first. If extra work is needed beyond what was quoted, we raise a new invoice and get your approval before proceeding — no surprise costs.",
      keywords: ['scope change', 'extra cost', 'goes up', 'more expensive', 'change of scope'],
    },
    {
      q: "What's your refund policy?",
      a: "You have a legal right to cancel within 14 days. If work hasn't started yet, that's a full refund. Once we've begun at your request, UK law lets us deduct a fair amount for the time and admin already spent, and refund the rest — never a blanket no-refund, but not always the full amount back either once work is under way.",
      keywords: ['refund', 'money back', 'cancel', 'cancellation'],
    },
    {
      q: 'Can I pay in installments?',
      a: 'For projects over £3,000, yes — ask us and we\'ll discuss payment plan options.',
      keywords: ['installment', 'installments', 'payment plan', 'split payment'],
    },
    {
      q: 'Will my website work on mobile?',
      a: 'Every site is built mobile-first and tested across devices and browsers.',
      keywords: ['mobile', 'responsive', 'phone friendly'],
    },
    {
      q: 'Can you update or maintain my site after launch?',
      a: 'Yes — monthly retainer or pay-per-edit, whichever suits you.',
      keywords: ['maintain', 'maintenance', 'update after launch', 'ongoing website support'],
    },
    {
      q: 'Can AI help my business?',
      a: 'Usually, yes — answering customer questions 24/7, qualifying leads, sending emails automatically, organising data, and more. We start with an audit to find what’s actually worth automating for you first, rather than guessing.',
      keywords: ['can ai help', 'what can ai', 'ai help my business', 'ai do for my business', 'ai actually do'],
    },
    {
      q: 'Do I need coding knowledge for AI/automation work?',
      a: 'No — we handle all the technical setup and hand you simple tools and instructions to use what we build.',
      keywords: ['coding', 'technical knowledge', 'do i need to code'],
    },
    {
      q: 'Is AI/automation work secure and private?',
      a: 'Yes — enterprise-grade tools, your data stays yours, and nothing is used to train third-party models.',
      keywords: ['secure', 'private', 'data privacy', 'gdpr'],
    },
    {
      q: 'Can you integrate AI with our existing tools?',
      a: 'Yes — we connect with Zapier, Make, Airtable, Stripe, email platforms and most common business software.',
      keywords: ['integrate', 'integration', 'zapier', 'existing tools', 'connect'],
    },
    {
      q: 'How much time can AI/automation actually save my business?',
      a: 'Most clients save 5–10 hours a week once things are set up. We work out a rough ROI once we understand your setup.',
      keywords: ['time save', 'how much time', 'roi', 'worth it'],
    },
    {
      q: 'Can you redesign or refresh my existing site?',
      a: "Yes — if it looks dated, loads slowly, or nobody's keeping it up to date, we can refresh it or take over the upkeep entirely.",
      keywords: ['redesign', 'refresh', 'existing site', 'already have a website', 'old website'],
    },
    {
      q: 'Can you build a mobile app?',
      a: 'Yes — cross-platform (iOS + Android) apps start from £500.',
      keywords: ['app', 'mobile app', 'ios', 'android'],
    },
    {
      q: 'Do you provide hosting?',
      a: "We recommend and set up Netlify hosting (included in website builds) — you own the domain.",
      keywords: ['hosting', 'domain', 'host my site'],
    },
  ],
};
