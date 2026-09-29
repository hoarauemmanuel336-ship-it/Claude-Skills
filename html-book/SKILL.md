---
name: "html-book"
description: "Compose a long text (book, essay, report, guide) as a single dark HTML page: collapsible side table of contents, reading progress tracking, three reading scopes and three reading depths to choose from, adjustable text size, text justified to both margins, citable pagination, quotation cards with a cut corner, one accent color per part. Use it whenever a book, an essay or a long document is requested in HTML."
---

# HTML Book

Produce a long text as a single HTML page, dark and dense, designed for sustained reading: fixed top bar, collapsible side table of contents that tracks the reader's position, three reading scopes and three reading depths to choose from, adjustable text size, text justified to both margins, citable pagination, quotation cards with a cut corner, one accent color per major part.

## Who the book is for

The book speaks at once to the novice, who does not yet know the subject even exists, and to the seasoned reader, who comes to deepen what they already know. The text therefore starts from what the novice already knows: every technical term receives its definition at the very place where it appears, in the sentence that introduces it, and every chapter opens by situating what it is about to cover. The seasoned reader finds their share in the same text: the precision of the distinctions and the detail of the reasoning.

The three reading depths serve this double audience. The abridged depth gives the whole subject to whoever is discovering it, with the definitions that make it readable on its own; the standard depth unfolds the reasoning; the full depth carries the detail and the nuances the seasoned reader comes looking for. Definitions and basic landmarks belong to level 1, which keeps them present in all three versions. The three scopes serve the same double audience: the core scope opens a clear door onto the heart of the subject for the novice, the complete scope gives the seasoned reader the full extent of the ground.

## Scope and depth: two choices for the reader

**The reader chooses two things, with one click each**: the scope, which sets the ground they cover, and the depth, which sets how deeply they cover it. Three scopes, **Core**, **Broad**, **Complete**, and three depths, **Abridged**, **Standard**, **Full**, combine freely: the same book thus offers nine readings, from the core abridged, which gives the heart of the subject in a few pages, to the complete full, which covers the whole ground in detail. The reader changes either one whenever they like.

**The three scopes differ by the extent of ground they cover.** Before writing, the AI maps the subject: its core, then the domains that surround it, as it discerns them for this subject. From this map it draws three nested perimeters, each defined by the question it answers:

- the core scope gives what one needs to know to be able to say one knows the subject;
- the broad scope adds what one needs to understand why the subject is what it is: what grounds it, what surrounds it and what follows directly from it;
- the complete scope adds everything a connoisseur of the subject judges worth attaching to it, out to the domains whose connection remains illuminating.

These three questions serve as a test: the AI asks them of every chapter and every block to set its scope, and the connoisseur's judgment draws the outer boundary of the complete scope.

**The scopes are cumulative**, like the depths. Every block of the book carries its entry scope in the `data-a` attribute: a block of scope 1 is read in all three scopes, a block of scope 2 appears from the broad scope onward, a block of scope 3 belongs to the complete scope alone. A block without the attribute counts as 1. The attribute goes first on whole chapters, since a neighboring domain most often forms its own chapters; it also goes on a paragraph, a subheading or a quotation card within a core chapter, where the text connects the core to a neighboring domain. A part divider carries the most central scope and the lowest depth of its chapters, in its `data-a` and `data-n` attributes, so that it appears as soon as one of them appears, and every table of contents entry carries the same `data-a` and `data-n` attributes as its section.

**Every reading stands on its own.** The core scope reads as a whole book on the heart of the subject, and each wider scope inserts its chapters at their place in the course. The two attributes are set independently: a chapter of scope 2 has its abridged, its standard and its full text like any other chapter.

**The book is written over the whole map**, at the length its content calls for. The plan sets, for each chapter, its scope and the distribution of its material across the three depths. The buttons and the top bar display the totals that the pagination computes at assembly for each of the nine readings, which are the real figures of the delivered book.

**The book opens at the broad scope and the full depth**; the saved state then restores the reader's choices.

## What is delivered

Two files come out of this work:

- `book.html`: the page content alone, starting with `<title>`, intended for publication through the Artifact tool.
- `<Title>.html`: the same content wrapped in a complete document with `<!doctype html>`, `<meta charset="utf-8">` and `<meta name="viewport">`, intended for download and free hosting.

Both are produced by the same assembly script, in a single pass.

## Method

**One file per chapter.** Each chapter lives in its own HTML file, in a `chapters/` folder, named by its rank and its subject: `01-tree.html`, `02-heart.html`. This separation makes it possible to write, reread and rework a chapter without touching the others.

**A script assembles.** A Python script reads the chapters in order, inserts the part dividers, paginates the text for each of the nine readings, builds the table of contents, applies English typography and writes the two output files. Rerunning the script after each chapter revision is enough to regenerate the whole book.

**One screenshot is enough.** After assembly, one screenshot at 1440 wide and one at 390 show the rendering; adjustments are then made in a single pass.

## Writing with several hands

Chapters can be handed to subagents that write in parallel. The main AI then keeps responsibility for the unity of the book, from the first word to the last.

**A shared brief comes before the writing.** The main AI writes it in a file that each subagent reads in full before writing. In it, the main AI sets out the complete plan of the book, the intended reader, the tone, the rules of substance and form, the markup, the map of the subject with the scope of each chapter, the three depths and the expected word count for each.

**Basic terms are defined once**, at the place where the reader first meets them, at the lowest scope and depth level at which they appear, which makes them present in every reading that uses them; the following chapters use them directly, and each chapter opens on its own subject.

**A single-handed rereading follows the writing.** Before assembly, the main AI itself reads the whole book, chapter after chapter, in the reader's order. It gives the whole text a single voice. It grants each example and each quotation one main place, the one where they serve best, and brings them back elsewhere when that new place draws from them a light of its own that fully justifies their return. It rewrites the passages that restate what another chapter already carries, replacing them with new material. The book then reads as the work of a single author. Each chapter thus keeps its full substance.

## Chapter markup

Each chapter file contains a single `<section>`:

```html
<section class="chap" id="ch1" data-part="1">
<p class="chap-num"></p>
<h2>Chapter title</h2>
<p class="lede">Opening paragraph that announces what the chapter establishes.</p>
<p>Body text.</p>
<h3>Subheading</h3>
<p>Body text, with a <i>term in its original language</i> and a passage in <b>bold</b>.</p>
<figure class="verset"><p class="v">“Text of the quotation.”</p><p class="ref">Reference</p></figure>
</section>
```

The `data-part` attribute carries the part number and sets the chapter's accent color: `0` for the opening and the closing, `1`, `2`, `3` for the parts. The `data-a` attribute carries the scope from which a block or a chapter appears, following the section “Scope and depth”, and the `data-n` attribute carries the depth, following the section “Three reading depths”.

For a numbered chapter, `chap-num` stays empty: the stylesheet writes into it the word “Chapter” followed by the rank spelled out in words, counted over the chapters of the chosen reading, so that chapters follow one another without gaps in each of the nine readings; the table of contents numbers its entries the same way. The opening, the closing and the appendices, in `data-part="0"`, carry their own label written in `chap-num` and enter the table of contents in italics.

The `figure.verset` card holds any set-off quotation: verse, excerpt, definition, legal text. The text goes in italics between curly double quotes, the reference in bold in the accent color.

## Three reading depths

The same book reads at three depths, which the reader chooses with one click and changes whenever they like: **Abridged**, **Standard**, **Full**. The abridged is a condensed version that stands on its own, the standard is the book as one reads it, the full is the book with everything the author had to say. These three names hold for every book, whatever the subject.

**The three depths are cumulative.** Every block of the book carries its entry level in the `data-n` attribute: a block of level 1 is read in all three versions, a block of level 2 appears from the standard version onward, a block of level 3 belongs to the full version alone. A block without the attribute counts as 1. The abridged is therefore contained in the standard, which is contained in the full, and the reader who moves up a notch finds their text enlarged, identical in everything they had already read.

```html
<p>This paragraph is read in all three versions.</p>
<p data-n="2">The development, from the standard version onward.</p>
<figure class="verset" data-n="3"><p class="v">“The quotation that only the full version carries.”</p>
<p class="ref">Reference</p></figure>
```

The attribute goes on a paragraph, a subheading, a quotation card, and on a whole `<section>` when a chapter belongs only to the deeper versions; that chapter's table of contents entry then carries the same attribute and disappears with it.

**What each depth contains.** Level 1 stands alone: lede, the chapter's thesis, the quotation that grounds it, the conclusion. It reads in one sitting and gives the whole book in a third of the time. Level 2 brings the development: the example, the second quotation, the objection and its answer, the detail of vocabulary. Level 3 brings the rest: the digression, the technical note, the historical passage, the long quotation, the borderline case. Writing proceeds in this direction, from level 1 toward level 3, each notch fitting into a text that already stood.

**The control consists of two groups of three buttons**, scope then depth, each preceded by its monospace label, “Scope” and “Depth”. Both groups appear in two places: on the cover, where the reader chooses before starting, and at the head of the table of contents, where they change along the way. The instances answer one another, the choices living in two `body` classes (`a1`, `a2`, `a3` and `v1`, `v2`, `v3`). Each button carries its name and the page count of the reading it opens, the other choice staying as it is: the scope buttons give their pages at the chosen depth, the depth buttons at the chosen scope, and these figures update with every choice, which makes the choice concrete. The active button turns solid white, frame included. The scope buttons carry `data-amp` and the depth buttons `data-v`, which leaves `data-a` and `data-n` to the content alone.

Both choices are kept from one visit to the next, together with the state of the table of contents and the page reached, following the section “Saved state”. **Changing keeps the reader's place**: the current section is noted before the switch and brought back to the top of the screen after it, so that moving from the abridged to the full at chapter eleven leaves the reader at chapter eleven. When the new reading leaves out the current section, the reader lands on the nearest rendered section that precedes it.

## Text size

**The reader sets the text size with three buttons, A−, A, A+**, and the book keeps the setting from one visit to the next. The setting is a magnification factor, `--lvz`, set on the root element of the page; every reading-text size is written `calc(Npx * var(--lvz,1.25))` and therefore follows that factor in a single movement.

**Six steps lead from a tight text to an ample one**: 0.85, 0.925, 1, 1.08, 1.16, 1.25. **The book opens at the most ample step, 1.25**, which is its default size: the reader finds the most comfortable text straight away and tightens it as they wish. The A− button goes down one step, the A+ button goes up one step, the middle A button brings the book back to its default size. The button that reaches the end of the range fades, to 0.3 opacity with `pointer-events:none`: at opening, A+ thus stands back and tells the reader the text is at its largest.

**The reading text follows the factor, the page framework keeps its dimensions**: the body text, the lede, the cover subtitle, the text of quotation cards and the part introduction grow; the top bar, the table of contents, the monospace labels and the page numbers stay as they are, which keeps the page stable while the reading column breathes. Chapter and part titles, set with `clamp` on the screen width, keep their own scale.

**The reading column grows with the text**, its width being given in `em`: the measure stays the same, around seventy-five characters per line, at every step. The page-number column follows it through `--pgcol`, also written in `calc`.

**Pagination holds for every step.** Pages are counted in words at assembly: “p. 42” designates the same passage whether the reader reads small or large, which keeps the reference citable.

**The control appears in two places**, like the depth buttons: on the cover and at the head of the table of contents. Both instances carry the same class and answer the same handler, set on the document. The saved step enters the book's state under the key `taille` and comes back with it on the next visit.

```html
<div class="taille"><span class="lab">Text size</span>
  <span class="btns"><button type="button" data-tz="-1">A−</button>
  <button type="button" data-tz="0">A</button>
  <button type="button" data-tz="1">A+</button></span></div>
```

## The text touches both margins

**The reading text is justified and words break at the end of the line**: `text-align:justify` and `hyphens:auto` go together, as in a well-set printed book. Justification gives a clean right edge and spreads, as a little air between the words of the line, what would otherwise be a gap at the end of the line; hyphenation keeps that air in check, because it lets a line take the first half of a long word instead of stopping before it.

**Hyphenation appears as it is done in English**: the browser breaks the word at the right place according to its dictionary, sets the hyphen at the end of the line and resumes the rest of the word at the start of the next line. It requires the language to be declared on the text itself: `lang="en"` goes on `<main>`, on `<nav id="toc">` and on the top bar, so that the book keeps its language inside the document that hosts it, whatever that document's own language.

**The body text, the lede and the part introduction carry both rules.** Quotation cards, titles, the table of contents and labels stay flush left with `hyphens:none`: a short italic quotation and a two-word title keep their look with a free right edge and whole words.

## Fonts and spacing

**The reading text is set in two classic book faces**: EB Garamond for the body text, Cormorant Garamond for the titles. They give the text the hand of a printed book, and every book composed with this skill shares the same page, trait for trait.

**The reading measures are the skill's own**, exact to the decimal, at step 1 of the size setting: text at 20.5px, line height of 1.08, paragraphs spaced by 1.25em. The line height is that of a block: the lines of a single paragraph follow closely and form a single flow, which the eye runs through in one stroke, while the space between two paragraphs carries the articulation of the text and gives the reader their footholds. That space is the one that shows, and it alone.

**The spacing between letters and between words stays that of the font**, `letter-spacing:normal` and `word-spacing:normal`: justification alone makes the line breathe, by spreading between the words the air left at the end of the line.

**The reading column is 35em wide**, that is 720px at step 1 and 900px at the opening step: a line carries the same number of characters at every step, and hyphenation falls in the same places.

**The page framework keeps its own typography**: the top bar, the table of contents, the numbered labels, the subheadings and the page numbers stay in interface sans-serif and monospace, which preserves the contrast between the text being read and the machinery that carries it.

The fonts load at the head of the page:

```html
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;0,500;0,600;1,400;1,500&family=EB+Garamond:ital,wght@0,400;0,500;1,400;1,500&family=Inter:wght@400;500;600;700&family=JetBrains+Mono:wght@400;500&display=swap">
```

## Page numbers

The book is paginated at assembly, from the word count: **330 words make one page**, the measure of a printed book page. The number of a sentence therefore stays the same on a phone, on a wide screen and from one visit to the next, which makes it a citable reference: “p. 42” designates the same passage for everyone.

**Each reading has its own pagination**, like nine editions of one book: the pagination pass runs for each pair of scope and depth, over the blocks that the reading keeps, and each reading receives its markers, its total and its opening pages in the table of contents. A reading is named by a two-digit key, scope then depth: `13` for the core full, `21` for the broad abridged. A citation is therefore given with its reading: “Complete, Full, p. 90” and “Core, Abridged, p. 20” can designate the same passage.

**Each section opens a page**, as in a printed book: the opening, each part divider, each chapter, the epilogue and the appendices. The number of that first page goes on the section's `h2` title.

**Within a section, a page opens at the block that takes the count beyond 330 words.** The carrier blocks are paragraphs and subheadings. Quotation cards count their words and let the number land on the text block that follows them, which keeps the card whole, its cut-corner clipping covering its children.

The marker is a `<span>` inserted right after the opening tag of its block:

```html
<p><span class="pg pg11" id="pg11-9" data-pg="9">9</span><span class="pg pg33" id="pg33-42"
   data-pg="42">42</span>Paragraph text.</p>
```

A block that opens a page in several readings carries one marker per reading, the class `pgK` saying which reading the marker belongs to; the page script gives the class `on` to the markers of the active reading, and the stylesheet shows those. The id serves as an anchor: `#pg33-42` designates page 42 of the complete full.

**The marker sits in the right margin**, in a single column set by `--pgcol`, placed just beyond the 35em reading column, and its top aligns with the first line of the block. Below 1380px, where that margin goes back to the text, it returns to superscript before the first word, in the manner of a reference edition.

**Three places pick up the pagination**: the top bar displays the current page and the total, the table of contents carries on the right the opening page of each entry, and the buttons on the cover and in the table of contents announce the page count of each reading. These displays follow the reading: the table of contents entry keeps its nine values in `data-p`, separated by commas in the order of the keys 11, 12, 13, 21, 22, 23, 31, 32, 33, and the script draws on them at every choice.

**The top bar's number is a field**, and it is through it that the reader goes wherever they want: they type a page, confirm, and the book opens at that place, the number reached lighting up in white for a second and a half. The field shows the current page during scrolling and hands control to the reader as soon as they touch it, for the time of their input. A value beyond the book returns to its nearest page, the first or the last. On a narrow screen, confirming closes the table of contents, which leaves the page reached full and whole.

Pagination is written in the assembly script, after typography and before the files are written. The `<main>` tag carries its `lang` attribute, and the search for the main text recognizes it with its attributes through `<main[^>]*>`:

```python
import re, json
LIMIT = 330
BLOCK = re.compile(r'<figure\b.*?</figure>|<h2\b[^>]*>.*?</h2>'
                   r'|<h3\b[^>]*>.*?</h3>|<p\b[^>]*>.*?</p>', re.S)
SEC   = re.compile(r'<section\b[^>]*>.*?</section>', re.S)
OPEN  = re.compile(r'<(?:p|h2|h3)\b[^>]*>')
ENT_NBSP = '&' 'nbsp;'   # the no-break space entity, written in two pieces

def mots(html):
    t = re.sub(r'<[^>]+>', ' ', html).replace(ENT_NBSP, ' ')
    return len([w for w in re.split(r'[\s  ]+', t)
                if re.search(r'[0-9A-Za-zÀ-ÿ]', w)])

def niveau(blk, attr):
    m = re.search(r'data-%s="(\d)"' % attr, blk[:blk.index('>')])
    return int(m.group(1)) if m else 1

def retenu(blk, a, v):
    return niveau(blk, 'a') <= a and niveau(blk, 'n') <= v

def paginer(page_html, a, v):
    """Returns the markers of reading (a, v), its opening pages and its total."""
    main = re.search(r'<main[^>]*>.*?</main>', page_html, re.S)
    marques, depart, page = [], {}, 0
    for ms in SEC.finditer(main.group(0)):
        sec, off = ms.group(0), main.start() + ms.start()
        if 'class="cover"' in sec or not retenu(sec, a, v):
            continue
        page += 1
        depart[re.search(r'id="([^"]+)"', sec).group(1)] = page
        compte, report, premier = 0, False, True
        for mb in BLOCK.finditer(sec):
            blk = mb.group(0)
            if not retenu(blk, a, v):
                continue
            porteur = blk.startswith(('<p', '<h2', '<h3'))
            n = mots(blk)
            if premier and blk.startswith('<h2'):
                marques.append((off + mb.start() + OPEN.match(blk).end(), page))
                premier, compte = False, n
                continue
            if porteur and (report or (compte and compte + n > LIMIT)):
                page += 1
                compte, report = 0, False
                marques.append((off + mb.start() + OPEN.match(blk).end(), page))
            elif not porteur and compte + n > LIMIT:
                report = True
            compte += n
    return marques, depart, page

CLES = ['%d%d' % (a, v) for a in (1, 2, 3) for v in (1, 2, 3)]
marques, depart, total = {}, {}, {}
for k in CLES:
    marques[k], depart[k], total[k] = paginer(page, int(k[0]), int(k[1]))

toutes = [(pos, k, pg) for k in CLES for pos, pg in marques[k]]
for pos, k, pg in sorted(toutes, reverse=True):
    marque = '<span class="pg pg%s" id="pg%s-%d" data-pg="%d">%d</span>' % (k, k, pg, pg, pg)
    page = page[:pos] + marque + page[pos:]

def pages_entree(ident):
    return ','.join(str(depart[k].get(ident, '')) for k in CLES)

page = page.replace('{TOT}', json.dumps(total))
```

The nine totals form the `TOT` table of the page script, which the assembly script writes as JSON in place of the `{TOT}` placeholder; the page script draws from it the figures on the buttons and the total in the top bar. The tables of starting pages feed the table of contents: each entry, part, chapter, opening or appendix, receives `<span class="tp" data-p="…"></span>` inside its link, just before it closes, which aligns it to the right of the line, the value coming from `pages_entree` with the id of its section, and a reading that leaves the entry out keeps its place empty in the list.

## Holding up on a phone

The layout follows a breakpoint at 980px, and the page marker follows a second one at 1380px: it keeps the right margin as long as that margin exists, and returns to superscript before the first word below it, where the text fills the whole width.

**Everything that is touched measures 44px high below 980px**: the page field, the “Contents” button and each table of contents entry, which thus gains a line comfortable for the thumb. The scope and depth buttons rise to 52px, the height their two lines call for, name and page count.

**The page field goes to 16px below 980px.** That is the size at which Safari on iPhone opens the keyboard while leaving the page at its scale. The “p.” and the total keep their gray 10px, so that the live number stands out as the only value the reader handles. The `inputmode="numeric"` attribute opens the number keyboard directly, and confirming closes the table of contents drawer.

**Two general rules hold the rest**: `html` receives `-webkit-text-size-adjust:100%` and `text-size-adjust:100%`, which keeps text sizes stable when rotating to landscape, and links, buttons and fields receive `-webkit-tap-highlight-color:transparent`, which leaves the page in charge of its own visual feedback on tap.

## Saved state

**The book reopens where the reader left it**: their scope, their reading depth, the text size, the table of contents collapsed or expanded, and the chapter where they were reading. These five things form the book's state, and that state comes back at every visit.

**Two keepers hold it, and the book serves both at every change.** The browser's local storage keeps the state when the book is opened directly, as a file or as a page. The host page keeps it when the book sits in an isolated frame: there, local storage belongs to the page, and the frame addresses it by message. Both writes happen inside a `try` and the book goes on its way with whatever it obtains.

**Shape of the state**, read and written as JSON on both sides:

```js
{v:1, ampleur:"2", epaisseur:"3", taille:1.25, sommaire:1, section:"ch7"}
```

`v` carries the shape number, `ampleur` the chosen scope, `epaisseur` the chosen depth, `taille` the saved step, which a step absent from the table brings back to the opening size, `sommaire` equal to 1 for a collapsed table of contents, and `section` the id of the section being read, the very one the table of contents highlights. The local storage key is `'livre-etat-'` followed by a book identifier, declared once at the head of the script.

**The state goes to both keepers at every change.** A choice of scope or depth, a change of step, collapsing or expanding the table of contents go out at once, within the gesture itself. Progress through the text goes out after a 250 ms delay, which reduces continuous scrolling to one write per pause. It also goes out when the page is hidden or left, on `visibilitychange` to the hidden state and on `pagehide`. Toward the host page, the sending is written `parent.postMessage({lvEtat:etat},'*')`, and it takes place when the book actually sits in a frame, which the comparison `parent!==window` establishes: opened alone in a tab, the book is its own host page, and local storage is enough for it.

**At the very first moment of the script, the book reads local storage and asks the host page for its state** through `parent.postMessage({lvEtatVoulu:1},'*')`, the request also going out under the condition `parent!==window`. The page answers with a `{lvEtat:etat}` message, and it may repeat it several times during setup. The book welcomes the messages that come from its parent and applies the received state at each arrival, until the reader's first gesture: each arrival restarts the restore from its beginning, and the page's state, keeper of the framed mode, becomes the book's. From the first gesture onward, the reader leads their reading, and the book keeps its current state.

**Application follows the order of dependencies**: the text size first, which governs the width of the column and the height of each block; the scope and the depth next, which govern what the book displays and therefore the place of each thing; the state of the table of contents, which governs the width of the reading column; the section last, brought back to the top of the screen. The progress bar, the page in the top bar and the highlight in the table of contents are recomputed right after.

**The restore repeats while the content settles**, at 150 ms, 500 ms and 1200 ms: fonts and images settle after the first frames, and each pass leaves exactly the same result. The reader's first gesture, wheel, finger, key or click, closes the restore and makes their gesture the current state. The book first builds itself in its opening reading, then applies the saved state on top.

## Accent colors

**The palette is composed subject by subject, one color per major part.** It is chosen when the book is designed, according to what it is about: the matter of the subject, its period, its climate, the imagery proper to it.

The composition follows four rules:

- **Each part receives a vivid, saturated hue**, bold on a black background, with enough lightness for small monospace text to stay readable.
- **The hues are clearly distinct from one another**: each occupies a distinct region of the color wheel, so that the reader recognizes at a glance which part they are in.
- **The number of hues follows the number of parts**, from two to five; beyond that, the major sections carry the color and their subparts share it.
- **The opening, the closing and the appendices keep the neutral off-white**, which sets them apart from the numbered parts.

The chosen palette is declared once, in the `:root` block of the stylesheet, under the names `--a1`, `--a2`, `--a3`: the part divider, the chapters, the table of contents and the cover gradient then draw on it by themselves.

## Typography

The script applies English typography to the text located outside tags, outside `<style>` and `<script>` blocks: curly apostrophe ’, curly double quotes “ ” with single quotes ‘ ’ inside them, no space before : ; ! ?. A quotation mark opens after a space, the start of a block or an opening bracket or dash, and closes everywhere else; the character that precedes each stretch of text carries over from the previous stretch, and a block tag starts afresh. HTML entities, which end with a semicolon, are set aside for the duration of the pass and take back their form afterward.

```python
NBSP = ' '   # no-break space

ENTITE = re.compile(r'&(#?\w+);')   # HTML entities, &amp; &lt; &#8217;…

def typo_text(t, avant=' '):
    t = t.replace(ENT_NBSP, NBSP)
    t = ENTITE.sub(lambda m: '\x00' + m.group(1) + '\x01', t)
    t = avant + t
    t = re.sub(r'(?<=[\s(\[—–])"', '“', t)
    t = t.replace('"', '”')
    t = re.sub(r"(?<=[\s(\[“—–])'", '‘', t)
    t = t.replace("'", '’')
    t = re.sub(r'[   ]+([:;!?])', r'\1', t[1:])
    return t.replace('\x00', '&').replace('\x01', ';')

BLOC = re.compile(r'</?(?:p|h\d|figure|li|section|div|header|nav|main|br)\b')

def typo_html(s):
    out, i, avant = [], 0, ' '
    for m in re.finditer(r'<[^>]+>', s):
        seg = typo_text(s[i:m.start()], avant)
        out.append(seg); out.append(m.group(0)); i = m.end()
        if seg: avant = seg[-1]
        if BLOC.match(m.group(0)): avant = ' '
    out.append(typo_text(s[i:], avant))
    return ''.join(out)
```

The `<style>` and `<script>` blocks are set aside before this pass and put back afterward:

```python
_stash = []
def _keep(m):
    _stash.append(m.group(0)); return f'@@KEEP{len(_stash)-1}@@'
page = re.sub(r'<style>.*?</style>|<script>.*?</script>', _keep, page, flags=re.S)
page = typo_html(page)
page = re.sub(r'@@KEEP(\d+)@@', lambda m: _stash[int(m.group(1))], page)
```

## Page template

The page opens with the title and the fonts, then the stylesheet, then the structure. The page carries `lang="en"`:

```html
<title>Book title</title>
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;0,500;0,600;1,400;1,500&family=EB+Garamond:ital,wght@0,400;0,500;1,400;1,500&family=Inter:wght@400;500;600;700&family=JetBrains+Mono:wght@400;500&display=swap">
<style>/* stylesheet below */</style>

<header class="topbar" lang="en">
  <span class="brand"><b>Title</b>  ·  short subtitle</span>
  <span class="pgnow" id="pgnow">p. <input class="pgin" id="pgin" type="text"
    inputmode="numeric" value="1" aria-label="Go to page"> / <span id="pgtot"></span></span>
  <button class="tocbtn" id="tocbtn" aria-controls="toc" aria-expanded="true">Contents</button>
</header>
<div class="bar"><i></i></div>
<div class="tocmask"></div>

<nav id="toc" lang="en">
  <div class="taille"><!-- the same three size buttons --></div>
  <p class="lab-choix">Scope</p>
  <div class="vers amp"><!-- the same three scope buttons --></div>
  <p class="lab-choix">Depth</p>
  <div class="vers"><!-- the same three depth buttons --></div>
  <ul><!-- table of contents entries --></ul>
</nav>

<main lang="en">
  <section class="cover" id="couverture">
    <p class="eyebrow">A book</p>
    <h1>Book title</h1>
    <p class="sub">One sentence that says what the book contains.</p>
    <div class="rule"></div>
    <p class="lab-choix">Scope</p>
    <div class="vers amp">
      <span data-amp="1" tabindex="0" role="button">Core<b></b></span>
      <span data-amp="2" tabindex="0" role="button">Broad<b></b></span>
      <span data-amp="3" tabindex="0" role="button">Complete<b></b></span>
    </div>
    <p class="lab-choix">Depth</p>
    <div class="vers">
      <span data-v="1" tabindex="0" role="button">Abridged<b></b></span>
      <span data-v="2" tabindex="0" role="button">Standard<b></b></span>
      <span data-v="3" tabindex="0" role="button">Full<b></b></span>
    </div>
    <div class="taille"><span class="lab">Text size</span>
      <span class="btns"><button type="button" data-tz="-1">A−</button>
      <button type="button" data-tz="0">A</button>
      <button type="button" data-tz="1">A+</button></span></div>
  </section>
  <!-- part dividers and chapters -->
</main>

<script>/* script below */</script>
```

The part divider:

```html
<section class="partsep" id="p1">
  <p class="part-kicker">Part One</p>
  <h2 class="part-title">Part title</h2>
  <div class="sep"></div>
  <p class="part-blurb">What this part covers, in one or two sentences.</p>
</section>
```

The table of contents entries:

```html
<li class="toc-part tp1"><a href="#p1"><span>Part title</span><span class="tp" data-p="2,2,2,2,3,3,2,3,3"></span></a></li>
<li class="toc-chap" data-id="ch1"><a href="#ch1"><span class="tn"></span><span>Title</span><span class="tp" data-p="3,3,3,3,4,4,3,4,4"></span></a></li>
<li class="toc-front" data-id="ouverture"><a href="#ouverture"><span>Title</span><span class="tp" data-p="1,1,1,1,1,1,1,1,1"></span></a></li>
<li class="toc-chap" data-id="ch7" data-n="3"><a href="#ch7"><span class="tn"></span><span>Chapter of the full version only</span><span class="tp" data-p=",,61,,,70,,,82"></span></a></li>
<li class="toc-chap" data-id="ch9" data-a="2"><a href="#ch9"><span class="tn"></span><span>Chapter of a neighboring domain</span><span class="tp" data-p=",,,40,52,75,40,52,90"></span></a></li>
```

## Stylesheet

```css
:root{
  --bg:#0a0a0a; --card:#000; --line:rgba(255,255,255,.16);
  --ink:#dcdcdc; --dim:#8a8a8a; --hi:#ffffff;
  --a:#f2f2f2;
  --a1:<color of the first part>;
  --a2:<color of the second part>;
  --a3:<color of the third part>;
  --pgcol:calc(739px*var(--lvz,1.25));
  --cut:polygon(0 0, calc(100% - 18px) 0, 100% 18px, 100% 100%, 0 100%);
  --serif:"EB Garamond",Georgia,serif;
  --display:"Cormorant Garamond","EB Garamond",Georgia,serif;
  --sans:"Inter","Helvetica Neue",Helvetica,Arial,"Segoe UI",system-ui,sans-serif;
  --mono:"JetBrains Mono","SFMono-Regular",Menlo,Consolas,"Liberation Mono",monospace;
  color-scheme:dark;
}
html{-webkit-text-size-adjust:100%;text-size-adjust:100%}
a,button,input{-webkit-tap-highlight-color:transparent}
*{box-sizing:border-box}
body{margin:0;background:var(--bg);color:var(--ink);font-family:var(--serif);
  font-size:calc(20.5px*var(--lvz,1.25));line-height:1.08;letter-spacing:normal;word-spacing:normal;
  -webkit-font-smoothing:antialiased;text-rendering:optimizeLegibility}

.topbar{position:fixed;top:0;left:0;right:0;height:52px;z-index:60;
  background:rgba(10,10,10,.86);backdrop-filter:blur(14px);
  border-bottom:1px solid var(--line);display:flex;align-items:center;gap:14px;padding:0 16px}
.topbar .brand{font-family:var(--mono);font-size:11px;letter-spacing:.22em;
  text-transform:uppercase;color:var(--dim);white-space:nowrap;overflow:hidden;text-overflow:ellipsis}
.topbar .brand b{color:var(--hi);font-weight:600}
.pgnow{margin-left:auto;flex:none;font-family:var(--mono);font-size:10px;letter-spacing:.18em;
  text-transform:uppercase;color:#5a5a5a;white-space:nowrap;display:flex;align-items:center;gap:3px}
.pgin{width:5ch;background:transparent;color:var(--hi);font-family:inherit;font-size:inherit;
  font-weight:600;letter-spacing:.08em;text-align:center;border:0;border-bottom:1px solid var(--line);
  padding:3px 0;border-radius:0;-webkit-appearance:none;appearance:none}
.pgin:hover{border-bottom-color:var(--dim)}
.pgin:focus{outline:none;border-bottom-color:var(--hi)}
.tocbtn{margin-left:14px;flex:none;background:transparent;color:var(--ink);
  border:1px solid var(--line);font-family:var(--mono);font-size:10px;letter-spacing:.18em;
  text-transform:uppercase;padding:7px 12px;cursor:pointer;border-radius:2px}
.tocbtn:hover{border-color:var(--a);color:var(--a)}
.bar{position:fixed;top:52px;left:0;right:0;height:2px;z-index:61;background:transparent}
.bar i{display:block;height:100%;width:0;background:var(--a);transition:width .1s linear}

#toc{position:fixed;top:54px;bottom:0;left:0;width:286px;z-index:55;overflow-y:auto;
  padding:26px 18px 60px;border-right:1px solid var(--line);background:var(--bg);
  transition:transform .28s ease}
body.tochid #toc{transform:translateX(-100%)}
#toc ul{list-style:none;margin:0;padding:0}
#toc li{margin:0}
#toc a{display:flex;gap:10px;text-decoration:none;color:var(--dim);padding:7px 10px;
  font-family:var(--sans);font-size:13.5px;line-height:1.45;border-left:1px solid transparent}
#toc a:hover{color:var(--hi)}
.toc-part{margin:26px 0 8px}
#toc .toc-part a{font-family:var(--mono);font-size:10.5px;letter-spacing:.2em;
  text-transform:uppercase;color:var(--a);padding-left:10px}
.tp1{--a:var(--a1)}.tp2{--a:var(--a2)}.tp3{--a:var(--a3)}
.toc-front a{font-style:italic}
.tn{font-family:var(--mono);font-size:10.5px;color:#4d4d4d;padding-top:3px;flex:none}
.tp{margin-left:auto;flex:none;font-family:var(--mono);font-size:10px;color:#4d4d4d;padding-top:4px}
#toc li.on .tp{color:var(--a)}
#toc .toc-part a .tp{padding-top:1px}
#toc li.on>a{color:var(--hi);border-left-color:var(--a)}
#toc li.on .tn{color:var(--a)}
.tocmask{display:none}
#toc ul{counter-reset:tch}
#toc li.toc-chap{counter-increment:tch}
#toc li.toc-chap .tn::before{content:counter(tch,decimal-leading-zero)}

main{margin-left:286px;padding:52px 0 0;transition:margin-left .28s ease;counter-reset:chap}
body.tochid main{margin-left:0}
section.chap,section.partsep,section.cover{padding-left:28px;padding-right:28px;
  max-width:calc(776px*var(--lvz,1.25));margin:0 auto}

.cover{padding-top:92px;padding-bottom:36px;text-align:left}
.cover .eyebrow{font-family:var(--mono);font-size:10.5px;letter-spacing:.28em;
  text-transform:uppercase;color:var(--dim);margin:0 0 26px}
.cover h1{font-family:var(--display);font-size:clamp(46px,9vw,92px);line-height:1;margin:0;
  letter-spacing:.005em;font-weight:400;color:var(--hi);text-wrap:balance}
.cover h1,.part-title,.chap h2,.chap h3,#toc a,figure.verset{hyphens:none;-webkit-hyphens:none}
.cover .sub{font-size:calc(22px*var(--lvz,1.25));color:var(--dim);margin:22px 0 0;max-width:30em;line-height:1.3}
.cover .rule{height:1px;margin:40px 0 26px;
  background:linear-gradient(90deg,var(--a1),var(--a2) 50%,var(--a3),transparent)}
.partsep{padding-top:104px;padding-bottom:26px}
.partsep[id="p1"]{--a:var(--a1)}
.partsep[id="p2"]{--a:var(--a2)}
.partsep[id="p3"]{--a:var(--a3)}
.part-kicker{font-family:var(--mono);font-size:10.5px;letter-spacing:.26em;
  text-transform:uppercase;color:var(--a);margin:0 0 14px}
.part-title{font-family:var(--display);font-size:clamp(34px,6vw,54px);line-height:1.06;margin:0;
  letter-spacing:.005em;font-weight:400;color:var(--hi)}
.sep{height:1px;margin:26px 0 20px;
  background:linear-gradient(90deg,var(--a),rgba(255,255,255,.06) 60%,transparent)}
.part-blurb{color:var(--dim);font-size:calc(19px*var(--lvz,1.25));line-height:1.2;max-width:36em;margin:0;
  text-align:justify;hyphens:auto;-webkit-hyphens:auto}

.chap{padding-top:86px;padding-bottom:14px;scroll-margin-top:70px}
.chap[data-part="1"]{--a:var(--a1)}
.chap[data-part="2"]{--a:var(--a2)}
.chap[data-part="3"]{--a:var(--a3)}
.chap[data-part="0"]{--a:#f2f2f2}
.chap .chap-num{display:inline-flex;align-items:center;gap:10px;margin:0 0 20px;max-width:none;
  font-family:var(--mono);text-align:left;font-size:10px;letter-spacing:.22em;text-transform:uppercase;
  color:var(--a);border:1px solid var(--a);padding:6px 12px;border-radius:2px;line-height:1}
.chap-num .n{color:var(--hi);opacity:.55}
@counter-style en-mots{system:fixed;fallback:decimal;
  symbols:"one" "two" "three" "four" "five" "six" "seven" "eight" "nine" "ten" "eleven" "twelve" "thirteen"
  "fourteen" "fifteen" "sixteen" "seventeen" "eighteen" "nineteen" "twenty" "twenty-one" "twenty-two"
  "twenty-three" "twenty-four" "twenty-five" "twenty-six" "twenty-seven" "twenty-eight" "twenty-nine" "thirty"
  "thirty-one" "thirty-two" "thirty-three" "thirty-four" "thirty-five" "thirty-six" "thirty-seven"
  "thirty-eight" "thirty-nine" "forty"}
section.chap:not([data-part="0"]){counter-increment:chap}
section.chap:not([data-part="0"]) .chap-num::before{content:"Chapter " counter(chap,en-mots)}
.chap h2{font-family:var(--display);font-size:clamp(30px,5vw,44px);line-height:1.12;margin:0 0 26px;
  letter-spacing:.005em;font-weight:400;color:var(--hi);max-width:16em;text-wrap:balance}
.chap h3{font-size:13px;font-family:var(--mono);letter-spacing:.18em;text-transform:uppercase;
  color:var(--a);margin:52px 0 18px;font-weight:500;padding-bottom:12px;
  border-bottom:1px solid var(--line)}
.chap .lede{font-size:calc(22px*var(--lvz,1.25));line-height:1.2;color:#b6b6b6;margin:0 0 34px;max-width:33em;
  border-left:2px solid var(--a);padding-left:20px;text-align:justify;hyphens:auto;-webkit-hyphens:auto}
.chap>p{margin:0 0 1.25em;max-width:35em;text-indent:0;
  text-align:justify;hyphens:auto;-webkit-hyphens:auto}
.chap p b{color:var(--hi);font-weight:600}
.chap i{color:#efefef;font-style:italic}

.pg{position:absolute;left:var(--pgcol);top:.55em;scroll-margin-top:92px;font-family:var(--mono);
  font-size:10.5px;letter-spacing:.1em;color:#4d4d4d;font-weight:500;
  -webkit-user-select:none;user-select:none}
main p,main h2,main h3{position:relative}
main h2 .pg{top:1.15em}
.pg.hit{color:var(--hi)}
body.v1 [data-n="2"],body.v1 [data-n="3"],body.v2 [data-n="3"],
body.a1 [data-a="2"],body.a1 [data-a="3"],body.a2 [data-a="3"]{display:none}
.pg:not(.on){display:none}

.taille{display:flex;align-items:center;justify-content:space-between;gap:10px;margin:0 0 20px;
  padding-bottom:18px;border-bottom:1px solid var(--line);-webkit-user-select:none;user-select:none}
.taille .lab{font-family:var(--mono);font-size:9.5px;letter-spacing:.16em;text-transform:uppercase;
  color:var(--dim);white-space:nowrap}
.taille .btns{display:flex;gap:6px;flex:none}
.taille button{background:transparent;border:1px solid var(--line);color:var(--ink);
  font-family:var(--display);font-size:13px;line-height:1;min-width:38px;padding:8px 9px;cursor:pointer;
  border-radius:2px;transition:border-color .25s,color .25s}
.taille button:hover,.taille button:focus-visible{border-color:var(--hi);color:var(--hi)}
.taille button.bout{opacity:.3;pointer-events:none}
.cover .taille{max-width:430px;margin:8px auto 26px}

.lab-choix{font-family:var(--mono);font-size:9.5px;letter-spacing:.16em;text-transform:uppercase;
  color:var(--dim);margin:0 0 8px}
.vers{display:flex;margin:0 0 22px;-webkit-user-select:none;user-select:none}
.vers span{flex:1;display:flex;flex-direction:column;align-items:center;gap:3px;cursor:pointer;
  font-family:var(--mono);font-size:9.5px;letter-spacing:.16em;text-transform:uppercase;
  color:var(--dim);border:1px solid var(--line);margin-left:-1px;padding:9px 4px;text-align:center}
.vers span:first-child{margin-left:0}
.vers span b{font-weight:400;font-size:9px;letter-spacing:.08em;color:#4d4d4d}
.vers span:hover{color:var(--hi)}
.vers span.on{color:var(--hi);border-color:var(--hi);position:relative;z-index:1}
.vers span.on b{color:var(--dim)}
.cover .lab-choix{max-width:430px;margin:0 auto 8px}
.cover .vers{max-width:430px;margin:0 auto 22px}

figure.verset{position:relative;margin:30px 0;padding:0;max-width:36em;
  background:var(--line);clip-path:var(--cut)}
figure.verset::before{content:"";position:absolute;inset:1px;background:var(--card);
  clip-path:var(--cut)}
figure.verset>p{position:relative;margin:0}
figure.verset .v{padding:24px 26px 14px;font-style:italic;font-size:calc(19px*var(--lvz,1.25));
  line-height:1.3;color:#e8e8e8;text-align:left}
figure.verset .ref{padding:0 26px 22px;font-weight:700;font-size:12px;font-family:var(--mono);
  letter-spacing:.12em;text-transform:uppercase;color:var(--a)}

a:focus-visible,button:focus-visible{outline:2px solid var(--a);outline-offset:3px}
@media (prefers-reduced-motion:reduce){*{transition:none !important;scroll-behavior:auto !important}}

@media (max-width:1380px){
  .pg{position:static;display:inline-block;margin-right:.5em;vertical-align:.4em;
      font-size:10px;color:#5f5f5f}
  .lede .pg,.chap h2 .pg,.part-title .pg{vertical-align:.6em}
}
@media (max-width:980px){
  .taille button{min-height:44px;min-width:44px}
  .pgnow{gap:5px}
  .pgin{font-size:16px;letter-spacing:0;width:4ch;min-height:44px;padding:0}
  .tocbtn{min-height:44px;display:inline-flex;align-items:center;padding:0 12px}
  #toc a{min-height:44px;align-items:center;padding:8px 12px}
  .vers span{min-height:52px;justify-content:center;font-size:10px}
  main{margin-left:0}
  #toc,body.tochid #toc{transform:translateX(-100%);width:min(300px,86vw);
    border-right:1px solid var(--line);box-shadow:0 0 60px rgba(0,0,0,.8)}
  body.tocopen #toc{transform:none}
  .tocmask{display:block;position:fixed;inset:52px 0 0;z-index:54;background:rgba(0,0,0,.6);
    opacity:0;pointer-events:none;transition:opacity .26s}
  body.tocopen .tocmask{opacity:1;pointer-events:auto}
  section.chap,section.partsep,section.cover{padding-left:20px;padding-right:20px}
  .cover{padding-top:64px;padding-bottom:36px}
  .chap>p,.chap .lede,figure.verset,.part-blurb,.chap h2{max-width:none}
  figure.verset .v{padding:20px 20px 12px;font-size:calc(18.5px*var(--lvz,1.25))}
  figure.verset .ref{padding:0 20px 18px}
}
@media (max-width:520px){
  .chap .lede{padding-left:16px;font-size:calc(20.5px*var(--lvz,1.25))}
}
```

## Page script

The scope and depth buttons govern the reading, save it and give the reader back the place they occupied. The three buttons A−, A, A+ govern the text size factor and save it in the same way. The “Contents” button collapses the table of contents to the left on a wide screen and opens it as a drawer on a narrow screen. The scope, the depth, the text size, the state of the table of contents and the current section form the book's state, entrusted to the two keepers following the section “Saved state”. The progress bar follows the advance through the book, the table of contents highlights the current chapter, and the top bar displays the current page, taken from the last marker that has passed under the top of the window. The highlighted entry stays visible in its column through a direct setting of `toc.scrollTop`, which scrolls the table of contents alone and leaves the reading page to the reader.

```js
(function(){
  var b=document.body, btn=document.getElementById('tocbtn'),
      mask=document.querySelector('.tocmask'), toc=document.getElementById('toc'),
      bar=document.querySelector('.bar i'), CLE='livre-etat-<book identifier>';
  var wide=function(){return innerWidth>980;};

  function sync(){
    var hid = wide() ? b.classList.contains('tochid') : !b.classList.contains('tocopen');
    btn.setAttribute('aria-expanded', hid?'false':'true');
  }
  function close(){b.classList.remove('tocopen');sync();}
  btn.addEventListener('click',function(){
    if(wide()) b.classList.toggle('tochid'); else b.classList.toggle('tocopen');
    sync(); ditEtat();
  });
  mask.addEventListener('click',close);
  toc.addEventListener('click',function(e){ if(e.target.closest('a') && !wide()) close(); });
  sync();

  var TZ=[.85,.925,1,1.08,1.16,1.25], TZD=TZ[TZ.length-1], tz=TZD;
  function taille(v){
    tz=v; document.documentElement.style.setProperty('--lvz',v);
    var i=TZ.indexOf(v);
    [].forEach.call(document.querySelectorAll('[data-tz]'),function(t){
      var d=t.getAttribute('data-tz');
      t.classList.toggle('bout',(d==='-1'&&i===0)||(d==='1'&&i===TZ.length-1));
    });
  }
  taille(TZD);
  document.addEventListener('click',function(e){
    var t=e.target.closest?e.target.closest('[data-tz]'):null;
    if(!t) return;
    var d=t.getAttribute('data-tz'), v=TZD;
    if(d!=='0'){
      var i=TZ.indexOf(tz); if(i<0) i=TZ.length-1;
      i=Math.max(0,Math.min(TZ.length-1,i+(d==='1'?1:-1))); v=TZ[i];
    }
    taille(v); onScroll(); ditEtat();
  });

  var pgin=document.getElementById('pgin'), pgtot=document.getElementById('pgtot'),
      TOT={TOT}, amp='2', niv='3', pgs=[], nbpg=0,
      doux=!matchMedia('(prefers-reduced-motion:reduce)').matches;
  function section(){
    var secs=[].slice.call(document.querySelectorAll('main section')), id='';
    for(var i=0;i<secs.length;i++){
      if(secs[i].offsetParent!==null && secs[i].getBoundingClientRect().top<=120) id=secs[i].id;
    }
    return id;
  }
  function cle(){ return amp+niv; }
  function vue(a,v,garder){
    var ancre=garder?section():'';
    amp=String(a); niv=String(v);
    b.classList.remove('a1','a2','a3','v1','v2','v3');
    b.classList.add('a'+amp,'v'+niv);
    [].forEach.call(document.querySelectorAll('.vers span[data-amp]'),function(sp){
      var x=sp.getAttribute('data-amp');
      sp.classList.toggle('on',x===amp);
      sp.querySelector('b').textContent=TOT[x+niv]+' p.';
    });
    [].forEach.call(document.querySelectorAll('.vers span[data-v]'),function(sp){
      var x=sp.getAttribute('data-v');
      sp.classList.toggle('on',x===niv);
      sp.querySelector('b').textContent=TOT[amp+x]+' p.';
    });
    var k=(+amp-1)*3+(+niv-1);
    [].forEach.call(document.querySelectorAll('.tp'),function(t){
      t.textContent=(t.getAttribute('data-p')||'').split(',')[k]||'';
    });
    [].forEach.call(document.querySelectorAll('.pg'),function(p){
      p.classList.toggle('on',p.classList.contains('pg'+cle()));
    });
    pgs=[].slice.call(document.querySelectorAll('.pg.pg'+cle())); nbpg=TOT[cle()];
    if(pgtot) pgtot.textContent=nbpg;
    if(ancre){
      var secs=[].slice.call(document.querySelectorAll('main section')), i=0;
      while(i<secs.length && secs[i].id!==ancre) i++;
      while(i>0 && (i>=secs.length || secs[i].offsetParent===null)) i--;
      if(secs[i]) secs[i].scrollIntoView({block:'start'});
    }
    onScroll();
  }
  function choix(sp){
    if(sp.hasAttribute('data-amp')) vue(sp.getAttribute('data-amp'),niv,true);
    else vue(amp,sp.getAttribute('data-v'),true);
    ditEtat();
  }
  document.addEventListener('click',function(e){
    var sp=e.target.closest('.vers span');
    if(sp) choix(sp);
  });
  document.addEventListener('keydown',function(e){
    if(e.key!=='Enter'&&e.key!==' ') return;
    var sp=e.target.closest&&e.target.closest('.vers span');
    if(sp){ e.preventDefault(); choix(sp); }
  });
  function aller(n){
    n=Math.max(1,Math.min(nbpg,parseInt(n,10)||1));
    var el=document.getElementById('pg'+cle()+'-'+n);
    if(el){
      el.scrollIntoView({block:'start',behavior:doux?'smooth':'auto'});
      el.classList.add('hit');
      setTimeout(function(){el.classList.remove('hit');},1600);
      if(!wide()) close();
    }
    return n;
  }
  if(pgin){
    pgin.addEventListener('focus',function(){pgin.select();});
    pgin.addEventListener('keydown',function(e){
      if(e.key==='Enter'){e.preventDefault();pgin.value=aller(pgin.value);pgin.blur();}
      if(e.key==='Escape'){pgin.blur();}
    });
    pgin.addEventListener('change',function(){pgin.value=aller(pgin.value);});
    pgin.addEventListener('blur',function(){onScroll();});
  }
  var items=[].slice.call(toc.querySelectorAll('li[data-id]'));
  var targets=items.map(function(li){return document.getElementById(li.dataset.id);});

  function onScroll(){
    var h=document.documentElement.scrollHeight-innerHeight;
    bar.style.width=(h>0?(scrollY/h*100):0)+'%';
    var cur=0;
    for(var i=0;i<targets.length;i++){
      if(targets[i] && targets[i].offsetParent!==null && targets[i].getBoundingClientRect().top<=120) cur=i;
    }
    items.forEach(function(li,i){li.classList.toggle('on',i===cur);});
    if(pgin&&nbpg&&document.activeElement!==pgin){
      var p=pgs.length?pgs[0].getAttribute('data-pg'):'1';
      for(var k=0;k<pgs.length;k++){
        if(pgs[k].getBoundingClientRect().top<=120) p=pgs[k].getAttribute('data-pg'); else break;
      }
      if(pgin.value!==p) pgin.value=p;
    }
    var on=items[cur];
    if(on && wide() && !b.classList.contains('tochid')){
      var r=on.getBoundingClientRect(), t=toc.getBoundingClientRect();
      if(r.top<t.top+40||r.bottom>t.bottom-40)
        toc.scrollTop += (r.top+r.height/2)-(t.top+t.height/2);
    }
  }

  /* ── SAVED STATE: local storage when the book is opened directly,
        the host page when it sits in an isolated frame ── */
  var etatPlan=0, reprises=[], touche=false;
  function etat(){
    return {v:1, ampleur:amp, epaisseur:niv, taille:tz,
            sommaire:b.classList.contains('tochid')?1:0, section:section()};
  }
  function ditEtat(){
    clearTimeout(etatPlan); etatPlan=0;
    var e=etat();
    try{ localStorage.setItem(CLE, JSON.stringify(e)); }catch(_){}
    try{ if(parent!==window) parent.postMessage({lvEtat:e},'*'); }catch(_){}
  }
  function planEtat(){ if(etatPlan) return; etatPlan=setTimeout(ditEtat,250); }
  function poseEtat(e){
    if(!e||e.v!==1) return;
    taille(TZ.indexOf(e.taille)<0?TZD:e.taille);
    vue(e.ampleur||amp, e.epaisseur||niv, false);
    b.classList.toggle('tochid', e.sommaire===1);
    sync();
    var el=e.section&&document.getElementById(e.section);
    if(el) el.scrollIntoView({block:'start'});
    onScroll();
  }
  function arrete(){ reprises.forEach(clearTimeout); reprises=[]; }
  function reprend(e){
    arrete(); poseEtat(e);
    reprises=[150,500,1200].map(function(t){ return setTimeout(function(){ poseEtat(e); },t); });
  }
  function cloture(){ touche=true; arrete(); }
  ['wheel','touchstart','keydown','pointerdown'].forEach(function(n){
    addEventListener(n,cloture,{passive:true,once:true});
  });
  addEventListener('message',function(ev){
    var d=ev.data;
    if(ev.source===parent && parent!==window && !touche && d && d.lvEtat) reprend(d.lvEtat);
  });
  var garde=null;
  try{ garde=JSON.parse(localStorage.getItem(CLE)||'null'); }catch(e){}
  vue(amp,niv,false);
  if(garde) reprend(garde);
  try{ if(parent!==window) parent.postMessage({lvEtatVoulu:1},'*'); }catch(e){}
  addEventListener('visibilitychange',function(){
    if(document.visibilityState==='hidden') ditEtat();
  });
  addEventListener('pagehide',ditEtat);
  addEventListener('scroll',function(){ onScroll(); planEtat(); },{passive:true});
  addEventListener('resize',onScroll);
  onScroll();
})();
```

## Downloadable version

The standalone file takes the page as it is into a complete document in `lang="en"`:

```python
standalone = ('<!doctype html>\n<html lang="en">\n<head>\n'
              '<meta charset="utf-8">\n'
              '<meta name="viewport" content="width=device-width,initial-scale=1">\n'
              '</head>\n<body style="margin:0">\n' + page + '\n</body>\n</html>\n')
```

## Settings

**The accent colors** are composed from the subject of the book, following the rules of the section “Accent colors”, and are declared in `:root` under `--a1`, `--a2`, `--a3`. The part divider, the chapters, the table of contents entries and the cover gradient pick them up by themselves.

**The number of parts** is adjusted by adding one color variable per part in `:root`, by extending the three series of rules that refer to them (`.partsep[id="pN"]`, `.chap[data-part="N"]`, `.tpN`), by lengthening the cover gradient and by adding its part divider in the assembly script.

**The `h3` subheadings** carry the color of their part and a white hairline, which gives the reader a permanent landmark of where they are in the book.

**The reading width** is 35em for the body text, 36em for the quotation cards and the part introduction, 33em for the lede, whose `.chap .lede` rule takes precedence over that of the paragraphs: at step 1, 35em at 20.5px gives a 720px reading column. Given in `em`, it follows the size factor and keeps the same measure at every step.

**Justification and hyphenation** apply to `.chap>p`, the paragraphs placed directly in the chapter, to `.chap .lede` and to `.part-blurb`, which receive `text-align:justify` and `hyphens:auto`; titles, the table of contents and quotation cards receive `hyphens:none` and keep their right edge free. The `lang="en"` declaration on `<header>`, `<nav id="toc">` and `<main>` gives the browser the English hyphenation dictionary.

**The spacing between paragraphs** is set by the bottom margin of `.chap>p`, at 1.25em for a line height of 1.08: these two values go together for reading comfort, and a change to one calls for the same proportion on the other.

**The text size steps** are set by the `TZ` table of the page script: six values from 0.85 to 1.25 give a comfortable increment, and a wider or narrower table changes the range of the setting. The last step of the table is the opening size, repeated as the fallback value in every `var(--lvz,1.25)` of the stylesheet, so that the page appears at that size from the very first frame. A new size is obtained by writing `calc(Npx * var(--lvz,1.25))` wherever the text is to follow the factor.

**The opening reading** is set in the page script: `amp` is `'2'`, the broad scope, and `niv` is `'3'`, the full depth.

**The book identifier** of the `CLE` key is set once in the page script, drawn from the book's title: two books opened on the same device thus each keep their own state.

**The length of a page** is set by `LIMIT` in the assembly script: 330 words give the page of a paperback, 250 an airy page, 450 a dense page. The chosen value holds for the whole book, which keeps the numbers regular.

**The page-number column** is set by `--pgcol` in `:root`, computed as the width of the reading column plus about twenty pixels: 739px for a 35em text at 20.5px, multiplied by the size factor. The 1380px breakpoint leaves this column in the margin at the opening step, with the table of contents expanded. A wider reading column moves `--pgcol` by as much, and the breakpoint follows the same movement.
