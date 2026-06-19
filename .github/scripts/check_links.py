"""Resolve every internal href/src in public/*.html against the file tree.

Clean-URL aware: `/features` resolves to public/features.html, `/` resolves to
public/index.html. Fragments and query strings are stripped before resolution.
External URLs (http://, https://, mailto:, tel:) are skipped.

Exits 1 with a list of broken refs if any internal target is missing.
"""
import re
import sys
import pathlib

ROOT = pathlib.Path(__file__).resolve().parents[2] / "public"
HREF_RE = re.compile(r'(?:href|src)="([^"]+)"')

EXTERNAL_PREFIXES = ("http://", "https://", "//", "mailto:", "tel:", "data:", "javascript:")

# Paths served by Vercel at runtime, not present in the repo.
VERCEL_RUNTIME_PREFIXES = ("/_vercel/",)


def resolve(url: str) -> pathlib.Path | None:
    """Return the file the URL should map to, or None if missing.

    Returns the sentinel `pathlib.Path('.')` for refs we deliberately skip
    (externals, pure fragments).
    """
    if not url or url.startswith(EXTERNAL_PREFIXES) or url.startswith("#"):
        return pathlib.Path(".")  # skip sentinel
    if url.startswith(VERCEL_RUNTIME_PREFIXES):
        return pathlib.Path(".")  # served by Vercel at runtime
    path = url.split("#", 1)[0].split("?", 1)[0]
    if not path:
        return pathlib.Path(".")  # pure fragment after strip
    if not path.startswith("/"):
        return None  # we don't use relative paths; flag as broken
    rel = path.lstrip("/").rstrip("/")
    if rel == "":
        return ROOT / "index.html"
    candidate = ROOT / rel
    if candidate.is_file():
        return candidate
    # clean-URL: /features -> public/features.html
    with_html = candidate.with_suffix(candidate.suffix + ".html") if candidate.suffix else candidate.parent / (candidate.name + ".html")
    if with_html.is_file():
        return with_html
    # locale home: /es -> public/es/index.html
    index = candidate / "index.html"
    if index.is_file():
        return index
    return None


def main() -> int:
    if not ROOT.is_dir():
        print(f"public/ not found at {ROOT}", file=sys.stderr)
        return 2

    errors: list[str] = []
    checked = 0
    for html in sorted(ROOT.rglob("*.html")):
        text = html.read_text(encoding="utf-8")
        for m in HREF_RE.finditer(text):
            url = m.group(1)
            target = resolve(url)
            checked += 1
            if target is None:
                rel = html.relative_to(ROOT.parent)
                errors.append(f'{rel}: broken ref -> "{url}"')

    if errors:
        print("Broken internal references:", file=sys.stderr)
        for e in errors:
            print(f"  {e}", file=sys.stderr)
        return 1
    print(f"All {checked} refs resolve.")
    return 0


if __name__ == "__main__":
    sys.exit(main())
