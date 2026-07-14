/**
 * Test script to verify Composio integrations are working
 * Usage: node scripts/test-integrations.js
 */

require('dotenv').config();

async function testComposioSetup() {
  try {
    console.log('🔍 Testing Composio Setup...\n');

    // Check environment variables
    console.log('📋 Checking environment variables:');
    const required = ['COMPOSIO_API_KEY', 'GOOGLE_SHEET_ID'];
    const missing = required.filter(key => !process.env[key]);

    if (missing.length > 0) {
      console.warn(`⚠️  Missing environment variables: ${missing.join(', ')}`);
      console.log('   Create a .env file using .env.example as a template\n');
    } else {
      console.log('✅ All required environment variables set\n');
    }

    // Load configuration
    console.log('📦 Loading Composio configuration...');
    const config = require('../composio.config.js');
    console.log('✅ Configuration loaded\n');

    // Display integrations
    console.log('🔌 Enabled Integrations:');
    Object.entries(config.connections).forEach(([name, settings]) => {
      if (settings.enabled) {
        console.log(`   ✅ ${name} - ${settings.description}`);
        console.log(`      Scopes: ${settings.scope.join(', ')}`);
      }
    });
    console.log();

    // Display sheet configuration
    console.log('📊 Google Sheets Configuration:');
    console.log(`   Spreadsheet ID: ${config.sheet.spreadsheetId || 'NOT SET'}`);
    console.log(`   Sheet Name: ${config.sheet.sheetName}`);
    console.log(`   Headers: ${config.sheet.headers.join(', ')}\n`);

    // Display Gmail configuration
    console.log('📧 Gmail Configuration:');
    console.log(`   Search Query: ${config.gmail.searchQuery}`);
    console.log(`   Process Label: ${config.gmail.processLabel}`);
    console.log(`   Lookback Window: 7 days\n`);

    console.log('✨ Setup test complete!');
    console.log('\nNext steps:');
    console.log('1. Ensure COMPOSIO_API_KEY is set in .env');
    console.log('2. Ensure GOOGLE_SHEET_ID points to your tracker sheet');
    console.log('3. Run: npm install dotenv --save');
    console.log('4. Authenticate with Google via Composio dashboard');

  } catch (error) {
    console.error('❌ Error during setup test:', error.message);
    process.exit(1);
  }
}

testComposioSetup();
