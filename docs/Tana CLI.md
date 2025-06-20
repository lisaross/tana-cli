# Tana CLI

A command-line interface for [Tana](https://tana.inc), the intelligent note-taking and knowledge management app. This tool allows you to interact with Tana from your terminal using both the Tana Input API and Tana Paste functionality.

## Features

- 🚀 **Dual Mode Support**: Use either Tana Paste (clipboard) or Input API (direct) modes
- 📝 **Quick Note Taking**: Add notes with tags and fields from the command line
- 🔧 **Template System**: Use predefined templates for common note types
- 📋 **Clipboard Integration**: Automatic clipboard management for Tana Paste
- ⚙️ **Configuration Management**: Easy setup and configuration
- 🔍 **Validation Tools**: Validate Tana Paste format and API payloads
- 🔄 **Pipe Support**: Unix-friendly with stdin/stdout support

## Installation

```bash
# Clone the repository
git clone <repository-url>
cd tana-cli

# Install dependencies
npm install

# Make globally available (optional)
npm link
```

## Quick Start

1. **Initialize configuration**:

   ```bash
   ./bin/tana-cli.js config init
   ```

2. **Add a simple note**:

   ```bash
   ./bin/tana-cli.js add "My first note from CLI"
   ```

3. **Add a note with tags**:

   ```bash
   ./bin/tana-cli.js add "Meeting notes" --tag meeting --tag project
   ```

## Commands

### `tana add` - Add content to Tana

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

### `tana config` - Configuration management

```bash
# Setup wizard
tana config init

# Set API token
tana config set api.token "your-api-token"

# Set default mode
tana config set default.mode paste

# View current config
tana config show
```

### `tana paste` - Generate Tana Paste format

```bash
# Generate paste format (to clipboard)
tana paste "My note" --tag idea

# Output to stdout
tana paste "My note" --tag idea --stdout

# With template
tana paste "Weekly standup" --template meeting
```

### `tana validate` - Validate data and formats

```bash
# Validate Tana Paste format
tana validate --paste-file input.txt

# Validate JSON for API
tana validate --api-file data.json

# Validate template
tana validate --template meeting
```

## Configuration

Configuration is stored in:

- **macOS/Linux**: `~/.config/tana-cli/config.yaml`
- **Windows**: `%APPDATA%/tana-cli/config.yaml`

### Example Configuration

```yaml
default:
  mode: paste              # paste|api
  target: inbox           # inbox|library|schema|<node-id>
  workspace: null
  
api:
  token: your-api-token
  endpoint: https://europe-west1-tagr-prod.cloudfunctions.net/addToNodeV2
  rate_limit: 1           # calls per second
  timeout: 30             # seconds
  
paste:
  auto_clipboard: true    # automatically copy to clipboard
  format_style: standard  # standard|compact
  
templates:
  meeting:
    supertags: [meeting]
    fields: [attendees, agenda, notes, date]
  
  task:
    supertags: [task]
    fields: [status, priority, due_date, assignee]
```

## Templates

Built-in templates include:

- **note** - Simple note with optional tags
- **meeting** - Meeting notes with attendees, agenda, notes
- **task** - Task with status, priority, due date
- **person** - Contact with name, email, role, company
- **article** - Article with title, author, URL, summary
- **idea** - Quick idea capture with category and priority

## API Setup

To use API mode, you need a Tana API token:

1. In Tana, go to `Settings` > `API Tokens`
2. Select your workspace and click `Create token`
3. Copy the token and set it in the CLI:

   ```bash
   tana config set api.token "your-token-here"
   ```

## Examples

### Basic Note Taking

```bash
# Quick note
tana add "Remember to buy milk"

# Note with context
tana add "Discussed new feature requirements" --tag meeting --tag product

# Task creation
tana add "Review pull request #123" --tag task --field "priority:high"
```

### File Import

```bash
# Import text file
tana add --file meeting-notes.txt --tag meeting

# Import with template
tana add --file project-update.md --template meeting --tag weekly
```

### Pipe Integration

```bash
# From command output
git log --oneline -5 | tana add --tag git --tag commits

# From file processing
cat todos.txt | grep "urgent" | tana add --tag urgent --tag task
```

### API Mode

```bash
# Direct to Tana (requires API token)
tana add "Important update" --api --target library

# Bulk operations
tana add --file large-dataset.txt --api --batch-size 50
```

## Tana Paste Format

The CLI generates Tana Paste format, which is a special text format that Tana recognizes:

```
%%tana%%
- My note #tag
  - Field Name:: Field Value
  - Another field:: Another value
  - Child note
    - Nested content
```

## Global Options

- `--verbose, -v` - Verbose output
- `--quiet, -q` - Suppress output  
- `--dry-run` - Show what would be done without executing
- `--config <path>` - Specify config file path

## Error Handling

The CLI provides clear error messages and suggestions:

```bash
# Missing content
$ tana add
Error: No content provided

# Invalid template
$ tana add "Note" --template invalid
Error: Template 'invalid' not found
Available templates: note, meeting, task, person, article, idea

# API errors
$ tana add "Note" --api
Error: API token not configured. Run "tana config set api.token <your-token>" first.
```

## Development

### Project Structure

```
tana-cli/
├── bin/
│   └── tana-cli.js          # Main executable
├── lib/
│   ├── commands/            # Command handlers
│   │   ├── add.js
│   │   ├── config.js
│   │   ├── paste.js
│   │   └── validate.js
│   └── utils/               # Utility modules
│       ├── config.js        # Configuration management
│       ├── paste-generator.js # Tana Paste formatter
│       └── api-client.js    # Input API wrapper
├── templates/               # Template definitions
├── examples/                # Usage examples
└── package.json
```

### Running Tests

```bash
npm test
```

### Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## License

MIT License - see LICENSE file for details.

## Related Projects

- [Tana Paste Examples](https://github.com/tanainc/tana-paste-examples) - Official examples
- [Tana Input API Samples](https://github.com/tanainc/tana-input-api-samples) - API examples
- [clip2tana](https://github.com/tanainc/clip2tana) - Browser extension

## Support

- [Tana Documentation](https://tana.inc/docs)
- [Tana Community Slack](https://tana.inc/slack)
- [GitHub Issues](https://github.com/your-repo/tana-cli/issues)
