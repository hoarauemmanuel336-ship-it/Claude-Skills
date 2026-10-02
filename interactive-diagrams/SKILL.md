---
name: "interactive-diagrams"
description: "Produce an interactive HTML learning widget, dark and dense, as a standalone file: collapsible sections, elements that unfold their explanation on click, three breadths and three depths to choose from, adjustable text size, standard layouts, bifurcation, tension and timeline. Use it whenever a diagram, a mind map, an interactive overview or an exploration widget is requested."
---

PURPOSE AND CONTENT

Produce an interactive HTML learning widget, delivered as a standalone file, that the reader consults on their own. The widget gives a structured overview from which the reader explores in depth: each element holds its explanation, written at build time, which unfolds on click and folds back with a touch on its title as well as on its text. It is rich and dense.

Role. The diagram serves to grasp a subject at a single glance: its parts, what links them, what sets them against each other and how they follow on from one another, what produces it and what it tends toward. The reader learns with the AI, which composes for them what they study, and the diagram gives them the map of the subject: they keep it in mind to place each notion they meet, and go down into the detail wherever they choose. The widget teaches on its own everything it shows. The file is passed on as it is to anyone who wants to learn.

Audience. The diagram addresses at the same time the novice, who does not even know the subject exists, and the experienced reader, who comes to deepen what they already know. Everything written in the widget therefore starts from what the novice already knows: the subject is named plainly, each technical term receives its definition at the very place where it appears, in a few words within the sentence that introduces it, and the order of the sections leads the reader from the known to the new. The experienced reader finds their share in the same text: the density, the precision of the distinctions and the explanations that open up the depths of the subject. A single piece of writing serves both, the brief definition in passing letting the development carry on at its full level. The breadths and depths serve the same double audience: the focused and the abridged open a clear door for the novice onto the heart of the subject, the complete and the unabridged give the experienced reader the whole extent and the whole detail of the ground.

THE ENGINE AND THE CONTENT

The widget is made of two parts. The engine, stored in the `engine` folder of this skill, carries all the mechanics and all the appearance: background, cut-corner cards, typography and embedded fonts, collapsible sections and their animations, unfolding of explanations, the settings row, grids, the drawn lines of the bifurcation, adaptation to phones, state remembered from one visit to the next. The content is the only part the AI writes: a short file, written in a simple markup that the engine knows how to display. All of the AI's attention thus goes to the subject, and the widget keeps the same finish from one diagram to the next.

Building. The AI writes the content in a file, for example `content.html`, then assembles it with the engine through the command:

```
python3 <skill folder>/engine/assemble.py content.html <diagram-name>.html
```

The file produced is the complete widget, standalone, ready to be delivered. To revise a diagram already assembled, the AI takes its content out with `python3 <skill folder>/engine/assemble.py --extract <diagram>.html content.html`, modifies it, then assembles it again: the diagram then leaves with the most recent engine. The assembly turns straight apostrophes into curly ones on its own.

THE ART OF EXPLAINING AN ELEMENT

The question of the subject. Before the plan, the AI formulates the central question the diagram answers, then the points where a novice stumbles and the misconceptions they often carry. The plan is built to get through these obstacles.

Knowing a subject. To know a subject is to know it through its causes: to know what it is made of, what makes it what it is, what produces it or sets it in motion, and what it tends toward. The map of the subject takes them all in, and the diagram shows them at a single glance. These causes say when the map is complete; the sections, for their part, follow the subject's own articulations, as the subject calls for them. The banner's explanation opens with the definition of the subject, a short sentence that states its nature, and each section then brings a new aspect.

The why as much as the what. Each notion receives its reason for being: what it explains, what it resolves, what would be missing without it. A reader who knows why remembers far better.

The first sentence states the essential. The reader who reads only that sentence leaves with the right idea.

The link with the neighborhood. Each explanation places its element within the whole: it says what distinguishes it from its neighbors and what connects it to them.

The choice of form. When several forms suit a section, the AI takes the one that shows the real structure of the subject.

Titles and card descriptions that already teach. The reader who unfolds nothing understands the subject at a glance.

The balance between what is shown and what is unfolded. The card gives the landmark, the explanation gives the understanding, and each level brings new material.

STRUCTURE OF THE WIDGET

Banner. The title of the subject and a brief subtitle, in monospace, that situates it. Its explanation sets out the overall logic of the subject and opens with its definition.

Color blocks. A simple, unified subject stays entirely neutral, in white. A subject structured in large distinct phases groups its sections into thematic blocks: each block receives a bright, saturated color, clearly distinct from that of its neighbors, and a heading that says on what grounds its sections belong together. The heading is read before anything is opened and turns the change of hue into information. The heading of a block of several sections carries its explanation, which sets out the overall logic of what the block brings together. A block of a single section keeps its heading as a simple landmark, and its explanation lives on the section, whose title explanation also carries the overall logic of the block: a single explanation for a single subject.

Sections. Each section carries a title in capitals, preceded by its number, and a title explanation that says what the section is about and how its elements fit together. It opens and folds with a click; its content takes one of the layouts described below.

Subgroups. In a section with a standard layout, subgroups gather the cards that belong together, each with a title, a brief description in monospace and its explanation.

Cards. Each card carries a title, a description read at rest, then its explanation, unfolded on click. A reference or a keyword that accompanies the title is worked into the description as prose.

SECTION LAYOUTS

Choice of layout. For each section, ask: what does someone unfamiliar need to know, in what order, in what form? The form follows from the function.

Sequential standard. A column of cards, for ordered elements: a narrative, a tight chronology, the steps of a line of reasoning.

Parallel standard. A grid of cards in several columns, for independent elements: a typology, themes, a classification. The engine gives the closed cards of a same row the same height, that of the tallest among them, makes an unfolded card take the full width, and widens the cards left alone on a row. The number of cards follows what the subject calls for.

Bifurcation. Two branches coming from a same origin, drawn as a fork: a choice or a binary distinction. The bifurcation has two branches by nature; a division into three branches or more takes the parallel layout. When the two branches lead to a conclusion they share, these common cards close the fork.

Tension. Two terms of the same rank that pull on each other, repeated in pairs. The two columns are named only once, at the head of the section, by two brief noun labels, which lets each card carry a title of its own that informs. Each pair is linked by a connector, and the choice of glyph is itself information about the subject: ↔, reciprocal relation, each holds the other, the two are of the same rank, and it is the most frequent case, the one the AI comes back to when in doubt; →, directed relation, the first term produces the second and the direction holds; ↻, cyclical relation, each sustains the other in a loop; ≡, false opposition, two terms that a tradition has set against each other and that say the same thing from two angles. Two incompatible terms between which one must choose call for a bifurcation. An isolated term, or a conclusion card, stands at full width.

Timeline. A vertical axis punctuated by one dot per event, for a dated sequence where the passing of time carries the meaning.

Free form. When a subject calls for a figure that none of these layouts renders, the AI composes it itself in a free zone, described under CONTENT FORMAT, keeping the atmosphere of the widget.

BREADTH AND DEPTH

Two choices for the reader. The reader chooses the breadth, which says the ground the widget shows them, and the depth, which says how deeply they travel through it. Three breadths, Focused, Broader, Complete, and three depths, Abridged, Standard, Unabridged, combine freely: the same widget thus offers nine readings. The widget opens at the broader breadth and the unabridged depth.

Three breadths. Before writing, the AI draws up the map of the subject: its heart, then the domains that surround it, as it discerns them for this subject. From it, it draws three nested perimeters, each defined by the question it answers: the focused breadth shows what one needs to know to be able to say one knows the subject, the subject known through its own causes; the broader breadth adds what is needed to situate the subject in its neighborhood, what prepares it, what surrounds it and what follows directly from it; the complete breadth adds everything a connoisseur of the subject judges worth attaching to it, out to the domains whose link remains illuminating. These three questions serve as a test: the AI asks them of each section and each element to set its breadth. The widget is written on the whole map, and each breadth shows the part of it that falls to it.

Three depths. The abridged gives the skeleton of the subject and the essentials of each element, the standard unfolds the reasoning, the unabridged carries the detail and the nuances. Writing goes in this direction, from level 1 to level 3, each level fitting into a text that already held together.

Setting the levels. Each element carries its entry breadth in the `breadth` attribute and its entry depth in the `depth` attribute, with a value of 2 or 3; an element without an attribute counts as 1 and appears in every reading. A level 2 element appears from the broader or the standard onward, a level 3 element in the complete or the unabridged only. Breadth is set first on whole sections, a neighboring domain most often forming its own sections; it is also set, inside a central section, on a subgroup, a card, a tension pair, a timeline event or an explanation paragraph, wherever the content links the heart to a neighboring domain. Depth is set mostly on the paragraphs of the explanations, and also on the cards, subgroups, pairs and events that belong to the detail. A bifurcation keeps its two branches in every reading: the levels are set there on the whole section or on the cards of the branches. The block heading takes on its own the lowest levels of its sections, and the numbering of the sections runs without gaps in each reading.

Each reading stands on its own. The focused reads as a whole widget on the heart of the subject, and the wider breadths add their elements to it in their place in the reading order. Each explanation opens with a level 1 paragraph that states the essentials of its element, so that every rendered element keeps its explanation in the abridged; the standard and the unabridged add their paragraphs to it. What an explanation says about an element of a wider breadth stands in a paragraph that carries that breadth.

EXPLANATIONS

Role. The explanations are the heart of the widget. The diagram carries within it all the knowledge of the subject: the overall map is seen at a glance, and each element delivers on click what there is to know about it. The reader explores by unfolding what they want to go deeper into, and the widget is sufficient unto itself.

What an explanation conveys. The first aim is understanding of the subject: bringing out the logic, the stakes, the reach of the element. Understanding presupposes knowing: the explanation therefore conveys in a single stretch the material and its meaning, in the form the nature of the element calls for. A narrative is told, a concept is set out, a doctrine is unfolded, a figure is introduced, a technique is described, an event is situated. The explanation first gives what the beginner needs to learn, what the thing is, its definition, its main distinction, then leads to what makes its meaning understood. Its length follows what the element calls for: a few sentences for a detail, several paragraphs for a notion that carries a great deal.

Overall logic. Every title in the widget, at whatever level it stands (banner, block heading, section title, subgroup, branch, tension column label), names a subject that gathers several elements. Its explanation takes this subject as a whole endowed with its own meaning and sets out its overall logic: the subject understood in a single stretch, in its nature, its reason for being, its movement from beginning to end, what it reveals and what it changes. The elements placed under the title take their place within this movement, and their own explanations deepen them. The card, which names a single element, receives the same demand at its own scale: its explanation brings out the logic proper to what it names.

Relation explanation. The connector of a tension pair depicts the passage from one term to the other, and its explanation sets out this passage: it is the element of the widget whose explanation bears on a relation, the relation being what it represents.

Standalone reading. The reader opens the explanations in the order they choose. Each one therefore names its subject in full and is understood on its own, while staying in tune with the title that governs it. Technical terms receive their definition there at the place where they appear, according to the audience rule set out at the start.

Language. All the texts of the widget, explanations included, are written in the user's language. Visible content uses commas, parentheses or colons as the context calls for.

CONTENT FORMAT

The content is a tree of simple tags. Titles and descriptions are written as attributes, explanations as HTML paragraphs inside an `<explanation>` tag. Each tag is closed by its end tag.

Root. `<diagram title="…" subtitle="…" lang="…">` wraps all the content. The `lang` attribute gives the code of the content's language (`en`, `es`, `de`…). Its first child is the banner's `<explanation>`, then come the blocks, or directly the sections for a neutral diagram.

Block. `<block name="…">` gathers sections of the same color, with its `<explanation>` when it has several. The engine assigns each block a color from its palette, in order; a `color="#rrggbb"` attribute sets another bright hue when the subject calls for one.

Section. `<section key="…" title="…" layout="…">` contains its title `<explanation>` then its content. The key is a short word drawn from the section's subject, unique in the diagram: the remembered state names the sections by it. The `layout` attribute takes one of the values `sequential`, the default value, `parallel`, `bifurcation`, `tension` or `timeline`.

Content of a standard section. `<card>` elements directly, or `<group title="…" desc="…">` elements that contain their `<explanation>` then their cards. A group receives its own `layout="parallel"` or `layout="sequential"` value when it differs from its section.

Card. `<card title="…" desc="…">` contains its `<explanation>`.

Content of a bifurcation. Two `<branch title="…" desc="…">`, each with its `<explanation>` then its cards, and, when the branches meet again, a `<common>` that contains the common cards.

Content of a tension. Two `<column title="…">`, each with its `<explanation>`, then `<pair glyph="↔" name="…">` elements that each contain two cards, the first belonging to the left column, and the connector's `<explanation>`. The `name` attribute names the relation. A card placed directly in the section stands at full width.

Content of a timeline. Cards, in the order of time, each for one event.

Explanations. Inside an `<explanation>`, each paragraph is a `<p>`, which receives `breadth` and `depth` according to its reading. A long explanation that calls for steps receives internal subheadings as `<h4>`. Italics are written `<i>`, bold `<b>`. Titles and descriptions in attributes also accept `<i>` and `<b>`.

Free zone. `<free>` contains HTML written by the AI, along with its own `<style>`, for a figure that the subject calls for and that the engine's layouts do not render. Any element of the zone that carries the `expand` attribute and contains an `<explanation>` unfolds on click like the rest of the widget. The zone keeps the atmosphere of the widget: a #0a0a0a background showing through, cards in absolute black #000 with a white hairline border at 0.2 alpha and a 12px cut corner at the top right, structuring lines of 1px in muted white (0.12 to 0.4 alpha), Outfit for titles and reading text, JetBrains Mono for labels, explanations justified across the full width of their frame, and text sizes written `calc(Npx * var(--tz,1.25))` to follow the size setting.

Example of the form:

```html
<diagram title="Title of the subject" subtitle="what situates it" lang="en">
<explanation>
<p>Definition of the subject, then its overall logic.</p>
<p depth="2">The reasoning that unfolds it.</p>
</explanation>
<block name="Name of the first block">
<explanation><p>What this block brings together.</p></explanation>
<section key="origins" title="Section title" layout="parallel">
<explanation><p>What the section is about.</p></explanation>
<group title="Subgroup" desc="what it holds">
<explanation><p>The logic of the subgroup.</p></explanation>
<card title="Card title" desc="Description read at rest.">
<explanation><p>The essentials.</p><p depth="3">The detail.</p></explanation>
</card>
</group>
</section>
<section key="neighborhood" title="A neighboring domain" breadth="2">
…
</section>
</block>
</diagram>
```

WRITING WITH SEVERAL HANDS

The content of the widget can be entrusted to subagents who write in parallel, each one a part of the diagram. The main AI then keeps charge of the diagram's unity, from the banner to the last element.

A shared brief precedes the writing. The main AI writes it in a file that each subagent reads in full before writing. In it, it sets down the overall plan of the diagram with the breadth of each element, the distribution of the material across the three depths, each one's share, the audience, the tone, the rules of substance and form, and the content format in which each part is delivered, so that the parts fit as they are into the content file.

A single-handed rereading follows the writing. Before assembly, the main AI itself reads the whole content, in the order in which the reader discovers it, from the banner to the last element. It gives all the texts a single voice. It grants each example and each quotation a main place, the one where they serve best, and brings them back elsewhere when this new place draws from them a light of its own that fully justifies their return. It rewrites the explanations that repeat what another already carries, replacing them with new material. The diagram then reads as the work of a single author, and each explanation keeps its standalone reading and its full substance.
