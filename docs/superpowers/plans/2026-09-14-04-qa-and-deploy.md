# QA and Deploy Plan (Plan 4 of 4)

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Verify the site against the spec's quality targets, then publish it on Vercel from a GitHub repo with the email key configured.

**Architecture:** Automated checks (lint, unit tests, static-route guard, Lighthouse, axe) run locally against a production build; a manual checklist covers keyboard, screen reader, reduced motion and breakpoints. Deployment is GitHub → Vercel with env vars set in Vercel.

**Tech Stack:** Lighthouse CLI, @axe-core/cli, GitHub CLI (`gh`), Vercel CLI (or the Vercel plugin skills).

**Spec:** `docs/superpowers/specs/2026-09-14-site-rebuild-design.md` §11–12. Requires Plans 1–3.

## Global Constraints

- Targets: Lighthouse mobile performance ≥ 90, accessibility ≥ 95; CLS < 0.1; axe: no serious/critical issues.
- Creating the GitHub repo, pushing, and deploying are shared-state actions: **confirm with the user before each**.
- Never commit `.env.local`; keys go into Vercel project settings.

---

### Task 1: Automated quality gates

**Files:**
- Modify: `package.json` (add `qa` script)

- [ ] **Step 1: Add scripts**

```json
"qa:build": "npm run lint && npm test && npm run build && npm run check:static",
"qa:lighthouse": "npx --yes lighthouse http://localhost:3000 --preset=perf --form-factor=mobile --screenEmulation.mobile --only-categories=performance,accessibility,best-practices,seo --chrome-flags=\"--headless=new\" --output=json --output-path=./.qa/lighthouse-home.json",
"qa:axe": "npx --yes @axe-core/cli http://localhost:3000 http://localhost:3000/products/rice http://localhost:3000/products/rice/irri-6 http://localhost:3000/contact http://localhost:3000/certifications --exit"
```
Add `.qa/` to `.gitignore`.

- [ ] **Step 2: Run the build gates** — `npm run qa:build` → all green.

- [ ] **Step 3: Start the production server and run Lighthouse + axe**

```bash
npm start &
sleep 3
mkdir -p .qa
npm run qa:lighthouse
npm run qa:axe
```
Read scores from `.qa/lighthouse-home.json` (`categories.performance.score`, `categories.accessibility.score`, `audits.cumulative-layout-shift.numericValue`). Expected: ≥ 0.90, ≥ 0.95, < 0.1. axe exits 0.

- [ ] **Step 4: Fix anything below target, re-run, then commit**

```bash
git add package.json .gitignore
git commit -m "chore: quality gate scripts"
```

---

### Task 2: Manual checklist (record results in the PR/commit message)

- [ ] Direct-load in a fresh tab: `/`, `/products`, `/products/rice`, `/products/rice/irri-6`, `/certifications`, `/services`, `/about`, `/insights`, `/contact`, `/blog` (→ `/insights`), a bad URL (404 page).
- [ ] Keyboard only: skip link → header → Products menu (open, arrow/Tab, Escape) → dial (arrows, Enter opens panel) → form (Tab order, error summary focus, links jump to fields).
- [ ] Screen reader spot check (NVDA or VoiceOver): dial announces "N of 6, Name"; form errors are read with the field.
- [ ] OS reduced motion on: no dial rotation, no page-load sequence.
- [ ] Widths 375, 768, 1024, 1440: no horizontal scroll; header CTAs present on mobile (icon + quote); dial usable by swipe at 375.
- [ ] Contrast spot check with the browser devtools on: teal buttons, muted text on salt, salt text on navy.
- [ ] Submit a real enquiry (valid) → email arrives; invalid → errors; then confirm no key appears in any client bundle (`grep -r WEB3FORMS .next/static` returns nothing).

---

### Task 3: Repository and Vercel deployment

- [ ] **Step 1: Confirm with the user**, then create the GitHub repo and push

```bash
gh repo create drake-passage-site --private --source=. --remote=origin --push
```

- [ ] **Step 2: Confirm with the user**, then create/link the Vercel project and set env vars (Vercel CLI; the `vercel:deploy` skill is an equivalent path)

```bash
npx --yes vercel link
npx --yes vercel env add WEB3FORMS_ACCESS_KEY production
npx --yes vercel env add NEXT_PUBLIC_SITE_URL production   # the production URL Vercel assigns, or the custom domain once it exists
npx --yes vercel --prod
```

- [ ] **Step 3: Post-deploy checks on the live URL**: direct-load the same routes as Task 2; submit a test enquiry from the live site; open `/sitemap.xml`, `/robots.txt`, and a shared link preview (OG image renders).

- [ ] **Step 4: Hand back**: report the production URL, the Vercel project name, and the open items from spec §14 (custom domain, business email, photography, founding year, new catalog PDF).

---

## Self-review

- Spec §11–12 covered: build/static guard, Lighthouse and axe thresholds, direct-load and keyboard/screen-reader/reduced-motion/breakpoint passes, real email test, secrets check.
- Shared-state actions gated on user confirmation.
