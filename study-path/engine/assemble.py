#!/usr/bin/env python3
"""Assemble a study path: engine (template, style, script) + content.

Usage:
  python3 assemble.py content.html output.html
      assembles the content with the engine into a self-contained path;
  python3 assemble.py --extract path.html content.html
      takes the content and the progress out of an already assembled path,
      to resume it and then reassemble it with the present engine.

The progress (block <script type="application/json" id="lv-progress">)
travels with the content: --extract writes it at the head of the content file,
assembly takes it out and puts it back in the head of the path.
"""
import html, json, pathlib, re, sys

HERE = pathlib.Path(__file__).resolve().parent
TAGS = 'study-path|block|theme|topic|explanation'
TEXT_ATTRS = r'\b(subject|title|subtitle|desc|name)="([^"]*)"'
PROGRESS_BLOCK = re.compile(r'<script\b[^>]*\bid=["\']lv-progress["\'][^>]*>(.*?)</script>\s*', re.S | re.I)
FRESH_PROGRESS = '{"updated":0,"topics":{}}'
SPACES = '[ \u00a0\u202f]*'
OPENERS = r'(?<=[\s(\[{\u2014\u2013\u201c\u2018-])'


def typo(text, lang, prev=' '):
    """Typography of the content's language: curly apostrophes and quotation marks."""
    if re.search(r'&#?\w+;', text):
        out = []
        for m in re.split(r'(&#?\w+;)', text):
            if re.fullmatch(r'&#?\w+;', m):
                out.append(m)
                prev = 'x'
            elif m:
                out.append(typo(m, lang, prev))
                prev = m[-1]
        return ''.join(out)
    text = prev[-1:] + text
    text = re.sub(OPENERS + "'", '\u2018', text)
    text = text.replace("'", '\u2019')
    text = re.sub(OPENERS + '"', '\u201c', text)
    text = text.replace('"', '\u201d')
    return text[1:]


def typo_content(content, lang):
    pieces = re.split(r'(<[^>]*>)', content)
    in_code = False
    prev = ' '
    for i, m in enumerate(pieces):
        if m.startswith('<'):
            low = m.lower()
            if low.startswith('<style') or low.startswith('<script'):
                in_code = True
            elif low.startswith('</style') or low.startswith('</script'):
                in_code = False
            if re.match(r'</?(p|li|br|%s)\b' % TAGS, low):
                prev = ' '
            pieces[i] = re.sub(TEXT_ATTRS, lambda a: '%s="%s"' % (a.group(1), typo(a.group(2), lang)), m)
        elif not in_code and m:
            pieces[i] = typo(m, lang, prev)
            prev = m[-1]
    return ''.join(pieces)


def progress(text):
    """Returns the progress block in its data form, angle brackets escaped."""
    try:
        p = json.loads(text)
        assert isinstance(p, dict)
    except Exception:
        return FRESH_PROGRESS
    return text.strip().replace('<', '\\u003c')


def assemble(source, output):
    content = pathlib.Path(source).read_text(encoding='utf-8')
    prog = FRESH_PROGRESS
    m = PROGRESS_BLOCK.search(content)
    if m:
        prog = progress(m.group(1).strip())
        content = content[:m.start()] + content[m.end():]
    content = content.strip()
    # A content tag written in short form <topic ... /> becomes <topic ...></topic>.
    content = re.sub(r'<(%s)(\s[^<>]*?)?\s*/>' % TAGS,
                     lambda m: '<%s%s></%s>' % (m.group(1), m.group(2) or '', m.group(1)), content)
    root = re.search(r'<study-path\b[^>]*>', content)
    lang_m = re.search(r'\blang="([A-Za-z0-9-]+)"', root.group(0)) if root else None
    lang = lang_m.group(1) if lang_m else 'en'
    content = typo_content(content, lang.lower())
    m = re.search(r'<study-path\b[^>]*\bsubject="([^"]*)"', content)
    title = re.sub(r'<[^>]+>', '', html.unescape(m.group(1))) if m else 'Study path'
    parts = {
        'LANG': lang,
        'TITLE': html.escape(title, quote=False),
        'CSS': (HERE / 'fonts.css').read_text(encoding='utf-8') + '\n' + (HERE / 'engine.css').read_text(encoding='utf-8'),
        'PROGRESS': prog,
        'CONTENT': content,
        'JS': (HERE / 'engine.js').read_text(encoding='utf-8'),
    }
    template = (HERE / 'template.html').read_text(encoding='utf-8')
    page = re.sub(r'\{\{(LANG|TITLE|CSS|PROGRESS|CONTENT|JS)\}\}', lambda m: parts[m.group(1)], template)
    pathlib.Path(output).write_text(page, encoding='utf-8')
    print('Path assembled: %s (%d KB)' % (output, len(page.encode('utf-8')) // 1024))


def extract(document, output):
    page = pathlib.Path(document).read_text(encoding='utf-8')
    m = re.search(r'<template id="content">\n?(.*?)\n?</template>', page, re.S)
    if not m:
        sys.exit('This file holds no content to extract.')
    # a file saved again from the browser writes the non-breaking space as an entity
    content = m.group(1).strip().replace('&nbsp;', '\u00a0')
    p = PROGRESS_BLOCK.search(page)
    prog = progress(p.group(1).strip()) if p else FRESH_PROGRESS
    text = '<script type="application/json" id="lv-progress">\n%s\n</script>\n%s\n' % (prog, content)
    pathlib.Path(output).write_text(text, encoding='utf-8')
    print('Content and progress extracted: %s' % output)


if __name__ == '__main__':
    if len(sys.argv) == 4 and sys.argv[1] == '--extract':
        extract(sys.argv[2], sys.argv[3])
    elif len(sys.argv) == 3:
        assemble(sys.argv[1], sys.argv[2])
    else:
        sys.exit(__doc__)
