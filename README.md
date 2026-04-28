# AutoDial v2 - User Guide

**The v2 workspace for AutoDial caller and management workflows**

## v2 Focus

- Clearer caller vs management workspace states.
- Pre-call readiness checks before a session starts.
- Script snapshots, reference-note toggling, and safer rich-text rendering.
- Filtered live activity, callback priority cards, duplicate merge tools, and stronger management analytics.
- V2-isolated PWA cache so this version can be tested separately from the original AutoDial app.

### For Mains (Callers)

1. Log in → select **Main** role
2. Wait for Owner approval (one-time)
3. Your admin will assign you a leads sheet
4. Go to **Leads** tab → **Fetch Leads** → start dialing!
5. Earn ⭐ stars with every dial and rank up monthly

### For Admins

1. Log in → select **Admin** role
2. Wait for Owner approval (one-time)
3. Your leads sheet will be linked by the Main/Owner
4. Go to **Leads** tab → **Fetch Leads** to load contacts
5. Track your Main's appointments and session stats

---

## 📲 Install as App (PWA)

AutoDial works as an installable app on your phone — no app store needed!

**iPhone:** Open in Safari → tap Share (↑) → "Add to Home Screen" → AutoDial appears as an app icon

**Android:** Open in Chrome → banner appears "Install AutoDial v2" → tap Install → appears in your app drawer

Once installed, it runs full-screen like a native app with offline support.

---

## 📱 The Calling Flow

### Starting a Session

1. Tap **▶️ Start Session** (bottom of Dial tab)
2. If multiple time slots are configured, pick one (e.g., "5h challenge")
3. The first eligible lead loads automatically and dials

### During a Call

You'll see the lead's name, phone, age, gender, email, and any remarks from the sheet.

**After each call, tap one of:**

| Button | What it does |
|--------|-------------|
| **NP** | No Pick — lead didn't answer. Auto-counts (NP x1, x2, x3…). After 5 NPs, auto-converts to NI |
| **CB** | Callback — pick a date/time. Lead enters the CB queue and surfaces when due |
| **NI** | Not Interested — lead is removed from the dial queue permanently |
| **Set** | Appointment Set! Creates a calendar event + appointment card |
| **Skip** | Don't mark anything — move to next lead |

### ⚡ Smart Auto-Dial

**NI and NP auto-advance instantly** — no extra screens, no extra taps. You tap NI → the next lead is already dialing. This saves ~200 taps per day across 100 calls.

**CB and Set** show a remarks screen so you can add notes before advancing.

### ↩️ 10-Second Undo

After NI or NP auto-advance, a gold **↩️ Undo** bar appears for 10 seconds. Tap it to reverse the status and jump back to that lead. Disappears automatically after 10 seconds.

---

## ⭐ Ranking & Stars System (Mains Only)

> **Important:** Mains earn **stars**, not pay. Stars are your gamified achievement currency. Admins handle pay separately through the session/timesheet system.

### How Ranks Work

Your rank is based on **appointments set this month**. Ranks reset on the 1st of every month.

| Rank | Emoji | Default Min Appts |
|------|-------|-------------------|
| Warrior | ⚔️ | 0 |
| Elite | 🛡️ | 5 |
| Master | 🏅 | 10 |
| Grandmaster | 💎 | 20 |
| Epic | 🌟 | 30 |
| Legend | 👑 | 40 |
| Mythic | 🏆 | 55 |

*(Owner can customize all thresholds in Settings → ⭐ Rank System)*

### How Stars Work

Stars are earned two ways:

1. **Milestone Stars** — awarded when you rank up. Each rank gives bonus stars (e.g., Elite = +10⭐, Mythic = +500⭐). Each rank can only award once per month.
2. **Stars per Dial** — earn a small amount for every call made (default: 0.1⭐ per dial). Even NP calls count!

### 🏦 Star Bank (Lifetime)

Your Star Bank is your lifetime accumulated total:
- On the **1st of each month**, your current monthly stars get **banked**
- Monthly rank resets to Warrior
- Milestone tracking resets (earn them again!)
- Your bank keeps growing forever
- Toast on reset: "🏦 X stars banked! New month, new grind."

Your total is shown in Settings: **🏦 Star Bank: X ⭐**

### Who Can Edit Ranks

- **Owner** — sees editable inputs for all rank thresholds, milestone stars, and stars per dial
- **Mains (non-owner)** — see a gamified read-only display showing which ranks they've achieved
- **Admins** — don't see the rank system at all

### What Doesn't Count

- Admin appointments do NOT count toward your rank
- Only appointments YOU set contribute to your monthly rank

---

## 🏆 Live Leaderboard

Real-time ranking across all Mains — visible in the **Rank tab**.

- Ranked by appointments set today
- 🥇🥈🥉 Gold / Silver / Bronze for top 3
- Green dot = currently in a live calling session
- "YOU" badge highlights your position
- Updates every 30 seconds automatically

---

## 🛡️ Conflict Resolution

When multiple Mains share the same lead sheet:

- Each lead is **claimed** when you start dialing them
- If another Main tries to dial the same lead within 10 minutes:
  **"⚠️ John is already calling Stella Koh"**
- The app auto-skips to the next unclaimed lead
- Prevents wasted calls and awkward double-dials

---

## 🧠 AI-Powered Lead Analysis

### Claude AI (Recommended — Each User's Own Key)

Claude analyzes your Google Sheet with 6 layers of intelligence:

1. **Two-Pass Validation** — verifies column mapping against sample data, corrects mistakes
2. **Batch Remark Classification** — understands context: "refund case pending" = NI, "husband will call back" = CB
3. **Name Extraction** — fixes leads where phone number shows as name
4. **Confidence Scoring** — flags uncertain columns → triggers 🔧 Columns override
5. **Smart Dedup** — finds duplicate leads across batches, auto-marks them
6. **Learning Loop** — when you correct a status, Claude learns related patterns (e.g., "refund" → also learns "refund case", "refund pending")

**Setup (each user does this individually):**
1. Go to [console.anthropic.com/settings/keys](https://console.anthropic.com/settings/keys)
2. Add $5 credit and create an API key
3. Open AutoDial → **Settings** → **🧠 Claude AI** section
4. Paste your `sk-ant-...` key
5. It's saved to your signed-in AutoDial account and synced across your own devices

**Key privacy:** Claude keys are user-specific. The app stores each key in that user's own Supabase row (`claude_<email>`) so it can follow the same user across devices. Apply the RLS policy in [`supabase/rls-autodial-admin-config.sql`](supabase/rls-autodial-admin-config.sql) so authenticated users can read or update only their own Claude-key row.

**Cost:** ~$0.04 per fetch. With 1-2 fetches/day = **~$2-4/month per user**.

No Claude key? Falls back to Gemini (free) or manual parsing.

### Gemini AI (Free Fallback)

If no Claude key is set, AutoDial uses Google Gemini. Add your Gemini key in **Settings → 🤖 Gemini AI**.

### Rich Text Script Safety

Calling scripts and reference notes support basic formatting such as bold, italic, underline, colors, highlights, lists, and spacing. AutoDial sanitizes saved HTML before syncing or rendering so unsafe tags, event handlers, links, images, scripts, and unapproved styles are stripped.

### 🔧 Manual Column Override

If AI gets columns wrong:
1. Fetch leads → go to **Leads** tab
2. Tap **🔧 Columns** button (next to search bar)
3. Reassign columns: Phone, First Name, DOB/Birthday, Remarks, etc.
4. Tap **✅ Apply & Re-import**

---

## 📴 Offline Mode

AutoDial works without internet:

- Leads are cached in your browser — keep calling even if WiFi drops
- Status changes (NI/NP/CB/Set) queue locally
- Sheet write-backs batch in a queue and flush when online
- When connection returns: **"📶 Back online — syncing…"**
- **OFFLINE** badge appears in the header when disconnected

---

## 📊 Sheet Write-Back Queue

Status updates are **batched** instead of firing one API call per change:
- Mark 5 leads NI quickly → one batched write instead of 5
- 3-second debounce — waits for you to finish rapid-fire marking
- If offline, changes queue locally and sync when back online
- Prevents Google API rate limiting during fast calling sessions

---

## 🔄 Session Recovery

If the app crashes or your browser closes mid-session:

- **Phase, lead position, and session stats** persist to localStorage
- On reload, you're restored to the **exact same lead and session**
- Sessions older than 24 hours auto-clear to prevent zombie sessions
- Cross-device: ending a session on desktop auto-detects on phone

---

## 📅 Appointments

### Call Mode (CALL toggle)
Shows only **your** appointments (ones you set).

### Manage Mode (MGMT toggle)
Shows **all** appointments grouped by admin:
- **📞 My Appointments** — yours (shown first)
- **👤 Admin Name** — each admin's appointments with count

### Appointment Actions

| Button | What it does |
|--------|-------------|
| **Met ✅** | Meeting completed → adds incentive to current billing cycle |
| **Postponed** | Reschedule — stays in pending |
| **Fly Kite 🪁** | No-show |
| **Closed 💰** | Deal closed! Enter EFYC (Main) or Tip (Admin) amount |

Status changes write back to the Google Sheet "Appointments Set" tab automatically.

---

## 🔗 Google Connection (Permanent)

AutoDial uses a Cloudflare Worker for permanent Google auth:

- **First time:** Tap "Connect Google" → popup → grant access → done forever
- **Every login after:** Token refreshes silently via the Worker. No popup, no tap.
- Works across devices and sessions — lasts until you manually disconnect

---

## 🔄 Cross-Device Sync

Everything syncs across devices via Supabase:

- Leads, settings, appointments, sessions, stars, achievements
- Each user's own Claude API key, scoped to that signed-in user
- Start a session on desktop → continue on phone
- End a session on one device → other device detects it automatically
- Deleted appointments sync across devices (can't come back)

---

## 📊 Status Abbreviations

AutoDial auto-detects these from your sheet remarks:

| Remark | Status | Meaning |
|--------|--------|---------|
| NI, N.I., not interested | NI | Not Interested |
| NP, NPx2, no pick, no answer | NP | No Pick |
| CB, callback, call back, call tmr | CB | Callback |
| appt set, appointment, date+time+location | Set | Appointment Set |
| WN, wrong number | NI | Wrong Number = NI |
| DNC, do not call, DND | NI | Do Not Call = NI |
| deceased, passed away | NI | = NI |
| refund, cancelled | NI | = NI |

**Custom patterns:** When you see "⚠ UNRECOGNIZED" and pick a status, AutoDial remembers that pattern forever. With Claude AI enabled, it also learns related variations automatically.

---

## ⚙️ Settings Reference

### Owner-Only Settings (⭐ Rank System)

| Setting | Description |
|---------|------------|
| Min Appts per Rank | Threshold for each rank (Warrior=0, Elite=5, Mythic=55…) |
| Milestone Stars | Stars awarded on rank-up (Elite=+10⭐, Mythic=+500⭐…) |
| Stars per Dial | Stars earned per call (default: 0.1) |

### All Users

| Setting | Description |
|---------|------------|
| Google Sheets | Link your lead spreadsheet |
| 🤖 Gemini AI Key | Free AI analysis |
| 🧠 Claude AI Key | Smarter analysis — each user enters their own key (~$4/mo) |
| Call Delay | Seconds between auto-dial (adjustable during calls) |
| NP → NI Threshold | Auto-convert to NI after X no-picks (default: 5) |
| Queue Priority | Lead selection order (Blank → CB Due → NP Retry) |

---

## 💡 Tips & Tricks

- **Speed dial:** NI/NP auto-advance means one tap = next call. No wasted time.
- **Undo safety net:** Mis-tapped NI? You have 10 seconds to undo.
- **Star grinding:** Even NP calls earn 0.1⭐. Every dial counts toward your bank!
- **Column override:** If AI misreads your sheet, 🔧 Columns fixes it instantly.
- **Leaderboard motivation:** Check the Rank tab to see who's on top today.
- **Offline calling:** WiFi dropped? Keep dialing — everything syncs later.
- **No double-calls:** The conflict system ensures two Mains never dial the same person.

---

## 🆘 Troubleshooting

| Issue | Fix |
|-------|-----|
| App won't load | Clear browser cache, reload. Data is safe in Supabase |
| Google popup keeps appearing | Check if Cloudflare Worker is set up. Settings → Google |
| Leads not loading | Check Google connection + sheet URL in Settings |
| NI leads still showing in dial | Hard refresh (Ctrl+Shift+R), re-fetch leads |
| Session won't start | Stale session may exist — auto-clears after 24h, or end manually |
| "OFFLINE" showing | Check internet. Changes will sync when back |
| Dial loops to same lead | Update to latest version (pre-computed navigation) |
| Claude AI not working | Check your API key in Settings → 🧠 Claude AI |
| Claude key not syncing | Confirm Supabase RLS policies from `supabase/rls-autodial-admin-config.sql` were applied |

---

## 🛠 Development Notes

AutoDial currently ships as a pre-compiled single-file React app in `index.html`. Keep production fixes surgical there, but future feature work should move toward the source/build plan in [`docs/ARCHITECTURE.md`](docs/ARCHITECTURE.md) so changes happen in readable components before compiling to the deployed file.

*AutoDial v2 - Dial smarter, manage cleaner, and ship safely.*
