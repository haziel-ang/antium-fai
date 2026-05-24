"""
Modulo 2: Traduzione dei capitoli con Claude API.

Divide il testo in chunk gestibili, li traduce uno ad uno
mantenendo coerenza tramite contesto scorrevole.
"""

import os
import sys
import time
from pathlib import Path

import anthropic
from dotenv import load_dotenv
from tqdm import tqdm

from config import MAX_TOKENS_PER_CHUNK, MODEL, OUTPUT_DIR, TRANSLATION_SYSTEM_PROMPT

load_dotenv()


def get_client() -> anthropic.Anthropic:
    """Inizializza il client Anthropic."""
    api_key = os.getenv("ANTHROPIC_API_KEY")
    if not api_key:
        print("Errore: ANTHROPIC_API_KEY non configurata.")
        print("Copia .env.example in .env e inserisci la tua chiave API.")
        sys.exit(1)
    return anthropic.Anthropic(api_key=api_key)


def chunk_text(text: str, max_chars: int = 3000) -> list[str]:
    """Divide il testo in chunk rispettando i confini dei paragrafi."""
    paragraphs = text.split("\n\n")
    chunks = []
    current_chunk = ""

    for para in paragraphs:
        if len(current_chunk) + len(para) > max_chars and current_chunk:
            chunks.append(current_chunk.strip())
            current_chunk = para
        else:
            current_chunk += "\n\n" + para

    if current_chunk.strip():
        chunks.append(current_chunk.strip())

    return chunks if chunks else [text]


def translate_chunk(
    client: anthropic.Anthropic,
    chunk: str,
    context: str = "",
    chapter_title: str = "",
) -> str:
    """Traduce un singolo chunk di testo."""
    user_msg = ""
    if context:
        user_msg += f"[Contesto precedente per coerenza: {context[-500:]}]\n\n"
    if chapter_title:
        user_msg += f"[Capitolo: {chapter_title}]\n\n"
    user_msg += f"Testo da tradurre:\n\n{chunk}"

    response = client.messages.create(
        model=MODEL,
        max_tokens=MAX_TOKENS_PER_CHUNK,
        system=TRANSLATION_SYSTEM_PROMPT,
        messages=[{"role": "user", "content": user_msg}],
    )

    return response.content[0].text


def translate_chapter(
    client: anthropic.Anthropic,
    chapter: dict,
    delay: float = 1.0,
) -> dict:
    """Traduce un intero capitolo chunk per chunk."""
    chunks = chunk_text(chapter["text"])
    translated_parts = []
    context = ""

    for chunk in tqdm(chunks, desc=f"  Traduzione {chapter['title']}", leave=False):
        translation = translate_chunk(
            client, chunk, context=context, chapter_title=chapter["title"]
        )
        translated_parts.append(translation)
        context = translation
        time.sleep(delay)

    return {
        "title": chapter["title"],
        "original": chapter["text"],
        "translation": "\n\n".join(translated_parts),
        "pages": chapter.get("pages", []),
    }


def translate_all(chapters: list[dict], delay: float = 1.0) -> list[dict]:
    """Traduce tutti i capitoli."""
    client = get_client()
    translated = []

    print(f"\n🔄 Traduzione di {len(chapters)} capitoli...")

    for chapter in chapters:
        result = translate_chapter(client, chapter, delay=delay)
        translated.append(result)
        print(f"  ✓ {chapter['title']} — {len(result['translation'])} caratteri")

    return translated


def save_translations_md(translated_chapters: list[dict], output_path: Path):
    """Salva le traduzioni in formato Markdown."""
    output_path.parent.mkdir(parents=True, exist_ok=True)

    with open(output_path, "w", encoding="utf-8") as f:
        f.write("# Traduzione in italiano moderno\n\n")
        f.write("---\n\n")

        for ch in translated_chapters:
            f.write(f"## {ch['title']}\n\n")
            if ch["pages"]:
                f.write(f"*Pagine originali: {ch['pages'][0]}–{ch['pages'][-1]}*\n\n")
            f.write(ch["translation"])
            f.write("\n\n---\n\n")

    print(f"  → Traduzione salvata in: {output_path}")


def run(chapters: list[dict], stem: str) -> list[dict]:
    """Esegue la traduzione completa."""
    translated = translate_all(chapters)
    md_path = OUTPUT_DIR / f"{stem}_tradotto.md"
    save_translations_md(translated, md_path)
    return translated


if __name__ == "__main__":
    print("Questo modulo va usato tramite pipeline.py o importato.")
    print("Uso: python pipeline.py <percorso_pdf>")
