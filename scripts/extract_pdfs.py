import pdfplumber, os, re, glob

def slugify(name):
    name = os.path.splitext(name)[0]
    name = re.sub(r'[\(\)]', '', name)
    name = re.sub(r'[^a-zA-Z0-9\u00C0-\u017F]+', '-', name).strip('-').lower()
    return name

def extract_all():
    outdir = os.path.join(os.getcwd(), 'wiki', 'raw')
    os.makedirs(outdir, exist_ok=True)
    pdfs = sorted(glob.glob('docs/*.pdf'))
    count = 0
    for pdf_path in pdfs:
        name = os.path.basename(pdf_path)
        slug = slugify(name)
        outpath = os.path.join(outdir, f'{slug}.md')
        if os.path.exists(outpath):
            print(f"SKIP (exists): {name}")
            continue
        try:
            with pdfplumber.open(pdf_path) as pdf:
                pages_text = []
                for i, page in enumerate(pdf.pages):
                    text = page.extract_text() or ""
                    if text.strip():
                        pages_text.append(f"## Page {i+1}\n\n{text.strip()}")
                total_chars = sum(len(t) for t in pages_text)
                if total_chars < 100:
                    print(f"SKIP (no text): {name} ({total_chars} chars)")
                    continue
                header = f"# {name}\n\n**Source:** `docs/{name}`  \n**Pages:** {len(pdf.pages)}  \n**Size:** {os.path.getsize(pdf_path)//1024} KB\n\n"
                full_text = header + "\n\n".join(pages_text) + "\n"
                with open(outpath, 'w', encoding='utf-8') as f:
                    f.write(full_text)
                print(f"OK: {name} -> {slug}.md  ({len(full_text)} chars)")
                count += 1
        except Exception as e:
            print(f"ERR: {name} -> {str(e)[:80]}")
    print(f"\nDone: {count} files extracted to wiki/raw/")

if __name__ == '__main__':
    extract_all()