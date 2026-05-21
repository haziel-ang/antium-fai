import fitz
from pathlib import Path
from PIL import Image
import io

PDF = r'c:\myGitRepo\antium-fai\docs\vallo.pdf'
OUT = Path(r'c:\myGitRepo\antium-fai\img')

# Mappa xref -> nome file
IMG_MAP = {
    26: 'vallo-territorio-antium',        # Fig. 2 - mappa aerea territorio
    28: 'colle-rotondo-aerea',            # Fig. 3 - foto aerea Colle Rotondo
    30: 'colle-rotondo-planimetria',      # Fig. 4 - planimetria topografica + sezione
    37: 'colle-rotondo-aggere-3d',        # Fig. 5 - ricostruzione 3D aggere
    54: 'vallo-muro-assonometria',        # Fig. 6 - assonometria muro Soprintendenza
    56: 'vallo-opera-quadrata',           # Fig. 7 - foto muro in opera quadrata
}

doc = fitz.open(PDF)

for page in doc:
    for img in page.get_images(full=True):
        xref = img[0]
        if xref not in IMG_MAP:
            continue
        base = doc.extract_image(xref)
        raw = base['image']
        ext = base['ext']
        w, h = base['width'], base['height']
        
        name = IMG_MAP[xref]
        out_path = OUT / f'{name}.webp'
        
        pil = Image.open(io.BytesIO(raw))
        pil.save(out_path, 'WEBP', quality=82, method=6)
        print(f'Salvato: {out_path.name} ({w}x{h})')

print('\nEstrazione completata.')
