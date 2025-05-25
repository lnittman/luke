#!/bin/bash
set -e

# Change to the script directory
cd "$(dirname "$0")"

# Generate default resume
npx md-to-pdf resume.md --stylesheet styles/resume.css --pdf-options '{"format": "A4", "margin": "3mm", "printBackground": true}'

# Generate Ford-specific resume
npx md-to-pdf resume-ford.md --stylesheet styles/resume.css --pdf-options '{"format": "A4", "margin": "3mm", "printBackground": true}'

# Show the resulting PDFs
ls -la resume.pdf resume-ford.pdf

echo "PDF generated successfully!" 
