# GitHub Setup Guide

## Steps to publish tana-cli on GitHub

### 1. Create GitHub Repository
1. Go to [GitHub](https://github.com) and create a new repository
2. Name it `tana-cli`
3. Keep it public for npm publishing
4. **Don't** initialize with README (we already have one)

### 2. Update Repository URLs
Replace `YOUR_USERNAME` in these files with your actual GitHub username:

**package.json:**
```json
"repository": {
  "type": "git", 
  "url": "https://github.com/YOUR_USERNAME/tana-cli.git"
},
"bugs": {
  "url": "https://github.com/YOUR_USERNAME/tana-cli/issues"
},
"homepage": "https://github.com/YOUR_USERNAME/tana-cli#readme"
```

**README.md:**
```bash
git clone https://github.com/YOUR_USERNAME/tana-cli.git
```

### 3. Push to GitHub
```bash
# Add your GitHub repository as remote
git remote add origin https://github.com/YOUR_USERNAME/tana-cli.git

# Push the code
git branch -M main
git push -u origin main
```

### 4. Optional: Publish to npm
```bash
# Login to npm (one-time setup)
npm login

# Publish the package
npm publish
```

### 5. Update Author Information
In `package.json`, update:
```json
"author": "Your Name <your.email@example.com>"
```

## What's Ready for GitHub

✅ **Complete CLI functionality**
- Quick capture: `tana "note"`
- Advanced features with tags/fields
- Configuration management
- Validation tools

✅ **Proper project structure**
- `bin/tana` - executable CLI
- `lib/` - organized command and utility modules
- Comprehensive README
- .gitignore with Node.js patterns

✅ **Documentation**
- README with installation and usage examples
- CLAUDE.md for development guidance
- Integration examples (Alfred, Raycast, shell)

✅ **npm ready**
- Correct package.json with dependencies
- Proper file inclusion list
- Version 0.1.0 ready for first release

## What Users Will Get

Once published, users can:

```bash
# Install globally
npm install -g tana-cli

# Use immediately
tana "My first note"
tana add "Meeting notes" --tag meeting
tana config set api.token YOUR_TOKEN
```

This transforms from a broken inherited project to a production-ready CLI tool!