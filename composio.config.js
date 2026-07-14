/**
 * Composio Configuration for Pre-Law Opportunity Tracker
 *
 * This configuration enables Composio integrations for:
 * - Google Sheets: Append opportunities, update tracker status
 * - Gmail: Process incoming pre-law opportunity emails
 * - Google Calendar: Create deadline reminders
 */

module.exports = {
  // API Key (set via environment variable COMPOSIO_API_KEY)
  apiKey: process.env.COMPOSIO_API_KEY,

  // Application connections
  connections: {
    googleSheets: {
      enabled: true,
      scope: ['https://www.googleapis.com/auth/spreadsheets'],
      required: true,
      description: 'Write opportunities to the Organized PRE-LAW sheet'
    },
    gmail: {
      enabled: true,
      scope: ['https://www.googleapis.com/auth/gmail.readonly'],
      required: true,
      description: 'Read and process pre-law opportunity emails'
    },
    googleCalendar: {
      enabled: true,
      scope: ['https://www.googleapis.com/auth/calendar'],
      required: false,
      description: 'Create deadline reminder events'
    }
  },

  // Sheet configuration - MATCHES YOUR ACTUAL SHEET
  sheet: {
    spreadsheetId: process.env.GOOGLE_SHEET_ID,
    sheetName: 'Sheet1', // Your default sheet
    headers: [
      'Name of Opportunity',
      'Demographic',
      'What type of opportunity is it?',
      'Notes',
      'Date of submission',
      'When is it?',
      'Organization',
      'Application Link',
      'Status'
    ]
  },

  // Gmail configuration - Runs every Friday morning
  gmail: {
    searchQuery: 'newer_than:7d (pre-law OR fellowship OR scholarship OR internship OR "first-gen" OR "Pacific Islander" OR underrepresented OR LSAT OR "pipeline program" OR "application deadline")',
    processLabel: 'Processed-by-Claude',
    archiveAfterProcessing: false,
    schedule: 'Friday 8:00 AM' // When automation runs
  },

  // Calendar configuration
  calendar: {
    calendarId: 'primary',
    reminderMinutesBefore: 1440, // 24 hours before deadline
    timeZone: 'America/Los_Angeles'
  }
};
