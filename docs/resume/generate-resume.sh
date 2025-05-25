#!/bin/bash

# Change to the script directory
cd "$(dirname "$0")"


# Generate PDF versions of the resumes
for file in resume.md resume-ford.md; do
  name="${file%.md}"
  npx md-to-pdf "$file" \
    --stylesheet styles/resume.css \
    --pdf-options '{"format": "A4", "margin": "3mm", "printBackground": true}' \
    -o "${name}.pdf"
  ls -la "${name}.pdf"
done

echo "PDF generated successfully!" 
