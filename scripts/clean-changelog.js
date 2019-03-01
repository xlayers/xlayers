const fs = require('fs');
let lines = fs.readFileSync('CHANGELOG.md', 'UTF-8').toString();
const cache = {};
const dedup = '@@@@@';

lines = lines
  .split('\n')
  .map(line => {
    if (line.startsWith('*')) {
      const commitMessage = line.split('(')[0];
      cache[commitMessage] = (cache[commitMessage] || 0) + 1;
      return cache[commitMessage] === 1 ? line : dedup;
    }
    return line;
  })
  .filter(line => line !== dedup);

fs.writeFileSync('CHANGELOG.md', lines.join('\n'), 'UTF-8');
