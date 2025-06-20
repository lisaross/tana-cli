# Tana CLI

A command-line interface for [Tana](https://tana.inc), the powerful note-taking and knowledge management app. Create, organize, and manage your notes directly from the terminal.

## Quick Start

The most common use case - quick capture to clipboard:

```bash
# Quick capture (copies to clipboard)
tana "This is my quick note"

# With tags
tana "Meeting notes" --tag meeting --tag project

# With fields  
tana "John Doe" --tag person --field "email:john@example.com"
```

## Installation

### Global Installation

```bash
npm install -g tana-cli
```

### Local Development

```bash
git clone https://github.com/lisaross/tana-cli.git
cd tana-cli
npm install
npm link  # Makes 'tana' command available globally
```

## Commands

### Quick Capture (Default)

```bash
# Basic quick capture - copies Tana Paste format to clipboard
tana "Your note content"

# Test what would be generated
tana "Your note content" --dry-run
```

### Add Command

More advanced content addition with file support and API integration:

```bash
# Add from command line (clipboard mode - default)
tana add "Meeting notes from today"

# Add with tags and fields
tana add "Project update" --tag project --field "status:in-progress"

# Add from file
tana add --file notes.txt --tag imported

# Add via stdin (great for piping)
echo "Quick thought" | tana add --tag idea

# Use API mode (requires configuration)
tana add "Important note" --api
```

### Paste Command

Generate Tana Paste format only:

```bash
# Generate paste format (copies to clipboard)
tana paste "Note content"

# Output to stdout instead
tana paste "Note content" --stdout

# Using templates
tana paste "Weekly meeting" --template meeting --field "attendees:Team"
```

### Configuration

```bash
# Initialize configuration
tana config init

# Set API token for API mode
tana config set api.token YOUR_TOKEN_HERE

# View current configuration
tana config show

# Get specific value
tana config get api.token
```

### Validation

```bash
# Validate Tana Paste format file
tana validate --paste-file my-notes.txt

# Validate API JSON payload
tana validate --api-file payload.json

# Validate template
tana validate --template meeting
```

## Configuration

Configuration is stored in `~/.config/tana-cli/config.yaml` (or Windows equivalent).

### Example Configuration

```yaml
default:
  mode: paste
  target: inbox
api:
  token: your-api-token-here
  endpoint: https://europe-west1-tagr-prod.cloudfunctions.net/addToNodeV2
  rate_limit: 1
  timeout: 30
paste:
  auto_clipboard: true
  format_style: standard
templates:
  meeting:
    supertags: ['meeting']
    fields: ['attendees', 'agenda', 'notes', 'date']
  task:
    supertags: ['task']  
    fields: ['status', 'priority', 'due_date', 'assignee']
```

## Output Modes

### Clipboard Mode (Default)

- Generated Tana Paste format is copied to clipboard
- Paste into Tana to create the note
- Great for quick capture workflows

### API Mode  

- Directly creates notes in Tana via API
- Requires API token configuration
- Real-time note creation

### Stdout Mode

- Outputs Tana Paste format to terminal
- Useful for debugging and scripting
- Use `--stdout` flag

## Tana Paste Format

The CLI generates properly formatted Tana Paste content:

```
%%tana%%
- Your note content #tag
  - Field Name:: Field Value
  - Child note
```

## Integration Examples

### Alfred Workflow

```bash
# Quick capture from Alfred
tana "{query}"
```

### Raycast Script

```bash
#!/bin/bash
tana "$1" --tag raycast
```

### Shell Aliases

```bash
# Add to your .bashrc/.zshrc
alias tn='tana'
alias tni='tana add --tag idea'
alias tnm='tana add --tag meeting'
```

### Pipe Integration

```bash
# Capture command output
ls -la | tana add --tag terminal-output

# Process text files
cat todos.txt | tana add --tag todos --field "source:file"
```

## Global Options

- `--verbose, -v`: Show detailed output
- `--quiet, -q`: Suppress non-essential output  
- `--dry-run`: Show what would be done without executing
- `--config <path>`: Use custom config file

## Examples

### Daily Workflow

```bash
# Quick thought
tana "Remember to follow up with client"

# Meeting notes
tana "Team standup" --tag meeting --field "date:2024-01-15"

# Task creation
tana "Fix login bug" --tag task --field "priority:high"

# Article capture
tana "Interesting article about AI" --tag article --field "url:https://example.com"
```

### Bulk Import

```bash
# Import from file with metadata
tana add --file research-notes.md --tag research --field "project:ai-study"

# Process multiple files
for file in *.md; do
  tana add --file "$file" --tag imported --field "source:$file"
done
```

### API Workflows

```bash
# Configure API access
tana config set api.token YOUR_TOKEN

# Direct API creation
tana add "Urgent update" --api --tag urgent

# Batch API operations with rate limiting
tana add --file large-import.txt --api
```

## Requirements

- Node.js 16 or higher
- Tana account (for API mode)

## Publishing to GitHub/npm

### GitHub Repository
- Repository: https://github.com/lisaross/tana-cli
- Issues: https://github.com/lisaross/tana-cli/issues

### npm Publishing (Optional)
```bash
npm login
npm publish
```

## License

MIT
