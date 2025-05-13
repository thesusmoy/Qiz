const fs = require('fs');
const path = require('path');
const strip = require('strip-comments');

const extensions = ['.js', '.jsx', '.mjs'];

const directories = ['app', 'components', 'hooks', 'lib', 'providers'];

const excludeDirs = ['node_modules', '.next', '.git'];

function processFile(filePath) {
  try {
    const content = fs.readFileSync(filePath, 'utf8');
    const strippedContent = strip(content);

    if (content !== strippedContent) {
      fs.writeFileSync(filePath, strippedContent, 'utf8');
      console.log(`✅ Processed: ${filePath}`);
    } else {
      console.log(`ℹ️ No comments to remove: ${filePath}`);
    }
  } catch (error) {
    console.error(`❌ Error processing ${filePath}: ${error.message}`);
  }
}

function walkDirectory(dir) {
  if (excludeDirs.includes(path.basename(dir))) {
    return;
  }

  const files = fs.readdirSync(dir);

  files.forEach((file) => {
    const filePath = path.join(dir, file);
    const stat = fs.statSync(filePath);

    if (stat.isDirectory()) {
      walkDirectory(filePath);
    } else if (extensions.includes(path.extname(file))) {
      processFile(filePath);
    }
  });
}

console.log('🔍 Starting to remove comments...');
directories.forEach((dir) => {
  const dirPath = path.join(process.cwd(), dir);
  if (fs.existsSync(dirPath)) {
    walkDirectory(dirPath);
  } else {
    console.log(`⚠️ Directory not found: ${dirPath}`);
  }
});

console.log('✨ Comment removal complete!');
