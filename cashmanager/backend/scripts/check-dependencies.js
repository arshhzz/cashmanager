const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

const requiredDependencies = [
  'express',
  'mongoose',
  'bcrypt',
  'jsonwebtoken',
  'cors',
  'helmet',
  'dotenv',
  'morgan',
  'winston',
  'zod',
  'express-rate-limit'
];

const devDependencies = [
  'nodemon',
  'jest',
  'eslint'
];

function checkDependencies() {
  console.log('Checking dependencies...');
  
  try {
    // Read package.json
    const packageJson = JSON.parse(fs.readFileSync(path.join(__dirname, '../package.json'), 'utf8'));
    const installedDeps = { ...packageJson.dependencies, ...packageJson.devDependencies };
    
    // Check required dependencies
    const missingDeps = requiredDependencies.filter(dep => !installedDeps[dep]);
    const missingDevDeps = devDependencies.filter(dep => !installedDeps[dep]);
    
    if (missingDeps.length > 0 || missingDevDeps.length > 0) {
      console.log('Installing missing dependencies...');
      
      if (missingDeps.length > 0) {
        execSync(`npm install ${missingDeps.join(' ')}`, { stdio: 'inherit' });
      }
      
      if (missingDevDeps.length > 0) {
        execSync(`npm install --save-dev ${missingDevDeps.join(' ')}`, { stdio: 'inherit' });
      }
      
      console.log('All dependencies installed successfully!');
    } else {
      console.log('All dependencies are already installed.');
    }
    
    // Check Node.js version
    const nodeVersion = process.version;
    const requiredVersion = packageJson.engines?.node?.replace('>=', '');
    
    if (requiredVersion && !nodeVersion.startsWith(`v${requiredVersion}`)) {
      console.warn(`Warning: Node.js version ${requiredVersion} or higher is required. Current version: ${nodeVersion}`);
    }
    
  } catch (error) {
    console.error('Error checking dependencies:', error);
    process.exit(1);
  }
}

checkDependencies(); 