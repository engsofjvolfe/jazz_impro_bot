# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/),  
and this project adheres to [Semantic Versioning](https://semver.org/).

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


