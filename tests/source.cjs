const fs = require('node:fs');
const path = require('node:path');
const src = path.join(__dirname, '..', 'src');
module.exports = fs.readFileSync(path.join(src, 'layout.html'), 'utf8').replace(/\{\{([^{}]+)\}\}/g, (_, name) => {
  if (!/^[a-z0-9-]+\.(js|css)$/.test(name)) throw new Error(`Invalid source include: ${name}`);
  const tag = name.endsWith('.js') ? 'script' : 'style';
  return `<${tag}>\n${fs.readFileSync(path.join(src, name), 'utf8')}</${tag}>`;
});
