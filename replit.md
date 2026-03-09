# GOJO BOT - WhatsApp Baileys Multi-Device Bot

## Project Overview
GOJO BOT is a Satoru Gojo (Jujutsu Kaisen) themed WhatsApp bot built with Baileys multi-device library for Node.js, deployed on Replit.

### Theme
- **Color Scheme:** Black background with blue #3d5afe glow (Infinite Void aesthetic)
- **Emojis:** ♾️✨🧿🤞🌀
- **Name:** GOJO
- **Prefix:** `.`

---

## Latest Updates (March 09, 2026)

### Fixed: Commands Not Working
- **Issue:** Made `reply` function async, breaking existing commands
- **Solution:** Reverted to synchronous `reply()` with error handling in `.catch()`
- **File:** `handler.js` (line 101)

### Feature: Any WhatsApp Connected = Owner
- Changed `isOwner` logic from hardcoded list to automatic owner detection
- **How it works:** Any WhatsApp number connected to the bot is automatically treated as the owner
- **File:** `handler.js` (lines 42-44)

### Feature: Creator Information System
Added creator details to `config.js`:
- **Creator Name:** OAD-26
- **Creator Number:** +2349138385352
- **Creator Email:** oad262626@gmail.com
- **Feedback Contact:** +2349138385352 (WhatsApp) / oad262626@gmail.com (Email)

### Feature: Automatic Connection Messages
When bot connects to WhatsApp, it automatically sends:

1. **To Creator (OAD-26):**
   - Shows the WhatsApp number that was connected
   - Formatted in Gojo style with emojis
   - Message: "DOMAIN CONNECTED" with status

2. **To Owner (Connected Number):**
   - Welcome message with "INFINITE VOID ACTIVATED"
   - Instructions for `.menu` command
   - Support contact information (email + WhatsApp)

**File:** `bot.js` (lines 41-63)

---

## Core System Architecture

### Key Files
- `bot.js` - Bot initialization, connection handling, auto-messages
- `handler.js` - Message routing, command detection, auto-react/greet
- `config.js` - Global configuration with Gojo theme
- `commands/` - Command modules organized by category
- `utils/` - Helper functions and systems

### Message Handler Flow
1. Extract message body from various message types
2. Extract quoted message (supports all Baileys message types)
3. Check for auto-react and auto-greet
4. Detect command with prefix (`.`)
5. Load command and execute with context object

### Context Object Passed to Commands
```javascript
ctx = {
  from,           // Sender's chat ID
  sender,         // Sender's WhatsApp number
  isOwner,        // Always true (auto-owner detection)
  isGroup,        // Is message from group?
  quoted,         // Quoted message object
  reply: (t) => {},       // Send reply with original message quoted
  react: (e) => {}        // React with emoji to message
}
```

---

## Database & Storage

### Session Management
- **Location:** `/session` folder
- **Excluded from Git:** Prevents credential leaks
- `.gitignore` protects sensitive session data

### Persistent Data
- **AutoReact State:** `database/autoreact.json`
  - Format: `{ "global": true/false, "mode": "all", ... }`
- **AutoGreet State:** `database/autogreet.json`

---

## Command System

### Command Structure
All commands export:
```javascript
{
  name: 'command-name',
  aliases: ['alias1', 'alias2'],
  category: 'general',
  description: 'What the command does',
  usage: '.command (args)',
  permission: 'Everyone',
  location: 'Group & Private Chat',
  cooldown: 5,
  async execute(sock, msg, args, ctx) { ... }
}
```

### Dynamic Command Loading
- `.menu` - Shows all commands grouped by category
- `.details <cmd>` - Shows command info dynamically

### Special Commands
- `.vv` (view-once) - Retrieve view-once images/videos
  - Supports all Baileys view-once message formats
  - Owner: sends to private chat
  - Others: sends in same chat
- `.entrance` - Configure domain expansion (auto-greet)

---

## Configuration

### Bot Settings (`config.js`)
- **Bot Name:** GOJO
- **Prefix:** `.`
- **Owner:** Auto-detected (any WhatsApp connected)
- **Creator:** OAD-26 (+2349138385352)
- **Features:** autoRead, autoReact, autoGreet, autoSticker, etc.

### Gojo Theme Messages
All system messages use Jujutsu Kaisen/Gojo aesthetic:
- Owner Only: "Only the Honored One can command me"
- Admin Only: "Only Grade 1 Sorcerers (admins) can use this"
- Group Only: "This belongs within a Domain Expansion"
- And more...

---

## Active Features

✅ **Working:**
- Message receiving and command processing
- All 230+ commands loaded dynamically
- Auto-react system with on/off toggle
- Auto-greet for groups with domain expansion
- View-once media retrieval (.vv command)
- Owner command detection (any connected WhatsApp)
- Connection auto-messages to creator and owner
- Session management and persistence

⚠️ **Known Limitations:**
- None at this time - all core systems operational

---

## Quick Start

1. **Connect WhatsApp:** Scan QR code when bot starts
2. **Bot Goes Online:** "GOJO IS ONLINE" message appears
3. **Connection Notifications:** Both creator and owner receive welcome messages
4. **Commands:** Start with `.menu` to see all available commands
5. **Feedback:** Contact OAD-26 at +2349138385352 or oad262626@gmail.com

---

## Development Notes

- **Language:** Node.js / JavaScript
- **Main Library:** @whiskeysockets/baileys (multi-device)
- **UI Server:** Express on port 5000
- **Media Support:** Canvas, Sharp, FFMPEG
- **Database:** JSON files in `/database` folder
- **Logging:** Console with emoji indicators

---

## Contact & Support

- **Creator:** OAD-26
- **WhatsApp:** +2349138385352
- **Email:** oad262626@gmail.com
- **GitHub:** https://github.com/OAD-26

---

*Last Updated: March 09, 2026*
*GOJO BOT v1.0 - Ready to serve the Infinite Void*
