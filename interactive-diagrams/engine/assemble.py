#!/usr/bin/env python3
"""Assemble a diagram: engine (template, stylesheet, script, fonts) + content.

Usage:
  python3 assemble.py content.html output.html
      assembles the content with the engine into a standalone widget;
  python3 assemble.py --extract diagram.html content.html
      takes the content out of an already assembled widget, so it can be
      revised and then reassembled with the current engine.
"""
import html, pathlib, re, sys

HERE = pathlib.Path(__file__).resolve().parent
TAGS = 'diagram|block|section|group|card|branch|common|column|pair|free|explanation'


TEXT_ATTRS = r'(title|subtitle|desc|name)="([^"]*)"'


def typography(text, lang):
    """Typography of the content: curly apostrophes in place of straight ones."""
    if re.search(r'&#?\w+;', text):
        return ''.join(m if re.fullmatch(r'&#?\w+;', m) else typography(m, lang) for m in re.split(r'(&#?\w+;)', text))
    return text.replace("'", '\u2019')


def typography_content(content, lang):
    pieces = re.split(r'(<[^>]*>)', content)
    in_style = False
    for i, m in enumerate(pieces):
        if m.startswith('<'):
            low = m.lower()
            if low.startswith('<style') or low.startswith('<script'):
                in_style = True
            elif low.startswith('</style') or low.startswith('</script'):
                in_style = False
            pieces[i] = re.sub(TEXT_ATTRS, lambda a: '%s="%s"' % (a.group(1), typography(a.group(2), lang)), m)
        elif not in_style:
            pieces[i] = typography(m, lang)
    return ''.join(pieces)


def assemble(source, output):
    content = pathlib.Path(source).read_text(encoding='utf-8')
    # A content tag written in short form <card ... /> becomes <card ...></card>.
    content = re.sub(r'<(%s)(\s[^<>]*?)?\s*/>' % TAGS,
                     lambda m: '<%s%s></%s>' % (m.group(1), m.group(2) or '', m.group(1)), content)
    l = re.search(r'<diagram\b[^>]*\blang="([^"]*)"', content)
    lang = l.group(1).strip() if l and l.group(1).strip() else 'en'
    content = typography_content(content, lang)
    m = re.search(r'<diagram\b[^>]*\btitle="([^"]*)"', content)
    title = re.sub(r'<[^>]+>', '', html.unescape(m.group(1))) if m else 'Diagram'
    pieces = {
        'LANG': html.escape(lang),
        'TITLE': html.escape(title),
        'FONTS': (HERE / 'fonts.css').read_text(encoding='utf-8'),
        'CSS': (HERE / 'engine.css').read_text(encoding='utf-8'),
        'CONTENT': content,
        'JS': (HERE / 'engine.js').read_text(encoding='utf-8'),
    }
    template = (HERE / 'template.html').read_text(encoding='utf-8')
    page = re.sub(r'\{\{(LANG|TITLE|FONTS|CSS|CONTENT|JS)\}\}', lambda m: pieces[m.group(1)], template)
    pathlib.Path(output).write_text(page, encoding='utf-8')
    print('Diagram assembled: %s (%d KB)' % (output, len(page.encode('utf-8')) // 1024))


def extract(widget, output):
    page = pathlib.Path(widget).read_text(encoding='utf-8')
    m = re.search(r'<template id="content">\n?(.*?)\n?</template>', page, re.S)
    if not m:
        sys.exit('This file contains no content to extract.')
    pathlib.Path(output).write_text(m.group(1).strip() + '\n', encoding='utf-8')
    print('Content extracted: %s' % output)


if __name__ == '__main__':
    if len(sys.argv) == 4 and sys.argv[1] == '--extract':
        extract(sys.argv[2], sys.argv[3])
    elif len(sys.argv) == 3:
        assemble(sys.argv[1], sys.argv[2])
    else:
        sys.exit(__doc__)
