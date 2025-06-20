const chalk = require('chalk');
const Config = require('../utils/config');

async function configCommand(action, key, value, options, command) {
  const config = new Config();
  const globalOptions = command.parent.opts();

  try {
    switch (action) {
      case 'init':
        await config.init();
        console.log(chalk.green(`✓ Configuration initialized at ${config.configFile}`));
        break;

      case 'set':
        if (!key) {
          console.error(chalk.red('Error: Key is required for set command'));
          console.log(chalk.yellow('Usage: tana config set <key> <value>'));
          console.log(chalk.gray('Example: tana config set api.token your-token'));
          process.exit(1);
        }
        if (value === undefined) {
          console.error(chalk.red('Error: Value is required for set command'));
          process.exit(1);
        }
        await config.set(key, value);
        console.log(chalk.green(`✓ Set ${key} = ${value}`));
        break;

      case 'get':
        if (!key) {
          console.error(chalk.red('Error: Key is required for get command'));
          console.log(chalk.yellow('Usage: tana config get <key>'));
          process.exit(1);
        }
        const val = await config.get(key);
        if (val !== null) {
          console.log(val);
        } else {
          console.error(chalk.red(`Key '${key}' not found in configuration`));
          process.exit(1);
        }
        break;

      case 'show':
        const fullConfig = await config.load();
        console.log(JSON.stringify(fullConfig, null, 2));
        break;

      default:
        if (!action) {
          // No action provided, show current config
          const currentConfig = await config.load();
          console.log(chalk.blue('Current configuration:'));
          console.log(JSON.stringify(currentConfig, null, 2));
        } else {
          console.error(chalk.red(`Unknown action: ${action}`));
          console.log(chalk.yellow('Available actions: init, set, get, show'));
          process.exit(1);
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

module.exports = configCommand;