/**
 * PRE-LAW OPPORTUNITY TRACKER
 * Searches the web for pre-law opportunities (fellowships, programs, scholarships),
 * uses Claude to extract structured info + deadlines, then writes to Google Sheet
 * and adds Calendar events.
 *
 * ============ SETUP (one time) ============
 * 1. Open your Google Sheet: https://docs.google.com/spreadsheets/d/1dR9tOJwcotZjZ-FfS0jOsR1eca9kVpOsiiKKcSmZ25M
 * 2. Extensions > Apps Script
 * 3. Delete any starter code and paste this entire file in
 * 4. Save it with Ctrl+S
 * 5. Run `createWeeklyTrigger` from the function dropdown at the top
 *    (Google will ask to authorize Calendar + external requests — approve it)
 * 6. Run `runOpportunitySearch` once manually to test
 *
 * You're all set! It will now run automatically every Friday at 8 AM.
 */

// ============ CONFIG (ALREADY FILLED IN) ============
const ANTHROPIC_API_KEY = 'ak_zmKl06WFADsfafyypYrI';
const GOOGLE_CSE_API_KEY = 'AIzaSyAuLgbuXdwKIMP1Uz3IGIJObuGOoRipVAc';
const GOOGLE_CSE_ID = 'b7a4fa7ce31574064';

// Pre-law focused search queries
const SEARCH_QUERIES = [
  'pre-law fellowship application deadline 2026 2027',
  'law school summer program high school application',
  'pre-law scholarship undergraduate students',
  'law school pipeline program application deadline',
  'pre-law internship program students apply',
  'law school mentorship program application',
  'diversity pre-law fellowship first generation'
];

const SHEET_NAME = 'Pre-Law Opportunities';

// ============ MAIN ENTRY POINT ============
function runOpportunitySearch() {
  console.log('🚀 Starting Pre-Law Opportunity Search...');
  const sheet = getOrCreateSheet();
  const existingLinks = getExistingLinks(sheet);
  let addedCount = 0;
  let processedCount = 0;

  SEARCH_QUERIES.forEach((query, index) => {
    console.log(`\n📍 Query ${index + 1}/${SEARCH_QUERIES.length}: "${query}"`);
    const results = googleSearch(query);
    console.log(`   Found ${results.length} results`);

    results.forEach((result, idx) => {
      processedCount++;

      if (existingLinks.has(result.link)) {
        console.log(`   [${idx + 1}] ⏭️  Already tracked: ${result.title.substring(0, 50)}`);
        return;
      }

      const info = extractOpportunityInfo(result);
      if (info && info.isRelevant) {
        addToSheet(sheet, info);
        if (info.deadline && isValidDate(info.deadline)) {
          addToCalendar(info);
          console.log(`   [${idx + 1}] ✅ Added: ${info.name} (deadline: ${info.deadline})`);
        } else {
          console.log(`   [${idx + 1}] ✅ Added: ${info.name} (no deadline)`);
        }
        existingLinks.add(result.link);
        addedCount++;
      } else {
        console.log(`   [${idx + 1}] ⏭️  Not relevant: ${result.title.substring(0, 50)}`);
      }

      Utilities.sleep(500); // be polite to APIs
    });
  });

  const summary = `\n✨ COMPLETE!\nProcessed: ${processedCount} results\nAdded: ${addedCount} new opportunities`;
  console.log(summary);
  Logger.log(summary);
}

// ============ SHEET HELPERS ============
function getOrCreateSheet() {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  let sheet = ss.getSheetByName(SHEET_NAME);

  if (!sheet) {
    console.log(`📊 Creating new sheet: "${SHEET_NAME}"`);
    sheet = ss.insertSheet(SHEET_NAME);

    // Headers matching your "Organized PRE-LAW" structure
    sheet.appendRow([
      'Name of Opportunity',
      'Demographic',
      'What type of opportunity is it?',
      'Notes',
      'Date of submission',
      'When is it?',
      'Organization',
      'Application Link',
      'Status'
    ]);

    sheet.setFrozenRows(1);
    console.log('   Headers created');
  }

  return sheet;
}

function getExistingLinks(sheet) {
  const data = sheet.getDataRange().getValues();
  const links = new Set();

  // Column 8 = "Application Link"
  for (let i = 1; i < data.length; i++) {
    if (data[i][7]) { // Column H (index 7)
      links.add(data[i][7]);
    }
  }

  console.log(`📋 Found ${links.size} existing opportunities in sheet`);
  return links;
}

function addToSheet(sheet, info) {
  sheet.appendRow([
    info.name || 'Unknown',
    info.demographic || '', // Will extract if possible
    info.type || 'Fellowship/Program',
    info.description || '',
    new Date(), // Date of submission = today
    info.deadline || 'Unknown',
    info.organization || '',
    info.link,
    'New' // Status
  ]);
}

// ============ SEARCH ============
function googleSearch(query) {
  const url = 'https://www.googleapis.com/customsearch/v1'
    + `?key=${GOOGLE_CSE_API_KEY}&cx=${GOOGLE_CSE_ID}`
    + `&q=${encodeURIComponent(query)}&num=5`; // 5 results per query

  try {
    const response = UrlFetchApp.fetch(url, { muteHttpExceptions: true });
    const json = JSON.parse(response.getContentText());

    if (json.error) {
      console.log('⚠️  Search API error: ' + JSON.stringify(json.error));
      return [];
    }

    return (json.items || []).map(item => ({
      title: item.title,
      link: item.link,
      snippet: item.snippet
    }));
  } catch (e) {
    console.log('❌ Search error: ' + e);
    return [];
  }
}

// ============ CLAUDE EXTRACTION ============
function extractOpportunityInfo(result) {
  const today = Utilities.formatDate(new Date(), Session.getScriptTimeZone(), 'yyyy-MM-dd');

  const prompt = `Today's date is ${today}. You are extracting structured data about a `
    + `pre-law opportunity (fellowship, program, scholarship, internship, mentorship) `
    + `from a search result snippet.

Title: ${result.title}
URL: ${result.link}
Snippet: ${result.snippet}

Respond with ONLY a JSON object, no markdown fences, exactly in this shape:
{"isRelevant": true/false, "name": "opportunity name", "organization": "org name or empty", "type": "Fellowship/Scholarship/Program/Internship", "demographic": "target demographic or empty", "deadline": "YYYY-MM-DD or null", "description": "one sentence"}

Rules:
- isRelevant = true ONLY if this is an actual open application for pre-law/law students
- isRelevant = false if: news article, expired, general law info, forum post, not for students
- type: use exact values (Fellowship/Scholarship/Program/Internship/Mentorship/Other)
- demographic: only if explicitly mentioned (first-gen, minority-focused, women, etc.)
- deadline: extract as YYYY-MM-DD, or null if not found
- description: one sentence about what it is`;

  const payload = {
    model: 'claude-opus-4-8',
    max_tokens: 300,
    messages: [{ role: 'user', content: prompt }]
  };

  const options = {
    method: 'post',
    contentType: 'application/json',
    headers: {
      'x-api-key': ANTHROPIC_API_KEY,
      'anthropic-version': '2023-06-01'
    },
    payload: JSON.stringify(payload),
    muteHttpExceptions: true
  };

  try {
    const response = UrlFetchApp.fetch('https://api.anthropic.com/v1/messages', options);
    const json = JSON.parse(response.getContentText());

    if (json.error) {
      console.log('⚠️  Claude API error: ' + JSON.stringify(json.error));
      return null;
    }

    const text = json.content[0].text.trim();
    const cleaned = text.replace(/```json|```/g, '').trim();
    const parsed = JSON.parse(cleaned);
    parsed.link = result.link;
    return parsed;
  } catch (e) {
    console.log('⚠️  Parse error: ' + e);
    return null;
  }
}

// ============ CALENDAR ============
function addToCalendar(info) {
  if (!info.deadline || !isValidDate(info.deadline)) return;

  try {
    const date = new Date(info.deadline + 'T00:00:00');
    if (isNaN(date.getTime())) return;

    const calendar = CalendarApp.getDefaultCalendar();
    const eventTitle = `📋 ${info.name}`;
    const eventDesc = `${info.description}\n\nOrganization: ${info.organization || 'Unknown'}\n\nApply: ${info.link}`;

    calendar.createAllDayEvent(eventTitle, date, { description: eventDesc });
    console.log(`   📅 Calendar reminder created for ${info.deadline}`);
  } catch (e) {
    console.log('⚠️  Calendar error: ' + e);
  }
}

// ============ HELPERS ============
function isValidDate(dateStr) {
  const date = new Date(dateStr + 'T00:00:00');
  return !isNaN(date.getTime()) && date > new Date();
}

// ============ SCHEDULING ============
// Run this ONCE from the function dropdown to set up weekly automation
function createWeeklyTrigger() {
  // Clear any existing triggers first
  ScriptApp.getProjectTriggers().forEach(t => {
    if (t.getHandlerFunction() === 'runOpportunitySearch') {
      ScriptApp.deleteTrigger(t);
    }
  });

  // Create new trigger: Friday at 8 AM
  ScriptApp.newTrigger('runOpportunitySearch')
    .timeBased()
    .everyWeeks(1)
    .onWeekDay(ScriptApp.WeekDay.FRIDAY)
    .atHour(8)
    .create();

  console.log('✅ Weekly trigger created: every Friday at 8:00 AM');
  Logger.log('✅ Weekly trigger created: every Friday at 8:00 AM');
}

// Delete the trigger if needed
function deleteWeeklyTrigger() {
  ScriptApp.getProjectTriggers().forEach(t => {
    if (t.getHandlerFunction() === 'runOpportunitySearch') {
      ScriptApp.deleteTrigger(t);
      Logger.log('❌ Trigger deleted');
    }
  });
}
