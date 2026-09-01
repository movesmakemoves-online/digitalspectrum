# GDPR Data Processing Note — Template

Use this whenever a project involves handling a client's *customer* data, not just the
client's own details — this applies most directly to: AI chatbots that talk to a client's
customers, email marketing setups, CRM work, and any custom app/website with user accounts.
It does NOT usually apply to a one-off flyer or logo job, where no customer data is involved.

This is a plain-English note to send the client, not a full legal Data Processing Agreement
(DPA) — for a client handling large volumes of sensitive data, recommend they get a solicitor
to draft a proper DPA. This note covers the common, lower-risk cases.

---

## Data Processing Note — [Client Name] project

As part of this project, Digital Spectrum Labs will process personal data on your behalf
(the "Client"). This note explains what that means under UK GDPR.

**What data is involved:**
[e.g. "Names, email addresses and messages submitted through your website's chatbot" / "Your
customers' email addresses and engagement data for the email marketing sequence" — fill in
per project]

**What we do with it:**
[e.g. "The chatbot stores conversation history to answer follow-up questions and hands off
unresolved queries to your team by email" — be specific about the actual data flow]

**Where it's stored:**
[Name the actual tools — e.g. "Stripe (for payment data)", "Netlify Forms", "the client's own
email platform" — don't leave this vague; the client should know exactly which third-party
tools touch their customers' data]

**How long we keep it:**
[e.g. "Chatbot conversation logs are kept for 90 days, then deleted" — set a real retention
period, don't leave data indefinitely without reason]

**Security measures:**
- All payment data is handled by Stripe (PCI-DSS Level 1 certified) — we never see or store
  card details directly
- [Add any other real measures — e.g. "Access to the admin panel requires a password", "Data
  is only accessible to the person doing the work"]

**Your responsibilities as the Client:**
- You remain the "data controller" — you decide what data is collected and why
- You're responsible for having your own privacy policy that covers what this project does
  with your customers' data
- You're responsible for having a lawful basis to collect the data in the first place (e.g.
  consent, legitimate interest)

**What happens when the project ends:**
[e.g. "On project completion, we delete any customer data we hold within 30 days unless
you've asked us to keep supporting the system under a retainer" — be explicit]

**Sub-processors:**
We use the following third-party tools that may process data as part of this project:
[List only what's actually relevant — e.g. Stripe, Netlify, the AI/automation platform used
(Zapier, Make, etc.), OpenAI/Anthropic if the chatbot uses an LLM API]

---

Questions about this note can go to services@digitalspectrumlabs.co.uk.
