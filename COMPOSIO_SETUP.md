# Composio Installation & Setup Guide

## Overview

This project uses **Composio** to extend the pre-law opportunity tracker with Google Sheets, Gmail, and Google Calendar integrations. This bridges the tooling gap left by the MCP server's read-only limitations.

## What is Composio?

Composio is an integration platform that provides a unified SDK for connecting your applications to 100+ external services (Google Workspace, Slack, HubSpot, etc.) with built-in authentication, error handling, and rate limiting.

## Installation Status

✅ **Composio Core** has been installed via npm:
```bash
npm install composio-core --save
```

## Required Setup Steps

### 1. Set Up Google Authentication

You'll need to authenticate Composio with Google to access Sheets, Gmail, and Calendar:

```bash
export COMPOSIO_API_KEY="your-composio-api-key"
```

Get your API key from [composio.dev](https://composio.dev) after signing up.

### 2. Google Sheets Integration

**Configuration:**
- Spreadsheet ID: Set `GOOGLE_SHEET_ID` environment variable
- Sheet name: `Organized PRE-LAW`
- Target columns: Opportunity Name, Organization, Type, Deadline Date, Application Link, Brief Description, Status

**Schema Reconciliation Needed:**
The current sheet header uses: `Name of Opportunity | Demographic | What type of opportunity is it? | Notes | Date of submission | When is it? | Column 5 | Column 6`

Before first append, align with the standardized schema above.

### 3. Gmail Integration

**Configuration:**
- Search query: Scans for pre-law, fellowship, scholarship, internship keywords
- Label to create: `Processed-by-Claude` (for tracking processed emails)
- Lookback window: Last 7 days (configurable)

### 4. Google Calendar Integration (Optional)

- Creates deadline reminder events 24 hours before application due dates
- Target calendar: Primary calendar
- Time zone: America/Los_Angeles (configurable)

## Environment Variables

Create a `.env` file (not committed to git):

```bash
COMPOSIO_API_KEY=your-api-key-here
GOOGLE_SHEET_ID=your-spreadsheet-id-here
COMPOSIO_LOG_LEVEL=info
```

## Configuration

The main configuration file is `composio.config.js`. It defines:
- Which integrations are enabled
- Google API scopes required
- Sheet headers and structure
- Gmail search queries
- Calendar reminder timing

## Next Steps

1. **Sign up** at [composio.dev](https://composio.dev)
2. **Generate an API key** from your Composio account
3. **Authenticate** with Google (Composio will guide you through OAuth)
4. **Update `.env`** with your credentials and spreadsheet ID
5. **Test integrations** using the scripts in `scripts/` directory (to be created)
6. **Deploy** the weekly automation (cron job or GitHub Actions)

## Troubleshooting

- **403 errors on Google APIs**: Check that your Google account has access to the target spreadsheet/Gmail account
- **Missing API key**: Ensure `COMPOSIO_API_KEY` environment variable is set
- **Sheet schema mismatch**: Manually edit the sheet headers first or use Composio's `updateRange()` method

## Resources

- [Composio Documentation](https://docs.composio.dev)
- [Google Sheets Integration Guide](https://docs.composio.dev/integrations/google-sheets)
- [Gmail Integration Guide](https://docs.composio.dev/integrations/gmail)
- [API Reference](https://docs.composio.dev/api-reference)

## Files in This Setup

```
├── package.json                   # Node.js dependencies
├── composio.config.js            # Composio configuration
├── COMPOSIO_SETUP.md             # This guide
├── .env                          # Environment variables (not committed)
└── scripts/                      # Automation scripts (to be created)
    ├── run-weekly-tracker.js
    └── test-integrations.js
```

---

**Last Updated:** 2026-07-14
