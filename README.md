# 🦁 LancerBeast — Waitlist Page

> Stop wasting connects on jobs that won't hire you.

A Chrome extension waitlist landing page for Upwork freelancers. Built with Next.js 14, Tailwind CSS, Neon PostgreSQL, and Resend.

---

## Your Work (What You Build vs What Is Already Done)

**Already done (this repo):**
- Complete waitlist page with all 5 sections
- All API routes (waitlist join, count, visitor tracking)
- Confirmation email template
- Database schema
- Deployment config

**Your job:**
1. Create accounts on 3 free services (Neon, Resend, Vercel)
2. Add 3 environment variables to Vercel
3. Run one SQL command to create the tables
4. Connect your Cloudflare domain

Total setup time: ~30 minutes.

---

## Step-by-Step Setup

### Step 1 — Run locally first
```bash
npm install
cp .env.example .env.local
# Fill in .env.local with your real values (see steps below)
npm run dev
```
Open http://localhost:3000 — the page loads but form won't work until you add env vars.

---

### Step 2 — Create your Neon database (free)

1. Go to **neon.tech** → Sign up (free, no credit card)
2. Click **"New Project"** → Name it `lancerbeast` → Click Create
3. On the dashboard, click **"Connection Details"**
4. Copy the **Connection string** — it looks like:
   ```
   postgresql://neondb_owner:xxxx@ep-xxxx.us-east-2.aws.neon.tech/neondb?sslmode=require
   ```
5. This is your `DATABASE_URL`. Save it somewhere safe.

**Create the tables:**
Still on Neon dashboard, click **"SQL Editor"** and run this:

```sql
CREATE TABLE IF NOT EXISTS waitlist (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email VARCHAR(255) UNIQUE NOT NULL,
  confirmed BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS page_views (
  session_id VARCHAR(64) PRIMARY KEY,
  last_seen TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

Click **Run**. Done.

---

### Step 3 — Set up Resend (free email, 3,000 emails/month)

1. Go to **resend.com** → Sign up (free)
2. Click **"API Keys"** in the sidebar → **"Create API Key"**
3. Name it `lancerbeast-production` → Click Create
4. Copy the key — it starts with `re_`. Save it. **You only see it once.**

**Add your domain to Resend (so emails send from hello@lancerbeast.com):**

5. In Resend, click **"Domains"** → **"Add Domain"**
6. Type `lancerbeast.com` → Click Add
7. Resend will show you **3–4 DNS records** to add. Leave this tab open.

**Add Resend DNS records to Cloudflare:**

8. Open **Cloudflare dashboard** → Click your domain `lancerbeast.com`
9. Click **DNS** → **Records**
10. For each record Resend shows you, click **"Add record"** in Cloudflare:
    - **Type**: exactly what Resend says (TXT or CNAME or MX)
    - **Name**: exactly what Resend says (e.g. `resend._domainkey`)
    - **Content**: exactly what Resend says (the long value)
    - **TTL**: Auto
    - **Proxy status**: Set to **DNS only** (grey cloud, NOT orange) for all Resend records
11. Click Save for each record
12. Go back to Resend → Click **"Verify Domain"**
13. Wait 2–5 minutes → refresh → it should show "Verified ✓"

> **If Resend verification fails:** Wait 10 more minutes and try again. DNS takes time.

---

### Step 4 — Deploy to Vercel

1. Create a GitHub repository:
   ```bash
   git init
   git add .
   git commit -m "Initial commit — LancerBeast waitlist"
   git branch -M main
   git remote add origin https://github.com/YOUR_USERNAME/lancerbeast.git
   git push -u origin main
   ```

2. Go to **vercel.com** → Sign up / Log in with GitHub
3. Click **"Add New Project"** → Import your `lancerbeast` repository
4. Framework: **Next.js** (auto-detected)
5. Click **"Deploy"** — it will fail because env vars are missing. That's expected.

**Add environment variables in Vercel:**

6. Go to your Vercel project → **Settings** → **Environment Variables**
7. Add these three variables (one at a time):

   | Variable | Value |
   |---|---|
   | `DATABASE_URL` | Your Neon connection string |
   | `RESEND_API_KEY` | Your Resend API key (starts with `re_`) |
   | `NEXT_PUBLIC_SITE_URL` | `https://lancerbeast.com` |

8. After adding all three, go to **Deployments** → Click the failed deployment → **Redeploy**

The site will now deploy successfully.

---

### Step 5 — Connect your Cloudflare domain to Vercel

**In Vercel:**
1. Go to your project → **Settings** → **Domains**
2. Type `lancerbeast.com` → Click **Add**
3. Also add `www.lancerbeast.com` → Click **Add**
4. Vercel will show you an IP address (for the A record) — something like `76.76.21.21`

**In Cloudflare:**
5. Open **Cloudflare dashboard** → Click `lancerbeast.com` → **DNS** → **Records**
6. Look for an existing **A record** with name `@` — if it exists, click Edit. If not, click Add Record.
7. Set it:
   - **Type**: A
   - **Name**: `@`
   - **IPv4 address**: The IP Vercel gave you (e.g. `76.76.21.21`)
   - **Proxy status**: **DNS only** (grey cloud) ← IMPORTANT: must be grey, not orange
   - **TTL**: Auto
8. Add or update the **CNAME record** for `www`:
   - **Type**: CNAME
   - **Name**: `www`
   - **Target**: `cname.vercel-dns.com`
   - **Proxy status**: **DNS only** (grey cloud)
   - **TTL**: Auto

> **Why grey cloud (DNS only)?** Vercel handles SSL certificates automatically. If you use Cloudflare's proxy (orange cloud), Vercel can't issue the SSL certificate and the site breaks. Always use DNS only for Vercel deployments.

9. Wait 10–60 minutes for DNS propagation
10. Go back to Vercel → **Settings** → **Domains** — the domain should show a green checkmark
11. SSL certificate is issued automatically by Vercel. No action needed.

---

### Step 6 — Test everything

- [ ] Open https://lancerbeast.com — page loads over HTTPS
- [ ] Submit a test email — should show success message
- [ ] Check your inbox — confirmation email arrives from hello@lancerbeast.com
- [ ] Check Neon SQL Editor: `SELECT * FROM waitlist;` — your email is in there
- [ ] Submit same email again — should say "already on the list"
- [ ] Check the spot counter in Section 4 updates

---

## Environment Variables Reference

| Variable | Where to get it | Example |
|---|---|---|
| `DATABASE_URL` | Neon dashboard → Connection Details | `postgresql://user:pass@ep-xxx.neon.tech/neondb?sslmode=require` |
| `RESEND_API_KEY` | Resend dashboard → API Keys | `re_xxxxxxxxxxxxxxxx` |
| `NEXT_PUBLIC_SITE_URL` | You set this | `https://lancerbeast.com` |

---

## Database Schema (already run in Step 2)

```sql
-- Stores waitlist emails
CREATE TABLE IF NOT EXISTS waitlist (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email VARCHAR(255) UNIQUE NOT NULL,
  confirmed BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Tracks active visitors (for live visitor count)
CREATE TABLE IF NOT EXISTS page_views (
  session_id VARCHAR(64) PRIMARY KEY,
  last_seen TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

---

## API Routes

| Method | Route | Purpose |
|---|---|---|
| `POST` | `/api/waitlist` | Submit email to waitlist |
| `GET` | `/api/waitlist/count` | Get current signup count |
| `POST` | `/api/visitors/ping` | Update visitor session timestamp |
| `GET` | `/api/visitors/count` | Get active visitor count (last 2 min) |

---

## Tech Stack

- **Next.js 14** (App Router)
- **Tailwind CSS**
- **Neon** (serverless PostgreSQL — free tier)
- **Resend** (transactional email — free tier, 3,000/month)
- **Vercel** (hosting — free tier)

---

## Troubleshooting

**"Email not arriving"**
→ Check Resend dashboard → Emails tab → see if it was sent and what the status is
→ Check spam folder
→ Make sure your domain is verified in Resend (green checkmark)

**"DATABASE_URL error on deploy"**
→ Make sure the full connection string is in Vercel env vars with no spaces
→ Make sure `?sslmode=require` is at the end

**"Domain not connecting"**
→ Make sure Cloudflare proxy is grey (DNS only), NOT orange
→ Wait longer — DNS can take up to 60 minutes
→ Use https://dnschecker.org to check if your A record has propagated

**"Resend domain not verifying"**
→ Make sure the Resend DNS records in Cloudflare are set to DNS only (grey cloud)
→ Wait 10 minutes and click Verify again

---

*LancerBeast — Built for Upwork freelancers.*
