const fs = require('fs').promises;
const path = require('path');
const process = require('process');
const {authenticate} = require('@google-cloud/local-auth');
const {google} = require('googleapis');

const SCOPES = ['https://www.googleapis.com/auth/spreadsheets.readonly'];
const TOKEN_PATH = path.join(process.cwd(), 'token.json');
const CREDENTIALS_PATH = path.join(process.cwd(), 'credentials.json');

// https://docs.google.com/spreadsheets/d/1OaO7VSl2fXM54-O-pl9KcovbzThR9YBSe4SbYGsJfn4/edit?usp=sharing
const HSULYMPICS_SPREADSHEET_ID = '1OaO7VSl2fXM54-O-pl9KcovbzThR9YBSe4SbYGsJfn4'

/**
 * Reads previously authorized credentials from the save file.
 *
 * @return {Promise<OAuth2Client|null>}
 */
async function loadSavedCredentialsIfExist() {
  try {
    const content = await fs.readFile(TOKEN_PATH);
    const credentials = JSON.parse(content);
    return google.auth.fromJSON(credentials);
  } catch (err) {
    return null;
  }
}

/**
 * Serializes credentials to a file comptible with GoogleAUth.fromJSON.
 *
 * @param {OAuth2Client} client
 * @return {Promise<void>}
 */
async function saveCredentials(client) {
  const content = await fs.readFile(CREDENTIALS_PATH);
  const keys = JSON.parse(content);
  const key = keys.installed || keys.web;
  const payload = JSON.stringify({
    type: 'authorized_user',
    client_id: key.client_id,
    client_secret: key.client_secret,
    refresh_token: client.credentials.refresh_token,
  });
  await fs.writeFile(TOKEN_PATH, payload);
}

/**
 * Load or request or authorization to call APIs.
 *
 */
async function authorize() {
  let client = await loadSavedCredentialsIfExist();
  if (client) {
    return client;
  }
  client = await authenticate({
    scopes: SCOPES,
    keyfilePath: CREDENTIALS_PATH,
  });
  if (client.credentials) {
    await saveCredentials(client);
  }
  return client;
}

/**
 * 
 * @param {google.auth.OAuth2} auth The authenticated Google OAuth client.
 */
async function loadSheet(auth, sheet_name_str, range_str) {
  const sheets = google.sheets({version: 'v4', auth});
  const res = await sheets.spreadsheets.values.get({
    spreadsheetId: HSULYMPICS_SPREADSHEET_ID,
    range: `'${sheet_name_str}'!${range_str}`,
  });
  
  const rows = res.data.values;
  if (!rows || rows.length === 0) {
    console.log('No data found.');
    return;
  }
  console.log(`\nSheet: ${sheet_name_str}\n`)
  rows.forEach((row) => {
    console.log(`${row}`);
  });
}



authorize().then(res => loadSheet(res, 'Scores','A1:L6')).catch(console.error)
authorize().then(res => loadSheet(res, 'Teams','A1:L6')).catch(console.error)
authorize().then(res => loadSheet(res, 'Games','A1:L6')).catch(console.error)
authorize().then(res => loadSheet(res, 'Players','A1:L6')).catch(console.error)

