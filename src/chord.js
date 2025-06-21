// src/chord.js

/**
 * Module for chord analysis and generation.
 * 
 * Allows:
 * 1. Parsing chord strings like 'C#maj7', 'Dbm7', 'G7', etc.
 * 2. Mapping chord types (maj7, m7, 7, m7b5, dim7) to degree formulas.
 * 3. Calculating the actual notes of the chord considering enharmonics and accidentals.
 * 4. Providing a user-friendly representation for musicians and developers.
 */

const { normalize, getDegree, spellNote } = require('./notes');
const { intervals } = require('./intervals');
const { chordFormulas } = require('./chordFormulas');

/**
 * Maps chord types (and their aliases) to the keys of chordFormulas.
 *
 * • In bots with buttons, only these appear: 'maj7', 'm7', '7', 'm7b5', 'dim7'
 * • In free input (REPL, tests), we also accept abbreviations:
 *    - 'M'    → maj7
 *    - 'min7' → m7
 *    - 'dom7' → 7
 *    - '-7b5' → m7b5
 *    - 'dim'  → dim7
 */
const typeMap = {
  'M':     'maj7',
  'maj7':  'maj7',
  'm':     'm7',
  'm7':    'm7',
  'min7':  'm7',
  '7':     '7',
  'dom7':  '7',
  '-7b5':  'm7b5',
  'm7b5':  'm7b5',
  'dim':   'dim7',
  'dim7':  'dim7'
};

class Chord {
  /**
   * Internal constructor. Do not use directly: prefer Chord.parse().
   * 
   * @param {string} inputRoot  - Root as typed by the user (e.g., 'C#', 'Db')
   * @param {string} typeKey    - Canonical key of the chord type (e.g., 'maj7', 'm7')
   * @param {string} normRoot   - Normalized root for calculation (e.g., 'C#' → 'C#', 'Db' → 'D♭')
   */
  constructor(inputRoot, typeKey, normRoot) {
    this.inputRoot = inputRoot;
    this.type      = typeKey;
    this._root     = normRoot;
  }

  /**
   * Parses a chord string and returns a Chord instance.
   * 
   * Valid input examples:
   *   'Cmaj7', 'C#maj7', 'Dbm7', 'E7', 'Fm7b5', 'Gdim7'
   * If no type is provided, defaults to 'M' (maj7).
   * 
   * @param {string} input  - Chord text, possibly with spaces.
   * @returns {Chord}
   * @throws {Error} If format is invalid or type is not supported.
   */
  static parse(input) {
    // removes internal and external spaces
    const clean = input.trim().replace(/\s+/g, '');
    // regex: 1) A–G letter with optional b/#, 2) rest as type
    const m = clean.match(/^([A-Ga-g][b#]?)(.*)$/);
    if (!m) {
      throw new Error(`Invalid chord format: "${input}"`);
    }

    const rawRoot = m[1];            // e.g., 'C#', 'Db'
    const rawType = m[2] || 'M';     // e.g., 'maj7', 'm7', '' → 'M'

    // Ensures the root starts with uppercase
    const inputRoot = rawRoot[0].toUpperCase() + (rawRoot[1] || '');
    // Normalizes accidentals and ensures valid note
    const normRoot = normalize(inputRoot);

    // Converts typed type to internal key
    const key = typeMap[rawType] || typeMap[rawType.toLowerCase()];
    if (!key) {
      const valid = Object.keys(typeMap).join(', ');
      throw new Error(
        `Invalid chord type: "${rawType}". ` +
        `Valid types: ${valid}.`
      );
    }

    return new Chord(inputRoot, key, normRoot);
  }

  /**
   * Generates the chord notes, spelling accidentals correctly.
   * 
   * Flow:
   * 1. Converts normalized root into chromatic index (0–11).
   * 2. Retrieves interval formula (degrees) for the type (e.g., ['1','3M','5J','7M']).
   * 3. For each degree:
   *    a) Adds semitones (intervals[degree]) to the root index.
   *    b) Calculates targetDeg within the 0–11 cycle.
   *    c) Uses spellNote(targetDeg, degreeNum, rootLetter) to name the note.
   * 
   * @returns {string[]} List of notes, e.g., ['C', 'E', 'G', 'B']
   * @throws {Error} If the type formula does not exist.
   */
  getNotes() {
    // chromatic index of the root (0–11)
    const degree  = getDegree(this._root);
    // degree formula for maj7, m7, etc.
    const formula = chordFormulas[this.type];
    if (!formula) {
      throw new Error(`Formula not found for type: "${this.type}"`);
    }

    return formula.map(intervalKey => {
      // semitones for the degree (e.g., '3M' → 4, '5J' → 7)
      const semis     = intervals[intervalKey];
      // new index in 0–11 cycle
      const targetDeg = (degree + semis + 12) % 12;
      // extracts degree number: '3M' → 3
      const degreeNum = parseInt(intervalKey, 10);
      // spells the note considering enharmonics
      return spellNote(targetDeg, degreeNum, this.inputRoot[0]);
    });
  }

  /**
   * User-friendly representation of the chord and its notes.
   * Ex: 'C#m7: C#, E, G, B'
   * 
   * @returns {string}
   */
  toString() {
    const notes = this.getNotes();
    return `${this.inputRoot}${this.type}: ${notes.join(', ')}`;
  }
}

module.exports = { Chord };
