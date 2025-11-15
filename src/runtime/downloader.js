#!/usr/bin/env node

/**
 * Artifact Downloader for Windmill MCP Server
 *
 * Downloads pre-generated MCP server artifacts from GitHub Releases.
 * 
 * Note: GitHub API calls are subject to rate limiting:
 * - Unauthenticated requests: 60 requests/hour per IP
 * - Authenticated requests: 5,000 requests/hour
 * 
 * Rate limit errors will be reported with reset time information.
 */

import https from 'https';
import { extractToCache } from './cache.js';

const GITHUB_REPO = 'rothnic/windmill-mcp';

/**
 * Download artifact from GitHub Release
 * @param {string} windmillVersion - Windmill version (e.g., "1.520.1" or "latest")
 * @param {string} packageVersion - MCP package version (e.g., "0.2.0")
 * @returns {Promise<boolean>} Whether download was successful
 */
export async function downloadArtifact(windmillVersion, packageVersion) {
  // Construct release tag
  const tag = windmillVersion === 'latest'
    ? 'windmill-latest'
    : `windmill-v${windmillVersion}-mcp-${packageVersion}`;

  console.log(`📥 Downloading artifact for Windmill ${windmillVersion}...`);
  console.log(`   Release tag: ${tag}`);

  try {
    // Get release information
    const release = await fetchReleaseByTag(tag);

    if (!release) {
      console.log(`⚠️  Release not found: ${tag}`);
      return false;
    }

    // Find the generated MCP server artifact
    const asset = release.assets.find(a => a.name === 'generated-mcp-server.tar.gz');

    if (!asset) {
      console.log(`⚠️  Artifact not found in release: ${tag}`);
      return false;
    }

    // Download the artifact
    const artifactBuffer = await downloadFile(asset.browser_download_url);

    // Extract to cache
    await extractToCache(artifactBuffer, windmillVersion);

    console.log(`✅ Downloaded and cached artifact for Windmill ${windmillVersion}`);
    return true;
  } catch (error) {
    console.log(`⚠️  Failed to download artifact: ${error.message}`);
    return false;
  }
}

/**
 * Fetch GitHub release by tag
 * @param {string} tag - Release tag
 * @returns {Promise<Object|null>} Release object or null if not found
 */
async function fetchReleaseByTag(tag) {
  const url = `https://api.github.com/repos/${GITHUB_REPO}/releases/tags/${tag}`;

  try {
    const data = await fetchJson(url);
    return data;
  } catch (error) {
    if (error.statusCode === 404) {
      return null;
    }
    throw error;
  }
}

/**
 * Fetch JSON from URL
 * @param {string} url - URL to fetch
 * @returns {Promise<Object>} Parsed JSON response
 */
function fetchJson(url) {
  const MAX_RESPONSE_SIZE = 10 * 1024 * 1024; // 10MB limit for JSON responses
  
  return new Promise((resolve, reject) => {
    const options = {
      headers: {
        'User-Agent': 'windmill-mcp',
        'Accept': 'application/vnd.github.v3+json',
      },
    };

    https.get(url, options, (res) => {
      if (res.statusCode === 404) {
        const error = new Error('Not found');
        error.statusCode = 404;
        reject(error);
        return;
      }
      
      // Check for rate limit errors
      if (res.statusCode === 403 && res.headers['x-ratelimit-remaining'] === '0') {
        const resetTime = res.headers['x-ratelimit-reset'];
        const resetDate = resetTime ? new Date(parseInt(resetTime) * 1000).toISOString() : 'unknown';
        reject(new Error(`GitHub API rate limit exceeded. Resets at: ${resetDate}. Consider authenticating for higher limits.`));
        return;
      }

      if (res.statusCode !== 200) {
        reject(new Error(`HTTP ${res.statusCode}: ${res.statusMessage}`));
        return;
      }

      let data = '';
      let dataSize = 0;
      
      res.on('data', (chunk) => {
        dataSize += chunk.length;
        
        if (dataSize > MAX_RESPONSE_SIZE) {
          res.destroy();
          reject(new Error(`Response size exceeds maximum allowed size of ${MAX_RESPONSE_SIZE / 1024 / 1024}MB`));
          return;
        }
        
        data += chunk;
      });
      
      res.on('end', () => {
        try {
          resolve(JSON.parse(data));
        } catch (error) {
          reject(new Error('Failed to parse JSON response'));
        }
      });
    }).on('error', reject);
  });
}

/**
 * Download file from URL
 * @param {string} url - URL to download
 * @returns {Promise<Buffer>} File content
 */
function downloadFile(url) {
  const MAX_FILE_SIZE = 100 * 1024 * 1024; // 100MB limit
  
  return new Promise((resolve, reject) => {
    https.get(url, (res) => {
      // Follow redirects with validation
      if (res.statusCode === 302 || res.statusCode === 301) {
        const redirectUrl = res.headers.location;
        
        // Validate redirect URL
        if (!redirectUrl || !redirectUrl.startsWith('https://')) {
          reject(new Error('Invalid redirect: only HTTPS URLs are allowed'));
          return;
        }
        
        return downloadFile(redirectUrl).then(resolve, reject);
      }

      if (res.statusCode !== 200) {
        reject(new Error(`HTTP ${res.statusCode}: ${res.statusMessage}`));
        return;
      }

      const chunks = [];
      let downloadedSize = 0;
      
      res.on('data', (chunk) => {
        downloadedSize += chunk.length;
        
        if (downloadedSize > MAX_FILE_SIZE) {
          res.destroy();
          reject(new Error(`File size exceeds maximum allowed size of ${MAX_FILE_SIZE / 1024 / 1024}MB`));
          return;
        }
        
        chunks.push(chunk);
      });
      
      res.on('end', () => resolve(Buffer.concat(chunks)));
    }).on('error', reject);
  });
}

/**
 * Get list of available versions from GitHub Releases
 * @returns {Promise<string[]>} List of available Windmill versions
 */
export async function listAvailableVersions() {
  const url = `https://api.github.com/repos/${GITHUB_REPO}/releases`;

  try {
    const releases = await fetchJson(url);

    // Extract Windmill versions from release tags
    const versions = releases
      .map(release => {
        const match = release.tag_name.match(/^windmill-v?(.+)-mcp-/);
        return match ? match[1] : null;
      })
      .filter(Boolean);

    return [...new Set(versions)]; // Remove duplicates
  } catch (error) {
    console.warn(`⚠️  Failed to fetch available versions: ${error.message}`);
    return [];
  }
}
