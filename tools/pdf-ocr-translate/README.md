# PDF OCR + Traduzione — Pipeline per libri antichi

Pipeline Python per estrarre testo da PDF scansionati (libri antichi in latino o italiano arcaico), tradurlo in italiano moderno con Claude AI, e ricomporlo capitolo per capitolo.

## Prerequisiti di sistema

```bash
# Ubuntu/Debian
sudo apt install tesseract-ocr tesseract-ocr-ita tesseract-ocr-lat poppler-utils

# macOS
brew install tesseract tesseract-lang poppler

# Windows (con Chocolatey)
choco install tesseract poppler
```

## Installazione

```bash
cd tools/pdf-ocr-translate
python -m venv .venv
source .venv/bin/activate   # Linux/Mac
# .venv\Scripts\activate    # Windows

pip install -r requirements.txt
```

## Configurazione

```bash
cp .env.example .env
# Modifica .env e inserisci la tua chiave API Anthropic
```

## Uso

### Pipeline completo (OCR + Traduzione + PDF)

```bash
python pipeline.py /percorso/al/libro_antico.pdf
```

### Con titolo personalizzato

```bash
python pipeline.py libro.pdf --title "De Antiquitate Antii"
```

### Solo OCR (senza traduzione)

```bash
python pipeline.py libro.pdf --only-ocr
```

### Solo un range di pagine

```bash
python pipeline.py libro.pdf --pages 10-50
```

### Traduzione da testo già estratto

```bash
python pipeline.py libro.pdf --skip-ocr --input-text output/libro_raw.txt
```

### Senza generazione PDF finale

```bash
python pipeline.py libro.pdf --no-pdf
```

## Output

La cartella `output/<nome_libro>/` conterrà:

```
output/
├── libro_raw.txt              # Testo grezzo dall'OCR
├── libro_tradotto.md          # Traduzione completa in Markdown
└── libro/
    ├── libro_completo.md      # Documento finale con indice
    ├── libro_tradotto.pdf     # PDF impaginato (se weasyprint è installato)
    └── capitoli/
        ├── 01_prefazione.md
        ├── 02_capitolo_i.md
        ├── 03_capitolo_ii.md
        └── ...
```

## Architettura

| Modulo | Funzione |
|--------|----------|
| `extract_ocr.py` | Estrazione testo: PyMuPDF (diretto) + Tesseract (OCR) |
| `translate.py` | Traduzione con Claude API, chunk per chunk con contesto |
| `compose.py` | Ricomposizione in Markdown e PDF |
| `pipeline.py` | Orchestratore principale |
| `config.py` | Configurazione centralizzata |

## Lingue supportate per OCR

Il sistema è configurato per riconoscere:
- **Italiano** (`ita`)
- **Latino** (`lat`)
- **Italiano antico** (`ita_old`, se disponibile nel sistema)

## Note

- La qualità dell'OCR dipende dalla risoluzione della scansione (300 DPI consigliati)
- Per PDF molto grandi, usa `--pages` per elaborare sezioni
- Il rate limiting dell'API è gestito con pause configurabili (`--delay`)
- I file temporanei vengono puliti automaticamente al termine
