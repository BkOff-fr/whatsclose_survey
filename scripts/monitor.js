#!/usr/bin/env node

/**
 * Script de monitoring pour vérifier la santé de l'application
 */

const https = require('https');
const http = require('http');
const { exec } = require('child_process');
const fs = require('fs');
const path = require('path');

// Configuration
const config = {
  url: process.env.APP_URL || 'http://localhost:3000',
  healthEndpoint: '/api/health',
  checkInterval: 60000, // 1 minute
  maxRetries: 3,
  logFile: path.join(process.cwd(), 'logs', 'monitoring.log'),
};

// Couleurs pour le terminal
const colors = {
  reset: '\x1b[0m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  red: '\x1b[31m',
  blue: '\x1b[34m',
};

// Créer le dossier logs s'il n'existe pas
const logsDir = path.dirname(config.logFile);
if (!fs.existsSync(logsDir)) {
  fs.mkdirSync(logsDir, { recursive: true });
}

// Logger
class Logger {
  static log(level, message) {
    const timestamp = new Date().toISOString();
    const logMessage = `[${timestamp}] [${level}] ${message}`;
    
    // Console
    switch (level) {
      case 'INFO':
        console.log(`${colors.blue}${logMessage}${colors.reset}`);
        break;
      case 'SUCCESS':
        console.log(`${colors.green}${logMessage}${colors.reset}`);
        break;
      case 'WARNING':
        console.log(`${colors.yellow}${logMessage}${colors.reset}`);
        break;
      case 'ERROR':
        console.log(`${colors.red}${logMessage}${colors.reset}`);
        break;
    }
    
    // Fichier
    fs.appendFileSync(config.logFile, logMessage + '\n');
  }

  static info(message) { this.log('INFO', message); }
  static success(message) { this.log('SUCCESS', message); }
  static warning(message) { this.log('WARNING', message); }
  static error(message) { this.log('ERROR', message); }
}

// Métriques
class Metrics {
  constructor() {
    this.reset();
  }

  reset() {
    this.totalChecks = 0;
    this.successfulChecks = 0;
    this.failedChecks = 0;
    this.averageResponseTime = 0;
    this.responseTimes = [];
    this.startTime = Date.now();
  }

  recordCheck(success, responseTime) {
    this.totalChecks++;
    if (success) {
      this.successfulChecks++;
    } else {
      this.failedChecks++;
    }
    
    if (responseTime) {
      this.responseTimes.push(responseTime);
      this.averageResponseTime = 
        this.responseTimes.reduce((a, b) => a + b, 0) / this.responseTimes.length;
    }
  }

  getUptime() {
    const uptimeMs = Date.now() - this.startTime;
    const hours = Math.floor(uptimeMs / 3600000);
    const minutes = Math.floor((uptimeMs % 3600000) / 60000);
    return `${hours}h ${minutes}m`;
  }

  getSummary() {
    const successRate = this.totalChecks > 0 
      ? (this.successfulChecks / this.totalChecks * 100).toFixed(2) 
      : 0;
    
    return {
      uptime: this.getUptime(),
      totalChecks: this.totalChecks,
      successRate: `${successRate}%`,
      averageResponseTime: `${this.averageResponseTime.toFixed(2)}ms`,
      failedChecks: this.failedChecks,
    };
  }
}

const metrics = new Metrics();

// Fonction de check
async function checkHealth() {
  const startTime = Date.now();
  const url = config.url + config.healthEndpoint;
  const protocol = url.startsWith('https') ? https : http;

  return new Promise((resolve) => {
    protocol.get(url, (res) => {
      let data = '';

      res.on('data', (chunk) => {
        data += chunk;
      });

      res.on('end', () => {
        const responseTime = Date.now() - startTime;
        
        try {
          const jsonData = JSON.parse(data);
          const isHealthy = res.statusCode === 200 && jsonData.status === 'healthy';
          
          metrics.recordCheck(isHealthy, responseTime);
          
          if (isHealthy) {
            Logger.success(`Health check OK - Response time: ${responseTime}ms`);
          } else {
            Logger.warning(`Health check returned unhealthy status`);
          }
          
          resolve({ success: isHealthy, data: jsonData, responseTime });
        } catch (error) {
          metrics.recordCheck(false, responseTime);
          Logger.error(`Failed to parse health check response: ${error.message}`);
          resolve({ success: false, error });
        }
      });
    }).on('error', (error) => {
      const responseTime = Date.now() - startTime;
      metrics.recordCheck(false, responseTime);
      Logger.error(`Health check failed: ${error.message}`);
      resolve({ success: false, error });
    });
  });
}

// Fonction de check système
async function checkSystem() {
  return new Promise((resolve) => {
    exec('node -v && npm -v', (error, stdout, stderr) => {
      if (error) {
        Logger.error(`System check failed: ${error.message}`);
        resolve({ success: false });
      } else {
        Logger.info(`System check OK - ${stdout.replace(/\n/g, ' ').trim()}`);
        resolve({ success: true });
      }
    });
  });
}

// Fonction de check mémoire
function checkMemory() {
  const used = process.memoryUsage();
  const memoryData = {
    rss: `${Math.round(used.rss / 1024 / 1024)}MB`,
    heapTotal: `${Math.round(used.heapTotal / 1024 / 1024)}MB`,
    heapUsed: `${Math.round(used.heapUsed / 1024 / 1024)}MB`,
    external: `${Math.round(used.external / 1024 / 1024)}MB`,
  };
  
  Logger.info(`Memory usage - RSS: ${memoryData.rss}, Heap: ${memoryData.heapUsed}/${memoryData.heapTotal}`);
  return memoryData;
}

// Fonction principale de monitoring
async function monitor() {
  Logger.info('Starting monitoring...');
  Logger.info(`Target: ${config.url}`);
  Logger.info(`Check interval: ${config.checkInterval}ms`);
  
  // Check initial
  await checkSystem();
  
  // Boucle de monitoring
  setInterval(async () => {
    Logger.info('--- Running health check ---');
    
    const healthResult = await checkHealth();
    
    // Check mémoire toutes les 5 checks
    if (metrics.totalChecks % 5 === 0) {
      checkMemory();
    }
    
    // Afficher les métriques toutes les 10 checks
    if (metrics.totalChecks % 10 === 0) {
      const summary = metrics.getSummary();
      Logger.info('=== Metrics Summary ===');
      Object.entries(summary).forEach(([key, value]) => {
        Logger.info(`${key}: ${value}`);
      });
      Logger.info('=====================');
    }
    
    // Alerte si trop d'échecs
    if (metrics.failedChecks > 5) {
      Logger.error('ALERT: Too many failed checks!');
      // Ici, vous pourriez envoyer une notification (email, Slack, etc.)
    }
  }, config.checkInterval);

  // Check immédiat
  await checkHealth();
}

// Gestion des signaux
process.on('SIGINT', () => {
  Logger.info('Stopping monitoring...');
  const summary = metrics.getSummary();
  Logger.info('Final metrics:');
  Object.entries(summary).forEach(([key, value]) => {
    Logger.info(`${key}: ${value}`);
  });
  process.exit(0);
});

process.on('uncaughtException', (error) => {
  Logger.error(`Uncaught exception: ${error.message}`);
  process.exit(1);
});

// Démarrer le monitoring
monitor().catch((error) => {
  Logger.error(`Failed to start monitoring: ${error.message}`);
  process.exit(1);
});