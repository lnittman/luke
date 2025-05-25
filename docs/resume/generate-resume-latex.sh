#!/bin/bash

set -e
cd "$(dirname "$0")"

TEMPLATE="resume-template.tex"

for file in resume.md resume-ford.md; do
  name="${file%.md}"
  pandoc "$file" -o "${name}.tex" --from markdown --template "$TEMPLATE"
  pdflatex -interaction=nonstopmode "${name}.tex" >/dev/null
  pdflatex -interaction=nonstopmode "${name}.tex" >/dev/null
  ls -la "${name}.pdf"
  rm -f "${name}.log" "${name}.aux"
done
