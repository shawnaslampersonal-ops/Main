# Friday Morning Automation - Exactly What It Does

## 🎯 The Goal
Every **Friday at 8:00 AM**, the bot automatically finds pre-law opportunities in your email and adds them to your Google Sheet.

---

## 📋 YOUR GOOGLE SHEET STRUCTURE

Your sheet has **9 columns**:

1. **Name of Opportunity** — What is the program called?
2. **Demographic** — Who is it for? (first-gen, Pacific Islander, etc.)
3. **What type of opportunity is it?** — Fellowship, scholarship, internship, etc.
4. **Notes** — Any important details
5. **Date of submission** — When you applied (auto-filled: today's date)
6. **When is it?** — When is the deadline?
7. **Organization** — Who runs it?
8. **Application Link** — URL to apply
9. **Status** — Is it "New", "Submitted", "Accepted", etc.?

---

## 🤖 EXACTLY WHAT THE BOT DOES EVERY FRIDAY

### Step 1: Scan Gmail (takes ~1 minute)
The bot searches your email for messages with keywords like:
- "pre-law"
- "fellowship"
- "scholarship"
- "internship"
- "first-generation"
- "Pacific Islander"
- "LSAT"
- "pipeline program"
- "application deadline"

**Looks at:** Last 7 days of emails

---

### Step 2: Extract Information
For each email it finds, it pulls out:
- **Organization name** (from email sender/content)
- **Program name** (opportunity title)
- **Deadline date** (when you need to apply by)
- **Application link** (URL to apply)
- **Type** (fellowship, scholarship, etc.)
- **Demographic info** (if mentioned)

---

### Step 3: Add to Google Sheet
The bot automatically adds a **NEW ROW** to your sheet with:
- Name of Opportunity
- Demographic (auto-detect or leave blank)
- Type of opportunity
- Notes (what the email said)
- Date of submission = **Today's date** (when the bot ran)
- When is it? = **The deadline date**
- Organization
- Application Link
- Status = **"New"** (you can change later)

**Example row that gets added:**

| Name of Opportunity | Demographic | What type of opportunity is it? | Notes | Date of submission | When is it? | Organization | Application Link | Status |
|---|---|---|---|---|---|---|---|---|
| Pre-Law Fellowship 2026 | First-generation | Fellowship | Applications open now | 2026-07-18 | 2026-08-15 | State Bar Association | https://bar.org/apply | New |

---

### Step 4: Mark Emails
The bot adds a Gmail label **"Processed-by-Claude"** to each email it processes.
- This prevents duplicate processing next week
- You can review the labeled emails anytime

---

### Step 5: Create Calendar Reminders
For each deadline, a calendar event is created:
- **When:** 24 hours before the deadline
- **Calendar:** Your primary calendar
- **Event name:** "Deadline: {Program Name}"
- **Time zone:** America/Los_Angeles

**Example:** If deadline is August 15, 2026 → Reminder on August 14, 2026 at 8:00 AM

---

## ⏰ SCHEDULE

- **When:** Every **Friday at 8:00 AM**
- **How often:** Once per week
- **Processing time:** ~2-3 minutes
- **What runs:** Only processes emails from the **last 7 days**

---

## 🚀 HOW TO SET IT UP (Friday Automation)

You have **two options:**

### Option A: Using GitHub Actions (Recommended)
Create a file: `.github/workflows/friday-automation.yml`

```yaml
name: Friday Pre-Law Tracker
on:
  schedule:
    - cron: '0 8 * * 5'  # Every Friday at 8:00 AM UTC

jobs:
  run-automation:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
      - run: npm install
      - run: node scripts/run-friday-automation.js
        env:
          COMPOSIO_API_KEY: ${{ secrets.COMPOSIO_API_KEY }}
          GOOGLE_SHEET_ID: ${{ secrets.GOOGLE_SHEET_ID }}
```

### Option B: Using a Cron Job (Linux/Mac)
```bash
# Edit your crontab
crontab -e

# Add this line (runs Friday at 8 AM):
0 8 * * 5 cd /home/user/Main && node scripts/run-friday-automation.js
```

---

## ✅ WHAT YOU SHOULD EXPECT

**Every Friday at 8:00 AM:**
1. Gmail gets scanned
2. New opportunities appear in your sheet
3. Emails get labeled "Processed-by-Claude"
4. Calendar reminders pop up 24 hours before deadlines

**Each row in your sheet:**
- Automatically filled with deadline, org, and link
- You can edit the "Status" column when you apply
- You can add notes to the "Notes" column

---

## 🛠️ TESTING BEFORE AUTOMATION

Run it manually first:
```bash
node scripts/run-friday-automation.js
```

This will:
- Show you what it finds
- Not actually modify anything yet (in test mode)
- Let you verify the setup works

---

## 📞 Troubleshooting

| Problem | Solution |
|---------|----------|
| No opportunities found | Check that you have recent emails with keywords |
| Sheet doesn't update | Make sure GOOGLE_SHEET_ID is correct in .env |
| Reminders not showing | Check calendar permissions in Google account |
| Emails not labeled | Make sure Composio has Gmail write access |

---

**Ready to set up automation?** Let me know if you want GitHub Actions or a cron job!
