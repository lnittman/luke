#!/bin/bash
set -e
cd "$(dirname "$0")"

# Build PDF from LaTeX sources
xelatex -interaction=nonstopmode resume.tex
xelatex -interaction=nonstopmode resume.tex
xelatex -interaction=nonstopmode resume-ford.tex
xelatex -interaction=nonstopmode resume-ford.tex

ls -la resume.pdf resume-ford.pdf

echo "LaTeX PDFs generated successfully!"
