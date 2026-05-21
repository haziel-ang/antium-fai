import fitz
from pathlib import Path

PDF = r'c:\myGitRepo\antium-fai\docs\vallo.pdf'
OUT = Path(r'c:\myGitRepo\antium-fai\img')

doc = fitz.open(PDF)
print(f'Pagine: {doc.page_count}')

extracted = []
for i, page in enumerate(doc):
    imgs = page.get_images(full=True)
    print(f'  Pag {i+1}: {len(imgs)} immagini')
    for j, img in enumerate(imgs):
        xref = img[0]
        base = doc.extract_image(xref)
        ext = base['ext']
        w = base['width']
        h = base['height']
        print(f'    img[{j}] xref={xref} ext={ext} size={w}x{h}')
        extracted.append((i+1, j, xref, ext, w, h))

print(f'\nTotale immagini: {len(extracted)}')
