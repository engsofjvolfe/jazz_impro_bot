// src/improvisation.js

const { Chord } = require('./chord');
const { getDegree, spellNote } = require('./notes');
const { intervals } = require('./intervals');

/**
 * Generates a suggested chord for improvisation based on the rule of a fifth above.
 *
 * The harmonic rule for improvisation consists of shifting the tonic of the original chord
 * to the fifth (perfect or diminished) above, while maintaining the harmonic type of the chord
 * (major, minor, dominant, half-diminished, or diminished) according to convention.
 *
 * Example for musicians:
 * - From Cmaj7 (C major with major seventh), the perfect fifth above is G;
 *   the suggested improvisation chord is Gmaj7.
 * - From Dm7 (D minor with minor seventh), the perfect fifth above is A;
 *   the suggested improvisation chord is Am7.
 *
 * @param {string|Chord} input
 *   - A string with the chord name (e.g.: 'Cmaj7', 'Dm7b5')
 *   - Or a previously created Chord instance.
 * @returns {Chord}
 *   New Chord instance pointing to the improvisation chord.
 * @throws {Error}
 *   If the chord type (chord.type) is not supported by the rule.
 *
 * @example
 * const chord = getImprovisationChord('Cmaj7');
 * console.log(chord.inputRoot, chord.type); // 'G', 'maj7'
 */
function getImprovisationChord(input) {
  // Gets a valid Chord object
  const chord = typeof input === 'string'
    ? Chord.parse(input)
    : input;

  let intervalKey, targetType;
  switch (chord.type) {
    case 'maj7':   intervalKey = '5J'; targetType = 'maj7'; break;
    case 'm7':     intervalKey = '5J'; targetType = 'm7';   break;
    case '7':      intervalKey = '5J'; targetType = 'm7';   break;
    case 'm7b5':   intervalKey = '5b'; targetType = 'maj7'; break;
    case 'dim7':   intervalKey = '5b'; targetType = 'dim7'; break;
    default:
      throw new Error(`Unsupported chord type: ${chord.type}`);
  }

  // Calculates the chromatic degree of the original tonic
  const rootDeg   = getDegree(chord._root);
  // Gets semitone value for the fifth (intervalKey)
  const semis     = intervals[intervalKey];
  // Determines new chromatic degree for the upper fifth
  const targetDeg = (rootDeg + semis + 12) % 12;

  // Properly spells the new tonic based on degree 5
  const newRoot   = spellNote(targetDeg, 5, chord.inputRoot[0]);

  // Reconstructs and returns the improvisation chord
  return Chord.parse(`${newRoot}${targetType}`);
}

module.exports = { getImprovisationChord };
