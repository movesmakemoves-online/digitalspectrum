/*
 * Digital Spectrum Labs — chat assistant widget.
 *
 * Rule-based (no AI API): every word this bot can say is written in chatbot-data.js or below.
 * It cannot invent a price or a service because there is no free-generation path at all — it
 * either shows a written answer or hands off to a human. That's deliberate, not a limitation
 * to fix quietly later; see the chat with Claude that built this for the reasoning.
 *
 * Built to be upgraded later: swap `matchFaq()` and the recommendation logic for a fetch() to
 * an AI backend without touching the DOM/rendering code below it.
 */

(function () {
  const DATA = window.DSL_CHATBOT_DATA;
  if (!DATA) return;

  const STORAGE_KEY = 'dslChatState';
  const SEEN_BOUNCE_KEY = 'dslChatSeenBounce';
  const PAGE = location.pathname.split('/').pop() || 'index.html';

  function loadState() {
    try {
      const raw = sessionStorage.getItem(STORAGE_KEY);
      if (raw) return JSON.parse(raw);
    } catch (e) { /* sessionStorage unavailable — start fresh */ }
    return { messages: [], answers: {}, currentStep: null, awaiting: null, open: false };
  }

  const state = loadState();

  function saveState() {
    try { sessionStorage.setItem(STORAGE_KEY, JSON.stringify(state)); } catch (e) { /* ignore */ }
  }

  // ------------------------------------------------------------------------------------
  // DOM setup
  // ------------------------------------------------------------------------------------

  const root = document.createElement('div');
  root.className = 'dsl-chat-root';
  root.innerHTML =
    '<button type="button" class="dsl-chat-toggle" id="dsl-chat-toggle" aria-label="Chat with Digital Spectrum Labs" aria-expanded="false">' +
      '<svg class="dsl-chat-toggle-icon dsl-chat-icon-open" viewBox="0 0 24 24" aria-hidden="true"><path d="M4 4h16a1 1 0 0 1 1 1v12a1 1 0 0 1-1 1H9l-5 4V6a1 1 0 0 1 1-1z"/></svg>' +
      '<svg class="dsl-chat-toggle-icon dsl-chat-icon-close" viewBox="0 0 24 24" aria-hidden="true"><path d="M6 6l12 12M18 6L6 18" stroke="currentColor" stroke-width="2" stroke-linecap="round" fill="none"/></svg>' +
      '<span class="dsl-chat-badge" id="dsl-chat-badge" hidden></span>' +
    '</button>' +
    '<div class="dsl-chat-panel" id="dsl-chat-panel" hidden role="dialog" aria-label="Digital Spectrum Labs chat">' +
      '<header class="dsl-chat-header">' +
        '<img src="assets/dsl-mark.svg" alt="" class="dsl-chat-header-logo">' +
        '<div class="dsl-chat-header-text">' +
          '<strong>Digital Spectrum Labs</strong>' +
          '<span>Usually replies within a few hours</span>' +
        '</div>' +
        '<button type="button" class="dsl-chat-restart" id="dsl-chat-restart" title="Start over">&#8635;</button>' +
        '<button type="button" class="dsl-chat-close" id="dsl-chat-close" title="Close" aria-label="Close chat">&#10005;</button>' +
      '</header>' +
      '<div class="dsl-chat-messages" id="dsl-chat-messages"></div>' +
      '<form class="dsl-chat-inputbar" id="dsl-chat-inputbar">' +
        '<input type="text" id="dsl-chat-input" autocomplete="off" placeholder="Type a message&hellip;">' +
        '<button type="submit" aria-label="Send">&#10148;</button>' +
      '</form>' +
    '</div>';
  document.body.appendChild(root);

  const els = {
    toggle: document.getElementById('dsl-chat-toggle'),
    badge: document.getElementById('dsl-chat-badge'),
    panel: document.getElementById('dsl-chat-panel'),
    messages: document.getElementById('dsl-chat-messages'),
    restart: document.getElementById('dsl-chat-restart'),
    close: document.getElementById('dsl-chat-close'),
    inputbar: document.getElementById('dsl-chat-inputbar'),
    input: document.getElementById('dsl-chat-input'),
  };

  function openPanel() {
    els.panel.hidden = false;
    root.classList.add('dsl-chat-open');
    els.toggle.setAttribute('aria-expanded', 'true');
    els.badge.hidden = true;
    state.open = true;
    saveState();
    scrollToBottom();
    if (state.messages.length === 0) begin();
    setTimeout(() => els.input.focus(), 50);
  }

  function closePanel() {
    els.panel.hidden = true;
    root.classList.remove('dsl-chat-open');
    els.toggle.setAttribute('aria-expanded', 'false');
    state.open = false;
    saveState();
  }

  els.toggle.addEventListener('click', () => {
    if (els.panel.hidden) openPanel(); else closePanel();
  });
  els.close.addEventListener('click', closePanel);

  els.restart.addEventListener('click', () => {
    if (!confirm('Start a new conversation? This clears the current chat.')) return;
    state.messages = [];
    state.answers = {};
    state.currentStep = null;
    state.awaiting = null;
    saveState();
    els.messages.innerHTML = '';
    begin();
  });

  function scrollToBottom() {
    els.messages.scrollTop = els.messages.scrollHeight;
  }

  // ------------------------------------------------------------------------------------
  // Message rendering
  // ------------------------------------------------------------------------------------

  function appendBubble(role, html) {
    const div = document.createElement('div');
    div.className = 'dsl-chat-msg dsl-chat-msg--' + role;
    div.innerHTML = html;
    els.messages.appendChild(div);
    scrollToBottom();
    return div;
  }

  // say(): adds a bot message to the transcript (persisted). Use for anything the user should
  // still see if they navigate to another page and come back.
  function say(html) {
    state.messages.push({ role: 'bot', html });
    saveState();
    appendBubble('bot', html);
  }

  function sayUser(html) {
    state.messages.push({ role: 'user', html });
    saveState();
    appendBubble('user', html);
  }

  // Quick-reply chips render on top of the transcript, not persisted as messages — they get
  // regenerated by re-running the current step's render function on rehydrate.
  let chipsContainer = null;
  function renderChips(options) {
    if (chipsContainer) chipsContainer.remove();
    chipsContainer = document.createElement('div');
    chipsContainer.className = 'dsl-chat-chips';
    options.forEach((opt) => {
      const btn = document.createElement('button');
      btn.type = 'button';
      btn.className = 'dsl-chat-chip';
      btn.textContent = opt.label;
      btn.addEventListener('click', () => {
        sayUser(opt.label);
        chipsContainer.remove();
        chipsContainer = null;
        opt.onClick();
      });
      chipsContainer.appendChild(btn);
    });
    els.messages.appendChild(chipsContainer);
    scrollToBottom();
  }

  function clearChips() {
    if (chipsContainer) { chipsContainer.remove(); chipsContainer = null; }
  }

  function setAwaiting(kind, placeholder) {
    state.awaiting = kind;
    saveState();
    els.input.placeholder = placeholder || 'Type a message…';
  }

  // ------------------------------------------------------------------------------------
  // Steps
  // ------------------------------------------------------------------------------------

  function goto(stepName, renderFn) {
    state.currentStep = stepName;
    saveState();
    renderFn(true);
  }

  const steps = {};

  steps.mainMenu = function (fresh) {
    if (fresh) {
      say(
        "Hi, I'm the Digital Spectrum Labs assistant. I can help you find the right service, " +
        "answer questions, or get you a quote. What would you like to do?"
      );
    }
    renderChips([
      { label: 'Recommend a service for my business', onClick: () => goto('recIndustry', steps.recIndustry) },
      { label: 'Ask a question', onClick: () => goto('faqMenu', steps.faqMenu) },
      { label: 'Get a quote', onClick: () => goto('quoteName', steps.quoteName) },
      { label: 'Talk to a human', onClick: () => goto('humanName', steps.humanName) },
    ]);
  };
  function begin() { goto('mainMenu', steps.mainMenu); }

  // --- Recommendation flow ---

  steps.recIndustry = function (fresh) {
    if (fresh) say("What kind of business is this for? (e.g. \"plumbing business\", \"restaurant\", \"clothing brand\")");
    clearChips();
    setAwaiting('recIndustry', 'e.g. a small plumbing business…');
  };

  steps.recWebsite = function (fresh) {
    if (fresh) say('Do you currently have a website?');
    renderChips([
      { label: 'Yes', onClick: () => { state.answers.hasWebsite = true; saveState(); goto('recSocial', steps.recSocial); } },
      { label: 'No', onClick: () => { state.answers.hasWebsite = false; saveState(); goto('recSocial', steps.recSocial); } },
    ]);
  };

  steps.recSocial = function (fresh) {
    if (fresh) say('Are you active on social media?');
    renderChips([
      { label: 'Yes', onClick: () => { state.answers.hasSocial = true; saveState(); goto('recSells', steps.recSells); } },
      { label: 'No', onClick: () => { state.answers.hasSocial = false; saveState(); goto('recSells', steps.recSells); } },
    ]);
  };

  steps.recSells = function (fresh) {
    if (fresh) say('Do customers currently book or buy from you online?');
    renderChips([
      { label: 'Yes', onClick: () => { state.answers.sellsOnline = true; saveState(); goto('recGoal', steps.recGoal); } },
      { label: 'No', onClick: () => { state.answers.sellsOnline = false; saveState(); goto('recGoal', steps.recGoal); } },
    ]);
  };

  steps.recGoal = function (fresh) {
    if (fresh) say("What's your main goal right now?");
    renderChips([
      { label: 'More customers', onClick: () => { state.answers.goal = 'customers'; saveState(); goto('recResult', steps.recResult); } },
      { label: 'Better branding', onClick: () => { state.answers.goal = 'branding'; saveState(); goto('recResult', steps.recResult); } },
      { label: 'Saving time', onClick: () => { state.answers.goal = 'time'; saveState(); goto('recResult', steps.recResult); } },
      { label: 'Improving my systems', onClick: () => { state.answers.goal = 'systems'; saveState(); goto('recResult', steps.recResult); } },
    ]);
  };

  steps.recResult = function (fresh) {
    if (fresh) say(buildRecommendation(state.answers));
    renderChips([
      { label: 'Get a tailored quote', onClick: () => goto('quoteName', steps.quoteName) },
      { label: 'Talk to a human', onClick: () => goto('humanName', steps.humanName) },
      { label: 'Start over', onClick: () => els.restart.click() },
    ]);
  };

  function buildRecommendation(a) {
    const scores = { websites: 0, growth: 0, ai: 0, design: 0, video: 0 };
    // No website at all is the dominant signal — everything else (growth, ads, social) needs
    // somewhere to send people, so it must outrank growth even when the goal is "more customers".
    if (!a.hasWebsite) scores.websites += 5;
    if (a.hasWebsite && a.goal === 'customers') scores.websites += 1;
    if (a.goal === 'customers') scores.growth += 2;
    if (!a.hasSocial) scores.growth += 1;
    if (!a.sellsOnline && a.hasWebsite) scores.growth += 1;
    if (a.goal === 'time' || a.goal === 'systems') scores.ai += 4;
    scores.ai += 1;
    if (a.goal === 'branding') scores.design += 4;
    if (!a.hasWebsite) scores.design += 1;
    if (a.goal === 'customers' || a.goal === 'branding') scores.video += 2;

    const blurbs = {
      websites: !a.hasWebsite
        ? 'You don’t have anywhere online for people to find you yet — usually the highest-impact starting point. A <a href="service-websites.html" target="_blank" rel="noopener">Landing Page</a> (from £199) or Business Website (from £1,199) gives people somewhere to land and get in touch.'
        : 'Your site is already up — worth a look at whether it’s actually converting visitors into enquiries. We can review and refresh it.',
      growth: 'Make it easier for the right people to find you — local SEO, social presence and a way to keep in touch with visitors. Starts from £350 for an SEO audit, £199/month for social.',
      ai: 'Worth a look at what’s eating your time on repetitive admin — a half-day <a href="service-ai.html" target="_blank" rel="noopener">AI Audit</a> (£450) tells you exactly what’s worth automating first.',
      design: 'A clear, consistent look — logo, colours, guidelines — makes your site, posts and print all work harder. Brand Starter is £450; a logo on its own is £99+.',
      video: 'Short video content performs well for attention and trust. A Promo Video runs £500–£3,000, or a short-form social clip from £99.',
    };

    const order = Object.keys(scores).filter((k) => scores[k] > 0).sort((x, y) => scores[y] - scores[x]).slice(0, 3);
    let html = '<strong>Your recommended digital plan</strong><br><br>';
    order.forEach((key, i) => {
      html += '<strong>Priority ' + (i + 1) + ' — ' + DATA.services[key].label + '</strong><br>' + blurbs[key] + '<br><br>';
    });
    html += 'Recommended next step: request a tailored quote or talk to a human.';
    state.answers.recommendedServices = order.map((k) => DATA.services[k].label).join(', ');
    saveState();
    return html;
  }

  // --- FAQ flow ---

  const FAQ_CATEGORIES = {
    services: { label: 'Services', ids: ['start', 'combine', 'redesign', 'app', 'hosting', 'mobile', 'maintain', 'can ai help'] },
    pricing: { label: 'Pricing & payment', ids: ['payment secure', 'discount', 'scope change', 'refund', 'installment', 'retainer'] },
    process: { label: 'How we work', ids: ['get started', 'timeline', 'process', 'call'] },
    about: { label: 'About us', ids: ['team', 'small business'] },
  };

  function findFaqByKeyword(kw) {
    return DATA.faqs.find((f) => f.keywords.includes(kw));
  }

  steps.faqMenu = function (fresh) {
    if (fresh) say('What would you like to know about?');
    renderChips(Object.keys(FAQ_CATEGORIES).map((catKey) => ({
      label: FAQ_CATEGORIES[catKey].label,
      onClick: () => { state.answers.faqCat = catKey; saveState(); goto('faqList', steps.faqList); },
    })).concat([{ label: 'Something else — let me type it', onClick: () => goto('faqFreeText', steps.faqFreeText) }]));
  };

  steps.faqList = function (fresh) {
    const cat = FAQ_CATEGORIES[state.answers.faqCat];
    if (fresh) say('Pick a question, or type your own any time:');
    const qs = cat.ids.map(findFaqByKeyword).filter(Boolean);
    renderChips(qs.map((f) => ({
      label: f.q,
      onClick: () => { state.answers.lastFaq = f.q; saveState(); goto('faqAnswer', steps.faqAnswer); },
    })).concat([{ label: '← Back', onClick: () => goto('faqMenu', steps.faqMenu) }]));
  };

  steps.faqAnswer = function (fresh) {
    if (fresh) {
      const f = DATA.faqs.find((x) => x.q === state.answers.lastFaq);
      say(f ? answerFor(f) : 'Sorry, I lost track of that one.');
    }
    renderChips([
      { label: 'Ask another question', onClick: () => goto('faqMenu', steps.faqMenu) },
      { label: 'Get a quote', onClick: () => goto('quoteName', steps.quoteName) },
      { label: 'Talk to a human', onClick: () => goto('humanName', steps.humanName) },
      { label: 'Main menu', onClick: () => goto('mainMenu', steps.mainMenu) },
    ]);
  };

  steps.faqFreeText = function (fresh) {
    if (fresh) say('Type your question below.');
    clearChips();
    setAwaiting('faqFreeText', 'Ask me anything about our services…');
  };

  function answerFor(f) {
    if (f.a !== null) return f.a;
    // discount-code FAQ — no active codes right now; never invent one
    return "There's no live discount code at the moment — want me to check with the team?";
  }

  // "How much does X cost?" style questions — answered directly from live pricing data rather
  // than relying on a canned FAQ, since these are the single most common real question (per the
  // Phase 2 brief) and the exact service asked about varies too much to write one FAQ per case.
  const PRICE_INTENT = ['cost', 'price', 'how much', 'pricing', 'charge', '£'];
  const SERVICE_KEYWORDS = {
    websites: ['website', ' site', 'web page', 'webpage', 'app', 'game'],
    ai: ['ai ', 'chatbot', 'automation', 'automate'],
    growth: ['seo', 'marketing', 'social media', 'email marketing', 'growth'],
    video: ['video', 'edit', 'film', 'promo'],
    design: ['logo', 'flyer', 'design', 'brand', 'cover art', 'poster'],
  };

  function matchPricingQuery(text) {
    const t = ' ' + text.toLowerCase();
    if (!PRICE_INTENT.some((w) => t.includes(w))) return null;
    const key = Object.keys(SERVICE_KEYWORDS).find((k) => SERVICE_KEYWORDS[k].some((kw) => t.includes(kw)));
    return key ? formatServicePricing(key) : null;
  }

  function formatServicePricing(key) {
    const s = DATA.services[key];
    let html = '<strong>' + s.label + ' — pricing</strong><br>';
    s.pricing.forEach((p) => { html += p.name + ': <strong>' + p.price + '</strong> — ' + p.detail + '<br>'; });
    html += '<br>Full breakdown: <a href="' + s.pricingUrl + '" target="_blank" rel="noopener">' + s.pricingUrl + '</a>';
    return html;
  }

  // Shared handler for any free-typed question, whether asked from the FAQ free-text step or
  // typed with no active flow at all.
  function answerFreeText(text) {
    const priceHtml = matchPricingQuery(text);
    if (priceHtml) {
      logQuery(text, true);
      say(priceHtml);
      state.currentStep = 'followupChips';
      saveState();
      steps.followupChips(false);
      return;
    }
    const f = matchFaq(text);
    if (f) {
      logQuery(text, true);
      state.answers.lastFaq = f.q;
      saveState();
      goto('faqAnswer', steps.faqAnswer);
    } else {
      handleFallback(text);
    }
  }

  steps.followupChips = function () {
    renderChips([
      { label: 'Ask another question', onClick: () => goto('faqMenu', steps.faqMenu) },
      { label: 'Get a quote', onClick: () => goto('quoteName', steps.quoteName) },
      { label: 'Talk to a human', onClick: () => goto('humanName', steps.humanName) },
      { label: 'Main menu', onClick: () => goto('mainMenu', steps.mainMenu) },
    ]);
  };

  // Simple keyword scoring for free-typed questions.
  function matchFaq(text) {
    const t = text.toLowerCase();
    let best = null;
    let bestScore = 0;
    DATA.faqs.forEach((f) => {
      let score = 0;
      f.keywords.forEach((kw) => { if (t.includes(kw)) score += kw.length; });
      if (score > bestScore) { bestScore = score; best = f; }
    });
    return bestScore >= 3 ? best : null;
  }

  // --- Quote flow ---

  steps.quoteName = function (fresh) {
    if (fresh) say("Happy to get that started. What's your name?");
    clearChips();
    setAwaiting('quoteName', 'Your name…');
  };
  steps.quoteEmail = function (fresh) {
    if (fresh) say('And the best email to send the quote to?');
    clearChips();
    setAwaiting('quoteEmail', 'you@example.com');
  };
  steps.quoteDetails = function (fresh) {
    if (fresh) say("Last thing — tell me a bit about the project (what you need, rough budget or timeline if you have one).");
    clearChips();
    setAwaiting('quoteDetails', 'Tell me about your project…');
  };
  steps.quoteDone = function (fresh) {
    if (fresh) {
      submitLead('quote');
      say(
        "Thanks — that's been sent to the team. Expect a written quote at " + escapeHtml(state.answers.email) +
        ' ' + DATA.brand.responseTime + '.'
      );
    }
    renderChips([{ label: 'Main menu', onClick: () => goto('mainMenu', steps.mainMenu) }]);
  };

  // --- Human handover flow ---

  steps.humanName = function (fresh) {
    if (fresh) say("No problem — what's your name?");
    clearChips();
    setAwaiting('humanName', 'Your name…');
  };
  steps.humanEmail = function (fresh) {
    if (fresh) say('And your email, so someone can reply directly?');
    clearChips();
    setAwaiting('humanEmail', 'you@example.com');
  };
  steps.humanNote = function (fresh) {
    if (fresh) say('Anything you want the team to know before they reply? (Or just hit send with anything, even "no")');
    clearChips();
    setAwaiting('humanNote', 'A quick note…');
  };
  steps.humanDone = function (fresh) {
    if (fresh) {
      submitLead('human_handover');
      say('Passed on to the team — expect a reply ' + DATA.brand.responseTime + '.');
    }
    renderChips([{ label: 'Main menu', onClick: () => goto('mainMenu', steps.mainMenu) }]);
  };

  // --- Fallback (unmatched free text outside a specific flow) ---

  function handleFallback(text) {
    logQuery(text, false);
    say("I don't have a confident answer for that one — want me to pass it to a person on the team?");
    renderChips([
      { label: 'Yes, pass it on', onClick: () => { state.answers.humanNote = text; saveState(); goto('humanName', steps.humanName); } },
      { label: 'Try the FAQ menu instead', onClick: () => goto('faqMenu', steps.faqMenu) },
      { label: 'No thanks', onClick: () => goto('mainMenu', steps.mainMenu) },
    ]);
  }

  // ------------------------------------------------------------------------------------
  // Free-text input handling
  // ------------------------------------------------------------------------------------

  function escapeHtml(str) {
    const div = document.createElement('div');
    div.textContent = String(str == null ? '' : str);
    return div.innerHTML;
  }

  els.inputbar.addEventListener('submit', (e) => {
    e.preventDefault();
    const text = els.input.value.trim();
    if (!text) return;
    els.input.value = '';
    sayUser(escapeHtml(text));
    clearChips();

    switch (state.awaiting) {
      case 'recIndustry':
        state.answers.industry = text;
        saveState();
        setAwaiting(null);
        goto('recWebsite', steps.recWebsite);
        return;
      case 'quoteName':
        state.answers.name = text;
        saveState();
        setAwaiting(null);
        goto('quoteEmail', steps.quoteEmail);
        return;
      case 'quoteEmail':
        if (!/^\S+@\S+\.\S+$/.test(text)) { say("That doesn't look like a valid email — try again?"); setAwaiting('quoteEmail'); return; }
        state.answers.email = text;
        saveState();
        setAwaiting(null);
        goto('quoteDetails', steps.quoteDetails);
        return;
      case 'quoteDetails':
        state.answers.message = text;
        saveState();
        setAwaiting(null);
        goto('quoteDone', steps.quoteDone);
        return;
      case 'humanName':
        state.answers.name = text;
        saveState();
        setAwaiting(null);
        goto('humanEmail', steps.humanEmail);
        return;
      case 'humanEmail':
        if (!/^\S+@\S+\.\S+$/.test(text)) { say("That doesn't look like a valid email — try again?"); setAwaiting('humanEmail'); return; }
        state.answers.email = text;
        saveState();
        setAwaiting(null);
        goto('humanNote', steps.humanNote);
        return;
      case 'humanNote':
        state.answers.humanNote = text;
        saveState();
        setAwaiting(null);
        goto('humanDone', steps.humanDone);
        return;
      case 'faqFreeText':
        setAwaiting(null);
        answerFreeText(text);
        return;
      default:
        // Free-typed question with no active flow — try to answer it, else hand off.
        answerFreeText(text);
    }
  });

  // ------------------------------------------------------------------------------------
  // Netlify Forms submission (same zero-backend pattern as the main contact form)
  // ------------------------------------------------------------------------------------

  function netlifySubmit(formName, data) {
    const body = Object.assign({ 'form-name': formName }, data);
    return fetch('/', {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: new URLSearchParams(body).toString(),
    }).catch(() => { /* best-effort — chat confirmation already shown regardless */ });
  }

  // Redundant backup copy to the same Worker that logs email leads to GitHub, so a chat-widget
  // quote request survives even if Netlify's own Forms dashboard is never checked. Best-effort —
  // the chat confirmation is already shown regardless of whether this succeeds.
  const LEAD_BACKUP_URL = 'https://dsl-lead-router.movesmakemoves.workers.dev/chatbot-lead';

  function backupLeadToGitHub(requestType, data) {
    fetch(LEAD_BACKUP_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(Object.assign({ request_type: requestType }, data)),
    }).catch(() => {});
  }

  function submitLead(requestType) {
    const a = state.answers;
    const data = {
      request_type: requestType,
      name: a.name || '',
      email: a.email || '',
      business: a.industry || '',
      goal: a.goal || '',
      has_website: a.hasWebsite === undefined ? '' : String(a.hasWebsite),
      has_social: a.hasSocial === undefined ? '' : String(a.hasSocial),
      sells_online: a.sellsOnline === undefined ? '' : String(a.sellsOnline),
      recommended_services: a.recommendedServices || '',
      message: a.message || a.humanNote || '',
      page: PAGE,
      timestamp: new Date().toISOString(),
    };
    netlifySubmit('chatbot-lead', data);
    backupLeadToGitHub(requestType, data);
  }

  function logQuery(text, matched) {
    netlifySubmit('chatbot-query', {
      question: text,
      matched: String(matched),
      page: PAGE,
      timestamp: new Date().toISOString(),
    });
  }

  // ------------------------------------------------------------------------------------
  // Boot
  // ------------------------------------------------------------------------------------

  // Replay any existing transcript (from an earlier page on this same site visit).
  if (state.messages.length) {
    state.messages.forEach((m) => appendBubble(m.role, m.html));
    if (state.currentStep && steps[state.currentStep]) {
      steps[state.currentStep](false);
      if (state.awaiting) els.input.placeholder = 'Continue…';
    }
  }

  // Always starts closed — icon only — on every page. Only the visitor clicking it opens it.

  // First-visit nudge: a single gentle pulse on the button, once ever, if still closed after 6s.
  setTimeout(() => {
    if (els.panel.hidden && !localStorage.getItem(SEEN_BOUNCE_KEY)) {
      els.toggle.classList.add('dsl-chat-pulse');
      els.badge.hidden = false;
      localStorage.setItem(SEEN_BOUNCE_KEY, '1');
    }
  }, 6000);
})();
