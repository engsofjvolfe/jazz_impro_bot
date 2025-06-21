/**
 * Copyright 2025 Jeanco Volfe
 * Licensed under the Apache License, Version 2.0
 * See LICENSE file in the project root for full license information.
 */

// src/chordFormulas.js

/**
 * Set of chord formulas by musical degree.
 *
 * Each formula is an array of strings representing
 * the degrees that make up the chord, including quality:
 * - Number: diatonic degree (1, 3, 5, 7)
 * - Quality suffix:
 *    M = Major (major third or major seventh)
 *    m = Minor (minor third or minor seventh)
 *    J = Perfect fifth
 *    b = Flat (degree lowered by one semitone)
 *    d = Diminished (double flat on the fifth, typical of diminished chords)
 *
 * Example: ['1', '3M', '5J', '7M'] → major chord with major seventh (maj7).
 */
const chordFormulas = {
  /**
   * Major chord with major seventh (Maj7).
   * 1 (root), 3M (major third), 5J (perfect fifth), 7M (major seventh).
   * Ex.: Cmaj7 → C, E, G, B
   */
  'maj7': ['1', '3M', '5J', '7M'],

  /**
   * Minor chord with minor seventh (m7).
   * 1 (root), 3m (minor third), 5J (perfect fifth), 7m (minor seventh).
   * Ex.: Cm7 → C, Eb, G, Bb
   */
  'm7': ['1', '3m', '5J', '7m'],

  /**
   * Dominant seventh chord (7).
   * Same as major, but with a minor seventh.
   * 1 (root), 3M (major third), 5J (perfect fifth), 7m (minor seventh).
   * Ex.: C7 → C, E, G, Bb
   */
  '7': ['1', '3M', '5J', '7m'],

  /**
   * Half-diminished chord (m7♭5).
   * Also called semidiminished.
   * 1 (root), 3m (minor third), 5b (flat fifth), 7m (minor seventh).
   * Ex.: Cm7b5 → C, Eb, Gb, Bb
   */
  'm7b5': ['1', '3m', '5b', '7m'],

  /**
   * Diminished chord with diminished seventh (dim7).
   * Uses flat fifth and diminished seventh (double flat).
   * 1 (root), 3m (minor third), 5b (flat fifth), 7d (diminished seventh).
   * Ex.: Cdim7 → C, Eb, Gb, Bbb (typically resolves to C).
   */
  'dim7': ['1', '3m', '5b', '7d']
};

module.exports = { chordFormulas };
