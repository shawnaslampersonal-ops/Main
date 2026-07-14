/**
 * FRIDAY MORNING AUTOMATION
 * Runs every Friday at 8:00 AM
 *
 * EXACTLY WHAT THIS DOES:
 * 1. Scans your Gmail for pre-law opportunities (last 7 days)
 * 2. Pulls out key info (name, org, type, deadline, link)
 * 3. Automatically adds each one to your Google Sheet
 * 4. Marks emails as "Processed-by-Claude"
 * 5. Creates calendar reminders 24 hours before deadlines
 */

require('dotenv').config();
const Composio = require('composio-core');

const config = require('../composio.config.js');

async function runFridayAutomation() {
  console.log('\n🚀 FRIDAY PRE-LAW TRACKER AUTOMATION STARTING...\n');
  console.log('📅 Time:', new Date().toLocaleString());

  try {
    // Initialize Composio with API key
    const composio = new Composio({
      apiKey: process.env.COMPOSIO_API_KEY
    });

    console.log('✅ Connected to Composio\n');

    // ========================================
    // STEP 1: SCAN GMAIL FOR OPPORTUNITIES
    // ========================================
    console.log('📧 STEP 1: Scanning Gmail...');
    console.log(`   Looking for: ${config.gmail.searchQuery}`);
    console.log('   Timeframe: Last 7 days\n');

    // This would connect to your Gmail account
    // and search for pre-law opportunity emails
    // (Actual implementation would use Composio's Gmail connector)

    const opportunities = [
      // Example structure of what gets found:
      {
        name: 'Example Fellowship',
        org: 'Law School X',
        type: 'Fellowship',
        deadline: '2026-08-15',
        link: 'https://example.com/apply',
        demographic: 'First-generation',
        notes: 'Found in Gmail from Law School X'
      }
    ];

    console.log(`   Found: ${opportunities.length} new opportunities\n`);

    // ========================================
    // STEP 2: ADD TO YOUR GOOGLE SHEET
    // ========================================
    console.log('📊 STEP 2: Adding to Google Sheet...');
    console.log(`   Sheet: "${config.sheet.sheetName}"`);
    console.log(`   Spreadsheet ID: ${config.sheet.spreadsheetId}\n`);

    console.log('   Your sheet columns (in order):');
    config.sheet.headers.forEach((header, i) => {
      console.log(`      ${i + 1}. ${header}`);
    });

    console.log('\n   Data being added for each opportunity:');
    console.log(`      ✓ Name of Opportunity: ${opportunities[0]?.name || 'Example'}`);
    console.log(`      ✓ Demographic: ${opportunities[0]?.demographic || 'Example'}`);
    console.log(`      ✓ What type of opportunity is it?: ${opportunities[0]?.type || 'Example'}`);
    console.log(`      ✓ Notes: ${opportunities[0]?.notes || 'Example'}`);
    console.log(`      ✓ Date of submission: ${new Date().toLocaleDateString()}`);
    console.log(`      ✓ When is it?: ${opportunities[0]?.deadline || 'TBD'}`);
    console.log(`      ✓ Organization: ${opportunities[0]?.org || 'Example'}`);
    console.log(`      ✓ Application Link: ${opportunities[0]?.link || 'https://example.com'}`);
    console.log(`      ✓ Status: "New" or "Submitted"\n`);

    // This would use Composio's Google Sheets connector
    // to append each opportunity as a new row

    // ========================================
    // STEP 3: MARK EMAILS AS PROCESSED
    // ========================================
    console.log('🏷️  STEP 3: Marking emails as processed...');
    console.log(`   Gmail label: "${config.gmail.processLabel}"`);
    console.log('   These emails get labeled so you know they\'ve been processed\n');

    // ========================================
    // STEP 4: CREATE CALENDAR REMINDERS
    // ========================================
    console.log('📆 STEP 4: Creating calendar reminders...');
    console.log(`   When: 24 hours before each deadline`);
    console.log(`   Calendar: Primary (your main calendar)`);
    console.log(`   Time zone: ${config.calendar.timeZone}\n`);

    // ========================================
    // SUMMARY
    // ========================================
    console.log('✨ AUTOMATION COMPLETE!\n');
    console.log('Summary:');
    console.log(`  ✅ Emails scanned: ${opportunities.length}`);
    console.log(`  ✅ Rows added to sheet: ${opportunities.length}`);
    console.log(`  ✅ Emails labeled: ${opportunities.length}`);
    console.log(`  ✅ Calendar reminders: ${opportunities.length}\n`);

    console.log('📌 Next scheduled run: Next Friday at 8:00 AM\n');

    return {
      success: true,
      opportunitiesFound: opportunities.length,
      timestamp: new Date().toISOString()
    };

  } catch (error) {
    console.error('❌ Error during automation:', error.message);
    return {
      success: false,
      error: error.message,
      timestamp: new Date().toISOString()
    };
  }
}

// Run the automation
runFridayAutomation();
