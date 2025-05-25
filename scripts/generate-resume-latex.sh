#!/bin/bash
set -e

# Get the absolute path to the resume directory
SCRIPT_DIR="$(cd "$(dirname "$0")" && pwd)"
# The resume directory is at docs/resume relative to the project root
PROJECT_ROOT="$(cd "$SCRIPT_DIR/.." && pwd)"
RESUME_DIR="$PROJECT_ROOT/docs/resume"

# Change to the resume directory
cd "$RESUME_DIR"

# Function to generate PDF from markdown using pandoc
generate_latex_pdf() {
    local md_file="$1"
    local base_name="$(basename "${md_file%.md}")"
    
    echo "Generating LaTeX PDF for $md_file..."
    
    # Use pandoc to convert markdown to PDF with LaTeX
    mkdir -p output/latex
    pandoc "$md_file" \
        -o "output/latex/${base_name}.pdf" \
        --pdf-engine=xelatex \
        --variable geometry:margin=0.75in \
        --variable fontsize=11pt \
        --variable colorlinks=true \
        --variable linkcolor=black \
        --variable urlcolor=blue
    
    echo "✓ Generated output/latex/${base_name}.pdf"
}

# Check if pandoc is available
if ! command -v pandoc &> /dev/null; then
    echo "❌ Error: pandoc is required for LaTeX PDF generation"
    echo "Install with: brew install pandoc"
    exit 1
fi

# Generate PDFs for LaTeX-optimized resume markdown files
for md_file in input/*/*-latex.md; do
    if [[ -f "$md_file" ]]; then
        generate_latex_pdf "$md_file"
    fi
done

# Show the resulting PDFs
echo ""
echo "Generated LaTeX PDFs:"
ls -la output/latex/*.pdf 2>/dev/null || echo "No PDFs found" 