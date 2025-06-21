# Jazz Impro Bot

**Telegram bot** for generating improvisation chords based on harmonic‐fifth rules. Users select a root note, chord quality and accidental (♭, ♯ or natural), then receive both the base chord and a suggested chord for improvisation.

# ⚠️ Known Limitations
This bot may still produce errors in specific cases, especially when dealing with enharmonic spellings (e.g., recognizing that the major 7th of F# is E#, not F).

These limitations are known and will be addressed in future releases as the harmonic analysis system is further refined.

If you notice any odd behavior, feel free to open an issue or report it.

---

## 🚀 Features

- **Interactive UI**  
  Inline keyboard for seamless chord selection in Telegram.

- **Flexible Parsing**  
  Accepts notations like `C#maj7`, `Dbm7b5`, etc.

- **Enharmonic Accuracy**  
  Supports simple and double accidentals (bb, ##).

- **Improvisation Suggestions**  
  Calculates a perfect or diminished fifth above the chosen chord.

- **Clear Error Handling**  
  User-friendly messages for invalid inputs.

---

## 📂 Project Structure

```
/src
├── bot.js                # Entry point: initializes bot, routes commands and callbacks
├── chord.js              # Chord class: parsing, note generation, formatting
├── chordFormulas.js      # Chord templates (maj7, m7, 7, m7b5, dim7)
├── improvisation.js      # Logic for deriving improvisation chords
├── intervals.js          # Semitone definitions for scale degrees
├── keyboards.js          # Inline keyboard layout generators (root, type, accidentals)
├── notes.js              # Note normalization, chromatic mapping, enharmonic spelling
├── session.js            # Per-chat state management and session timeout
├── handlers/
│   ├── commands.js       # /start, /help, /cancel command handlers
│   ├── callbacks.js      # Routes callback_query actions to step handlers
│   └── flow/
│       ├── backNavigation.js   # Handles back:root and back:type navigation
│       ├── handleAccidental.js # Final step: computes and shows result
│       ├── handleRoot.js       # Handles root note selection
│       ├── handleType.js       # Handles chord type selection
│       └── quickActions.js     # restart, show_help, quick_cancel

/tests
└── *.test.js            # Jest test suites for each module

/docs
├── app_flow.md          # Descrição do fluxo da aplicação (em português)
└── code_flow.md         # Explicação técnica do fluxo do código (em português)

```

---

## ⚙️ Installation

1. **Clone the repository**  
   ```bash
   git clone https://github.com/your-username/jazz-impro-bot.git
   cd jazz-impro-bot
   ```

2. **Install dependencies**

   ```bash
   npm install
   ```

---

## 🔧 Configuration

Create a `.env` file at the project root:

```env
TELEGRAM_TOKEN=<YOUR_TELEGRAM_BOT_TOKEN>
```

---

## ▶️ Usage

* **Start the bot**

  ```bash
  npm start
  ```
* **On Telegram**, send `/start` and follow the inline prompts to choose root, chord type and accidental.

---

## 🛠️ Development & REPL

* **Add REPL script** to `package.json`:

  ```jsonc
  "scripts": {
    "repl": "node -i"
  }
  ```
* **Launch REPL**:

  ```bash
  npm run repl
  ```
* **Example usage**:

  ```js
  const { Chord } = require('./src/chord');
  console.log(Chord.parse('C#maj7').getNotes());

  const notes = require('./src/notes');
  console.log(notes.spellNote(10, 'D'));

  const improv = require('./src/improvisation');
  console.log(improv.getFifthAbove('C', 'maj7'));
  ```

---

## 🧪 Tests

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

---

## 🤝 Contributing

1. Fork the repo and create a descriptive feature branch.
2. Make atomic commits with clear messages.
3. Open a Pull Request explaining your changes.

---

## 📬 Contact

Questions or feedback? Open an issue or reach out via Telegram.

---

## 📜 License and Authorship

This project was conceived by Jeanco Volfe, based on harmonic concepts that are publicly known and widely used in music education.

While it does not represent a technically exclusive innovation, the logical structure and code implementation were originally developed starting in 2023 and finalized in 2025 with the support of AI tools for technical assistance.

All source code in this repository is licensed under the **Apache License 2.0**.  
See the [LICENSE](./LICENSE.md) file for details.

© 2025 Jeanco. All rights to this code are reserved.