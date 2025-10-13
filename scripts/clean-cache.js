const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

function deleteRecursive(dirPath) {
  if (fs.existsSync(dirPath)) {
    fs.readdirSync(dirPath).forEach((file) => {
      const curPath = path.join(dirPath, file);
      if (fs.lstatSync(curPath).isDirectory()) {
        deleteRecursive(curPath);
      } else {
        fs.unlinkSync(curPath);
      }
    });
    fs.rmdirSync(dirPath);
  }
}

console.log('Cleaning Next.js cache...\n');

const webNextDir = path.join(__dirname, '..', 'apps', 'web', '.next');

if (fs.existsSync(webNextDir)) {
  console.log(`Deleting: ${webNextDir}`);
  try {
    deleteRecursive(webNextDir);
    console.log('Successfully deleted .next directory');
  } catch (error) {
    console.error('Error deleting .next:', error.message);
  }
} else {
  console.log('.next directory does not exist');
}

console.log('\nCache cleanup complete!');
