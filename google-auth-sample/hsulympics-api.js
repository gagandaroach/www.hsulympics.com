const fs = require('fs').promises;
const path = require('path');
const process = require('process');
const { authenticate } = require('@google-cloud/local-auth');
const { google } = require('googleapis');

const SCOPES = ['https://www.googleapis.com/auth/spreadsheets.readonly'];
const TOKEN_PATH = path.join(process.cwd(), 'token.json');
const CREDENTIALS_PATH = path.join(process.cwd(), 'credentials.json');

// https://docs.google.com/spreadsheets/d/1OaO7VSl2fXM54-O-pl9KcovbzThR9YBSe4SbYGsJfn4/edit?usp=sharing
const HSULYMPICS_SPREADSHEET_ID = '1OaO7VSl2fXM54-O-pl9KcovbzThR9YBSe4SbYGsJfn4'

const HSULYMPICS_SPREADSHEET_RANGES = [
  "Scores!A1:Z50",
  "Teams!A1:Z50",
  "Games!A1:Z50",
  "Players!A1:Z50",
  "Settings!A1:Z50"
]

const HSULYMPICS_SPREADSHEET_SHEETS = {
  Scores: HSULYMPICS_SPREADSHEET_RANGES[0],
  Teams: HSULYMPICS_SPREADSHEET_RANGES[1],
  Games: HSULYMPICS_SPREADSHEET_RANGES[2],
  Players: HSULYMPICS_SPREADSHEET_RANGES[3],
  Settings: HSULYMPICS_SPREADSHEET_RANGES[4]
}

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

function _parseHsuSettings(sheet) {
  var settings = {}
  if (sheet.values && sheet.values.length > 0)
  {
    sheet.values.forEach((val) => {
      settings[val[0]] = val[1]
    })
  }
  return settings
}

function _parseHsuPlayers(sheet) {
  var players = {}
  for (let i = 1; i < sheet.values.length; i++) {
    const row = sheet.values[i];
    var player = {
      name: row[0],
      team: row[1],
      zodiac: row[2],
      password: row[3]
    }
    players[player.name] = player
  }
  return players
}

function _parseHsuGames(sheet) {
  var games = {}
  for (let i = 1; i < sheet.values.length; i++) {
    const row = sheet.values[i];
    var game = {
      id: row[0],
      name: row[1],
      hidden: row[2],
      obj: row[3],
      rules: row[4],
      format: row[5],
      scoring: row[6]
    }
    games[game.id] = game
  }
  return games
}

function _parseHsuScores(sheet) {
  var game_scores = {}
  num_games = sheet.values.length - 1
  num_teams = sheet.values[0].length - 2
  console.log(num_games)
  for (let i = 1; i < sheet.values.length; i++) {
    const row = sheet.values[i];
    game_score = {
      id: row[0],
      scores: new Array(num_teams),
      hidden: row[1]
    };
    for (let team_idx = 0; team_idx < num_teams; team_idx++) {
      game_score.scores[team_idx] = row[2 + team_idx];
    };
    game_scores[game_score.id] = game_score;
  }
  return game_scores
}

function _parseHsuTeams(sheet) {
  var teams = {}
  
  for (let i = 1; i < sheet.values.length; i++) {
    const row = sheet.values[i];
    var team = {
      id: row[0],
      name: row[1],
      members: row[2]
    }
    teams[team.name] = team
  }

  return teams
}

function _parseHsuSheets(hsu_sheets) {
  var data = {}
  hsu_sheets.forEach((sheet) => {
    // console.log(`\nParsing ${sheet.range}:`);
    // sheet.values.forEach((row) =>
    //   console.log(`${row}`)
    // )
    if (sheet.range === HSULYMPICS_SPREADSHEET_SHEETS.Players) {
      data['Players'] = _parseHsuPlayers(sheet)
    }
    else if (sheet.range === HSULYMPICS_SPREADSHEET_SHEETS.Scores) {
      data['Scores'] = _parseHsuScores(sheet)
    }
    else if (sheet.range === HSULYMPICS_SPREADSHEET_SHEETS.Teams) {
      data['Teams'] = _parseHsuTeams(sheet)
    }
    else if (sheet.range === HSULYMPICS_SPREADSHEET_SHEETS.Settings) {
      data['Settings'] = _parseHsuSettings(sheet)
    }
    else if (sheet.range === HSULYMPICS_SPREADSHEET_SHEETS.Games) {
      data['Games'] = _parseHsuGames(sheet)
    }
    else {
      console.log(`ignored google sheet: ${sheet.range}`)
    }
  });

  console.log(`Parsed google sheets data: ${JSON.stringify(data)}`)
  return data
}

/**
 * 
 * @param {google.auth.OAuth2} auth The authenticated Google OAuth client.
 */
async function loadAllSheets(auth, parse = true) {
  const google_sheets = google.sheets({ version: 'v4', auth });

  const res = await google_sheets.spreadsheets.values.batchGet({
    spreadsheetId: HSULYMPICS_SPREADSHEET_ID,
    ranges: HSULYMPICS_SPREADSHEET_RANGES
  });

  const hsu_sheets = res.data.valueRanges;
  if (!hsu_sheets || hsu_sheets.length === 0) {
    console.log('No data found.');
    return null;
  }

  if (parse === false) {
    console.log(`google sheets: ${hsu_sheets}`)
    return hsu_sheets;
  }

  return _parseHsuSheets(hsu_sheets);
}

/**
 * 
 * @param {google.auth.OAuth2} auth The authenticated Google OAuth client.
 */
async function loadSheet(auth, sheet_name_str, range_str) {
  const sheets = google.sheets({ version: 'v4', auth });
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

// authorize().then(auth => loadSheet(auth, 'Scores','A1:L6')).catch(console.error)
// authorize().then(auth => loadSheet(auth, 'Teams','A1:L6')).catch(console.error)
// authorize().then(auth => loadSheet(auth, 'Games','A1:L6')).catch(console.error)
// authorize().then(auth => loadSheet(auth, 'Players','A1:L6')).catch(console.error)

res = authorize().then(auth => loadAllSheets(auth)).catch(console.error)

console.log(`final res: ${res}`)
