#!/bin/bash
set -e

# Get the absolute path to the resume directory
SCRIPT_DIR="$(cd "$(dirname "$0")" && pwd)"
# The resume directory is at docs/resume relative to the project root
PROJECT_ROOT="$(cd "$SCRIPT_DIR/.." && pwd)"
RESUME_DIR="$PROJECT_ROOT/docs/resume"

# Change to the resume directory
cd "$RESUME_DIR"

# Function to generate PDF from markdown with CSS styling
generate_styled_pdf() {
    local md_file="$1"
    local base_name="$(basename "${md_file%.md}")"
    
    echo "Generating styled PDF for $md_file..."
    
    npx md-to-pdf "$md_file" \
        --stylesheet styles/resume.css \
        --pdf-options '{"format": "A4", "margin": "3mm", "printBackground": true}' \
        --launch-options '{"args": ["--no-sandbox", "--disable-setuid-sandbox"]}'
    
    # Move to output directory
    mkdir -p output/styled
    mv "${md_file%.md}.pdf" "output/styled/${base_name}-styled.pdf"
    echo "✓ Generated output/styled/${base_name}-styled.pdf"
}

# Generate PDFs for resume markdown files only
for md_file in input/*/resume*.md; do
    # Skip latex versions
    if [[ "$md_file" == *"-latex.md" ]]; then
        continue
    fi
    
    if [[ -f "$md_file" ]]; then
        generate_styled_pdf "$md_file"
    fi
done

# Show the resulting PDFs
echo ""
echo "Generated styled PDFs:"
ls -la output/styled/*.pdf 2>/dev/null || echo "No PDFs found" 