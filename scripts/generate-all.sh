#!/bin/bash
set -e

# Get the absolute path to the resume directory
SCRIPT_DIR="$(cd "$(dirname "$0")" && pwd)"
# The resume directory is at docs/resume relative to the project root
PROJECT_ROOT="$(cd "$SCRIPT_DIR/.." && pwd)"
RESUME_DIR="$PROJECT_ROOT/docs/resume"

# Change to the resume directory
cd "$RESUME_DIR"

echo "🚀 Generating all resume formats..."
echo "📁 Working directory: $(pwd)"
echo ""

# Check dependencies
echo "📋 Checking dependencies..."
missing_deps=()

if ! command -v npx &> /dev/null; then
    missing_deps+=("npx (Node.js)")
fi

if ! command -v pandoc &> /dev/null; then
    missing_deps+=("pandoc")
fi

if [ ${#missing_deps[@]} -ne 0 ]; then
    echo "❌ Missing dependencies:"
    for dep in "${missing_deps[@]}"; do
        echo "   - $dep"
    done
    echo ""
    echo "Install with:"
    echo "   brew install pandoc"
    echo "   npm install -g md-to-pdf"
    exit 1
fi

echo "✅ All dependencies found"
echo ""

# Create output directories
mkdir -p output/styled output/latex

# Function to generate styled PDF
generate_styled_pdf() {
    local md_file="$1"
    local base_name="$(basename "${md_file%.md}")"
    
    echo "📄 Generating styled PDF for $md_file..."
    
    npx md-to-pdf "$md_file" \
        --stylesheet styles/resume.css \
        --pdf-options '{"format": "A4", "margin": "3mm", "printBackground": true}' \
        --launch-options '{"args": ["--no-sandbox", "--disable-setuid-sandbox"]}'
    
    # Move to output directory with descriptive name
    mv "${md_file%.md}.pdf" "output/styled/${base_name}-styled.pdf"
    echo "   ✓ output/styled/${base_name}-styled.pdf"
}

# Function to generate LaTeX PDF
generate_latex_pdf() {
    local md_file="$1"
    local latex_file="$2"
    local base_name="$(basename "${md_file%.md}")"
    
    echo "📄 Generating LaTeX PDF for $md_file (using $latex_file)..."
    
    # Add timeout and better error handling
    if timeout 60 pandoc "$latex_file" \
        -o "output/latex/${base_name}-latex.pdf" \
        --pdf-engine=xelatex \
        --variable geometry:margin=0.75in \
        --variable fontsize=11pt \
        --variable colorlinks=true \
        --variable linkcolor=black \
        --variable urlcolor=blue 2>/dev/null; then
        echo "   ✓ output/latex/${base_name}-latex.pdf"
    else
        echo "   ❌ Failed to generate LaTeX PDF for $latex_file (timeout or error)"
        return 1
    fi
}

# Find and process resume files
count=0
echo "🔍 Looking for files in input/*/resume*.md..."

for md_file in input/*/resume*.md; do
    echo "🔍 Checking: $md_file"
    
    # Skip latex versions and non-existent files
    if [[ "$md_file" == *"-latex.md" ]]; then
        echo "   ⏭️  Skipping LaTeX version"
        continue
    fi
    
    if [[ ! -f "$md_file" ]]; then
        echo "   ⏭️  File doesn't exist"
        continue
    fi
    
    count=$((count + 1))
    base_name="$(basename "${md_file%.md}")"
    latex_file="${md_file%.md}-latex.md"
    
    echo ""
    echo "Processing $md_file:"
    
    # Generate styled PDF
    generate_styled_pdf "$md_file"
    
    # Generate LaTeX PDF if latex version exists
    if [[ -f "$latex_file" ]]; then
        generate_latex_pdf "$md_file" "$latex_file" || echo "   ⚠️  Continuing despite LaTeX generation failure..."
    else
        echo "⚠️  No LaTeX version found for $md_file (expected: $latex_file)"
    fi
    
    echo ""
done

echo "🔄 Processed $count resume file(s)"
echo ""

# Show summary
echo "📊 Generated files:"
echo ""
echo "Styled PDFs (modern CSS):"
for pdf in output/styled/*.pdf; do
    if [[ -f "$pdf" ]]; then
        size=$(stat -f%z "$pdf" 2>/dev/null || stat -c%s "$pdf" 2>/dev/null || echo "unknown")
        echo "   $pdf ($size bytes)"
    fi
done

echo ""
echo "LaTeX PDFs (traditional):"
for pdf in output/latex/*.pdf; do
    if [[ -f "$pdf" ]]; then
        size=$(stat -f%z "$pdf" 2>/dev/null || stat -c%s "$pdf" 2>/dev/null || echo "unknown")
        echo "   $pdf ($size bytes)"
    fi
done

echo ""
echo "✅ All resume formats generated successfully!"
echo "📁 Files saved in output/ directory" 