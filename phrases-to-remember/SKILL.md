---
name: "phrases-to-remember"
description: "Turn any subject to be remembered into phrases to memorize and say out loud: a definition, then one phrase per major part, which together carry the complete framework of the subject. The phrases appear in a dark HTML page displayed directly in the conversation, where the user checks the ones to rewrite."
---

# Phrases to remember

This skill serves to remember a subject through phrases that are easy to recite. It applies to anything given to be remembered.

## Displayed directly in the conversation

Everything this skill produces is displayed directly in the conversation, as an interactive HTML page, through the tool that renders HTML inline in the thread of the discussion. The page appears where the user reads the reply: they check, write their remarks and send their choice without leaving the conversation, and their choice comes back into the thread as a message. The page is the only place for the phrases: the reply is contained entirely within it, with no text around it.

## Knowing a subject

To know a subject is to know it through its causes: to know what it is made of, what makes it what it is, what produces it or sets it in motion, and what it tends toward.

## The method

**The definition.** The subject is first defined: what it is, in one short phrase that states its nature.

**The detailed phrases.** The subject is divided into a small number of major parts. These parts cover what comes beyond the definition: each one brings a new aspect of the subject, and the nature of the subject remains carried by the definition alone. Together, they make the subject known through its causes. Each part receives its phrase, which is said in a single breath. Each segment of a phrase, separated by a comma, corresponds to one major idea of the part, in its natural order. The segments of a part's phrases thus correspond, one by one, to its major ideas. A semicolon marks a change of group within a phrase. The number of segments in a phrase stays within the measure of a breath, so that the phrase keeps the pace of a thought moving forward; a part rich in major ideas is spread over two phrases.

The parts serve to divide the detailed phrases into digestible pieces: they appear as headings.

**The language.** The phrases are written in the user's language, and the whole content follows the typographic conventions of that language.

## The engine and the content

The page is made of two portions. The engine, stored in the `engine` folder of this skill, carries all the mechanics and all the appearance: background, embedded fonts, headings, checkboxes, remarks field, send button, message sent back into the conversation, hiding for recitation, adaptation to phones. The content is the only portion the AI writes: a short file, written in a simple markup that the engine knows how to display. All of the AI's attention thus goes to the phrases, and the page keeps the same finish from one subject to the next.

**Building.** The AI writes the content to a file, for example `content.html`, then assembles it with the engine using the command:

```
python3 <skill folder>/engine/assemble.py content.html page.html
```

The assembly is done with Python alone. The file produced is a complete HTML fragment (fonts, style, page and script), ready for inline display. The AI displays this file in full in the terminal and passes its content, as is and character for character, to the inline display tool, which renders it in the conversation.

**The fonts.** The page loads its fonts from Google Fonts: EB Garamond for the phrases, Cormorant Garamond for the subject name, Inter for the welcome phrase, JetBrains Mono for the part headings (weight 500), the numbers, the labels and the button (weight 400). The page thus stays light, a few kilobytes, and displays quickly at each turn. The assembly applies the typography of the content's language on its own, English by default: curly apostrophes and curly quotation marks. The AI therefore writes its texts with straight apostrophes and straight quotation marks.

## Content format

The content is a tree of simple tags, each closed by its end tag.

**Root.** `<phrases topic="…">` wraps all the content and gives the name of the subject, which is displayed at the top of the page. The attribute `lang="…"` gives the language of the content as a short language code (`en`, `es`, `de`…), `en` by default. The choice page is the default form; the attribute `mode="final"` gives the final page.

**Definition.** `<definition>` contains the definition phrase. Its heading is displayed alone, "Definition", without a number.

**Part.** `<part title="…">` contains the phrase or phrases of the part. The engine numbers the parts in order (01, 02…). When a page presents only some of the phrases, as in the round of rewritten phrases, the attribute `num="…"` keeps for each part the number it bears in the whole.

**Phrase.** `<phrase>` contains an entire phrase. Italics are written `<i>`.

Example of the form:

```html
<phrases topic="Name of the subject" lang="en">
<definition>
<phrase>The phrase that states the nature of the subject.</phrase>
</definition>
<part title="Title of the first part">
<phrase>The phrase of the part, segment by segment.</phrase>
</part>
<part title="Title of the second part">
<phrase>First phrase of a rich part.</phrase>
<phrase>Second phrase of the same part.</phrase>
</part>
</phrases>
```

## Writing with several hands

The parts can be entrusted to subagents who write in parallel, each one the phrases of one or more parts. They run on the same model as the main AI. The main AI keeps responsibility for the unity of the whole, from the definition to the last phrase.

**A shared brief precedes the writing.** The main AI writes it in a file that each subagent reads in full before writing. In it, the main AI sets down the definition, the division into parts with the major ideas of each, each subagent's share, the whole method and the content format in which each share is delivered, so that the shares fit together as they are in the content file.

**A single-handed rereading follows the writing.** Before the assembly, the main AI itself reads all the phrases, from the definition to the last part, in the order in which they are said. It gives them one voice and one breath. It places each idea in the part where it serves best, and rewrites the segments that repeat what another phrase already carries, replacing them with a fresh idea. The whole is then said like the thought of a single author, and each phrase keeps its full substance.

## Choosing the phrases

The choice page bears at the top the name of the subject and a welcome phrase announcing that the user checks the phrases they dislike, and that the phrases left unchecked are kept. Then come all the phrases, in full: first the definition, then the detailed phrases, each under the heading of its part. A click on a phrase or on its box checks or unchecks it. Below the phrases, the "What I dislike" field receives the user's remarks.

The send button follows the state of the checkboxes: "Keep all ↗" as long as no phrase is checked, "Rewrite checked phrases (n) ↗" as soon as one is. On click, the page sends into the conversation a message written in plain language: the name of the subject, the phrases to rewrite each with the heading of its part, the remarks, then the kept phrases each with the heading of its part. When no phrase is checked, the message announces that all the phrases shown are kept.

The phrases left unchecked are kept word for word and set aside. The checked phrases are rewritten anew, following the whole method and taking the user's remarks into account.

At the next turn, a new choice page, displayed in the conversation in the same way, presents only the rewritten phrases, each under the heading and number of its part. The back-and-forth continues in this way, on only the phrases still to be revised, until the user keeps all the phrases shown.

## The final page

When all the phrases are kept, the whole is given again in full in the final page, displayed in the conversation: the definition, then each phrase in its place under the heading of its part, in the order in which they are said. This page serves for reciting. The "Hide to recite" button hides the text of all the phrases and leaves the headings visible; each hidden phrase leaves a dotted line, and a click on it reveals it. The same button, now "Show all", makes all the text visible again.

## The look of the page

The engine gives the page this look, all in white and gray on a dark background, with red as the only mark of checked phrases.

**The atmosphere.** A block with a solid #0a0a0a background, square corners, with 32px of inner padding at the top and bottom and 28px on the sides. Body text is #f2f2f2. The phrases are in EB Garamond, the subject name in Cormorant Garamond, the welcome phrase in Inter; the tags, the numbers and the button labels are in JetBrains Mono, weight 400, and the part headings in JetBrains Mono, weight 500. No accent color: white plays that role, and red #ef4444 marks only the cross of checked phrases.

**The header.** A monospace tag at 11px, in uppercase spaced at 0.12em, in #8a8a8a: "PHRASES TO REMEMBER" on the choice page, "FINAL VERSION" on the final page. Below it, the subject name in Cormorant Garamond 32px, weight 500, line height 1.15, in #ffffff, then the welcome phrase in Inter 15px, line height 1.6, in #a3a3a3.

**The part headings.** Each part opens 36px below the previous one. Its heading is written in JetBrains Mono 12px, weight 500, in uppercase spaced at 0.12em, in white, preceded, for the detailed parts, by its number in 11px monospace inside a 1px white frame, with 3px of padding at the top and bottom and 7px on the sides, 10px from the heading. The definition and the remarks field bear their heading alone. Under each heading runs a thin 1px line in white at 25% opacity, across the full width, 12px below the heading and 12px above the phrases; it is the only line on the page.

**The phrases.** They sit directly on the background, in EB Garamond 20px, line height 1.55, in #f2f2f2, with no first-line indent, with 8px of space above and below. On the choice page, an 18px square box with a 1.5px white outline sits to the left of each phrase, aligned with its first line, 14px from the text; on hover, it is tinted white at 15%. A checked phrase receives a red #ef4444 cross in its box, whose outline turns the same red, its text turns #8a8a8a, and a 10px monospace tag, "TO REVISE", in white, appears to its right.

**The remarks field.** It comes 44px after the last part, under its heading "What I dislike". The field is a flat gray #1c1c1c, without a border, with its top right corner cut diagonally over 14px, 120px tall at first and expandable in height, with 16px of inner padding at the top and bottom and 18px on the sides. The typed text is in the device's interface font, at 16px, in white, so that every typed character displays; the placeholder text, "Write here what bothers you in the checked phrases…", is in #9a9a9a. The flat fill turns #222222 on hover and #262626 while typing.

**The button.** A flat white fill, without a border, with its top right corner cut over 10px, with 11px of inner padding at the top and bottom and 20px on the sides; its label is in 13px monospace, in black. On hover, the fill turns #d4d4d4. On the choice page, it sits on the right, 20px below the field; after sending, its label becomes "Sent". On the final page, it sits to the right of the header, and a hidden phrase leaves a 1px dotted line, in white at 50%, across the full width, at the height of its first line.

**At every width.** On a narrow screen, the block's side padding becomes 18px, the phrases 18px, the send button takes the full width, and the final page's button moves below the subject name.
