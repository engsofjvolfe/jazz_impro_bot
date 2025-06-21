/**
 * Musical Intervals Module
 *
 * This file maps musical degrees (unison, thirds, fifths, sevenths)
 * to the corresponding number of semitones in a chromatic octave (0–11).
 * Ideal for use in chord construction and distance calculations
 * between notes in music theory.
 *
 * The keys represent:
 *   '1'  – Unison (first degree) → 0 semitones
 *   '3M' – Major third           → 4 semitones
 *   '3m' – Minor third           → 3 semitones
 *   '5J' – Perfect fifth         → 7 semitones
 *   '5b' – Diminished fifth      → 6 semitones (one semitone below the perfect fifth)
 *   '7M' – Major seventh         → 11 semitones
 *   '7m' – Minor seventh         → 10 semitones
 *   '7d' – Diminished seventh    → 9 semitones (one semitone below the minor seventh)
 *
 * These values are used to:
 *  - Calculate the notes of a chord from its root.
 *  - Chromatically determine the distance between musical degrees.
 *
 * @example
 * // For a C major 7 chord (Cmaj7):
 * // degrees [1, 3M, 5J, 7M] → semitones [0, 4, 7, 11]
 * const { intervals } = require('./intervals');
 * console.log(intervals['3M']); // 4
 */

const intervals = {
  /** Unison (first degree): 0 semitones */
  '1': 0,
  /** Major third: 4 semitones */
  '3M': 4,
  /** Minor third: 3 semitones */
  '3m': 3,
  /** Perfect fifth: 7 semitones */
  '5J': 7,
  /** Diminished fifth (5b): 6 semitones */
  '5b': 6,
  /** Major seventh: 11 semitones */
  '7M': 11,
  /** Minor seventh: 10 semitones */
  '7m': 10,
  /** Diminished seventh: 9 semitones */
  '7d': 9
};

module.exports = { intervals };
