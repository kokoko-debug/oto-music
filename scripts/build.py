"""Build the dependency-free static app. No personal data is read or included."""
from pathlib import Path
import re

ROOT = Path(__file__).resolve().parent.parent
SRC = ROOT / 'src'


def assemble():
    template = (SRC / 'layout.html').read_text(encoding='utf-8')

    def include(match):
        name = match.group(1)
        # Only explicit, flat source names are valid includes.
        if not re.fullmatch(r'[a-z0-9-]+\.(js|css)', name):
            raise ValueError(f'Invalid source include: {name}')
        tag = 'script' if name.endswith('.js') else 'style'
        return f'<{tag}>\n' + (SRC / name).read_text(encoding='utf-8') + f'</{tag}>'

    return re.sub(r'\{\{([^{}]+)\}\}', include, template)


def build():
    source = assemble()
    shell = (SRC / 'document.html').read_text(encoding='utf-8')
    storage = (SRC / 'storage.js').read_text(encoding='utf-8')
    document = shell.replace('{{storage}}', storage).replace('{{app}}', source)
    if '{{' in document:
        raise ValueError('An unresolved build placeholder remains')
    dist = ROOT / 'dist'
    dist.mkdir(exist_ok=True)
    (dist / 'index.html').write_text(document, encoding='utf-8')
    (dist / '.nojekyll').write_text('', encoding='utf-8')
    return document


if __name__ == '__main__':
    document = build()
    print(f'Built dist/index.html ({len(document.encode("utf-8")):,} bytes).')
