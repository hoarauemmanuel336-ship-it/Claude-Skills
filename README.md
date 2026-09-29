# Learning skills for Claude

Four skills that turn any subject into a dark, dense, self-contained HTML page for learning: a diagram to explore, a book to read, a course to work through and a study path to follow. Each page is a single file that opens in any browser, on a computer or a phone, with no server and no external library.

| Skill | What it produces |
|---|---|
| [`interactive-diagrams`](interactive-diagrams/SKILL.md) | An interactive overview of a subject: collapsible sections, elements that unfold their explanation on click, three scopes and three depths, fork, tension and timeline layouts. |
| [`html-book`](html-book/SKILL.md) | A long text (book, essay, report, guide) with a collapsible table of contents, nine readings (three scopes × three depths), citable page numbers and adjustable text size. |
| [`html-course`](html-course/SKILL.md) | An introductory course split into pages: lessons, callout boxes, exercises with worked answers, self-assessment, synthesis, review sheets and glossary. |
| [`study-path`](study-path/SKILL.md) | A study plan from first notions to mastery: blocks, themes and topics to mark as you go, each copied in one tap to ask the AI for a book, a diagram or an article. |

The four share one visual language: a #0a0a0a background, absolute-black cards with a cut corner, monospace tags, one vivid color per major part. Each skill describes it in full and stands on its own.

## Saved progress

Courses and study paths remember where the reader is. Progress lives in three places at once: the browser's local storage, the host page when the file is embedded in a sandboxed frame, and the file itself. A **Save** button downloads the file with the reader's progress written inside, so that progress travels with the file and comes back in any browser.

## Installation

Each folder holds one `SKILL.md`. Copy the folders you want into your skills directory (for Claude Code, `~/.claude/skills/`), or upload a folder as a custom skill in the Claude app. Then ask for what you want in plain words: “make me a course on…”, “a study path on…”, “a diagram of…”, “write a book on… in HTML”.

## Language

The instructions are in English. The generated pages are written in the language of the request and follow its typographic conventions; English and French are described in detail.
