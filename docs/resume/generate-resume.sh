#!/bin/bash

# Change to the script directory
cd "$(dirname "$0")"

# Run the md-to-pdf command
npx md-to-pdf resume-ford-ios.md --stylesheet styles/resume.css --pdf-options '{"format": "A4", "margin": "3mm", "printBackground": true}'

# Copy to the final filename
cp resume-ford-ios.pdf resume-ford-ios.pdf

# Show the file details
ls -la resume-ford-ios.pdf

echo "PDF generated successfully!" 
