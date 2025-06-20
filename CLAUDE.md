# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Status: FUNCTIONAL CLI ✅

The tana-cli is now a working, installable CLI tool with proper structure and quick capture functionality.

## Common Development Commands

### Running the CLI
```bash
# Quick capture (most common use case)
node bin/tana "Quick note"

# Specific commands
node bin/tana add "Content" --tag example
node bin/tana paste "Content" --stdout
node bin/tana config show
node bin/tana validate --paste-file test.txt

# Install globally
npm install
npm link
tana "Quick note"  # Now works globally
```

### Testing Commands
```bash
# Test quick capture
node bin/tana "Test note" --dry-run

# Test paste command
node bin/tana paste "Test" --stdout

# Test config
node bin/tana config init
node bin/tana config show
```

## Code Architecture (FIXED ✅)

### Directory Structure (CORRECTED)
```
bin/tana                    # Main CLI entry point (executable)
lib/
  commands/                 # Command handlers
    add.js                  # Add command (supports both API/paste modes)
    config.js               # Configuration management command
    paste.js                # Paste generation command  
    validate.js             # Validation utilities
  utils/                    # Core utility modules
    config.js               # Config class for YAML management
    paste-generator.js      # TanaPasteGenerator class
    api-client.js           # TanaAPIClient class
package.json               # Updated with correct bin path: "./bin/tana"
README.md                  # Comprehensive documentation
```

### Quick Capture Feature ✅
- Default command: `tana "content"` copies to clipboard
- Most common use case made simplest
- Supports all global flags (--dry-run, --verbose, etc.)

### Core Modules (WORKING)

1. **TanaPasteGenerator** (`lib/utils/paste-generator.js`)
   - Generates proper Tana Paste format (`%%tana%%`)
   - Handles node hierarchy, tags, and fields
   - Multi-word tags wrapped with `[[]]`
   - Template support

2. **TanaAPIClient** (`lib/utils/api-client.js`)
   - Direct API integration with Tana Input API
   - Rate limiting and retry logic
   - Requires API token configuration

3. **Config** (`lib/utils/config.js`)
   - YAML-based configuration in `~/.config/tana-cli/config.yaml`
   - Cross-platform directory handling
   - Nested value get/set support

### Command Architecture

1. **Default/Quick Capture**: `tana "content"` 
   - Most common use case
   - Automatically uses paste mode
   - Copies to clipboard by default

2. **add command**: Advanced content addition
   - Supports both API and Paste modes  
   - File input, stdin, and direct content
   - Tags and fields support

3. **paste command**: Pure paste generation
   - Always outputs Tana Paste format
   - Useful for scripting and testing

4. **config command**: Configuration management
   - Initialize, get, set, show operations
   - Handles nested configuration keys

5. **validate command**: Format validation
   - Validates Tana Paste format files
   - Validates API JSON payloads
   - Template validation

### Removed Features
- **context command**: Removed (overly complex for basic CLI)
- Focus on core note-taking functionality

### Installation & Distribution
- Proper package.json with correct bin path
- Global installation via npm link works
- All dependencies properly installed

### Usage Patterns
```bash
# Quick daily usage
tana "Quick thought"
tana "Meeting notes" --tag meeting

# Advanced usage  
tana add --file notes.txt --tag imported
echo "Idea" | tana add --tag idea
tana add "Note" --api  # Direct to Tana via API

# Configuration
tana config set api.token YOUR_TOKEN
tana config show
```

## Development Notes

- CLI is functional and ready for daily use
- All core features working (quick capture, paste generation, config, validation)
- Proper error handling and user feedback
- Comprehensive README documentation
- Ready for npm publishing