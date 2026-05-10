#!/usr/bin/env python3

from __future__ import annotations

import re
import shutil
import subprocess
from pathlib import Path


ROOT = Path(__file__).resolve().parents[1]
SITE_DIR = ROOT / "_site"
CONVERTIBLE_IMAGE_EXTENSIONS = {".png", ".jpg", ".jpeg"}
ALL_IMAGE_EXTENSIONS = {
    ".avif",
    ".bmp",
    ".gif",
    ".heic",
    ".heif",
    ".ico",
    ".jpeg",
    ".jpg",
    ".png",
    ".svg",
    ".tif",
    ".tiff",
    ".webp",
}
TEXT_EXTENSIONS = {
    ".css",
    ".html",
    ".js",
    ".json",
    ".md",
    ".txt",
    ".xml",
}
IMAGE_REFERENCE_PATTERN = re.compile(
    r"(?P<prefix>(?:\./|\.\./)[^\"'()\s<>?#]+?)\.(?P<ext>png|jpg|jpeg)(?P<suffix>[?#][^\"'()\s<>]*)?",
    re.IGNORECASE,
)
SOURCE_ONLY_DIRECTORIES = {
    ".claude",
    ".github",
    ".git",
    "scripts",
}


def prepare_site() -> None:
    if SITE_DIR.exists():
        shutil.rmtree(SITE_DIR)

    ensure_conversion_tool_available()
    shutil.copytree(ROOT, SITE_DIR, ignore=shutil.ignore_patterns(".git", "_site"))
    prune_source_only_content(SITE_DIR)
    convert_images(SITE_DIR)
    rewrite_image_references(SITE_DIR)
    ensure_only_webp_images(SITE_DIR)
    ensure_no_source_only_content_remains(SITE_DIR)


def ensure_conversion_tool_available() -> None:
    if shutil.which("cwebp") is None:
        raise SystemExit(
            "Manca il convertitore cwebp. Installa il pacchetto webp prima del deploy."
        )


def convert_images(base_dir: Path) -> None:
    for image_path in sorted(base_dir.rglob("*")):
        if not image_path.is_file() or image_path.suffix.lower() not in CONVERTIBLE_IMAGE_EXTENSIONS:
            continue

        output_path = image_path.with_suffix(".webp")
        if output_path.exists():
            output_path.unlink()

        subprocess.run(
            ["cwebp", "-q", "82", str(image_path), "-o", str(output_path)],
            check=True,
            stdout=subprocess.DEVNULL,
            stderr=subprocess.DEVNULL,
        )
        image_path.unlink()


def prune_source_only_content(base_dir: Path) -> None:
    for directory_name in SOURCE_ONLY_DIRECTORIES:
        directory_path = base_dir / directory_name
        if directory_path.exists():
            shutil.rmtree(directory_path)

    for file_path in sorted(base_dir.rglob("*")):
        if not file_path.is_file():
            continue

        if "Conflicted copy" in file_path.name:
            file_path.unlink()
            continue

        if file_path.suffix.lower() == ".md":
            file_path.unlink()


def ensure_no_source_only_content_remains(base_dir: Path) -> None:
    remaining = [
        path.relative_to(base_dir)
        for path in base_dir.rglob("*")
        if path.is_file()
        and (
            "Conflicted copy" in path.name
            or path.suffix.lower() == ".md"
            or path.parts and path.parts[0] in SOURCE_ONLY_DIRECTORIES
        )
    ]

    if remaining:
        raise SystemExit(
            "Sono rimasti file sorgente nello staging: "
            + ", ".join(str(path) for path in remaining)
        )


def rewrite_image_references(base_dir: Path) -> None:
    for file_path in sorted(base_dir.rglob("*")):
        if not file_path.is_file() or file_path.suffix.lower() not in TEXT_EXTENSIONS:
            continue

        original_text = file_path.read_text(encoding="utf-8")
        rewritten_text = IMAGE_REFERENCE_PATTERN.sub(
            lambda match: f"{match.group('prefix')}.webp{match.group('suffix') or ''}",
            original_text,
        )

        if rewritten_text != original_text:
            file_path.write_text(rewritten_text, encoding="utf-8")


def ensure_only_webp_images(base_dir: Path) -> None:
    remaining = [
        path.relative_to(base_dir)
        for path in base_dir.rglob("*")
        if path.is_file()
        and path.suffix.lower() in ALL_IMAGE_EXTENSIONS
        and path.suffix.lower() != ".webp"
    ]

    if remaining:
        raise SystemExit(
            "Sono rimaste immagini non WebP o immagini non previste nello staging: "
            + ", ".join(str(path) for path in remaining)
        )


if __name__ == "__main__":
    prepare_site()