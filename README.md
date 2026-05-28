# Fora CRM 
**A Premium WhatsApp Business CRM — Engineered by Forahia Solutions**

> The ultimate, fully-managed WhatsApp Business CRM built for high-growth teams. Stop losing leads to slow response times. Fora CRM turns your company's WhatsApp number into a centralized, AI-powered sales and support machine. 

## 🚀 Why Fora CRM?

Built by **Forahia Solutions**, Fora CRM bypasses expensive intermediaries and connects your team directly to the official **Meta WhatsApp Cloud API**. It is designed to scale with your business, offering a true Multi-Tenant SaaS architecture, automated billing, and powerful AI integrations.

## ✨ Features

### The Universal Core
- **Multi-Agent Shared Inbox:** Multiple agents working from a single official WhatsApp Business number. No more fighting over one phone.
- **Smart Assignment & Routing:** Assign conversations to specific agents to prevent collision.
- **Sales Pipelines (Kanban):** Track deals visually from `New Lead` to `Closed Won`.
- **Broadcast Campaigns:** Send Meta-approved template messages to thousands of contacts with delivery and read tracking.
- **No-Code Automations:** Visually build triggers for inbound messages, keywords, or schedules.
- **Internal Notes:** Agents can silently tag each other and leave sticky notes on chats without the customer seeing.

### 🌟 Premium SaaS Features (Built by Forahia Solutions)
- **AI Chatbot Auto-Responder:** 24/7 intelligent agent powered by OpenAI/Gemini that reads inbound queries and instantly replies based on your company's custom knowledge base.
- **Native E-Commerce Integration:** Instantly fetch and display customer Shopify/WooCommerce order statuses right in the chat sidebar.
- **In-Chat Payment Links:** Generate and send Stripe payment links directly in the chat to close sales instantly.
- **True Multi-Tenancy:** Securely host hundreds of different businesses on a single server instance with strict data isolation.
- **Automated Billing & SaaS Paywall:** Fully automated Stripe subscription management with graceful degradation, warning banners, and hard lockouts for past-due accounts.
- **Analytics & Reporting Dashboard:** Bird's-eye view of agent performance, response times, and sales ROI.

---

## 🛠 Tech Stack

Our platform uses a robust, highly scalable stack:
- **App:** Next.js 16 (App Router), React 19, TypeScript.
- **Styling:** Tailwind CSS v4, shadcn/ui.
- **Data & Auth:** Supabase (Postgres, Auth, RLS).
- **Integrations:** Meta Cloud API (WhatsApp), Stripe API, OpenAI API.
- **Deployment:** Vercel / Hostinger / AWS.

---

## 💻 Local Development Setup

*Note: Forahia Solutions Engineers Only*

```bash
# 1. Clone the repository
git clone https://github.com/ForahiaSolutions/forachat-crm.git
cd forachat-crm

# 2. Install dependencies
npm install

# 3. Environment Variables
cp .env.local.example .env.local   
# Fill in your Supabase, Meta, Stripe, and OpenAI credentials

# 4. Start Development Server
npm run dev
```

Open <http://localhost:3000>. You'll be redirected to `/login`.

### Webhook Configuration (Local)
To receive inbound WhatsApp messages locally, expose your server using ngrok:
```bash
ngrok http 3000
```
Update your Meta App Webhook configuration with the generated ngrok URL.

---

## 📄 License & Ownership

Copyright © 2026 **Forahia Solutions**. All Rights Reserved. 
This software is a proprietary product of Forahia Solutions. Unauthorized copying, distribution, or modification is strictly prohibited.
