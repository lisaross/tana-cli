const axios = require('axios');

class TanaAPIClient {
  constructor(config) {
    this.config = config;
    this.endpoint = config.api?.endpoint || 'https://europe-west1-tagr-prod.cloudfunctions.net/addToNodeV2';
    this.token = config.api?.token;
    this.timeout = (config.api?.timeout || 30) * 1000;
    this.rateLimit = config.api?.rate_limit || 1; // calls per second
    this.lastCallTime = 0;
  }

  async makeRequest(payload) {
    if (!this.token) {
      throw new Error('API token not configured. Run "tana config set api.token <your-token>" first.');
    }

    // Rate limiting
    await this.enforceRateLimit();

    try {
      const response = await axios.post(this.endpoint, payload, {
        headers: {
          'Authorization': `Bearer ${this.token}`,
          'Content-Type': 'application/json'
        },
        timeout: this.timeout
      });

      return response.data;
    } catch (error) {
      if (error.response) {
        throw new Error(`API Error ${error.response.status}: ${error.response.data?.message || error.response.statusText}`);
      } else if (error.request) {
        throw new Error('Network error: Could not reach Tana API');
      } else {
        throw new Error(`Request error: ${error.message}`);
      }
    }
  }

  async enforceRateLimit() {
    const now = Date.now();
    const timeSinceLastCall = now - this.lastCallTime;
    const minInterval = 1000 / this.rateLimit; // milliseconds between calls

    if (timeSinceLastCall < minInterval) {
      const waitTime = minInterval - timeSinceLastCall;
      await new Promise(resolve => setTimeout(resolve, waitTime));
    }

    this.lastCallTime = Date.now();
  }

  createNode(content, options = {}) {
    const { tags = [], fields = [], target = 'INBOX', children = [] } = options;

    const node = {
      name: content,
      dataType: 'plain'
    };

    // Add supertags
    if (tags.length > 0) {
      node.supertags = tags.map(tag => ({ id: tag }));
    }

    // Add children (fields and other content)
    if (fields.length > 0 || children.length > 0) {
      node.children = [];

      // Add fields as children
      fields.forEach(field => {
        const [name, value] = this.parseField(field);
        node.children.push({
          type: 'field',
          attributeId: name, // This would need to be resolved to actual field ID
          children: [{ name: value }]
        });
      });

      // Add other children
      children.forEach(child => {
        if (typeof child === 'string') {
          node.children.push({ name: child });
        } else {
          node.children.push(child);
        }
      });
    }

    return {
      targetNodeId: target.toUpperCase(),
      nodes: [node]
    };
  }

  parseField(field) {
    if (typeof field === 'string' && field.includes(':')) {
      const [name, ...valueParts] = field.split(':');
      return [name.trim(), valueParts.join(':').trim()];
    }
    return [field, ''];
  }

  async addContent(content, options = {}) {
    const payload = this.createNode(content, options);
    return await this.makeRequest(payload);
  }

  async addMultipleNodes(nodes, options = {}) {
    const { target = 'INBOX', batchSize = 50 } = options;
    const results = [];

    // Process in batches to respect API limits
    for (let i = 0; i < nodes.length; i += batchSize) {
      const batch = nodes.slice(i, i + batchSize);
      const payload = {
        targetNodeId: target.toUpperCase(),
        nodes: batch.map(node => {
          if (typeof node === 'string') {
            return { name: node, dataType: 'plain' };
          }
          return node;
        })
      };

      const result = await this.makeRequest(payload);
      results.push(result);
    }

    return results;
  }

  // Utility methods for different node types
  createReferenceNode(nodeId) {
    return {
      dataType: 'reference',
      id: nodeId
    };
  }

  createDateNode(date) {
    return {
      dataType: 'date',
      name: date instanceof Date ? date.toISOString().split('T')[0] : date
    };
  }

  createURLNode(name, url) {
    return {
      name: name,
      children: [{
        type: 'field',
        attributeId: 'URL', // This would need proper field ID
        children: [{
          dataType: 'url',
          name: url
        }]
      }]
    };
  }

  createCheckboxNode(name, checked = false) {
    return {
      dataType: 'boolean',
      name: name,
      value: checked
    };
  }

  createFileNode(filename, base64Data, contentType) {
    return {
      dataType: 'file',
      file: base64Data,
      filename: filename,
      contentType: contentType
    };
  }
}

module.exports = TanaAPIClient;

