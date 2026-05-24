"""Configurazione del pipeline OCR + Traduzione."""

from pathlib import Path

BASE_DIR = Path(__file__).parent
OUTPUT_DIR = BASE_DIR / "output"
TEMP_DIR = BASE_DIR / "temp"

# OCR
TESSERACT_LANGS = "ita+lat+ita_old"
DPI = 300

# Traduzione
MODEL = "claude-sonnet-4-6"
MAX_TOKENS_PER_CHUNK = 4000
CHAPTER_MARKERS = [
    r"^CAP(?:ITOLO|UT|\.)\s*[IVXLCDM\d]+",
    r"^LIBER\s+[IVXLCDM]+",
    r"^LIBRO\s+[IVXLCDM\d]+",
    r"^PARS\s+[IVXLCDM]+",
    r"^PARTE\s+[IVXLCDM\d]+",
    r"^SECTIO\s+[IVXLCDM]+",
    r"^SEZIONE\s+[IVXLCDM\d]+",
]

TRANSLATION_SYSTEM_PROMPT = """\
Sei un traduttore esperto di testi antichi. Il tuo compito è tradurre \
il seguente testo (latino o italiano arcaico) in italiano moderno, \
mantenendo il significato originale ma rendendo il testo chiaro e \
leggibile per un lettore contemporaneo.

Regole:
- Mantieni la struttura dei paragrafi
- Conserva i nomi propri nella forma originale
- Se un passaggio è illeggibile o incerto, segnalalo con [?]
- Non aggiungere commenti o note, solo la traduzione
- Mantieni eventuali titoli di capitolo traducendoli
"""
