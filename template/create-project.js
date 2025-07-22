#!/usr/bin/env node

/**
 * NodeJsEmailer Project Template Generator
 * Creates a new email service project based on the NodeJsEmailer template
 */

const fs = require('fs');
const path = require('path');
const readline = require('readline');

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

// Template configuration
const templateConfig = {
  PROJECT_NAME: '',
  PROJECT_DESCRIPTION: '',
  AUTHOR_NAME: '',
  REPOSITORY_URL: '',
  EMAIL_HOST: 'smtp.gmail.com',
  EMAIL_PORT: '587',
  EMAIL_SECURE: 'false',
  EMAIL_USER: 'your-email@gmail.com',
  EMAIL_PASS: 'your-app-password',
  KAFKA_BROKERS: 'localhost:9092',
  KAFKA_CLIENT_ID: '',
  KAFKA_GROUP_ID: '',
  KAFKA_TOPIC: 'email-notifications',
  PORT: '3000',
  NODE_ENV: 'development'
};

// Files to copy from source
const filesToCopy = [
  'src/',
  'docker-compose.yml',
  '.gitignore'
];

// Template files to process
const templateFiles = [
  { source: 'template/package.json.template', target: 'package.json' },
  { source: 'template/env.template', target: '.env.example' },
  { source: 'template/README.template.md', target: 'README.md' }
];

function askQuestion(question) {
  return new Promise((resolve) => {
    rl.question(question, (answer) => {
      resolve(answer.trim());
    });
  });
}

function replaceTemplateVariables(content, config) {
  let result = content;
  for (const [key, value] of Object.entries(config)) {
    const regex = new RegExp(`{{${key}}}`, 'g');
    result = result.replace(regex, value);
  }
  return result;
}

function copyDirectory(src, dest) {
  if (!fs.existsSync(dest)) {
    fs.mkdirSync(dest, { recursive: true });
  }

  const entries = fs.readdirSync(src, { withFileTypes: true });

  for (const entry of entries) {
    const srcPath = path.join(src, entry.name);
    const destPath = path.join(dest, entry.name);

    if (entry.isDirectory()) {
      copyDirectory(srcPath, destPath);
    } else {
      fs.copyFileSync(srcPath, destPath);
    }
  }
}

async function generateProject() {
  console.log('🚀 NodeJsEmailer Project Template Generator\n');

  // Collect project information
  templateConfig.PROJECT_NAME = await askQuestion('Project name: ');
  templateConfig.PROJECT_DESCRIPTION = await askQuestion('Project description: ');
  templateConfig.AUTHOR_NAME = await askQuestion('Author name: ');
  templateConfig.REPOSITORY_URL = await askQuestion('Repository URL (optional): ');
  
  // Set derived values
  templateConfig.KAFKA_CLIENT_ID = templateConfig.PROJECT_NAME.toLowerCase().replace(/\s+/g, '-');
  templateConfig.KAFKA_GROUP_ID = `${templateConfig.KAFKA_CLIENT_ID}-consumer-group`;

  const projectDir = templateConfig.PROJECT_NAME.toLowerCase().replace(/\s+/g, '-');
  const targetPath = path.join(process.cwd(), projectDir);

  console.log(`\n📁 Creating project in: ${targetPath}\n`);

  // Create project directory
  if (!fs.existsSync(targetPath)) {
    fs.mkdirSync(targetPath, { recursive: true });
  }

  // Copy source files
  console.log('📋 Copying source files...');
  for (const file of filesToCopy) {
    const sourcePath = path.join(__dirname, '..', file);
    const destPath = path.join(targetPath, file);
    
    if (fs.existsSync(sourcePath)) {
      if (fs.statSync(sourcePath).isDirectory()) {
        copyDirectory(sourcePath, destPath);
      } else {
        fs.copyFileSync(sourcePath, destPath);
      }
      console.log(`  ✅ ${file}`);
    }
  }

  // Process template files
  console.log('\n🎨 Processing template files...');
  for (const template of templateFiles) {
    const sourcePath = path.join(__dirname, '..', template.source);
    const destPath = path.join(targetPath, template.target);
    
    if (fs.existsSync(sourcePath)) {
      const content = fs.readFileSync(sourcePath, 'utf8');
      const processedContent = replaceTemplateVariables(content, templateConfig);
      fs.writeFileSync(destPath, processedContent);
      console.log(`  ✅ ${template.target}`);
    }
  }

  console.log('\n🎉 Project created successfully!\n');
  console.log('Next steps:');
  console.log(`  1. cd ${projectDir}`);
  console.log('  2. npm install');
  console.log('  3. cp .env.example .env');
  console.log('  4. Edit .env with your configuration');
  console.log('  5. docker-compose up -d');
  console.log('  6. npm start');
  console.log('\n📚 See README.md for detailed instructions.');

  rl.close();
}

// Handle command line arguments
if (process.argv.includes('--help') || process.argv.includes('-h')) {
  console.log(`
NodeJsEmailer Project Template Generator

Usage:
  node create-project.js

Options:
  -h, --help    Show this help message

This script will create a new email service project based on the NodeJsEmailer template.
It will ask for project details and generate all necessary files.
  `);
  process.exit(0);
}

// Run the generator
generateProject().catch((error) => {
  console.error('❌ Error creating project:', error);
  process.exit(1);
});
