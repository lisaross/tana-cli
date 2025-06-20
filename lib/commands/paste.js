const chalk = require('chalk');
const { default: clipboardy } = require('clipboardy');
const TanaPasteGenerator = require('../utils/paste-generator');

async function pasteCommand(content, options, command) {
  const globalOptions = command.parent.opts();
  
  try {
    if (!content) {
      console.error(chalk.red('Error: Content is required'));
      console.log(chalk.yellow('Usage: tana paste <content>'));
      console.log(chalk.yellow('Example: tana paste "My note" --tag idea'));
      process.exit(1);
    }

    const generator = new TanaPasteGenerator();
    
    // Process tags and fields
    const tags = Array.isArray(options.tag) ? options.tag : [options.tag].filter(Boolean);
    const fields = Array.isArray(options.field) ? options.field : [options.field].filter(Boolean);
    
    let pasteContent;
    if (options.template) {
      pasteContent = generator.applyTemplate(content, options.template, {});
    } else {
      pasteContent = generator.generate(content, { tags, fields });
    }

    if (globalOptions.verbose) {
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
      await clipboardy.write(pasteContent);
      console.log(chalk.green(`✓ Tana Paste format copied to clipboard`));
      
      if (!globalOptions.quiet) {
        console.log(chalk.gray('Paste into Tana to create the note'));
      }
    }

  } catch (error) {
    console.error(chalk.red(`Error: ${error.message}`));
    if (globalOptions.verbose) {
      console.error(error.stack);
    }
    process.exit(1);
  }
}

module.exports = pasteCommand;

