const fs = require('fs');
const os = require('os');

const fileDir = `${os.homedir()}/.readrc`;
const defaultRc = 'https://www.reddit.com/.rss\n';

function addUrl(url) {
  confirmFileExists();
  if (!isValidURL(url)) {
    console.log(`${url} is an invalid URL.`);
    return;
  }
  if (isDuplicateUrl(url)) {
    console.log(`${url} is a duplicate URL.`);
    return;
  }
  fs.appendFileSync(fileDir, `${url}\n`);
  console.log(`Added ${url}.`);
}

function removeUrl(url) {
  confirmFileExists(url);
  const file = fs.readFileSync(fileDir, 'utf8');
  // split string on new line, remove given url, join on new line, add a new line to end of doc
  const fileAfterRemoved = file.split('\n').filter((line) => (line !== url) && (line !== '')).join('\n').concat('\n');
  if (file === fileAfterRemoved) {
    console.log(`${url} does not exist in \"${fileDir}\".`);
    return;
  }
  fs.writeFileSync(fileDir, fileAfterRemoved);
  console.log(`Removed ${url}.`);
}

function printUrls() {
  confirmFileExists();
  console.log(fs.readFileSync(fileDir, 'utf8'));
}

function getUrls() {
  confirmFileExists();
  return fs.readFileSync(fileDir, 'utf8').split('\n').filter((line) => line !== '');
}

function printPath() {
  confirmFileExists();
  console.log(fileDir);
}

function confirmFileExists() {
  const exists = fs.existsSync(fileDir);
  if (!exists) {
    fs.writeFileSync(fileDir, defaultRc);
    console.log(`${fileDir} was created.`);
  }
}

function isValidURL(url) {
  const pattern = new RegExp('^(https?:\\/\\/)?' + // protocol
    '((([a-z\\d]([a-z\\d-]*[a-z\\d])*)\\.)+[a-z]{2,}|' + // domain name
    '((\\d{1,3}\\.){3}\\d{1,3}))' + // OR ip (v4) address
    '(\\:\\d+)?(\\/[-a-z\\d%_.~+]*)*' + // port and path
    '(\\?[;&a-z\\d%_.~+=-]*)?' + // query string
    '(\\#[-a-z\\d_]*)?$', 'i'); // fragment locator
  return !!pattern.test(url);
}

function isDuplicateUrl(url) {
  const urls = getUrls();
  return urls.includes(url);
}

module.exports = {
  fileDir,
  defaultRc,
  getUrls,
  addUrl,
  removeUrl,
  printPath,
  printUrls,
}