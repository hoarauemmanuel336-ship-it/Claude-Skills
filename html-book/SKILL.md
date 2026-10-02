---
name: "html-book"
description: "Compose a long text (book, essay, dossier, guide) as a single dark HTML page: collapsible side table of contents, reading tracker, three scopes and three depths of reading to choose from, adjustable text size, text justified on both margins, citable pagination, cut-corner quote cards, one accent color per part. Use whenever a book, an essay or a long document is requested in HTML."
---

# HTML Book

Produce a long text as a single, dark, dense HTML page designed for sustained reading: fixed top bar, collapsible side table of contents with position tracking, three scopes and three depths of reading to choose from, adjustable text size, text justified on both margins, citable pagination, cut-corner quote cards, one accent color per major part.

## What the book brings

The book serves to understand a subject in depth. The reader learns with the AI, which composes for them what they study, and the book is the form of this learning in which they read at length, follow a line of reasoning from start to finish and keep a solid, lasting understanding of it. On its own, it teaches everything it announces: the reader who finishes it owns the subject. The file is passed on as is to anyone who wants to learn.

## Who the book is for

The book speaks at once to the novice, who does not even know the subject exists, and to the experienced reader, who comes to deepen what they already know. The text therefore starts from what the novice already knows: each technical term receives its definition at the very place it appears, in the sentence that introduces it, and each chapter opens by situating what it will deal with. The experienced reader finds their share in the same text: the precision of the distinctions and the detail of the reasoning.

The three depths of reading serve this double audience. The abridged gives the whole subject to the one discovering it, with the definitions that make it readable on its own; the standard unfolds the reasoning; the unabridged carries the detail and the nuances the experienced reader comes looking for. Definitions and basic landmarks belong to level 1, which keeps them present in all three versions. The three scopes serve the same double audience: the core opens a clear door onto the heart of the subject for the novice, the complete gives the experienced reader the full extent of the ground.

## The art of writing

**The question of the subject.** Before the outline, the AI formulates the central question the book answers, then the points where a novice stumbles and the misconceptions they often hold. The outline is built to get past these obstacles.

**Knowing a subject.** To know a subject is to know it through its causes: to know what it is made of, what makes it what it is, what produces it or sets it in motion, and what it tends toward. The map of the subject embraces them all, and the book leads the reader to this knowledge. These causes say when the map is complete; the outline, for its part, follows the subject's own articulations, as the subject calls for them.

**The order of the chapters.** The chapters follow one another in the order in which one learns best: the foundations first, which give the words and the first notions, then the heart of the subject, then its extensions. Each chapter builds on those before it, so that the reader always finds already acquired what they need to understand the page they are reading, and thus advances from the known toward the new.

**The why as much as the what.** Each notion receives its reason for being: what it explains, what it resolves, what would be missing without it. A reader who knows why retains far better.

**The arc of the book.** The opening poses the book's question, and the closing shows the reader that they now know how to answer it: it restates in one short sentence the nature of the subject, which the reader now knows through all its causes. Each part takes them up a level of understanding.

**A guiding thread.** Each chapter starts from a question and moves toward its answer, so that the reader always knows where they are going and why they are going there.

**The movement of real thought.** The idea is set down, shown on a case, meets the most serious difficulty that can be raised against it, answers it, then delivers its consequence.

**Well-chosen examples.** Each example is simple, striking and faithful, and takes its place where it sheds the most light.

**The transitions.** Each chapter says in one sentence what it takes up from the previous one and what it prepares, and the book reads as a single line of reasoning.

**The right density.** Difficult ideas receive the room they ask for, what goes without saying passes at a brisk pace, and every sentence moves forward.

**A voice.** That of a master speaking to someone they hold in esteem: clear and warm.

## The extent of the book, asked before writing

**The user chooses the extent of the book before the writing begins.** Once the question of the subject is posed and the map of the subject drawn, the AI offers them several possible extents for the whole book. Each proposed extent announces its number of pages, which the AI judges from what the subject calls for, preceded by "about": the number of pages of the unabridged, then those of the standard and the abridged, each set according to the subject. The user chooses, and the book is written at that extent.

**The announced numbers are estimates.** The engine counts one page per 330 words, which gives the AI the length of text each number represents. The book then follows the length its content calls for: its outline and its material remain those that best serve the subject, and the actual number of pages, displayed by the book, stays around the announced number.

## Scope and depth: two choices for the reader

**The reader chooses two things, with one click each**: the scope, which says the ground they cover, and the depth, which says how deeply they cover it. Three scopes, **Core**, **Extended**, **Complete**, and three depths, **Abridged**, **Standard**, **Unabridged**, combine freely: the same book thus offers nine readings, from the core abridged, which gives the heart of the subject in a few pages, to the complete unabridged, which covers the whole ground in detail. The reader changes either one whenever they like.

**The three scopes differ by the extent of ground covered.** Before writing, the AI draws the map of the subject: its core, then the domains surrounding it, as it discerns them for this subject. From it, it draws three nested perimeters, each defined by the question it answers:

- the core scope gives what one must know to be able to say one knows the subject: the subject known through its own causes;
- the extended scope adds what is needed to situate the subject in its neighborhood: what prepares it, what surrounds it and what follows directly from it;
- the complete scope adds everything a connoisseur of the subject deems worth attaching to it, up to the domains whose connection remains illuminating.

These three questions serve as a test: the AI asks them of each chapter and each block to set its scope, and the connoisseur's judgment draws the outer boundary of the complete.

**The scopes are cumulative**, like the depths. Each block of the book carries its entry scope in the `s` attribute: a block of scope 1 is read in all three scopes, a block of scope 2 appears from the extended on, a block of scope 3 belongs to the complete alone. A block without the attribute counts as 1. The attribute is set first on whole chapters, a neighboring domain most often forming its own chapters, or on a whole part when an entire set of chapters belongs to a neighboring domain; it is also set on a paragraph, a subheading or a quote card of a core chapter, where the text links the core to a neighboring domain. The part divider and the table-of-contents entries follow their chapters on their own.

**Each reading stands on its own.** The core reads as a whole book on the heart of the subject, and each wider scope inserts its chapters at their place in the progression. The two attributes are set independently: a chapter of scope 2 has its abridged, its standard and its unabridged like any other chapter.

**The book is written over the whole map**, at the length its content calls for. The outline sets for each chapter its scope and the distribution of its material across the three depths. The buttons and the top bar display the totals the engine computes for each of the nine readings, which are the actual numbers of the delivered book.

**The book opens at the extended scope and the unabridged depth**; the remembered state then restores the reader's choices.

## Three depths of reading

The same book is read at three depths, which the reader chooses with one click and changes whenever they like: **Abridged**, **Standard**, **Unabridged**. The abridged is a tightened version that stands on its own, the standard is the book as one reads it, the unabridged is the book with everything the author had to say. These three names hold for every book, whatever the subject.

**The three depths are cumulative.** Each block of the book carries its entry level in the `d` attribute: a block of level 1 is read in all three versions, a block of level 2 appears from the standard on, a block of level 3 belongs to the unabridged alone. A block without the attribute counts as 1. The abridged is thus contained in the standard, which is contained in the unabridged, and the reader who goes up a notch finds their text enlarged, identical for everything they had already read.

The attribute is set on a paragraph, a subheading, a quote card, and on a whole chapter when it belongs only to the deeper versions; its table-of-contents entry then disappears with it.

**What each depth contains.** Level 1 stands alone: lede, thesis of the chapter, the quotation that grounds it, the conclusion. It reads in one sitting and gives the whole book in far less time. Level 2 brings the development: the example, the second quotation, the objection and its answer, the detail of vocabulary. Level 3 brings the rest: the digression, the technical note, the historical passage, the long quotation, the borderline case. Writing proceeds in this direction, from level 1 toward level 3, each notch fitting into a text that already stood.

## Accent colors

**The palette is composed subject by subject, one color per major part.** It is chosen when the book is designed, according to what it is about: the matter of the subject, its era, its climate, the imagery proper to it.

The composition follows four rules:

- **Each part receives a vivid, saturated hue**, clear-cut on a black background, with enough lightness for small monospace text to remain readable.
- **The hues are clearly distinct from one another**: each occupies a distinct region of the color wheel, so that the reader recognizes at a glance which part they are in.
- **The number of hues follows the number of parts**, from two to five; beyond that, the major sections carry the color and their subparts share it.
- **The opening, the closing and the appendices keep the neutral off-white**, which sets them apart from the numbered parts.

The hue of each part is written only once, in the `color` attribute of its `<part>` tag: the part divider, the chapters, their subheadings and their quote cards, the table of contents, the progress bar and the cover rule take it up on their own.

## The engine and the content

The book is made of two parts. The engine, stored in this skill's `engine` folder, carries all the mechanics and all the appearance: background, embedded fonts, justified reading column with hyphenation, top bar, table of contents and its tracking, cover and reading choices, size control, numbering, pagination, quote cards, part colors, phone adaptation, state remembered from one visit to the next. The content is the only part the AI writes: the text of the book, written in a simple markup the engine knows how to display. All of the AI's attention thus goes to the subject, and every book keeps the same finish.

**One file per chapter.** Each chapter lives in its own file, in a `chapters/` folder, named by its rank and its subject: `01-tree.html`, `02-heart.html`. The main content file, `content.html`, carries the `<book>` tag, the parts, and a line `<include file="chapters/01-tree.html"/>` in place of each chapter. This separation makes it possible to write, reread and rework one chapter while leaving the others as they are.

**Building.** The AI assembles the content with the engine with the command:

```
python3 <skill folder>/engine/assemble.py content.html "<Book title>.html"
```

The file produced is the complete book, self-contained, fonts included: it can be published, downloaded and hosted as is, and displays in its fonts everywhere, with or without a connection. Rerunning the command after each chapter edit regenerates the whole book. The assembly applies on its own the typographic conventions of the language the book is written in, named in the `lang` attribute of `<book>`, English by default: typographic apostrophes and quotation marks, and the spaces that language sets around punctuation. The AI therefore writes its texts with ordinary spaces and the keyboard's straight apostrophe and quotation marks.

**Reworking a book.** To rework a book already assembled, the AI takes its content back out with `python3 <skill folder>/engine/assemble.py --extract "<book>.html" content.html`. The extracted content gathers all the chapters in a single file; the AI modifies it, then assembles it again, and the book sets off again with the most recent engine.

**What the engine deduces on its own.** The numbering of chapters in words and of parts by rank, counted in each reading so that the chapters follow one another without gaps; the identifiers and anchors; the table of contents with its numbers and pages; the quotation marks of the quote cards; the colors; the page counts on the buttons; the reader's place, kept when they change reading or text size.

**Citable pagination.** The engine paginates the book from the word count: 330 words make a page, the measure of a printed book page, and each section, opening, part divider, chapter, closing or appendix, opens a new page. The number of a sentence thus stays the same on a phone, on a wide screen, at every text size and from one visit to the next, which makes it a citable reference. Each reading has its own pagination, like nine editions of the same book: a citation is given with its reading, "Complete unabridged, p. 90" or "Core abridged, p. 20". The number sits in the right margin of the reading column, and moves to a superscript before the first word on a narrower screen. The page field in the top bar leads to the typed page, and the file's address followed by `#pg33-90` opens page 90 of the complete unabridged reading directly, the two-digit key giving the scope then the depth.

## Content format

The content is a tree of simple tags. Titles and short texts are written as attributes, the text of the book as HTML paragraphs. Each tag is closed by its end tag; an empty tag can be written in short form, `<include file="…"/>`.

**Root.** `<book title="…" subtitle="…" tagline="…" lang="…">` wraps all the content. The book is written in the user's language, whose code goes in `lang`. The title appears on the cover and in the top bar; the subtitle is the cover sentence that says what the book contains; the tagline is a short subtitle, a few words, that follows the title in the top bar. The `eyebrow` attribute replaces, when the book calls for it, the mention "A book" set above the title. The children of `<book>` are, in reading order, `<chapter>` and `<part>` elements.

**Part.** `<part title="…" summary="…" color="#rrggbb">` contains its chapters. The summary says in one or two sentences what the part covers; the color follows the "Accent colors" section. The engine writes the part's rank and sets its divider, which opens a page. A part can carry `s` and `d`, which then apply to all its chapters.

**Chapter.** `<chapter title="…">` contains the text of the chapter. The engine writes above the title "Chapter" followed by its number in words. The opening, the closing, the epilogue and the appendices receive the `label` attribute, which carries their own mention, `label="Opening"` for example: they stand outside the parts, keep the neutral off-white and enter the table of contents in italics.

**Text of a chapter.** In the order the reader reads them:

- `<lede>`: the opening paragraph that announces what the chapter establishes, at the head of the chapter;
- `<p>`: a paragraph of running text;
- `<subhead>`: a subheading, short;
- `<quote ref="…">`: a set-off quotation, verse, excerpt, definition, legal text, written as plain text: the engine sets it as a cut-corner card, in italics between the quotation marks of the book's language, with its reference in bold in the part's color; a quotation of several paragraphs contains one `<p>` per paragraph;
- `<ul>` or `<ol>`: a list, when the text calls for one;
- `<free>`: the free zone, described below.

Each of these blocks receives `s` and `d` according to its reading. Within the text, italics are written `<i>`, bold `<b>`, superscript `<sup>`. Title attributes also accept `<i>` and `<b>`.

**Free zone.** `<free>` contains HTML written by the AI, accompanied by its own `<style>` whose classes carry a name specific to the figure, for a form the subject calls for beyond running text, as it best serves what needs to be shown. The zone keeps the book's atmosphere: #0a0a0a background showing through, cards in absolute black #000 with a white hairline border at 0.16 alpha and an 18px cut corner at the top right, structuring 1px lines in dimmed white (0.12 to 0.4 alpha), EB Garamond for text, Cormorant Garamond for large titles, JetBrains Mono in spaced capitals for labels, the part's color in `var(--a)`, and text sizes written `calc(Npx * var(--bkz,1.25))` to follow the size control. It fits within the width of the reading column, 36em, and switches to a single column below 640px wide.

Example of the form:

```html
<book title="Book title" subtitle="A sentence that says what the book contains." tagline="short subtitle" lang="en">

<include file="chapters/00-opening.html"/>

<part title="Title of the first part" summary="What this part covers." color="#ffb627">
<include file="chapters/01-first.html"/>
<include file="chapters/02-second.html"/>
</part>

<part title="A neighboring domain" summary="What it adds to the heart of the subject." color="#3fa7ff" s="2">
<include file="chapters/03-neighbor.html"/>
</part>

<include file="chapters/04-closing.html"/>
</book>
```

A chapter file:

```html
<chapter title="Chapter title">
<lede>Opening paragraph that announces what the chapter establishes.</lede>
<p>This paragraph is read in all three versions, with a <i>term in its original language</i> and a passage in <b>bold</b>.</p>
<p d="2">The development, from the standard version on.</p>
<subhead>Subheading</subhead>
<quote ref="Reference">Text of the quotation.</quote>
<p s="2">The link with a neighboring domain, from the extended scope on.</p>
<quote ref="Reference" d="3">The quotation only the unabridged carries.</quote>
</chapter>
```

## Writing with several hands

The chapters can be entrusted to subagents writing in parallel. The main AI then keeps charge of the unity of the book, from the first word to the last.

**A shared brief precedes the writing.** The main AI writes it in a file that each subagent reads in full before writing. In it, it sets out the complete outline of the book, the intended reader, the tone, the rules of substance and form, the content format, the map of the subject with the scope of each chapter, the three depths and the number of words expected for each. Each subagent chooses for itself the examples and quotations that best serve its chapter, and delivers its chapter in its file, ready for assembly.

**Basic terms are defined once**, at the place where the reader first meets them, at the lowest level of scope and depth where they appear, which makes them present in all the readings that use them; the following chapters use them directly, and each chapter opens on its own subject.

**A single-handed rereading follows the writing.** Before assembly, the main AI itself reads the whole book, chapter after chapter, in the reader's order. It gives the whole text a single voice. It grants each example and each quotation a main place, the one where they serve best, and brings them back a second time when that new place draws from them a light of its own that fully justifies their return. It rewrites the passages that repeat what another chapter already carries, replacing them with new material. The book then reads as the work of a single author. Each chapter thus keeps its full substance.
