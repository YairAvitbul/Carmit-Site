// generateMenu.js
const fs = require('fs');
const path = require('path');

/**
 * בונה עצים של קבצים ותיקיות,
 * מחזיר מערך של אובייקטים { name, path, children? }
 */
function buildTree(dir, baseUrl = '') {
  return fs.readdirSync(dir, { withFileTypes: true })
    // מיון אלפאביתי: תיקיות לפני קבצים
    .sort((a, b) => {
      if (a.isDirectory() && !b.isDirectory()) return -1;
      if (!a.isDirectory() && b.isDirectory()) return 1;
      return a.name.localeCompare(b.name, 'he');
    })
    .map(dirent => {
      const name = dirent.name;
      const fullPath = path.join(dir, name);
      const urlPath = path.posix.join(baseUrl, encodeURIComponent(name));
      if (dirent.isDirectory()) {
        return {
          name,
          path: null,
          children: buildTree(fullPath, urlPath)
        };
      } else {
        return {
          name,
          path: urlPath
        };
      }
    });
}

// נתיב לתיקיית "מידע טכני"
const docsDir = path.join(__dirname, 'docs', 'מידע טכני');
const tree = buildTree(docsDir, 'docs/מידע טכני');

fs.writeFileSync(
  path.join(__dirname, 'docs', 'menu.json'),
  JSON.stringify(tree, null, 2),
  'utf8'
);

console.log('✅ menu.json נוצר בהצלחה ב־docs/menu.json');
