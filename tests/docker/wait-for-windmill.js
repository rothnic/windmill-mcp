#!/usr/bin/env node

/**
 * Wait for Windmill to be ready
 * 
 * This script waits for a Windmill instance to be healthy and ready to accept requests.
 * Useful for CI/CD and automated testing.
 */

const http = require('http');

const WINDMILL_URL = process.env.E2E_WINDMILL_URL || 'http://localhost:8000';
const MAX_ATTEMPTS = 60; // 5 minutes with 5 second intervals
const RETRY_INTERVAL = 5000; // 5 seconds

/**
 * Check if Windmill is ready
 */
async function checkWindmill() {
  return new Promise((resolve) => {
    const url = new URL('/api/version', WINDMILL_URL);
    
    const req = http.get(url, (res) => {
      if (res.statusCode === 200) {
        resolve(true);
      } else {
        resolve(false);
      }
    });
    
    req.on('error', () => {
      resolve(false);
    });
    
    req.setTimeout(5000, () => {
      req.destroy();
      resolve(false);
    });
  });
}

/**
 * Wait for Windmill with retries
 */
async function waitForWindmill() {
  console.log(`⏳ Waiting for Windmill at ${WINDMILL_URL}...`);
  
  for (let attempt = 1; attempt <= MAX_ATTEMPTS; attempt++) {
    const ready = await checkWindmill();
    
    if (ready) {
      console.log(`✅ Windmill is ready! (attempt ${attempt}/${MAX_ATTEMPTS})`);
      return true;
    }
    
    if (attempt < MAX_ATTEMPTS) {
      process.stdout.write(`   Attempt ${attempt}/${MAX_ATTEMPTS} - not ready yet, retrying in ${RETRY_INTERVAL/1000}s...\r`);
      await new Promise(resolve => setTimeout(resolve, RETRY_INTERVAL));
    }
  }
  
  console.error(`\n❌ Windmill did not become ready after ${MAX_ATTEMPTS} attempts`);
  return false;
}

// Run if executed directly
if (require.main === module) {
  waitForWindmill()
    .then((ready) => {
      process.exit(ready ? 0 : 1);
    })
    .catch((error) => {
      console.error('Error:', error);
      process.exit(1);
    });
}

module.exports = { waitForWindmill, checkWindmill };
