#!/usr/bin/env node

const fs = require('fs');
const path = require('path');
const readline = require('readline');

// Couleurs pour le terminal
const colors = {
  reset: '\x1b[0m',
  bright: '\x1b[1m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  red: '\x1b[31m',
};

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

// Fonction pour poser une question
const question = (query) => new Promise((resolve) => rl.question(query, resolve));

// Logo ASCII
const logo = `
${colors.green}
 _    _ _           _       _____ _                
| |  | | |         | |     / ____| |               
| |  | | |__   __ _| |_ ___| |    | | ___  ___  ___ 
| |/\\| | '_ \\ / _\` | __/ __| |    | |/ _ \\/ __|/ _ \\
\\  /\\  / | | | (_| | |_\\__ \\ |____| | (_) \\__ \\  __/
 \\/  \\/|_| |_|\\__,_|\\__|___/\\_____|_|\\___/|___/\\___|
                                                     
${colors.reset}
`;

// Configuration principale
async function setup() {
  console.clear();
  console.log(logo);
  console.log(`${colors.blue}${colors.bright}🚀 Configuration de WhatsClose Survey Experience${colors.reset}\n`);

  // Vérifier si .env.local existe déjà
  const envPath = path.join(process.cwd(), '.env.local');
  const envExamplePath = path.join(process.cwd(), '.env.example');
  
  if (fs.existsSync(envPath)) {
    const overwrite = await question(
      `${colors.yellow}⚠️  Le fichier .env.local existe déjà. Voulez-vous le remplacer ? (y/n) ${colors.reset}`
    );
    
    if (overwrite.toLowerCase() !== 'y') {
      console.log(`${colors.blue}Configuration annulée.${colors.reset}`);
      rl.close();
      return;
    }
  }

  // Questions de configuration
  console.log(`\n${colors.bright}📋 Configuration de l'application${colors.reset}\n`);

  const config = {
    appName: await question(`Nom de l'application (WhatsClose): `) || 'WhatsClose',
    appUrl: await question(`URL de l'application (http://localhost:3000): `) || 'http://localhost:3000',
    apiUrl: await question(`URL de l'API (optionnel): `) || '',
    gaId: await question(`Google Analytics ID (optionnel): `) || '',
    emailFrom: await question(`Email d'envoi (optionnel): `) || '',
  };

  // Créer le contenu du fichier .env.local
  const envContent = `# Application
NEXT_PUBLIC_APP_NAME=${config.appName}
NEXT_PUBLIC_APP_URL=${config.appUrl}

# API
NEXT_PUBLIC_API_URL=${config.apiUrl || '/api'}

# Analytics
NEXT_PUBLIC_GA_ID=${config.gaId}

# Email
EMAIL_FROM=${config.emailFrom}
EMAIL_TO=${config.emailFrom}

# Generated at ${new Date().toISOString()}
`;

  // Écrire le fichier
  try {
    fs.writeFileSync(envPath, envContent);
    console.log(`\n${colors.green}✅ Fichier .env.local créé avec succès !${colors.reset}`);
  } catch (error) {
    console.error(`${colors.red}❌ Erreur lors de la création du fichier : ${error.message}${colors.reset}`);
  }

  // Installer les dépendances si nécessaire
  const installDeps = await question(
    `\n${colors.blue}Voulez-vous installer les dépendances maintenant ? (y/n) ${colors.reset}`
  );

  if (installDeps.toLowerCase() === 'y') {
    console.log(`\n${colors.yellow}📦 Installation des dépendances...${colors.reset}\n`);
    
    const { exec } = require('child_process');
    const npmInstall = exec('npm install');
    
    npmInstall.stdout.on('data', (data) => {
      process.stdout.write(data);
    });

    npmInstall.on('close', (code) => {
      if (code === 0) {
        console.log(`\n${colors.green}✅ Dépendances installées avec succès !${colors.reset}`);
        showNextSteps();
      } else {
        console.log(`\n${colors.red}❌ Erreur lors de l'installation des dépendances${colors.reset}`);
      }
      rl.close();
    });
  } else {
    showNextSteps();
    rl.close();
  }
}

// Afficher les prochaines étapes
function showNextSteps() {
  console.log(`\n${colors.bright}🎉 Configuration terminée !${colors.reset}\n`);
  console.log(`${colors.green}Prochaines étapes :${colors.reset}`);
  console.log(`  1. ${colors.blue}npm run dev${colors.reset} - Lancer le serveur de développement`);
  console.log(`  2. Ouvrir ${colors.blue}http://localhost:3000${colors.reset}`);
  console.log(`  3. Commencer à développer ! 🚀\n`);
  console.log(`${colors.yellow}Documentation :${colors.reset} https://github.com/whatsclose/survey-experience\n`);
}

// Gérer les erreurs
process.on('unhandledRejection', (error) => {
  console.error(`\n${colors.red}❌ Erreur : ${error.message}${colors.reset}`);
  rl.close();
  process.exit(1);
});

// Gérer l'interruption
process.on('SIGINT', () => {
  console.log(`\n${colors.yellow}Configuration interrompue.${colors.reset}`);
  rl.close();
  process.exit(0);
});

// Lancer la configuration
setup();