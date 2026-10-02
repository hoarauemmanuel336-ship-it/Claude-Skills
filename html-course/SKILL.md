---
name: "html-course"
description: "Compose an introductory course as a single dark HTML page split into pages, with lessons, boxes, exercises with solutions, self-assessment, a capstone, review sheets and a glossary; one file can hold several courses. Use whenever a course is requested or is to be added to an existing file."
---

# HTML Course

OBJECTIVE

Produce a complete course on the requested subject, delivered as a self-contained HTML file that the reader opens in their browser, on a computer as on a phone. A course differs from a book: it breaks knowledge into clear units, shows each one through examples, has the reader practice it, then sums it up so that it stays. The reader learns it, checks that they grasp the whole, then reviews it, page after page. A single file can hold several courses, on the major areas of one subject or on neighboring subjects, which the reader goes through one after another or picks from the contents; each course is built from the start so that it can welcome others, as described in SEVERAL COURSES IN ONE FILE.

The course is the gateway to a subject: it takes the reader from discovery to solid foundations, on which they then build any further study. The reader learns with the AI, which composes what they study for them, and the course gives them the active part of that learning: practicing, checking what they know, reviewing. On its own, it teaches everything it announces. The file can be passed as is to anyone who wants to learn.

AUDIENCE

The course addresses at the same time the novice, who is discovering the subject, and the experienced reader, who comes to deepen it. It starts from what the novice already knows: each technical term receives its definition at the very place where it appears, and each lesson builds on the previous ones. The experienced reader finds their share in the precision of the distinctions and in the most demanding exercises.

THE ENGINE AND THE CONTENT

The course is made of two parts. The engine, stored in this skill's `engine` folder, carries all the mechanics and all the appearance: dark background, embedded fonts, pages and navigation, top bar and contents panel (a panel that opens on the left edge and scrolls over the full height of the screen, whether the course is opened on its own or placed in a host page), lesson colors, boxes, folding out of answers and solutions, keywords, self-assessment and progress, course outline, review sheets, glossary, text size control, phone adaptation, printing, progress saved in the file, and exchanges with the host page. The content is the only part the AI writes: a file written in a simple markup, described under CONTENT FORMAT, that the engine knows how to display. All of the AI's attention thus goes to the knowledge and its explanation, and every course keeps the same finish.

Building. The AI writes the content in a file, for example `content.html`, then assembles it with the engine using the command:

```
python3 <skill folder>/engine/assemble.py content.html <course-name>.html
```

The resulting file is the complete course, self-contained, ready to be delivered. The assembly sets curly apostrophes on its own, as described under TYPOGRAPHY: the AI therefore writes its apostrophes straight. It also gives each course its letter and each "I can…" statement its key, and writes them into the content the file carries.

Resuming a course. To develop an assembled course or to add a course to it, the AI takes its content out with:

```
python3 <skill folder>/engine/assemble.py --extract <course>.html content.html
```

The extracted content opens with a `<progress>` tag that carries the progress recorded in the file, the statements checked by the reader, and each statement keeps its key there. The AI modifies the content, then assembles it again with the building command: the course starts afresh with the most recent engine and with all its checks.

COURSE ARCHITECTURE

Before writing, the AI draws up the map of the subject, which makes it known through its causes, and divides it into lessons, in the order in which one learns best: the foundations first, then the heart of the subject, then its extensions. The number of lessons, parts, boxes and exercises follows what the subject calls for. The engine gives each lesson its accent color.

A vast subject is composed as several courses. When the map of the subject brings out major areas, each with its own unity, its central question and enough material to fill a whole course, the AI composes from the outset a file that brings together one course per area, following SEVERAL COURSES IN ONE FILE. Each course thus keeps a size that can be gone through, checked and reviewed in one sitting, with its own capstone and its own review sheets. The courses follow one another in the order in which one learns best, each building on those that precede it. When the reader provides a plan already organized into major areas, each area becomes a course and its subdivisions become the lessons of that course; the AI keeps this division and gives each lesson all the material the plan assigns to it.

The course is made of pages that follow one another:

- the opening page: the banner, with its note on progress, then a brief introduction that says what the course covers and whom it is for, how the lessons follow on from one another and how each lesson is built; then the course outline and the box legend;
- one page per lesson;
- the capstone page: exercises that cross several lessons;
- the review page: the review sheets, then the glossary.

The AI writes the introduction, the lessons and the capstone; the engine composes the banner, the note, the outline, the box legend, the review sheets and the glossary from them.

THE LESSON

Each lesson follows the same path in three stages.

Opening. The header carries the label "Lesson" and its number, then the title. Next come two lists side by side: the objectives, each preceded by an arrow in the lesson's color, and the prerequisites, which name the lessons and notions this one builds on. Then the "To begin" block: a question or a concrete situation, large and in white, followed by a few sentences that show why the subject matters. The first part follows this block directly; the contents panel gives access to the parts of each lesson.

Body. The lesson moves forward in parts numbered in Roman numerals, from simple to complex, one idea at a time. The underlying pattern of each notion goes from the definition to the explanation in plain language, then to the example, the remarks and the check; the AI lets this pattern breathe according to the idea, tightening it, filling it out or changing the order when the idea is better understood another way, so that the text keeps the movement of a real explanation. Paragraphs are short and start flush with the margin. A table serves when the idea is compared or arranged in columns; a card grid serves when several elements of the same rank are presented together.

Closing. Four blocks close the lesson, each announced by a subheading:

- Essentials: the lesson summed up in a few sentences, enough to review it; the first says, in one short sentence, the nature of what the lesson teaches, and the following ones each bring a new aspect;
- Keywords: the lesson's terms, as buttons; a tap displays the word's definition, taken from the glossary, below the row;
- Exercises: exercises of increasing difficulty, leading from restating the lesson to applying it, then to personal reflection; each carries a short name that says what it asks and its solution to fold out;
- Self-assessment: "I can…" statements to check, one per objective, with a counter and a segmented bar. Each statement names, below its text, the exercise or exercises of the lesson that put it to the test, with a link to them. A brief note, below the subheading, invites the reader to check a statement once those exercises are passed: the check then stands for tested knowledge. Each objective of the lesson thus finds at least one exercise that verifies it.

THE ART OF EXPLAINING

The heart of the course is its explanation. Everything this skill describes, pages, boxes, progress, serves a text that brings understanding; the AI gives this text the best of its attention.

The question of the subject. Before the plan, the AI formulates the central question the course answers, then the points where a novice stumbles and the misconceptions they often carry. The plan is built to get through these obstacles.

Knowing a subject. To know a subject is to know it through its causes: to know what it is made of, what makes it what it is, what produces it or sets it in motion, and what it tends toward. The map of the subject embraces them all, and the course leads the reader to this knowledge, each lesson doing the same for the notion it teaches. These causes tell when the map is complete; the lessons, for their part, follow the subject's own articulations, as the subject calls for them.

The why as much as the what. Each notion receives its reason for being: what it explains, what it solves, what would be missing without it. A reader who knows why remembers far better.

Going from the concrete to the abstract. An idea is first shown in a case, then formulated in general, then returns to the concrete in a second case that lights up another side of it. The reader thus sees the rule arise from the facts and return to them.

Choosing examples that illuminate. A good example is simple, striking and faithful: it shows the notion without noise, it sticks, and it shows the notion as it really is. For each notion the AI chooses the example that brings out its essential feature, and, when two neighboring notions look alike, a pair of examples that shows them side by side, right where they part.

Getting ahead of confusions. The AI puts itself in the novice's place and spots where they are likely to go wrong: two similar words, an idea that seems to contradict intuition, a tempting shortcut. The explanation tackles these spots head on, at the moment they arise, setting out the right distinction clearly; the Caution box carries the confusions that matter most.

Sparking interest. The "To begin" block opens a real question, the one the reader asks or will ask as soon as they look closely at the subject: a puzzle, a situation where one hesitates, a surprising fact. The lesson answers it step by step, and Essentials comes back to it to show the reader that they now know how to answer it.

Exercises that teach. The exercises work the lesson from several angles: restating, recognizing, applying, comparing, explaining in one's own words, judging a new situation. The AI chooses their forms according to what the subject requires one to know how to do, and each exercise asks the reader for a real effort of thought. End-of-lesson exercises also bring back, now and then, notions from earlier lessons, so that the reader recalls them to memory as they move forward. Some exercises place the reader in front of the novice's usual mistakes, and their solution names them: the reader then recognizes them at a glance.

Solutions that teach. Each solution shows the path as much as the destination: it unfolds the reasoning that leads to the answer, names the notion of the lesson that sheds light on it, and, when a neighboring answer is tempting, says how it differs from the right one. The reader who went wrong thus understands why; the one who succeeded consolidates what they knew.

One idea at a time, at the right density. Each paragraph carries one idea, and each sentence moves the explanation forward. The text gives each notion the room it needs: more space for difficult ideas, a quick pace over what is self-evident. The voice is that of a teacher speaking to a student they respect: clear, precise, warm.

THE CAPSTONE

The capstone checks that the reader holds the course as a whole. Its exercises each draw on several lessons at once: a question that has two notions linked, a situation that requires combining several, a reflection that embraces the whole subject. They go from the simplest to the most demanding, and each carries its solution to fold out, which shows which lessons meet and how.

The page opens with a header labeled "Capstone", with a title, then a brief note that tells the reader to try before opening the solutions. Each exercise takes up the frame of the lesson exercises; below its level, a row of tags names the lessons it draws on, each in its lesson's color and leading to it. The capstone page, which gathers all the lessons, takes white as its color, and its separator runs through the colors of all the lessons.

THE BOX LEGEND

Each type of content always keeps the same form from one end of the course to the other, and the color follows the lesson. The legend follows one principle: a frame marks a place where the reader acts, and what is read stands freely on the page background. Reading boxes are therefore distinguished by a line, a rule or a band; "Remember" is the only reading box that carries a frame, and it stands out all the more. Each box carries a label, set at the head of the box, above its text. The opening page of the first course presents this legend in a card grid, which the engine composes: each card is the box itself, in its complete form, with a line that says what it is for.

- Definition: a solid line in the color on the left edge; the defined term in bold in the color, followed by a colon and the definition. The label carries the single word "Definition": the bold term that opens the text already names what the box defines.
- Example: a dotted rule in the color on the left edge, slightly dimmed text: the example reads as an aside in the text.
- Caution: a hatched band on the left edge, for the confusions that matter most.
- Remember: the double-ruled frame, white text in a heavier weight.
- Landmark: a fixed point that situates the notion, whether a date, a text, an author or a work, presented as a small timeline; several landmarks follow one another on the same timeline. The box appears where the subject offers such fixed points.
- Check: it calls for an action and so keeps a frame, dashed; a question, then the "Show the answer" button.

END OF THE COURSE

The review sheets take up, in a card grid, the essentials of each lesson: the engine composes them from the "Essentials" blocks, so that they always follow the text of the lessons. Each sheet carries the number and title of its lesson, under a rule in its color.

The glossary gathers all the course's keywords in alphabetical order, each with a label that points to the lesson where it is explained, in that lesson's color. The engine composes it from the keywords each lesson defines; the glossary definitions are the ones the keyword buttons display. A discreet footer closes the course.

VISUAL ATMOSPHERE

The course has a dark, dense atmosphere: dark background, pure black, monospace tags, one vivid color per lesson, from cool to warm. Its technique is that of a textbook: a reading column free of any frame, boxes that announce their role with a label at their head, frames reserved for what is done, and reading page by page. The reading text is set in EB Garamond, justified on both edges with hyphenation, the main titles in Cormorant Garamond, the page framework in Inter, and the labels, tags and buttons in JetBrains Mono: the course looks like a printed textbook served by an interface. The engine carries all this appearance, with its measurements, its animations and its phone adaptation.

The reader sets the text size with the A−, A and A+ buttons, in the banner and at the head of the contents panel; the course opens at the largest step, which is its default size. The Save button stands to their right, and the banner note tells the reader how their progress is kept: automatically in this browser, and in the file with this button.

SAVED PROGRESS

The course keeps the reader's progress, the "I can…" statements they have checked, in the file itself, in a reserved block of its header that the host page and the Save button rewrite; it also keeps the page reached, the reading position and the text size in the browser's storage, or with the host page when it is placed in a frame. The file the reader gets back thus carries all their checks, and the AI finds them in the `<progress>` tag when it resumes the course. Each statement carries a stable key, which the assembly gives to a new statement and which the content then keeps: the check is recorded under this key.

SEVERAL COURSES IN ONE FILE

A course file can welcome others. It brings several together from its composition when the requested subject divides into major areas, as described in COURSE ARCHITECTURE: the AI then composes all the courses of the file at once, the first carrying the shared presentations, the following ones being composed like added courses. When the reader hands over an existing file and asks for a new course "in it", the AI adds that course to the file, after the courses already present, and delivers the whole file. Each added course is a complete course, with its own opening page, its lessons, its capstone and its review page, composed according to all the rules of this skill.

Adding a course to an existing file. The AI takes the content out of the file with `--extract`, as described in THE ENGINE AND THE CONTENT. It keeps everything it carries as is, the `<progress>` tag, the courses present, their letters and the keys of their statements, then writes the new course at the end, just before the closing `</file>` tag, and assembles the content thus completed. The new course receives its letter and its keys at assembly, the courses already present keep all the reader's progress, and the engine updates the kickers, the outline, the contents panel and the navigation on its own.

What the engine holds for the whole file. The file keeps a single progress, a single size setting and a single reading state. The page title and the file name take the common subject of the gathered courses. The engine recognizes each course and builds for each one its opening page, its outline, its overall progress, its capstone, its sheets, its sorted glossary and its navigation. Each course receives a short letter: the first keeps the letter l, each added course takes a letter drawn from its title; lessons are numbered from 1 in each course, and each course forms its own arc of colors, from cool to warm. The banner of each opening carries as a kicker the course's place in the file and the number of its lessons; the outline of each course leads to the opening of each of the others; the contents panel presents one tab per course, and the page navigation passes from one course to the next without stopping.

The courses answer one another. Each course can be followed on its own: it recalls in one sentence, at their first use, the basic terms that another course in the file defines, and it keeps its Definition boxes for the terms it brings. Its prerequisites and its text can point to the lessons of another course with a link to their identifier, naming the course, "lesson 3 of the course on such-and-such a subject". The opening of an added course carries what is its own: its banner, what it covers, the sequence of its lessons and its outline. It says in one sentence how it answers the other courses of the file, and, in the same sentence or the next, that its lessons share the construction and the box legend presented in the opening of the first course, with a link to it. These shared presentations thus stand only once in the file, in the opening of the first course.

An added course brings new material. Before writing, the AI reads the courses already present in the file, their lessons, their examples, their exercises and their glossary. The new course builds on what they teach and extends it: what they already set out is recalled in one sentence with a link to the lesson that develops it, and its lessons, its examples and its exercises carry what the file brings that is new. A keyword already defined in an earlier course reappears in a lesson's keywords by its tag alone, and the engine takes up its definition.

UPDATING A COURSE

When the reader hands over an existing course to develop it, the AI takes its content out with `--extract`. It keeps the `<progress>` tag as is and keeps the key of each statement it retains, even reworded or moved; a new statement is written with its content attributes alone and receives its key at assembly. It reads the progress to know how far the reader has come and develops the course accordingly: what they have mastered keeps its place, the lessons still little checked can be clarified and enriched with examples, and the capstone builds on what they already know. The reassembled course starts afresh with the most recent engine.

A course composed before the engine is resumed by rewriting its content in the format described below: the AI carries over all its lessons and all its text, gives each statement the key it carried in the old file, and opens the content with a `<progress>` tag that takes up the progress block of the old file. The course thus keeps all the reader's checks. Its "I can…" statements receive the names of the exercises that put them to the test, and the introduction of its opening page leaves the presentation of progress to the banner note.

TYPOGRAPHY

The course is written in the user's language, and the `lang` attribute of the root gives that language to the page. The text follows the typographic conventions of that language, English by default: its apostrophes, its quotation marks, with the quotation marks of the second level for words reported inside a quotation, and the spacing its punctuation calls for. Commas, parentheses and colons carry the asides. The assembly sets the curly apostrophe on its own; the AI writes the quotation marks and the spacing.

CONTENT FORMAT

The content is a tree of simple tags. Titles and short texts are written as attributes, running text in `<p>` paragraphs. Each tag is closed by its end tag; an empty tag can be written in short form, `<keyword term="…"/>`. Everything mechanical is deduced from the content: numbers of the lessons, of the parts in Roman numerals and of the exercises, colors, identifiers, outline, counters, contents panel, sheets, glossary, navigation, course letters and statement keys.

Root. `<file subject="…" lang="…">` wraps all the content; the subject gives the page title and the name suggested for the saved file, and `lang` gives the language code of the course, `en` by default. It contains one or more `<course>`, in the reader's order. Content taken out with `--extract` opens with `<progress>…</progress>`, which is kept as is.

Course. `<course title="…" subtitle="…">` contains its `<introduction>`, its `<lesson>` tags, then its `<capstone>`. The subtitle, brief, situates the course. The assembly adds the `letter` attribute, which is kept from then on.

Introduction. `<introduction>` contains the paragraphs of the introduction of the opening page. The banner, its note, the course outline and, in the first course, the box legend come from the engine.

Lesson. `<lesson title="…" desc="…">`: the description, one line long, is read in the lesson's card in the course outline. A lesson contains, in this order:
- `<objectives>` then `<prerequisites>`, each made of `<li>`;
- `<start question="…">`, with its paragraphs;
- the `<part title="…">` tags, each with its text and its boxes;
- `<essentials>`, made of `<li>`, one sentence per bullet;
- `<keywords>`, made of `<keyword term="…">definition</keyword>`; the definition stands in the lesson that explains the word, and a lesson that takes up a word already defined writes it by its tag alone, `<keyword term="…"/>`;
- `<exercises>`, made of `<exercise name="…" level="1">`; the level goes from 1 to 3, the question is written directly in the tag, as text or in paragraphs, and the solution in `<solution>`, last;
- `<self-assessment>`, made of `<i-can exercises="2 4">I can…</i-can>`, where `exercises` names the numbers of the lesson's exercises that put the statement to the test; the assembly adds the `key` attribute, which is kept from then on.

A lesson receives the attribute `color="#rrggbb"` when the subject calls for a precise vivid hue; otherwise, the engine draws the colors from its palette. The `<self-assessment>` tag accepts a `note` attribute that replaces its default note when the course calls for another one.

Content of a part. `<p>` paragraphs, `<ul>` or `<ol>` lists, internal `<h4>` subheadings and these boxes:
- `<definition term="…">the definition</definition>`: the engine sets the term in bold in the color, followed by a colon;
- `<example>`, `<caution>`, `<remember>`: their text, in paragraphs or in one piece;
- `<landmarks>`, made of `<landmark title="…">text</landmark>`; the title carries the date, the text, the author or the work;
- `<check>`: the question, then `<answer>`;
- `<cards>`, made of `<card title="…">description</card>`; the `tag` attribute replaces the card's number with a brief marker;
- `<table>`, whose first row carries the headers in `<th>`; on a phone, each cell takes up the name of its column;
- `<free>`, the free zone described below.

Capstone. `<capstone title="…">` contains, if needed, a paragraph that replaces the default note, then its `<exercise name="…" level="…" lessons="1 3">`, where `lessons` names the numbers of the course's lessons that the exercise draws on.

Text. Italics are written `<i>`, bold `<b>`. An internal link is written `<a href="#identifier">`, and the engine opens the page that contains its target. Identifiers are formed with the course letter, l for the first: `l3` for lesson 3, `l3-2` for its second part, `l3-ex2` for its second exercise, `opening-l`, `outline-l`, `legend-l`, `capstone-l`, `review-l`, `sheets-l` and `glossary-l` for the other places in the course. The letter of an added course is read in the content after the first assembly; the AI that composes several courses at once gives them their letter itself with the `letter` attribute, a lowercase letter drawn from the title, to write its links from one course to another.

Free zone. `<free>` contains HTML written by the AI, accompanied by its own `<style>`, for a custom figure the subject calls for, beyond boxes, tables and cards. The zone keeps the course's atmosphere: #0a0a0a background showing through, frames in pure black #000 with a white hairline at .2 alpha, square corners, a 4px cut corner at top right and bottom left reserved for small elements, 1px lines in dimmed white between .12 and .4 alpha, the lesson's color through `var(--a)` and its transparencies through `rgb(var(--r)/.5)`, EB Garamond for reading text, JetBrains Mono for spaced uppercase labels, text sizes written `calc(Npx * var(--z,1.25))` to follow the size setting, and a card grid whose last row widens to fill itself.

Example of form:

```html
<file subject="Common subject" lang="en">
<course title="Course title" subtitle="what situates it">
<introduction>
<p>What the course covers, whom it is for, how the lessons follow on from one another and how each lesson is built, with a link to the <a href="#legend-l">box legend</a>.</p>
</introduction>
<lesson title="Lesson title" desc="One line for the course outline.">
<objectives><li>First objective.</li><li>Second objective.</li></objectives>
<prerequisites><li>What the lesson assumes is known.</li></prerequisites>
<start question="The question that opens the lesson?">
<p>Why it matters.</p>
</start>
<part title="Part title">
<p>The text of the explanation.</p>
<definition term="Term">its definition.</definition>
<example><p>The case that shows the notion.</p></example>
<check>A question.<answer>Its answer.</answer></check>
</part>
<essentials><li>What the lesson teaches, in one sentence.</li><li>A new aspect.</li></essentials>
<keywords><keyword term="Term">its definition.</keyword></keywords>
<exercises>
<exercise name="Restate" level="1">The question.
<solution><p>The reasoning and the answer.</p></solution>
</exercise>
</exercises>
<self-assessment>
<i-can exercises="1">I can…</i-can>
</self-assessment>
</lesson>
<capstone title="Capstone title">
<exercise name="Connect" level="2" lessons="1 2">The question.
<solution><p>How the lessons meet.</p></solution>
</exercise>
</capstone>
</course>
</file>
```

WRITING WITH SEVERAL HANDS

The lessons can be entrusted to subagents that write in parallel, each one or more lessons in its own file, in the content format. The main AI then keeps charge of the unity of the course, from the opening page to the glossary.

A shared brief comes before the writing. The main AI writes it in a file that each subagent reads in full before writing. In it, the main AI sets out the map of the subject and the complete plan of the course, or of all the courses when the file brings several together, the terms already defined by the other courses of the file with the lesson that defines them, each one's share, the objectives and prerequisites of each lesson, the audience, the tone, the principles of THE ART OF EXPLAINING, the box legend, the rules of substance and form, the content format, the link identifiers and the form in which each lesson is delivered, so that the lessons fit into the content file as they are.

Basic terms are defined once, in the lesson where the reader first meets them; the following lessons use them directly and name that lesson in their prerequisites. When the file brings together several courses composed together, the shared brief assigns in advance each basic term, each shared notion and each major example to the lesson that carries it, across the whole file: each subagent thus knows what its lesson brings of its own and what it recalls in one sentence by pointing to the lesson that develops it.

A single-handed rereading follows the writing. Before assembly, the main AI itself reads the whole course, lesson after lesson, in the reader's order; when the file brings several courses together, it likewise reads all the courses of the file, from the first to the last. It gives the whole text a single voice. It tunes each lesson to those that precede it, so that each builds on what they have laid down. It gives each example and each quotation a main place in the whole file, the one where they serve best, and brings them back elsewhere when that new place draws from them a light of its own that fully justifies their return. It rewrites the passages and exercises that repeat what another lesson already carries, whether that lesson belongs to the same course or to another course of the file, replacing them with new material; a basic term defined by another course keeps its one-sentence reminder, which lets the course be followed on its own. It tunes the keywords of all the lessons, each word keeping the definition of the lesson that explains it. It then composes the capstone of each course itself, on the reread course, since it crosses all its lessons. The course then reads as the work of a single author, and each lesson keeps its full substance.

METHOD AND DELIVERY

The AI writes the content, in one file or in several lesson files that it brings together in order, then assembles it with the building command. The course is delivered as a single self-contained HTML file, fonts included, whose name takes up the course title, or the common subject when the file brings several courses together. When the reader has handed over an existing file, the AI delivers the whole file, reassembled.
