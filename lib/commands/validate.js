const fs = require('fs-extra');
const chalk = require('chalk');

async function validateCommand(options, command) {
  const globalOptions = command.parent.opts();
  
  try {
    let hasValidation = false;

    if (options.pasteFile) {
      await validatePasteFile(options.pasteFile, globalOptions);
      hasValidation = true;
    }

    if (options.apiFile) {
      await validateAPIFile(options.apiFile, globalOptions);
      hasValidation = true;
    }

    if (options.template) {
      await validateTemplate(options.template, globalOptions);
      hasValidation = true;
    }

    if (!hasValidation) {
      console.error(chalk.red('Error: No validation target specified'));
      console.log(chalk.yellow('Usage: tana validate [options]'));
      console.log(chalk.yellow('Options:'));
      console.log(chalk.yellow('  --paste-file <file>    Validate Tana Paste format file'));
      console.log(chalk.yellow('  --api-file <file>      Validate JSON for API'));
      console.log(chalk.yellow('  --template <name>      Validate template'));
      process.exit(1);
    }

  } catch (error) {
    console.error(chalk.red(`Error: ${error.message}`));
    if (globalOptions.verbose) {
      console.error(error.stack);
    }
    process.exit(1);
  }
}

async function validatePasteFile(filePath, globalOptions) {
  if (!await fs.pathExists(filePath)) {
    throw new Error(`File not found: ${filePath}`);
  }

  const content = await fs.readFile(filePath, 'utf8');
  
  console.log(chalk.blue(`🔍 Validating Tana Paste file: ${filePath}`));
  
  const errors = [];
  const warnings = [];

  // Check if it starts with %%tana%%
  if (!content.trim().startsWith('%%tana%%')) {
    errors.push('File must start with "%%tana%%"');
  }

  // Check for common formatting issues
  const lines = content.split('\n');
  let inTanaBlock = false;
  
  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    const lineNum = i + 1;
    
    if (line.trim() === '%%tana%%') {
      inTanaBlock = true;
      continue;
    }
    
    if (!inTanaBlock) continue;
    
    // Check node formatting
    if (line.trim() && !line.match(/^(\s*)-\s+/) && !line.match(/^(\s*)%%/)) {
      warnings.push(`Line ${lineNum}: Content should start with "- " for nodes`);
    }
    
    // Check field formatting
    if (line.includes('::') && !line.match(/^(\s*)-\s+.*::/)) {
      warnings.push(`Line ${lineNum}: Fields should be formatted as "- Field Name:: Value"`);
    }
    
    // Check tag formatting
    const tagMatches = line.match(/#([^\s\]]+)/g);
    if (tagMatches) {
      tagMatches.forEach(tag => {
        if (tag.includes(' ') && !tag.startsWith('#[[')) {
          warnings.push(`Line ${lineNum}: Multi-word tag "${tag}" should be wrapped in [[]]`);
        }
      });
    }
  }

  // Report results
  if (errors.length === 0 && warnings.length === 0) {
    console.log(chalk.green('✓ Tana Paste format is valid'));
  } else {
    if (errors.length > 0) {
      console.log(chalk.red(`❌ ${errors.length} error(s) found:`));
      errors.forEach(error => console.log(chalk.red(`  • ${error}`)));
    }
    
    if (warnings.length > 0) {
      console.log(chalk.yellow(`⚠️  ${warnings.length} warning(s) found:`));
      warnings.forEach(warning => console.log(chalk.yellow(`  • ${warning}`)));
    }
    
    if (errors.length > 0) {
      process.exit(1);
    }
  }
}

async function validateAPIFile(filePath, globalOptions) {
  if (!await fs.pathExists(filePath)) {
    throw new Error(`File not found: ${filePath}`);
  }

  const content = await fs.readFile(filePath, 'utf8');
  
  console.log(chalk.blue(`🔍 Validating API JSON file: ${filePath}`));
  
  let data;
  try {
    data = JSON.parse(content);
  } catch (error) {
    console.log(chalk.red('❌ Invalid JSON format'));
    throw new Error(`JSON parsing error: ${error.message}`);
  }

  const errors = [];
  const warnings = [];

  // Validate required structure
  if (!data.nodes && !data.targetNodeId) {
    errors.push('JSON must contain either "nodes" array or be a complete API payload with "targetNodeId"');
  }

  if (data.nodes) {
    if (!Array.isArray(data.nodes)) {
      errors.push('"nodes" must be an array');
    } else if (data.nodes.length > 100) {
      warnings.push(`Large batch: ${data.nodes.length} nodes (API limit is 100 per call)`);
    }

    // Validate individual nodes
    data.nodes.forEach((node, index) => {
      if (!node.name && !node.dataType) {
        errors.push(`Node ${index}: Must have either "name" or "dataType"`);
      }
      
      if (node.dataType && !['plain', 'field', 'url', 'date', 'reference', 'boolean', 'file'].includes(node.dataType)) {
        errors.push(`Node ${index}: Invalid dataType "${node.dataType}"`);
      }
    });
  }

  // Check payload size
  const payloadSize = JSON.stringify(data).length;
  if (payloadSize > 5000) {
    warnings.push(`Large payload: ${payloadSize} characters (API limit is 5000)`);
  }

  // Report results
  if (errors.length === 0 && warnings.length === 0) {
    console.log(chalk.green('✓ API JSON format is valid'));
  } else {
    if (errors.length > 0) {
      console.log(chalk.red(`❌ ${errors.length} error(s) found:`));
      errors.forEach(error => console.log(chalk.red(`  • ${error}`)));
    }
    
    if (warnings.length > 0) {
      console.log(chalk.yellow(`⚠️  ${warnings.length} warning(s) found:`));
      warnings.forEach(warning => console.log(chalk.yellow(`  • ${warning}`)));
    }
    
    if (errors.length > 0) {
      process.exit(1);
    }
  }
}

async function validateTemplate(templateName, globalOptions) {
  console.log(chalk.blue(`🔍 Validating template: ${templateName}`));
  
  // For now, just check if it's a known template
  const knownTemplates = ['note', 'meeting', 'task', 'person', 'article', 'idea'];
  
  if (knownTemplates.includes(templateName)) {
    console.log(chalk.green(`✓ Template "${templateName}" is valid`));
  } else {
    console.log(chalk.yellow(`⚠️  Template "${templateName}" is not a built-in template`));
    console.log(chalk.gray('Available templates: ' + knownTemplates.join(', ')));
  }
}

module.exports = validateCommand;

