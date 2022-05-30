import { program } from 'commander';
import fs from 'fs';
import os from 'os';

const fileDir = `${os.homedir()}/.readrc`;

export function addUrl() {
  const urls = program.args;
  if (!urls) {
    console.log('You did not enter a URL.\n');
    return;
  }
  urls.forEach((url) => {
    confirmFileExists();
    if (!isValidURL(url)) {
      console.log('You did not enter a valid URL.\n');
    } else if (isDuplicateUrl(url)) {
      console.log('You entered a duplicate URL.\n');
    } else {
      fs.appendFileSync(fileDir, `${url}\n`);
      console.log(`Added source ${url}.\n`);
    }
  });
}

export function removeUrl(url) {
  const urls = program.args;
  if (!urls) {
    console.log('You did not enter a URL.\n');
    return;
  }
  urls.forEach((url) => {
    confirmFileExists();
    const file = fs.readFileSync(fileDir, 'utf8');
    // split string on new line, remove given url, join on new line, add a new line to end of doc
    const removed = file.split('\n').filter((line) => (line !== url) && (line !== '')).join('\n').concat('\n');
    if (file === removed) {
      console.log(`${url} does not exist in ${fileDir}\n`);
    } else {
      fs.writeFileSync(fileDir, removed);
      console.log(`${url} was removed.\n`);
    }
  });
}

export function printUrls() {
  confirmFileExists();
  console.log(fs.readFileSync(fileDir, 'utf8'));
}

export function getUrls() {
  confirmFileExists();
  return fs.readFileSync(fileDir, 'utf8').split('\n').filter((line) => line !== '');
}

export function printPath() {
  confirmFileExists();
  console.log(fileDir);
}

function confirmFileExists() {
  const exists = fs.existsSync(fileDir);
  if (!exists) {
    fs.writeFileSync(fileDir, 'https://www.reddit.com/.rss\n');
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
