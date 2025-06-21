# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/),  
and this project adheres to [Semantic Versioning](https://semver.org/).

## [0.2.2] - 2025-06-21

### Added
- New `session.js` module for per-chat state management and session timeout
- New `keyboards.js` module for generating inline keyboards (root, type, accidentals, quick actions)
- New `handlers/flow/` folder with modular step handlers:
  - `handleRoot.js`, `handleType.js`, `handleAccidental.js`
  - `backNavigation.js`, `quickActions.js`
- New centralized handlers in `handlers/commands.js` and `handlers/callbacks.js`
- Clarifying - Documentation under `/docs`:
  - `app_flow.md`: describes the user flow (in Portuguese)
  - `code_flow.md`: technical breakdown of code execution (in Portuguese)

### Changed
- `bot.js` is now a thin entry point that initializes the bot and delegates logic
- `/start`, `/help`, and `/cancel` commands now use modular handler functions
- Callback interactions (`callback_query`) fully migrated to `handlers/flow/*` files
- Project structure section in `README.md` updated to reflect new modular layout

### Internal
- `TODO.md`: added a task to translate `/docs/*.md` into English for international consistency

---

## [0.2.1] - 2025-06-21

### Added
- Auto-timeout: session is automatically deleted after 5 minutes of inactivity
- "🔁 New Chord" button at the end of the interaction to restart without typing /start
- "typing..." chat action shown before sending the result (reduces latency perception)

### Changed
- Final result now replaces the last message instead of sending a new one
- Removed residual "calculating…" message after chord processing
- Timer is now properly cleared on `/cancel` command and ❌ Cancel button

### Internal
- Automatic synchronization between CHANGELOG.md and package.json version
- Added Git hooks (`pre-commit`, `post-checkout`) and `"prepare"` script for consistency

---

## [0.2.0] - 2025-06-21

### Added
- Quick action buttons "📖 Help" and "❌ Cancel" on /start
- Navigation via "⬅️ Back" between steps (root → type → acc)

### Changed
- Step flow now edits a single message instead of sending many
- Accidental ♮ (natural) now uses a visual symbol
- Cleaner UI with compact keyboard layout

---

## [0.1.2] - 2025-06-20

### Added
- Conditional fake_token for codex to access without .env variables
  - `src/bot.js`
  
---

## [0.1.1] - 2025-06-21

### Added
- Apache License 2.0 (`LICENSE.md`)
- License headers in all core and legacy source files.
- Legacy folder containing early prototype:
  - `legacy/good-choice-chord/` (original script and Git history)
  - `legacy/image.png` (dated screenshot of original development)
  - `legacy/README_legacy.txt` with context and explanation

### Changed
- `README.md`: added authorship section and license notice.

---

## [0.1.0] - 2025-06-20

### Added
- Initial project scaffolding with the following core modules:
  - `src/intervals.js`
  - `src/notes.js`
  - `src/chordFormulas.js`
  - `src/improvisation.js`
  - `src/chord.js`
  - `src/bot.js`
- JSDoc comments and inline musical explanations.
- REPL script for development.
- Basic README structure (Installation, Usage, REPL, Testing).
- `package.json` scripts: `start`, `test`, `repl`.


