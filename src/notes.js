// src/notes.js

/**
 * Note module with dynamic enharmonic logic.
 *
 * Provides functions to:
 * 1. Normalize musical note inputs,
 * 2. Convert notes to chromatic degrees (number of semitones from C),
 * 3. Spell notes with accidentals (b, bb, #, ##) based on enharmonic logic.
 *
 * Useful for chord construction and musical distance calculations,
 * allowing musicians and developers to clearly understand
 * how notes are handled in code.
 */

/** Sequence of musical letters for degrees (C, D, E, F, G, A, B). */
const letterSequence = ['C', 'D', 'E', 'F', 'G', 'A', 'B'];

/** Natural semitones of each letter without accidentals (C=0, D=2, E=4, F=5, G=7, A=9, B=11). */
const naturalSemitones = { C: 0, D: 2, E: 4, F: 5, G: 7, A: 9, B: 11 };

/** Mapping of musical degree (1,3,5,7) to letter step in the cycle (0–6). */
const letterSteps = { 1: 0, 3: 2, 5: 4, 7: 6 };

/**
 * Normalizes a note input.
 *
 * - Removes extra spaces and converts to uppercase (e.g., ' c# ' → 'C#').
 * - Keeps simple accidentals (# or b) after the letter.
 *
 * @param {string} input Raw user input (letter + optional '#' or 'b').
 * @returns {string} Normalized note (e.g., 'C', 'C#', 'Db').
 */
function normalize(input) {
  return input.trim().toUpperCase();
}

/**
 * Converts a note to its chromatic value (0–11) from C.
 *
 * - Interprets the base letter (A–G) using `naturalSemitones`.
 * - Adjusts simple accidentals (# → +1 semitone, b → -1 semitone).
 *
 * @param {string} note Normalized or raw note (e.g., 'F#', 'Eb', 'G').
 * @returns {number} Chromatic value (0 = C, 1 = C#/Db, …, 11 = B).
 */
function getDegree(note) {
  const n = normalize(note);
  const letter = n.charAt(0);
  const base = naturalSemitones[letter];

  // Adjusts simple accidentals after the letter
  const accidentals = n.slice(1);
  let adjust = 0;
  for (const char of accidentals) {
    if (char === '#') adjust += 1;
    else if (char === 'B') adjust -= 1;
  }

  return (base + adjust + 12) % 12;
}

/**
 * Generates the spelled name (with b, bb, # or ##) for the target semitone
 * and desired musical degree, correctly handling enharmonics.
 *
 * Internally used to convert degrees (1,3,5,7) into written notes,
 * respecting the letter sequence and chromatic cycle.
 *
 * @param {number} targetDeg  
 *   Target chromatic index (0–11), e.g., C=0, C#=1, …, B=11.
 * @param {number} degreeNum  
 *   Musical degree (1, 3, 5 or 7) to determine position in the letter cycle.
 * @param {string} rootLetter  
 *   Root letter (A–G) used as starting point for enharmonic calculation.
 * @returns {string} Note with appropriate accidental: '', 'b', 'bb', '#', or '##'.
 *
 * @example
 * // 4 semitones above E at degree 1: E → Fb
 * spellNote(4, 1, 'E') // 'Fb'
 */
function spellNote(targetDeg, degreeNum, rootLetter) {
  const rootIdx   = letterSequence.indexOf(rootLetter);
  const step      = letterSteps[degreeNum];
  const letterIdx = (rootIdx + step) % 7;
  const letter    = letterSequence[letterIdx];
  const natural   = naturalSemitones[letter];

  // Calculates semitone difference (+ up, - down)
  let diff = (targetDeg - natural + 12) % 12;
  // If wraparound > half octave, go backwards
  if (diff > 6) diff -= 12;

  // Determines accidental based on difference
  let accidental;
  if (diff === 0)  accidental = '';
  else if (diff ===  1) accidental = '#';
  else if (diff ===  2) accidental = '##';
  else if (diff === -1) accidental = 'b';
  else if (diff === -2) accidental = 'bb';
  else throw new Error(
    `Cannot spell degree ${degreeNum} of ${letter}, diff = ${diff}`
  );

  return letter + accidental;
}

module.exports = {
  normalize,
  getDegree,
  spellNote
};
