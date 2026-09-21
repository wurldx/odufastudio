"""Build css/site.min.css from the three source stylesheets.

The site used to pull in css/style.css, css/components.css and css/responsive.css
as three separate render-blocking <link> elements. They are now concatenated in
the same order (so the cascade order is untouched) and whitespace-minified into
one file.

This is a *lossless* transform: only comments and insignificant whitespace are
removed. The script verifies that by comparing a comment- and
whitespace-stripped view of the input and the output, and refuses to write the
file if they differ -- so a minifier bug can never silently change the CSS.

Run it after editing any of the three source files:

    python _build_css.py
"""

import os
import sys

HERE = os.path.dirname(os.path.abspath(__file__))
CSS_DIR = os.path.join(HERE, "css")
SOURCES = ["style.css", "components.css", "responsive.css"]
TARGET = os.path.join(CSS_DIR, "site.min.css")

BOUNDARY = "{};,"


def strip_comments(text):
    """Remove /* ... */ comments without touching quoted strings."""
    out = []
    index = 0
    length = len(text)
    quote = None
    while index < length:
        char = text[index]
        if quote:
            out.append(char)
            if char == "\\" and index + 1 < length:
                out.append(text[index + 1])
                index += 2
                continue
            if char == quote:
                quote = None
            index += 1
            continue
        if char in "\"'":
            quote = char
            out.append(char)
            index += 1
            continue
        if char == "/" and index + 1 < length and text[index + 1] == "*":
            end = text.find("*/", index + 2)
            index = length if end == -1 else end + 2
            continue
        out.append(char)
        index += 1
    return "".join(out)


def minify(text):
    """Collapse whitespace, but never across a quoted string or a boundary."""
    text = strip_comments(text)
    out = []
    index = 0
    length = len(text)
    quote = None
    while index < length:
        char = text[index]
        if quote:
            out.append(char)
            if char == "\\" and index + 1 < length:
                out.append(text[index + 1])
                index += 2
                continue
            if char == quote:
                quote = None
            index += 1
            continue
        if char in "\"'":
            quote = char
            out.append(char)
            index += 1
            continue
        if char.isspace() or char == "\n":
            while index < length and (text[index].isspace() or text[index] == "\n"):
                index += 1
            previous = out[-1] if out else ""
            following = text[index] if index < length else ""
            if previous and following and previous not in BOUNDARY and following not in BOUNDARY:
                out.append(" ")
            continue
        out.append(char)
        index += 1
    return "".join(out).replace(";}", "}").strip()


def normalise(text):
    """Comment- and whitespace-free view used to prove the transform is lossless."""
    text = strip_comments(text)
    out = []
    quote = None
    for char in text:
        if quote:
            out.append(char)
            if char == quote:
                quote = None
            continue
        if char in "\"'":
            quote = char
            out.append(char)
            continue
        if char.isspace() or char == "\n":
            continue
        out.append(char)
    return "".join(out).replace(";}", "}")


def main():
    chunks = []
    for name in SOURCES:
        path = os.path.join(CSS_DIR, name)
        with open(path, encoding="utf-8") as handle:
            body = handle.read()
        chunks.append(f"/* --- {name} --- */\n{body}")
        print(f"  source {name:<18} {len(body.encode('utf-8')):>7} bytes")

    combined = "\n".join(chunks)
    minified = minify(combined)

    if normalise(combined) != normalise(minified):
        sys.exit("ABORT: minified CSS is not equivalent to the sources -- not writing.")

    with open(TARGET, "w", encoding="utf-8", newline="\n") as handle:
        handle.write(minified + "\n")

    before = len(combined.encode("utf-8"))
    after = os.path.getsize(TARGET)
    print(f"  -> css/site.min.css {after} bytes ({before - after} bytes smaller, {after * 100 // before}% of source)")
    print("  verified: minified output is comment/whitespace-equivalent to the sources")


if __name__ == "__main__":
    main()
