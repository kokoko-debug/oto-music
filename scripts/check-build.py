"""Verify the complete distribution, including source and storage compatibility."""
from pathlib import Path
from html.parser import HTMLParser
import re
from build import build, assemble, ROOT


class Distribution(HTMLParser):
    def __init__(self):
        super().__init__()
        self.ids = []
        self.scripts = 0
        self.external = []

    def handle_starttag(self, tag, attrs):
        attrs = dict(attrs)
        if 'id' in attrs:
            self.ids.append(attrs['id'])
        if tag == 'script':
            self.scripts += 1
            if 'src' in attrs:
                self.external.append(attrs['src'])
        if tag == 'link' and attrs.get('rel') in ('stylesheet', 'preload'):
            self.external.append(attrs.get('href'))


document = build()
assert document == (ROOT / 'dist/index.html').read_text(encoding='utf-8')
assert document.count(assemble()) == 1
assert '{{' not in document
assert not re.search(r'C:[\\/]|Users[\\/]|localhost:|127\.0\.0\.1:', document), 'Local-only configuration in public app'
parser = Distribution()
parser.feed(document)
assert parser.scripts == 6
assert 'oto-mock' in parser.ids
assert len(parser.ids) == len(set(parser.ids)), 'Duplicate static IDs'
assert not parser.external, 'Distribution must run without external script/style dependencies'
assert 'oto-learning-preview' in document
assert 'data-chord-voicing' in document
assert 'nav.dataset.advancedNav' in document
assert set(p.name for p in (ROOT / 'dist').iterdir()) == {'index.html', '.nojekyll'}, 'Unexpected files in upload directory'
print('PASS: complete static distribution, local-path isolation, storage key and no external dependencies.')
