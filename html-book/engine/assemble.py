#!/usr/bin/env python3
"""Assemble a book: engine (template, style, script, fonts) + content.

Usage:
  python3 assemble.py content.html output.html
      assembles the content with the engine into a self-contained book;
      a line <include file="chapters/03-title.html"/> in the content
      is replaced by the named file (path relative to the content);
  python3 assemble.py --extract book.html content.html
      takes the content back out of an already assembled book, to rework it
      and then reassemble it with the current engine.
"""
import html, pathlib, re, sys

HERE = pathlib.Path(__file__).resolve().parent
TAGS = 'book|part|chapter|lede|subhead|quote|free|include'
TEXT_ATTRS = r'\b(title|subtitle|eyebrow|tagline|summary|label|ref)="([^"]*)"'
ENTITY = r'&#?\w+;'
SPACES = '[ \u00a0\u202f]*'
OPENERS = ' \t\n\r\u00a0\u202f([{\u2014\u2013-/'


def typo(text, lang, prev=' '):
    """Typography of the book's language: typographic apostrophes and
    quotation marks. `prev` is the character that precedes the text."""
    if re.search(ENTITY, text):
        out = []
        for piece in re.split('(%s)' % ENTITY, text):
            if re.fullmatch(ENTITY, piece):
                out.append(piece)
                prev = html.unescape(piece)[-1:] or prev
            elif piece:
                out.append(typo(piece, lang, prev))
                prev = piece[-1]
        return ''.join(out)
    out = []
    for ch in text:
        if ch in '\'"':
            opening = prev in OPENERS or prev in '\u201c\u2018'
            if ch == '"':
                ch = '\u201c' if opening else '\u201d'
            else:
                ch = '\u2018' if opening else '\u2019'
        out.append(ch)
        prev = ch
    return ''.join(out)


def typo_content(content, lang):
    """Applies typography to the text and to the text attributes, never to
    the code of the <style> and <script> blocks of a free zone."""
    pieces = re.split(r'(<(?:[^>"]|"[^"]*")*>)', content)
    in_code = False
    prev = ' '
    for i, m in enumerate(pieces):
        if m.startswith('<'):
            low = m.lower()
            if low.startswith('<style') or low.startswith('<script'):
                in_code = True
            elif low.startswith('</style') or low.startswith('</script'):
                in_code = False
            elif not m.startswith('<!--'):
                pieces[i] = re.sub(TEXT_ATTRS, lambda a: '%s="%s"' % (a.group(1), typo(a.group(2), lang)), m)
            if re.match(r'</?(p|li|h\d|br|div|ul|ol|%s)\b' % TAGS, low):
                prev = ' '
        elif not in_code and m:
            pieces[i] = typo(m, lang, prev)
            prev = m[-1]
    return ''.join(pieces)


def include(content, folder, stack=()):
    """Replaces each <include file="…"/> with the named file."""
    def replace(m):
        path = (folder / m.group(1)).resolve()
        if path in stack:
            sys.exit('Circular inclusion: %s' % path)
        text = path.read_text(encoding='utf-8').strip()
        return include(text, path.parent, stack + (path,))
    return re.sub(r'<include\s+file="([^"]+)"\s*/?>(?:\s*</include>)?', replace, content)


def assemble(source, output):
    source = pathlib.Path(source)
    content = include(source.read_text(encoding='utf-8'), source.resolve().parent).strip()
    # A content tag written in short form <chapter ... /> becomes <chapter ...></chapter>.
    content = re.sub(r'<(%s)(\s[^<>]*?)?\s*/>' % TAGS,
                     lambda m: '<%s%s></%s>' % (m.group(1), m.group(2) or '', m.group(1)), content)
    m = re.search(r'<book\b((?:[^>"]|"[^"]*")*)>', content)
    m = m and re.search(r'\slang="([^"]+)"', m.group(1))
    lang = m.group(1).strip().lower() if m else 'en'
    content = typo_content(content, lang)
    m = re.search(r'<book\b[^>]*\btitle="([^"]*)"', content)
    title = re.sub(r'<[^>]+>', '', html.unescape(m.group(1))) if m else 'Book'
    parts = {
        'TITLE': html.escape(title),
        'LANG': html.escape(lang),
        'FONTS': (HERE / 'fonts.css').read_text(encoding='utf-8'),
        'CSS': (HERE / 'engine.css').read_text(encoding='utf-8'),
        'CONTENT': content,
        'JS': (HERE / 'engine.js').read_text(encoding='utf-8'),
    }
    template = (HERE / 'template.html').read_text(encoding='utf-8')
    page = re.sub(r'\{\{(TITLE|LANG|FONTS|CSS|CONTENT|JS)\}\}', lambda m: parts[m.group(1)], template)
    pathlib.Path(output).write_text(page, encoding='utf-8')
    words = len([w for w in re.split('[\\s\u00a0\u202f]+', re.sub(r'<[^>]+>', ' ', content))
                 if re.search('[0-9A-Za-z\u00c0-\u00ff]', w)])
    print('Book assembled: %s (%d KB, %d words in the complete unabridged reading)'
          % (output, len(page.encode('utf-8')) // 1024, words))


def extract(book, output):
    page = pathlib.Path(book).read_text(encoding='utf-8')
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
