const fs = require('fs-extra');
const path = require('path');
const os = require('os');
const yaml = require('js-yaml');

class Config {
  constructor() {
    this.configDir = this.getConfigDir();
    this.configFile = path.join(this.configDir, 'config.yaml');
    this.defaultConfig = {
      default: {
        mode: 'paste',
        target: 'inbox',
        workspace: null
      },
      api: {
        token: null,
        endpoint: 'https://europe-west1-tagr-prod.cloudfunctions.net/addToNodeV2',
        rate_limit: 1,
        timeout: 30
      },
      paste: {
        auto_clipboard: true,
        format_style: 'standard'
      },
      templates: {
        note: {
          supertags: [],
          fields: []
        },
        meeting: {
          supertags: ['meeting'],
          fields: ['attendees', 'agenda', 'notes', 'date']
        },
        task: {
          supertags: ['task'],
          fields: ['status', 'priority', 'due_date', 'assignee']
        }
      }
    };
  }

  getConfigDir() {
    const platform = os.platform();
    if (platform === 'win32') {
      return path.join(os.homedir(), 'AppData', 'Roaming', 'tana-cli');
    } else {
      return path.join(os.homedir(), '.config', 'tana-cli');
    }
  }

  async ensureConfigDir() {
    await fs.ensureDir(this.configDir);
  }

  async load() {
    try {
      if (await fs.pathExists(this.configFile)) {
        const content = await fs.readFile(this.configFile, 'utf8');
        return yaml.load(content);
      } else {
        return this.defaultConfig;
      }
    } catch (error) {
      console.warn(`Warning: Could not load config file: ${error.message}`);
      return this.defaultConfig;
    }
  }

  async save(config) {
    await this.ensureConfigDir();
    const yamlContent = yaml.dump(config, { 
      defaultFlowStyle: false,
      lineWidth: -1 
    });
    await fs.writeFile(this.configFile, yamlContent, 'utf8');
  }

  async get(key) {
    const config = await this.load();
    return this.getNestedValue(config, key);
  }

  async set(key, value) {
    const config = await this.load();
    this.setNestedValue(config, key, value);
    await this.save(config);
  }

  async init() {
    await this.save(this.defaultConfig);
    return this.configFile;
  }

  getNestedValue(obj, key) {
    return key.split('.').reduce((current, prop) => {
      return current && current[prop] !== undefined ? current[prop] : null;
    }, obj);
  }

  setNestedValue(obj, key, value) {
    const keys = key.split('.');
    const lastKey = keys.pop();
    const target = keys.reduce((current, prop) => {
      if (!current[prop]) current[prop] = {};
      return current[prop];
    }, obj);
    target[lastKey] = value;
  }

  async exists() {
    return await fs.pathExists(this.configFile);
  }
}

module.exports = Config;

