# Google Apps Script Setup - Step by Step

## 📋 What You'll Have When Done

✅ A second sheet called **"Pre-Law Opportunities"** in your Google Sheet  
✅ Automatic web search for pre-law opportunities every **Friday at 8 AM**  
✅ Claude AI reviewing each result for relevance and deadline  
✅ New opportunities auto-added to the sheet  
✅ Calendar reminders 24 hours before each deadline

---

## 🚀 Installation (5 minutes)

### Step 1: Open Your Google Sheet
Go to: https://docs.google.com/spreadsheets/d/1dR9tOJwcotZjZ-FfS0jOsR1eca9kVpOsiiKKcSmZ25M

### Step 2: Open Apps Script Editor
- Click **Extensions** (top menu)
- Click **Apps Script**
- A new tab opens with the code editor

### Step 3: Clear & Paste Code
1. Delete any starter code in the editor
2. Open the file: `scripts/GoogleAppsScript-PreLaw.gs` (in your project folder)
3. Copy the **ENTIRE** file
4. Paste it into the Apps Script editor
5. Press **Ctrl+S** (or Cmd+S) to save

### Step 4: Run Setup Function
1. At the top, find the function dropdown (currently says "Select function")
2. Choose `createWeeklyTrigger`
3. Click the ▶️ **Run** button
4. Google will ask to authorize:
   - "Apps Script wants to access your Google Calendar"
   - "Apps Script wants to access external services"
   - Click **"Allow"** for both
5. Wait ~10 seconds

**You'll see in the console:**
```
✅ Weekly trigger created: every Friday at 8:00 AM
```

### Step 5: Test It (Optional but Recommended)
1. Change the function dropdown to `runOpportunitySearch`
2. Click **Run** button
3. Google will ask to authorize Calendar again — click **"Allow"**
4. Watch the **Execution log** (bottom) to see what it finds
5. Check your Google Sheet — a new sheet called **"Pre-Law Opportunities"** should appear with some opportunities

### Step 6: You're Done! 🎉
- The automation is now scheduled
- **Every Friday at 8:00 AM**, it will search and add opportunities
- Check your sheet anytime to see what was found
- Edit the "Status" column as you apply (to "Submitted", "Accepted", etc.)

---

## 📊 What Gets Added to Your Sheet

**New sheet: "Pre-Law Opportunities"** with these columns:

| Column | What it contains |
|--------|-----------------|
| Name of Opportunity | Program/fellowship name |
| Demographic | Who it's for (e.g., "First-generation") |
| What type of opportunity is it? | Fellowship, Scholarship, Program, Internship |
| Notes | Brief description from Claude |
| Date of submission | Today's date (when bot ran) |
| When is it? | Application deadline |
| Organization | Who runs it |
| Application Link | URL to apply |
| Status | "New" (you can change to "Submitted", etc.) |

**Example row:**
```
Pre-Law Fellowship | First-generation | Fellowship | 
Competitive program for diverse law students | 7/18/2026 | 
2026-08-15 | State Bar Association | https://bar.org/apply | New
```

---

## 🔍 What It Searches For

Every Friday, it runs 7 different searches:
- "pre-law fellowship application deadline 2026 2027"
- "law school summer program high school application"
- "pre-law scholarship undergraduate students"
- "law school pipeline program application deadline"
- "law school mentorship program application"
- "law school mentorship program application"
- "diversity pre-law fellowship first generation"

**Result:** ~5 results per search = up to 35 new opportunities checked each week

---

## 🧠 How Claude Reviews Results

For each search result, Claude asks:
✅ Is this actually a pre-law opportunity?  
✅ Is it open to apply right now (not expired)?  
✅ What's the deadline?  
✅ Who is it for?  
✅ What is it really about?

**Claude says "no thanks" if it's:**
- A news article about pre-law
- A forum post or Reddit thread
- Expired or past deadline
- General law school info (not an application)
- Not for students

---

## ⏰ Schedule

| When | What |
|------|------|
| **Every Friday at 8:00 AM** | Automation runs |
| ~2-3 minutes | Search + Claude + sheet update completes |
| Same day | Calendar reminders created for deadlines |

---

## 💰 Cost

- **Google Custom Search API**: FREE (100 searches/day, you use ~7/week)
- **Claude API**: ~$0.10-0.50 per week (processes 35 results, very cheap)
- **Google Calendar**: FREE

**Total:** ~$2-3/month (basically free)

---

## 🆘 Troubleshooting

| Problem | Solution |
|---------|----------|
| Nothing appears in sheet | Run `runOpportunitySearch` manually to test |
| Authorization failed | Click "Allow" when Google asks to authorize |
| API key errors | Check that all 3 API keys are correct (they're in the .gs file) |
| No opportunities found | Normal! Some weeks may have fewer results. Check again next Friday. |
| Deadline not showing on calendar | Claude couldn't parse the date. It will still show in the sheet. |

---

## 🎯 Next Steps

1. ✅ Copy the Apps Script code into your Google Sheet
2. ✅ Run `createWeeklyTrigger` once
3. ✅ (Optional) Test with `runOpportunitySearch`
4. ✅ Done! It runs automatically now

**Questions?** The code has detailed comments. Check the Execution log in Apps Script for details on what happened.

---

**Ready to go!** Your Friday automation is live. 🚀
