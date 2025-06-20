const fs = require('fs-extra');
const chalk = require('chalk');
const { default: clipboardy } = require('clipboardy');
const { default: ora } = require('ora');

const Config = require('../utils/config');
const TanaPasteGenerator = require('../utils/paste-generator');
const TanaAPIClient = require('../utils/api-client');

async function addCommand(content, options, command) {
  const globalOptions = command.parent.opts();
  const config = new Config();
  
  try {
    // Load configuration
    const userConfig = await config.load();
    
    // Determine mode (API or Paste)
    const mode = options.api ? 'api' : 
                 options.paste ? 'paste' : 
                 userConfig.default?.mode || 'paste';

    // Get content from various sources
    const finalContent = await getContent(content, options);
    
    if (!finalContent) {
      console.error(chalk.red('Error: No content provided'));
      process.exit(1);
    }

    // Process tags and fields
    const tags = Array.isArray(options.tag) ? options.tag : [options.tag].filter(Boolean);
    const fields = Array.isArray(options.field) ? options.field : [options.field].filter(Boolean);
    
    if (mode === 'api') {
      await handleAPIMode(finalContent, { tags, fields, ...options }, userConfig, globalOptions);
    } else {
      await handlePasteMode(finalContent, { tags, fields, ...options }, userConfig, globalOptions);
    }

  } catch (error) {
    console.error(chalk.red(`Error: ${error.message}`));
    if (globalOptions.verbose) {
      console.error(error.stack);
    }
    process.exit(1);
  }
}

async function getContent(content, options) {
  // Priority: file > stdin > direct content
  if (options.file) {
    if (await fs.pathExists(options.file)) {
      const fileContent = await fs.readFile(options.file, 'utf8');
      return fileContent.trim();
    } else {
      throw new Error(`File not found: ${options.file}`);
    }
  }
  
  // Check if stdin has data (for piped input)
  if (!process.stdin.isTTY && !content) {
    return new Promise((resolve, reject) => {
      let data = '';
      process.stdin.setEncoding('utf8');
      
      process.stdin.on('data', chunk => {
        data += chunk;
      });
      
      process.stdin.on('end', () => {
        resolve(data.trim());
      });
      
      process.stdin.on('error', reject);
    });
  }
  
  return content;
}

async function handlePasteMode(content, options, config, globalOptions) {
  const generator = new TanaPasteGenerator();
  
  let pasteContent;
  if (options.template) {
    pasteContent = generator.applyTemplate(content, options.template, {});
  } else {
    pasteContent = generator.generate(content, {
      tags: options.tags,
      fields: options.fields
    });
  }

  if (globalOptions.verbose) {
    console.log(chalk.blue('→ Mode: paste'));
    console.log(chalk.blue('→ Generated Tana Paste format:'));
    console.log(chalk.gray(pasteContent));
  }

  if (globalOptions.dryRun) {
    console.log(chalk.yellow('Dry run - would generate:'));
    console.log(pasteContent);
    return;
  }

  // Output handling
  if (options.stdout) {
    console.log(pasteContent);
  } else {
    // Copy to clipboard (default)
    const spinner = ora('Copying to clipboard...').start();
    try {
      await clipboardy.write(pasteContent);
      spinner.succeed(chalk.green(`✓ Added note "${content.substring(0, 50)}${content.length > 50 ? '...' : ''}" to clipboard`));
      
      if (!globalOptions.quiet) {
        console.log(chalk.gray('Paste into Tana to create the note'));
      }
    } catch (error) {
      spinner.fail(chalk.red('Failed to copy to clipboard'));
      throw error;
    }
  }
}

async function handleAPIMode(content, options, config, globalOptions) {
  const apiClient = new TanaAPIClient(config);
  
  if (globalOptions.verbose) {
    console.log(chalk.blue('→ Mode: API'));
    console.log(chalk.blue(`→ Target: ${options.target}`));
    console.log(chalk.blue(`→ Tags: ${options.tags.join(', ') || 'none'}`));
    console.log(chalk.blue(`→ Fields: ${options.fields.join(', ') || 'none'}`));
  }

  if (globalOptions.dryRun) {
    const payload = apiClient.createNode(content, {
      tags: options.tags,
      fields: options.fields,
      target: options.target
    });
    console.log(chalk.yellow('Dry run - would send to API:'));
    console.log(JSON.stringify(payload, null, 2));
    return;
  }

  const spinner = ora('Sending to Tana API...').start();
  
  try {
    const result = await apiClient.addContent(content, {
      tags: options.tags,
      fields: options.fields,
      target: options.target
    });
    
    spinner.succeed(chalk.green(`✓ Added note "${content.substring(0, 50)}${content.length > 50 ? '...' : ''}" to Tana`));
    
    if (globalOptions.verbose && result) {
      console.log(chalk.gray('API Response:'), result);
    }
  } catch (error) {
    spinner.fail(chalk.red('Failed to add to Tana'));
    throw error;
  }
}

module.exports = addCommand;

