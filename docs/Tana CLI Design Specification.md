# Tana CLI Design Specification

## Overview

A comprehensive command-line interface for Tana that supports both Input API and Tana Paste workflows, designed for developers, power users, and automation enthusiasts.

## Core Design Principles

1. **Unix Philosophy**: Do one thing well, composable with other tools
2. **Sensible Defaults**: Work out of the box with minimal configuration
3. **Progressive Disclosure**: Simple commands for beginners, advanced options for power users
4. **Pipe-Friendly**: Support for Unix pipes and standard input/output
5. **Cross-Platform**: Work consistently on macOS, Linux, and Windows

## Command Structure

### Primary Commands

#### 1. `tana add` - Add content to Tana

```bash
# Basic usage (Tana Paste to clipboard)
tana add "Meeting notes from today"

# With supertags
tana add "Project update" --tag meeting --tag project

# With fields
tana add "John Doe" --field "email:john@example.com" --field "role:developer"

# API mode (direct to Tana)
tana add "Important note" --api --target inbox

# From file
tana add --file notes.txt --template meeting

# From stdin
echo "Quick note" | tana add --tag idea
```

#### 2. `tana import` - Bulk import data

```bash
# CSV import
tana import data.csv --map "title:name,content:description" --tag imported

# JSON import
tana import data.json --template person --tag contacts

# Text files
tana import *.txt --tag notes --target library

# RSS feed
tana import --rss "https://feeds.example.com/tech" --limit 10 --tag news

# From URL with metadata extraction
tana import --url "https://example.com/article" --extract-metadata
```

#### 3. `tana search` - Search and query Tana data (future: requires read API)

```bash
# Basic search (when read API available)
tana search "meeting notes" --tag project

# Structured queries
tana search --tag task --status "in-progress" --format json

# Export search results
tana search --tag research --export notes.md
```

#### 4. `tana config` - Configuration management

```bash
# Setup wizard
tana config init

# Set API token
tana config set token "your-api-token"

# Set default workspace
tana config set workspace "workspace-id"

# View current config
tana config show

# Set default mode (paste|api)
tana config set mode paste
```

#### 5. `tana template` - Template management

```bash
# List available templates
tana template list

# Create new template
tana template create meeting --fields "attendees,agenda,notes"

# Use template
tana add --template meeting "Weekly standup"

# Edit template
tana template edit meeting
```

### Utility Commands

#### 6. `tana paste` - Generate Tana Paste format

```bash
# Generate paste format (to clipboard)
tana paste "My note" --tag idea

# Output to stdout
tana paste "My note" --tag idea --stdout

# From structured data
echo '{"title":"Note","content":"Content"}' | tana paste --template note
```

#### 7. `tana validate` - Validate data and formats

```bash
# Validate Tana Paste format
tana validate --paste-file input.txt

# Validate JSON for API
tana validate --api-file data.json

# Validate template
tana validate --template meeting
```

#### 8. `tana auth` - Authentication management

```bash
# Login wizard
tana auth login

# Test authentication
tana auth test

# Logout
tana auth logout

# Show current user/workspace
tana auth whoami
```

## Command Options and Flags

### Global Options

```bash
--config, -c     # Specify config file path
--verbose, -v    # Verbose output
--quiet, -q      # Suppress output
--dry-run        # Show what would be done without executing
--help, -h       # Show help
--version        # Show version
```

### Mode Selection

```bash
--api           # Use Input API mode
--paste         # Use Tana Paste mode (default)
--clipboard     # Copy to clipboard (default for paste mode)
--stdout        # Output to stdout instead of clipboard
```

### Content Options

```bash
--tag, -t       # Add supertag (can be repeated)
--field, -f     # Add field in format "name:value" (can be repeated)
--target        # Target node (inbox, library, schema, or node ID)
--template      # Use predefined template
--file          # Read content from file
--stdin         # Read content from stdin
```

### Import Options

```bash
--map           # Field mapping for CSV/JSON import
--limit         # Limit number of items to import
--batch-size    # Number of items per API call (default: 50)
--skip-errors   # Continue on errors
--extract-metadata  # Extract metadata from URLs
```

### Output Options

```bash
--format        # Output format (json, yaml, table, paste)
--export        # Export to file
--pretty        # Pretty-print output
```

## Configuration System

### Configuration File Location

- **macOS/Linux**: `~/.config/tana-cli/config.yaml`
- **Windows**: `%APPDATA%/tana-cli/config.yaml`

### Configuration Structure

```yaml
# ~/.config/tana-cli/config.yaml
default:
  mode: paste              # paste|api
  target: inbox           # inbox|library|schema|<node-id>
  workspace: <workspace-id>
  
api:
  token: <encrypted-token>
  endpoint: https://europe-west1-tagr-prod.cloudfunctions.net/addToNodeV2
  rate_limit: 1           # calls per second
  timeout: 30             # seconds
  
paste:
  auto_clipboard: true    # automatically copy to clipboard
  format_style: standard  # standard|compact
  
templates:
  meeting:
    supertags: [meeting]
    fields:
      - attendees
      - agenda
      - notes
      - date
  
  task:
    supertags: [task]
    fields:
      - status
      - priority
      - due_date
      - assignee

aliases:
  m: add --template meeting
  t: add --template task
  n: add --tag note
```

### Environment Variables

```bash
TANA_API_TOKEN          # API token
TANA_WORKSPACE_ID       # Default workspace ID
TANA_CONFIG_PATH        # Custom config file path
TANA_DEFAULT_MODE       # Default mode (paste|api)
TANA_DEFAULT_TARGET     # Default target node
```

## Template System

### Built-in Templates

1. **note** - Simple note with optional tags
2. **meeting** - Meeting notes with attendees, agenda, notes
3. **task** - Task with status, priority, due date
4. **person** - Contact with name, email, role, company
5. **article** - Article with title, author, URL, summary
6. **idea** - Quick idea capture with category and priority

### Custom Templates

Users can create custom templates with:

- Predefined supertags
- Required and optional fields
- Default values
- Validation rules
- Custom Tana Paste formatting

### Template Definition Format

```yaml
# ~/.config/tana-cli/templates/project.yaml
name: project
description: Project tracking template
supertags:
  - project
fields:
  - name: status
    type: option
    options: [planning, active, on-hold, completed]
    required: true
    default: planning
  - name: priority
    type: option
    options: [low, medium, high, critical]
    required: false
    default: medium
  - name: due_date
    type: date
    required: false
  - name: team_members
    type: reference
    multiple: true
    required: false
paste_format: |
  %%tana%%
  - {{title}} #project
    - Status:: {{status}}
    - Priority:: {{priority}}
    {{#if due_date}}- Due Date:: [[date:{{due_date}}]]{{/if}}
    {{#each team_members}}- Team Member:: [[{{this}}]]{{/each}}
    {{#if description}}- {{description}}{{/if}}
```

## Error Handling and Validation

### Input Validation

- Validate API tokens and workspace IDs
- Check required fields for templates
- Validate date formats and references
- Verify file formats and accessibility

### Error Messages

- Clear, actionable error messages
- Suggestions for common mistakes
- Links to documentation and help

### Recovery Mechanisms

- Retry logic for network failures
- Graceful degradation when API is unavailable
- Backup to paste mode when API fails

## Integration Features

### Unix Integration

```bash
# Pipe support
echo "Quick note" | tana add --tag idea

# File processing
find . -name "*.md" | xargs tana import --tag documentation

# Git integration
git log --oneline -10 | tana import --template commit --tag development
```

### Shell Completion

- Bash completion for commands and options
- Zsh completion with descriptions
- Fish shell completion
- PowerShell completion for Windows

### Plugin Architecture

```bash
# Plugin system for extensibility
tana plugin install tana-github    # GitHub integration
tana plugin install tana-calendar  # Calendar sync
tana plugin list                   # List installed plugins
```

## Output Formats

### Standard Output

```bash
# Success message
✓ Added note "Meeting notes" to Tana (paste mode)
✓ Imported 15 items from data.csv using API

# Progress indicators for bulk operations
Importing data.csv... [████████████████████] 100% (50/50)
```

### JSON Output

```bash
tana add "Note" --format json
{
  "success": true,
  "mode": "paste",
  "content": "%%tana%%\n- Note",
  "clipboard": true,
  "timestamp": "2025-06-19T02:15:00Z"
}
```

### Verbose Mode

```bash
tana add "Note" --verbose
→ Mode: paste (default)
→ Target: inbox (default)
→ Generating Tana Paste format...
→ Content: %%tana%%\n- Note
→ Copying to clipboard...
✓ Added note "Note" to clipboard
```

## Security Considerations

### Token Storage

- Encrypted storage of API tokens
- Secure keychain integration on macOS
- Windows Credential Manager integration
- Linux keyring integration

### Data Privacy

- No data logging by default
- Optional telemetry with user consent
- Clear data handling policies
- Local-first approach

## Performance Optimization

### Caching

- Cache workspace and node information
- Template caching for faster execution
- Configuration caching

### Rate Limiting

- Respect Tana API rate limits (1 call/second)
- Intelligent batching for bulk operations
- Queue management for multiple operations

### Async Operations

- Non-blocking clipboard operations
- Parallel processing where possible
- Progress indicators for long operations

This design provides a comprehensive, user-friendly CLI tool that addresses the needs identified in the market research while maintaining technical feasibility and following CLI best practices.
