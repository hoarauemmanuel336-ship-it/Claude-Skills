---
name: "study-path"
description: "Compose a study path on a subject as a single dark HTML page: blocks, collapsible themes, topics to check off, saved progress, and one-tap copying of a topic, a theme or a block to have the AI explain it as a book (html-book skill), a diagram (interactive-diagrams skill), a course (html-course skill) or an article."
---

GOAL

Produce a complete study path on the requested subject, delivered as a self-contained HTML file that the reader opens in their browser, on a computer as well as on a phone. The path leads from the very first notion all the way to mastery of the subject. In it, the reader follows their progress topic by topic and copies, with a single tap, whatever they want to study, so as to ask the AI for the book, the diagram, the course or the article that will teach it to them.

The reader learns with the AI, through what it composes for them: books, with the html-book skill; diagrams, with the interactive-diagrams skill; courses, with the html-course skill; and articles. Each topic of the path is therefore material to be written up in one of these forms, and each point to learn lends itself to becoming a chapter of a book, a section of a diagram, a page of a course or a part of an article.

The path is the roadmap of this study: it says what to learn and in what order, gives the reader a view of the whole road before the first step, and keeps track of the ground already covered. It thus takes the place of a training program's syllabus: the reader who has followed it to the end masters the subject. The file is passed on as is to anyone who wants to learn the subject, who then follows their own progress in it.

The path is written in the user's language.

CONTENT

The question of the subject. Before the plan, the AI states the central question the path answers, then the points where a novice stumbles and the misconceptions they often carry. The plan is built to get through these obstacles.

Knowing a subject. To know a subject is to know it through its causes: to know what it is made of, what makes it what it is, what produces it or sets it in motion, and what it tends toward. The full map of the subject embraces all of them, and the path followed to its end gives the reader this knowledge. These causes tell when the map is complete; the blocks, the themes and the topics, for their part, follow the subject's own articulations, as the subject calls for them.

Architecture. The path is built on three levels. Blocks are the major parts of the subject; each one carries a color. Themes are the collapsible sections of a block, numbered from 01 to the end of the path. Topics are the cards of a theme: each one is a unit of study. The AI first draws up the full map of the subject, then divides it along its natural articulations: the number of blocks, themes and topics follows what the subject calls for.

Order. The themes follow one another in the order in which one learns best: the foundations first, which provide the words and the sources, then the heart of the subject, then its extensions, and finally the synthesis, which gathers the subject together in its nature and its causes, ties the whole together and teaches how to pass it on. Within a theme, each topic builds on those that come before it. The path is presented as a plan by major themes, in one continuous order.

Topic. Each topic carries a short, noun-phrase title, a one-line description that says in simple words what it is about, and a list of points to learn, as many as the material calls for. Each point names a precise notion, a distinction, a work, a text or a figure, so that on its own it forms a part of the book (html-book skill), the diagram (interactive-diagrams skill), the course (html-course skill) or the article the reader will ask for. The points are written for a novice discovering the subject, naming the exact terms they will learn to master.

The why as much as the what. Each notion receives its reason for being: what it explains, what it resolves, what would be missing without it. The points to learn name it, so that the book, the diagram, the course or the article requested carries it in turn. A reader who knows why remembers far better.

Explanations. The banner carries an explanation in three short paragraphs: what the path covers and how each topic is copied to be requested from the AI as a book with the html-book skill, as a diagram with the interactive-diagrams skill, as a course with the html-course skill, or as an article; how the themes follow on from one another and how to mark each topic; then the way progress is kept: by itself in the browser when it allows it, and in the file through the Save button, which writes the progress into the very file the reader designated once and for all, or, on phone browsers, downloads the updated path, to be reopened next time in place of the old one. Each block of several themes carries an explanation that sets out its overall logic: what it gathers, why in this order, what it prepares. Each theme carries an explanation of one or two sentences that says what one learns in it, what the reader will be able to do on finishing it, and why it comes at this place. A block of a single theme keeps its heading as a simple landmark, and its theme carries the explanation. Bold marks the two or three key notions of each explanation.

Copy. Each topic, each theme and each block of several themes carries a copy button. A topic is copied like this: its title, a blank line, then its points, each on its own line and preceded by "· ". A theme: its name, a blank line, then its topics separated by a blank line. A block: its name in capitals, a blank line, then its themes separated by two blank lines. The reader pastes this text into their request for a book (html-book skill), a diagram (interactive-diagrams skill), a course (html-course skill) or an article. The title and the points of a topic are therefore written to be read on their own, once copied, as the complete order for a study.

Typography. The assembly sets the typography of the content's language by itself: curly apostrophes in place of straight ones and curly quotation marks in place of straight ones. The AI writes its texts with straight apostrophes, straight quotation marks and ordinary spaces. Commas, parentheses and colons carry the asides.

THE PATH ON SCREEN

What the reader finds. At the top, the banner bearing the name of the subject, whose explanation unfolds at a tap; below it, a progress bar per theme, numbered, which fills with the block's color as topics are done and is hatched for topics in progress or to review; then the SAVE button. Next come the blocks, each announced by its heading, and their themes, collapsed at the start. An arrow, in the corner of the banner, opens or collapses all the themes in one gesture. An open theme shows the COPY THEME button and the column of its topics along a rail that fills up to the last done topic of the unbroken run from the first. Each topic card carries its code (theme number then topic rank), its title, its description and the state selector: TO DO, IN PROGRESS, DONE, TO REVIEW. Tapping the title unfolds the WHAT YOU WILL LEARN list and the COPY TOPIC button. At the foot of the page, three buttons set the text size.

Saved progress. Progress is kept at every gesture, by itself in the browser when it allows it. It is also written into the file: in a reserved block of the head, `<script type="application/json" id="lv-progress">`, which contains {"updated": time of the last change in milliseconds, "topics": {topic key: state}}, with the states in-progress, done and to-review; a topic to do is absent from the block. Opened directly, the path writes this block through the SAVE button, in place in the file designated once and for all when the browser allows it, and by downloading the updated file on the others, including phone browsers. Placed within the frame of a host page, the path entrusts its state and its progress to that page, which rewrites the block in the file. The file the reader gets back thus carries all their progress, and the AI reads it when the reader entrusts the file to it.

THE ENGINE AND THE CONTENT

The path is made of two parts. The engine, stored in the `engine` folder of this skill, carries all the mechanics and all the appearance: dark background, embedded fonts (Outfit for headings and text, JetBrains Mono for tags, codes, labels and buttons), black cards with a cut corner, monospace tags, the vivid color of each block, banner, progress bars, rails, state selectors, copy buttons, opening and collapsing animations, text size, phone adaptation, progress saved in the browser, in the file and with the host page. The content is the only part the AI writes: a short file, written in a simple markup the engine knows how to display. All of the AI's attention thus goes to the subject, and the path keeps the same finish from one subject to the next.

Building. The AI writes the content into a file, for example `content.html`, then assembles it with the engine with the command:

```
python3 <skill folder>/engine/assemble.py content.html <path-name>.html
```

The file produced is the complete path, self-contained, ready to be delivered; its name takes up the subject of the path. The engine deduces on its own everything mechanical: the numbering of the themes from 01 to the end and the code of each topic, the color of each block, ranged from cool to warm, the progress bars, the copy buttons and their texts, the subtitle when it is omitted, and the fresh progress block, with updated at 0 and topics empty.

Resuming an assembled path. The AI extracts its content with the command:

```
python3 <skill folder>/engine/assemble.py --extract <path>.html content.html
```

The content file obtained begins with the path's progress block, as the file carried it, followed by the content. The AI keeps this block at the head of the file, modifies the content, then assembles it again: the path starts afresh with the most recent engine and all of the reader's progress.

CONTENT FORMAT

The content is a tree of simple tags. Titles and descriptions are written as attributes, explanations as HTML paragraphs inside an `<explanation>` tag, the points to learn as paragraphs inside their topic. Each tag is closed by its end tag.

Root. `<study-path subject="…" subtitle="…" lang="…">` wraps all the content. The `subject` attribute carries the name of the subject, which the banner displays in capitals and which gives the path its name; the `subtitle` announces a study plan by major themes; `lang` gives the language code of the content, and English applies when it is omitted. Its first child is the banner's `<explanation>`, in three paragraphs, then come the blocks.

Block. `<block name="…">` gathers themes of the same color. Its `<explanation>` comes first: for a block of several themes, it sets out the logic of the block; for a block of a single theme, the engine gives it to that theme. The engine assigns each block a color from its palette; a `color="#rrggbb"` attribute sets another vivid, saturated hue when the subject calls for one.

Theme. `<theme key="…" title="…">` contains its `<explanation>` then its topics. The key is a short word taken from the theme, unique in the path, which names the theme in the remembered state.

Topic. `<topic key="…" title="…" desc="…">` contains its points to learn, one `<p>` per point. The key is made of letters from a to z, capitals included, digits, periods, hyphens or underscores, 80 characters at most, unique in the path; it is written once and keeps the topic's state when the plan is reorganized. A readable form, which recalls the theme then the topic, serves rereading well.

Text. Italics are written `<i>`, bold `<b>`, in explanations, points, titles and descriptions.

Progress. The `<script type="application/json" id="lv-progress">` block that `--extract` places at the head of the content is kept as is. Fresh content does without it: the engine sets a fresh block.

Example of the form:

```html
<study-path subject="Name of the subject" subtitle="Study plan in five major themes" lang="en">
<explanation>
<p>What the path covers, and how each topic is copied to be requested from the AI.</p>
<p>How the themes follow on from one another, and how to mark each topic.</p>
<p>How progress is kept.</p>
</explanation>
<block name="Foundations">
<explanation><p>What the block gathers, why in this order, what it prepares.</p></explanation>
<theme key="words" title="Title of the theme">
<explanation><p>What one learns in it, what the reader will be able to do, why at this place.</p></explanation>
<topic key="words.first" title="Title of the topic" desc="What it is about, in simple words.">
<p>A precise notion and its reason for being</p>
<p>A distinction, with its <b>exact terms</b></p>
</topic>
</theme>
</block>
</study-path>
```

WRITING WITH SEVERAL HANDS

The blocks can be entrusted to subagents who write in parallel, each one the themes, topics and points of one or more blocks. The main AI then keeps charge of the unity of the path, from the banner to the last topic.

A common brief precedes the writing. The main AI writes it in a file that each subagent reads in full before writing. In it, it sets out the full map of the subject, the division into blocks and themes with their numbering, each one's share, the audience, the tone, the rules of substance and form, the content format and the form of the topic keys, so that the parts fit together as they are in the content file.

A single-handed rereading follows the writing. Before assembly, the main AI itself reads the entire path, from the first theme to the last, in the reader's order. It gives all the texts one voice. It attunes each theme to those that precede it, so that the continuous order of the path carries on from one block to the next. It places each notion, each work and each figure in the topic where it is best learned, and rewrites the points that repeat what another topic already carries, replacing them with fresh material. It then composes the explanations of the banner and of the blocks itself, on the reread path. The path then reads as the plan of a single author, and each topic keeps its full substance.

UPDATING A PATH

When the reader entrusts an existing path to have it evolve, the AI extracts its content with `--extract`, which places the progress block at the head, and keeps this block as is. It keeps the key of each topic retained, even renamed or moved; a new topic receives a new key. It reads the block to know the reader's progress and evolves the path accordingly: what they have done keeps its place, what they have marked to review can be deepened, and what follows builds on what they already know. It finally assembles the content with the present engine, and the updated path carries all of the reader's progress.

A path composed before the engine is taken up in the same way: the AI rewrites its data in the content format, keeping the keys of its topics, places its progress block at the head of the content file, then assembles it. It thus receives the save button and all the present mechanics; the banner's explanation receives, if needed, the sentence that introduces this button.

DELIVERY

The path is delivered as a single self-contained HTML file, produced by the assembly. The name of the file takes up the subject of the path.
