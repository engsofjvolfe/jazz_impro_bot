### Known Issue: Incorrect Enharmonic Chord Representation

Some enharmonic chords are not correctly parsed or displayed.

**Example:**  
`B#maj7` is technically valid (enharmonic to `Cmaj7`), but the current system may fail to recognize or spell it correctly.

**Cause:**  
The current chord parsing and note spelling may not fully support enharmonic equivalents or less common notations.

**Planned Fix:**  
Investigate how enharmonic resolution is handled in the system and apply adjustments to ensure proper recognition and display.
