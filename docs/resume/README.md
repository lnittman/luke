# Resume Generation System

This directory contains a clean, streamlined system for generating professional resumes in multiple formats.

## Structure

```
docs/resume/
├── README.md                    # This file
├── .gitignore                   # Excludes temporary files and output
├── resume.md                    # Main resume (source of truth)
├── resume-ford.md              # Ford-specific resume variant
├── generate-all.sh             # 🎯 Generate both formats (recommended)
├── generate-resume.sh          # Generate styled PDFs only
├── generate-resume-latex.sh    # Generate LaTeX PDFs only
├── output/                     # Generated PDFs (organized by type)
│   ├── styled/                 # Modern CSS-styled PDFs
│   └── latex/                  # Traditional LaTeX PDFs
└── styles/
    └── resume.css              # CSS styling for markdown PDFs
```

## Quick Start

### Generate All Formats (Recommended) 🚀
```bash
./generate-all.sh
```
This creates both styled and LaTeX versions in organized output directories.

### Generate Specific Format
```bash
# Modern styled PDFs only
./generate-resume.sh

# Traditional LaTeX PDFs only  
./generate-resume-latex.sh
```

## Output Organization

The master script organizes outputs clearly:
- **`output/styled/`** - Modern CSS-styled PDFs (`resume-styled.pdf`, `resume-ford-styled.pdf`)
- **`output/latex/`** - Traditional LaTeX PDFs (`resume-latex.pdf`, `resume-ford-latex.pdf`)

## Requirements

- **For styled PDFs**: `md-to-pdf` (install: `npm install -g md-to-pdf`)
- **For LaTeX PDFs**: `pandoc` and `xelatex` (install: `brew install pandoc`)

The master script checks dependencies and provides helpful error messages.

## How It Works

1. **Source Files**: `resume.md` and `resume-ford.md` are the single source of truth
2. **Styled PDFs**: Uses `md-to-pdf` with custom CSS for modern styling
3. **LaTeX PDFs**: Uses `pandoc` with XeLaTeX engine for traditional formatting
4. **Automatic Discovery**: All scripts automatically find and process `resume*.md` files
5. **Clean Organization**: Outputs are separated by type in the `output/` directory

## Adding New Resume Variants

1. Create a new markdown file (e.g., `resume-company.md`)
2. Run `./generate-all.sh` - it will automatically be included
3. Find outputs in `output/styled/resume-company-styled.pdf` and `output/latex/resume-company-latex.pdf`

## Benefits of This Approach

- ✅ **One Command**: `./generate-all.sh` creates everything you need
- ✅ **Organized Output**: Clear separation of styled vs LaTeX versions
- ✅ **Single Source of Truth**: Markdown files contain all content
- ✅ **Dependency Checking**: Helpful error messages for missing tools
- ✅ **Automatic Discovery**: Finds and processes all resume variants
- ✅ **Clean Workspace**: Generated files don't clutter the source directory
- ✅ **Version Control Friendly**: Only source files need to be tracked
- ✅ **Tool Agnostic**: Works with standard markdown processing tools 