# Tana CLI Research

## Tana Overview

- Tana is a graph-based note-taking and productivity app
- Features supertags, AI integration, daily pages, and structured data
- Combines outliner and relational note-taking with AI capabilities

## Tana Input API (addToNodeV2)

**Endpoint**: `https://europe-west1-tagr-prod.cloudfunctions.net/addToNodeV2`

### Key Features

- POST-only API for adding data to Tana workspaces
- Can create nodes, fields, supertags, edit nodes, and upload files
- Requires API token (generated per workspace in Tana settings)

### Restrictions

- POST only (no read operations yet)
- One call per second per token
- Maximum 100 nodes per call
- Payload size limited to 5000 characters
- Won't sync on workspaces with more than 750k nodes

### Supported Data Types

- Plain nodes (text content)
- Reference nodes (links to other nodes)
- Date nodes (ISO 8601 format)
- URL nodes
- Boolean/checkbox nodes
- File attachments (base64 encoded)

### Node Structure

- `targetNodeId`: Where nodes will be created (Library, SCHEMA, INBOX, or specific nodeID)
- `nodes`: Array of node objects
- Each node can have: name, description, dataType, supertags, children, fields

### Authentication

- API tokens generated per workspace in Tana client
- Settings > API Tokens > Create token

## Next Steps

- Research Tana paste functionality
- Look for existing CLI tools
- Evaluate use cases and demand

## Tana Paste Format

**Trigger**: Text starting with `%%tana%%`

### Syntax (Markdown-based)

- **Nodes**: Prepended by `-` (dash and space), indentation for children
- **References**: `[[node name]]` or `[[name^nodeID]]` or `[[name #tag]]`
- **Fields**: `field name::field value`
- **Supertags**: `#tag` or `#[[multi word tag]]`
- **Dates**: `[[date:2021-02-01]]` or `[[date:2021-02/2021-04-05]]` (ranges)
- **Checkboxes**: `[ ]` (unchecked) or `[x]` (checked)
- **URLs**: `[name](url)`
- **Search nodes**: `%%search%%` with search expression indented
- **Views**: `%%view:table%%`, `%%view:cards%%`, etc.
- **Formatting**: `**bold**`, `^^highlight^^`, `__italic__`
- **Headings**: Start with `!!`

### Limitations

- Not for large data imports (use API for heavy lifting)
- Cannot update existing information, only creates new
- One-off, small generative results

## Existing Tools

### Raycast Extension (2,304 installs)

- Quick Add: Write notes and send to Tana
- Manage Supertags and Target Nodes
- Limitations: Single-node plaintext only, no field modification

### GitHub Examples (91 stars, 21 forks)

Scripts for generating Tana Paste output:

- RSS feed fetcher
- GitHub PR fetcher
- Twitter/X tweet fetcher
- Hypothesis annotations
- Readwise highlights
- Calendar events (macOS)
- Zotero bibliography
- Things 3 tasks

### No Existing CLI Tool Found

- No dedicated terminal-based Tana CLI exists
- Current tools are mostly GUI-based (Raycast) or script examples
- Gap in the market for a comprehensive CLI tool
