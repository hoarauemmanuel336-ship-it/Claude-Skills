#!/usr/bin/env python3
"""Assemble a course: engine (template, style, script, fonts) + content.

Usage:
  python3 assemble.py content.html output.html
      assembles the content with the engine into a self-contained course;
  python3 assemble.py --extract course.html content.html
      takes the content and the progress out of an already assembled course,
      so they can be reworked and the course reassembled with the current engine.

Along the way, the assembly:
  - converts content tags written in short form <x ... /> ;
  - gives a letter to each course that has none (l for the first);
  - gives a stable key to each "I can..." statement that has none,
    and writes it into the content, so that an extraction finds it again;
  - puts back into the lv-progress block the progress carried by the content
    (<progress> tag), or a fresh progress;
  - sets the page language from the lang attribute of <file> (en by default);
  - turns straight apostrophes inside words into curly ones.
"""
import html, json, pathlib, re, sys, unicodedata

HERE = pathlib.Path(__file__).resolve().parent
TAGS = ('file|course|introduction|lesson|objectives|prerequisites|start|part|definition|example|'
        'caution|remember|landmarks|landmark|check|answer|cards|card|free|essentials|keywords|keyword|'
        'exercises|exercise|solution|self-assessment|i-can|capstone|progress')
TEXT_ATTRS = r'\b(title|subtitle|desc|name|subject|question|term|note)="([^"]*)"'
KEY_OK = re.compile(r'^[A-Za-z0-9._-]{1,80}$')
PROGRESS_BLOCK = re.compile(r'(<script type="application/json" id="lv-progress">\n?)(.*?)(\n?</script>)', re.S)


# ── Typography ─────────────────────────────────────────────────────────
def typo(text):
    """Curly apostrophe inside words."""
    if re.search(r'&#?\w+;', text):
        return ''.join(m if re.fullmatch(r'&#?\w+;', m) else typo(m)
                       for m in re.split(r'(&#?\w+;)', text))
    return re.sub(r"(?<=\w)'(?=\w)", '’', text)


def typo_content(content):
    pieces = re.split(r'(<[^>]*>)', content)
    apart = False
    for i, m in enumerate(pieces):
        if m.startswith('<'):
            low = m.lower()
            if re.match(r'<(style|script|code|pre)\b', low):
                apart = True
            elif re.match(r'</(style|script|code|pre)\b', low):
                apart = False
            pieces[i] = re.sub(TEXT_ATTRS, lambda a: '%s="%s"' % (a.group(1), typo(a.group(2))), m)
        elif not apart:
            pieces[i] = typo(m)
    return ''.join(pieces)


# ── Course letters and statement keys ─────────────────────────────────
def attr(tag, name):
    m = re.search(r'\b%s="([^"]*)"' % re.escape(name), tag)
    return html.unescape(m.group(1)) if m else None


def strip_accents(s):
    s = unicodedata.normalize('NFD', s or '')
    return ''.join(c for c in s if unicodedata.category(c) != 'Mn').lower()


def identify(content):
    """Sets the missing course letters and the missing statement keys,
    always leaving the ones already written untouched."""
    taken = set(x for x in re.findall(r'<course\b[^>]*\bletter="([a-z])"', content))
    keys = set(re.findall(r'<i-can\b[^>]*\bkey="([^"]*)"', content))
    state = {'course': 0, 'letter': 'l', 'lesson': 0, 'rank': 0}

    def letter_for(title, first):
        if first and 'l' not in taken:
            return 'l'
        words = [w for w in re.findall(r'[a-z]+', strip_accents(title))
                 if w not in ('the', 'a', 'an', 'of', 'and', 'to', 'in', 'on', 'for', 'with', 'at', 'by', 's')]
        for c in ''.join(w[0] for w in words) + ''.join(words) + 'abcdefghijkmnopqrstuvwxyz':
            if 'a' <= c <= 'z' and c not in taken:
                return c
        return 'z'

    def place(m):
        tag, name = m.group(0), m.group(1)
        if name == 'course':
            state['course'] += 1
            state['lesson'] = 0
            l = attr(tag, 'letter')
            if not l:
                l = letter_for(attr(tag, 'title') or '', state['course'] == 1)
                taken.add(l)
                tag = tag.replace('<course', '<course letter="%s"' % l, 1)
            state['letter'] = l
        elif name == 'lesson':
            state['lesson'] += 1
            state['rank'] = 0
        elif name == 'i-can':
            state['rank'] += 1
            if not attr(tag, 'key'):
                i = state['rank']
                while True:
                    key = '%s%02d.%d' % (state['letter'], state['lesson'], i)
                    if key not in keys:
                        break
                    i += 1
                keys.add(key)
                tag = tag.replace('<i-can', '<i-can key="%s"' % key, 1)
        return tag

    return re.sub(r'<(course|lesson|i-can)\b[^>]*>', place, content)


# ── Progress ───────────────────────────────────────────────────────────
def clean_progress(text):
    try:
        p = json.loads(text)
    except (ValueError, TypeError):
        p = {}
    if not isinstance(p, dict):
        p = {}
    mastered = p.get('mastered') if isinstance(p.get('mastered'), dict) else {}
    mastered = {k: True for k, v in mastered.items() if v is True and KEY_OK.match(k)}
    try:
        updated = max(0, int(p.get('updated') or 0))
    except (ValueError, TypeError):
        updated = 0
    return {'updated': updated, 'mastered': mastered}


def progress_block(p):
    return json.dumps(p, ensure_ascii=False, indent=1).replace('<', '\\u003c')


# ── Assembly ───────────────────────────────────────────────────────────
def assemble(source, output):
    content = pathlib.Path(source).read_text(encoding='utf-8')
    # A content tag written in short form <keyword ... /> becomes <keyword ...></keyword>.
    content = re.sub(r'<(%s)(\s[^<>]*?)?\s*/>' % TAGS,
                     lambda m: '<%s%s></%s>' % (m.group(1), m.group(2) or '', m.group(1)), content)
    # The progress carried by the content joins the reserved block of the header.
    p = {'updated': 0, 'mastered': {}}
    m = re.search(r'<progress>(.*?)</progress>\s*', content, re.S)
    if m:
        p = clean_progress(m.group(1))
        content = content[:m.start()] + content[m.end():]
    content = identify(content.strip())
    content = typo_content(content)
    subject = re.search(r'<file\b[^>]*\bsubject="([^"]*)"', content) or re.search(r'<course\b[^>]*\btitle="([^"]*)"', content)
    title = re.sub(r'<[^>]+>', '', html.unescape(subject.group(1))) if subject else 'Course'
    root = re.search(r'<file\b[^>]*>', content)
    lang = (attr(root.group(0), 'lang') if root else None) or 'en'
    if not re.fullmatch(r'[A-Za-z]{2,3}(-[A-Za-z0-9]{2,8})*', lang):
        lang = 'en'
    pieces = {
        'LANG': lang,
        'TITLE': html.escape(title),
        'FONTS': (HERE / 'fonts.css').read_text(encoding='utf-8'),
        'CSS': (HERE / 'engine.css').read_text(encoding='utf-8'),
        'PROGRESS': progress_block(p),
        'CONTENT': content,
        'JS': (HERE / 'engine.js').read_text(encoding='utf-8'),
    }
    template = (HERE / 'template.html').read_text(encoding='utf-8')
    page = re.sub(r'\{\{(LANG|TITLE|FONTS|CSS|PROGRESS|CONTENT|JS)\}\}', lambda m: pieces[m.group(1)], template)
    pathlib.Path(output).write_text(page, encoding='utf-8')
    n = len(re.findall(r'<course\b', content))
    print('Course assembled: %s (%d course(s), %d lesson(s), %d KB)' % (
        output, n, len(re.findall(r'<lesson\b', content)), len(page.encode('utf-8')) // 1024))


def extract(course, output):
    page = pathlib.Path(course).read_text(encoding='utf-8')
    m = re.search(r'<template id="content">\n?(.*?)\n?</template>', page, re.S)
    if not m:
        sys.exit('This file holds no content to extract.')
    # A course saved from the browser writes non-breaking spaces as &nbsp;:
    # they are given back their original form.
    content = m.group(1).strip().replace('&nbsp;', ' ')
    b = PROGRESS_BLOCK.search(page)
    p = clean_progress(b.group(2) if b else '')
    text = '<progress>%s</progress>\n%s\n' % (json.dumps(p, ensure_ascii=False), content)
    pathlib.Path(output).write_text(text, encoding='utf-8')
    print('Content extracted: %s (%d statement(s) mastered)' % (output, len(p['mastered'])))


if __name__ == '__main__':
    if len(sys.argv) == 4 and sys.argv[1] == '--extract':
        extract(sys.argv[2], sys.argv[3])
    elif len(sys.argv) == 3:
        assemble(sys.argv[1], sys.argv[2])
    else:
        sys.exit(__doc__)
