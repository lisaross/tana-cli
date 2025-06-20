class TanaPasteGenerator {
  constructor() {
    this.header = '%%tana%%';
  }

  generate(content, options = {}) {
    const { tags = [], fields = [], template = null, children = [] } = options;
    
    let output = this.header + '\n';
    
    // Main content node
    output += this.formatNode(content, { tags, fields, children });
    
    return output;
  }

  formatNode(content, options = {}, indent = 0) {
    const { tags = [], fields = [], children = [] } = options;
    const indentStr = '  '.repeat(indent);
    
    let nodeStr = `${indentStr}- ${content}`;
    
    // Add supertags
    if (tags.length > 0) {
      tags.forEach(tag => {
        nodeStr += ` #${this.formatTag(tag)}`;
      });
    }
    
    nodeStr += '\n';
    
    // Add fields as children
    fields.forEach(field => {
      const [name, value] = this.parseField(field);
      nodeStr += `${indentStr}  - ${name}:: ${value}\n`;
    });
    
    // Add additional children
    children.forEach(child => {
      if (typeof child === 'string') {
        nodeStr += `${indentStr}  - ${child}\n`;
      } else {
        nodeStr += this.formatNode(child.content, child, indent + 1);
      }
    });
    
    return nodeStr;
  }

  formatTag(tag) {
    // Handle multi-word tags
    if (tag.includes(' ') || tag.includes('-')) {
      return `[[${tag}]]`;
    }
    return tag;
  }

  parseField(field) {
    if (typeof field === 'string' && field.includes(':')) {
      const [name, ...valueParts] = field.split(':');
      return [name.trim(), valueParts.join(':').trim()];
    }
    return [field, ''];
  }

  formatReference(text, nodeId = null) {
    if (nodeId) {
      return `[[${text}^${nodeId}]]`;
    }
    return `[[${text}]]`;
  }

  formatDate(date) {
    if (date instanceof Date) {
      return `[[date:${date.toISOString().split('T')[0]}]]`;
    }
    if (typeof date === 'string') {
      return `[[date:${date}]]`;
    }
    return date;
  }

  formatURL(text, url) {
    return `[${text}](${url})`;
  }

  formatCheckbox(checked = false) {
    return checked ? '[x]' : '[ ]';
  }

  applyTemplate(content, templateName, templateData = {}) {
    // This would load template definitions and apply them
    // For now, return basic structure
    const templates = {
      meeting: {
        tags: ['meeting'],
        fields: ['date', 'attendees', 'agenda']
      },
      task: {
        tags: ['task'],
        fields: ['status', 'priority', 'due_date']
      },
      note: {
        tags: ['note'],
        fields: []
      }
    };

    const template = templates[templateName];
    if (!template) {
      throw new Error(`Template '${templateName}' not found`);
    }

    const options = {
      tags: template.tags,
      fields: template.fields.map(field => {
        const value = templateData[field] || '';
        return `${field}:${value}`;
      }).filter(field => field.split(':')[1]) // Only include fields with values
    };

    return this.generate(content, options);
  }

  // Utility method to create structured content
  createStructuredContent(data) {
    if (Array.isArray(data)) {
      return data.map(item => this.createStructuredContent(item)).join('\n');
    }
    
    if (typeof data === 'object' && data !== null) {
      const { title, content, tags, fields, children } = data;
      return this.generate(title || content, { tags, fields, children });
    }
    
    return this.generate(data);
  }
}

module.exports = TanaPasteGenerator;

