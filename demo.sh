#!/bin/bash

# Tana CLI Demonstration Script
# This script demonstrates the key features of the Tana CLI tool

echo "🚀 Tana CLI Demonstration"
echo "========================="
echo

# Show version and help
echo "📋 1. Basic CLI Information"
echo "Version:"
./bin/tana-cli.js --version
echo
echo "Available commands:"
./bin/tana-cli.js --help
echo

# Configuration
echo "⚙️  2. Configuration Management"
echo "Current configuration:"
./bin/tana-cli.js config show
echo

# Basic note creation
echo "📝 3. Basic Note Creation"
echo "Simple note:"
./bin/tana-cli.js paste "My first CLI note" --stdout
echo

echo "Note with tags:"
./bin/tana-cli.js paste "Meeting notes" --tag meeting --tag project --stdout
echo

echo "Note with tags and fields:"
./bin/tana-cli.js paste "John Doe" --tag person --field "email:john@example.com" --field "role:developer" --stdout
echo

# File input
echo "📁 4. File Input"
echo "Content from file:"
./bin/tana-cli.js add --file examples/sample-notes.txt --tag imported --dry-run
echo

# Pipe input
echo "🔄 5. Pipe Input"
echo "Content from pipe:"
echo "Quick note from command line" | ./bin/tana-cli.js add --tag cli --tag quick --dry-run
echo

# Validation
echo "🔍 6. Validation"
echo "Creating test file..."
cat > demo-test.txt << 'EOF'
%%tana%%
- Demo note #demo
  - Author:: Tana CLI
  - Date:: 2025-06-19
  - Status:: Complete
EOF

echo "Validating Tana Paste format:"
./bin/tana-cli.js validate --paste-file demo-test.txt
echo

# Template usage (simulated)
echo "📋 7. Template Usage"
echo "Using meeting template:"
./bin/tana-cli.js paste "Weekly standup" --tag meeting --field "attendees:Alice, Bob" --field "date:2025-06-19" --stdout
echo

# API mode simulation
echo "🌐 8. API Mode (Dry Run)"
echo "API mode with dry run:"
./bin/tana-cli.js add "Important update" --api --tag urgent --field "priority:high" --dry-run
echo

# Complex example
echo "🎯 9. Complex Example"
echo "Complex structured note:"
./bin/tana-cli.js paste "Project Alpha Review" \
  --tag project --tag review \
  --field "status:in-progress" \
  --field "due-date:2025-07-01" \
  --field "team:Engineering" \
  --stdout
echo

# Cleanup
rm -f demo-test.txt test-paste.txt

echo "✅ Demonstration complete!"
echo
echo "🔗 Next steps:"
echo "1. Set up API token: tana config set api.token <your-token>"
echo "2. Try real API mode: tana add 'My note' --api"
echo "3. Use clipboard mode: tana add 'My note' (copies to clipboard)"
echo "4. Explore templates and custom workflows"

