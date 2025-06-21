# 🛠️ TODO – UI & UX Improvements for Jazz Impro Bot

This document outlines planned enhancements to improve the overall user interface (UI) and user experience (UX) of the bot. Each item focuses on usability, clarity, and interaction flow.

> ✅ **Note:** ~~Strikethrough items~~ are **completed** and kept for historical reference.

---

## ✅ Planned Improvements

| #  | Idea                                                                 | Primary Benefit                                                   |
|----|----------------------------------------------------------------------|-------------------------------------------------------------------|
| 1  | ~~Add “📖 Help” and “❌ Cancel” buttons directly in /start~~             | Users don’t need to type commands; flow becomes more intuitive    |
| 2  | ~~Reuse a single message block (edit text + keyboard) per session~~     | Reduces chat clutter; keeps conversation clean and readable       |
| 3  | ~~Include a ⬅️ Back button on each step (type / acc)~~                  | Allows users to correct choices without restarting the session    |
| 4  | ~~Show “typing…” chat action while computing result~~                   | Feedback during processing; improves experience on slow networks  |
| 5  | ~~Auto-timeout: clear state after X minutes of inactivity~~             | Prevents orphaned states and confusing replies                    |
| 6  | ~~Display a “🔁 New Chord” button in the final result~~                 | Lets users restart easily without typing /start                   |
| 7  | Simple internationalization (🇺🇸 / 🇧🇷) using a dictionary map       | Language adapts without touching logic code                       |
| 8  | Support typed “b” or “#” as accidentals                             | Improves accessibility, especially for desktop keyboard users     |
| 9  | Encapsulate UI steps in named functions (e.g., `sendStart()`)      | Cleaner structure, easier to update or localize UI behavior       |
| 10 | Translate and revise `/docs/*.md` to English                      | Ensures consistency with codebase and supports international users |

---
