#!/usr/bin/env python3
"""Assemble a phrases-to-remember page: engine (template, style, fonts, script) + content.

Usage:
  python3 assemble.py content.html output.html
      assembles the content with the engine into an HTML fragment ready to be
      displayed directly in the conversation.

The fonts are loaded from Google Fonts, which keeps the page light
and quick to display.
"""
import html, pathlib, re, sys

HERE = pathlib.Path(__file__).resolve().parent
ENTITY = r'&#?\w+;'


def typo(text, lang):
    """Typography of the content's language: curly apostrophes and quotation marks."""
    if re.search(ENTITY, text):
        return ''.join(m if re.fullmatch(ENTITY, m) else typo(m, lang) for m in re.split('(%s)' % ENTITY, text))
    text = text.replace("'", '’')
    text = re.sub(r'(^|[\s(\[{—–-])"', lambda m: m.group(1) + '“', text)
    text = text.replace('"', '”')
    return text


def typo_content(content, lang):
    pieces = re.split(r'(<[^>]*>)', content)
    for i, m in enumerate(pieces):
        if m.startswith('<'):
            pieces[i] = re.sub(r'\b(topic|title|intro)="([^"]*)"',
                               lambda a: '%s="%s"' % (a.group(1), typo(a.group(2), lang)), m)
        else:
            pieces[i] = typo(m, lang)
    return ''.join(pieces)


FONTS = ("@import url('https://fonts.googleapis.com/css2"
         "?family=Cormorant+Garamond:wght@500"
         "&family=EB+Garamond:ital@0;1"
         "&family=Inter:wght@400"
         "&family=JetBrains+Mono:wght@400;500"
         "&display=block');")


def assemble(source, output):
    raw = pathlib.Path(source).read_text(encoding='utf-8').strip()
    m = re.search(r'<phrases\b[^>]*\blang="([^"]*)"', raw)
    lang = m.group(1).strip().lower().split('-')[0] if m else 'en'
    content = typo_content(raw, lang)
    m = re.search(r'<phrases\b[^>]*\btopic="([^"]*)"', content)
    topic = html.unescape(m.group(1)) if m else 'Phrases to remember'
    mode = 'final' if re.search(r'<phrases\b[^>]*\bmode="final"', content) else 'choice'
    summary = ('Phrases to remember on “%s”, final version to recite.' if mode == 'final'
               else 'Phrases to remember on “%s”, to check for rewriting.') % topic
    pieces = {
        'FONTS': FONTS,
        'CSS': (HERE / 'engine.css').read_text(encoding='utf-8').strip(),
        'MODE': mode,
        'LANG': html.escape(lang),
        'SUMMARY': html.escape(summary),
        'CONTENT': content,
        'JS': (HERE / 'engine.js').read_text(encoding='utf-8').strip(),
    }
    template = (HERE / 'template.html').read_text(encoding='utf-8')
    page = re.sub(r'\{\{(FONTS|CSS|MODE|LANG|SUMMARY|CONTENT|JS)\}\}', lambda m: pieces[m.group(1)], template)
    pathlib.Path(output).write_text(page, encoding='utf-8')
    print('Page assembled: %s (%d KB)' % (output, len(page.encode('utf-8')) // 1024))


if __name__ == '__main__':
    if len(sys.argv) == 3:
        assemble(sys.argv[1], sys.argv[2])
    else:
        sys.exit(__doc__)
