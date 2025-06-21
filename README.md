# Jazz Impro Bot

This project implements a Telegram bot that generates improvisation chords based on harmonic fifth rules. The core idea is to let the user select a tonic (root), chord type, and accidental (♭, ♯ or natural), and receive both the base chord notes and a suggested chord for improvisation.

---

## Features

* Interaction via Telegram bot using inline buttons (inline keyboards).
* Chord parser (`Chord.parse`) that accepts flexible input (e.g., `C#maj7`, `Dbm7b5`).
* Generation of enharmonically correct notes, supporting simple and double accidentals (bb, ##).
* Improvisation chord calculation using the rule of perfect or diminished fifth above.
* Error handling with clear messages to the user.

---

## Architecture

The code is organized into modules:

* **src/bot.js**: Orchestrates interaction flow, chat states, and message sending.
* **src/notes.js**: Normalization, chromatic mapping, and `spellNote` function (enharmonics).
* **src/intervals.js**: Semitone table for degrees (1, 3M, 3m, 5P, 5b, 7M, 7m, 7d).
* **src/chordFormulas.js**: Chord formulas by type (`maj7`, `m7`, `7`, `m7b5`, `dim7`).
* **src/chord.js**: `Chord` class with parsing, note generation, and formatting methods.
* **src/improvisation.js**: Fifth-based rule for deriving improvisation chords.

---

## Installation

1. Clone this repository:

   ```bash
   git clone https://github.com/seu-usuario/jazz-impro-bot.git
   cd jazz-impro-bot
  ```

2. Install dependencies:

   ```bash
   npm install
   ```

---

## Configuration

1. Create a `.env` file at the project root with:

   ```env
   TELEGRAM_TOKEN=<your_bot_token>
   ```

---

## Usage

* Run the bot in development mode:

  ```bash
  npm start
  ```

* On Telegram, send `/start` to begin selecting root, chord type, and accidental.

---

## Development (REPL)

To interactively experiment with modules without running the bot or creating tests, you can use Node's REPL:

1. In `package.json`, add the script:

   ```jsonc
   "scripts": {
     "repl": "node -i"
   }
   ```

2. Run the REPL:

   ```bash
   npm run repl
   ```

3. In the Node prompt, import modules and test functions:

   ```js
   const { Chord } = require('./src/chord');
   // Example: parse and get the notes of a chord
   Chord.parse('C#maj7').getNotes();

   const notes = require('./src/notes');
   // Example: enarmonic spelling
   notes.spellNote(10, 'D');

   const improv = require('./src/improvisation');
   // Example: improvisation chord a fifth above
   improv.getFifthAbove('C', 'maj7');
   ```

For full function details and signatures, refer to the comments and headers in the source files under `src/` (e.g., `src/chord.js`, `src/notes.js`, `src/improvisation.js`).

---

## Tests

Jest is already installed as a development dependency, but no tests have been implemented yet.

When running coverage:

```bash
npm test -- --coverage
```

You will see a message like:

```text
No tests found, exiting with code 1
Run with `--passWithNoTests` to exit with code 0
```

To generate coverage without initial error, use:

```bash
npm test -- --coverage --passWithNoTests
```

Then create test files in `tests/`, for example:

* `tests/notes.test.js`
* `tests/intervals.test.js`
* `tests/chordFormulas.test.js`
* `tests/chord.test.js`
* `tests/improvisation.test.js`

Inside each, start with a basic skeleton. For example, in `tests/notes.test.js`:

```js
const notes = require('../src/notes');

describe('normalize and getDegree', () => {
  test('normalize removes spaces and uppercases', () => {
    expect(notes.normalize(' c ')).toBe('C');
  });
});
```

After adding some tests, run again:

```bash
npm test -- --coverage
```

This will let Jest generate an actual coverage report, showing lines and functions covered by your tests.
