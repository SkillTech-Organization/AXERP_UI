import { readFileSync, writeFileSync } from 'fs';

let content = readFileSync('src/environments/environment.ts', 'utf8');

// Environment variables from process.env
const {
  API_URL,
  CLIENT_ID,
  AUTHORITY,
  REDIRECT,
  URI
} = process.env;

// Build the new scopes array
const scopesArray = [`'${CLIENT_ID}/axerpui.read'`];
const scopesString = `scopes: [${scopesArray.join(', ')}]`;

// Perform replacements
content = content
  .replace(/apiUrl:\s*["'`].*?["'`]/, `apiUrl: "${API_URL}"`)
  .replace(/clientId:\s*["'`].*?["'`]/, `clientId: "${CLIENT_ID}"`)
  .replace(/authority:\s*["'`].*?["'`]/, `authority: "${AUTHORITY}"`)
  .replace(/redirect:\s*["'`].*?["'`]/, `redirect: "${REDIRECT}"`)
  .replace(/uri:\s*["'`].*?["'`]/, `uri: "${URI}"`)
  .replace(/scopes:\s*\[[^\]]*\]/, scopesString);

writeFileSync('src/environments/environment.ts', content);
console.log('environment.ts updated successfully');
