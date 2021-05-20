import fs from 'fs';
import os from 'os';

const fileDir = `${os.homedir()}/readr.txt`;

export function addUrl(url: string): void {
  confirmFileExists();
  if (!isValidURL(url)) {
    console.log('You did not enter a valid URL.\n');
  } else if (isDuplicateUrl(url)) {
    console.log('You entered a duplicate URL.\n');
  } else {
    fs.appendFileSync(fileDir, `${url}\n`);
    console.log(`Added source ${url}.\n`);
  }
}

export function removeUrl(url: string): void {
  confirmFileExists();
  const file = fs.readFileSync(fileDir, 'utf8');
  // split string on new line, remove given url, join on new line, add a new line to end of doc
  const removed = file.split('\n').filter((line): boolean => (line !== url) && (line !== '')).join('\n').concat('\n');
  if (file === removed) {
    console.log(`${url} does not exist in ${fileDir}\n`);
  } else {
    fs.writeFileSync(fileDir, removed);
    console.log(`${url} was removed.\n`);
  }
}

export function printUrls(): void {
  confirmFileExists();
  console.log(fs.readFileSync(fileDir, 'utf8'));
}

export function getUrls(): string[] {
  confirmFileExists();
  return fs.readFileSync(fileDir, 'utf8').split('\n').filter((line): boolean => line !== '');
}

export function printPath(): void {
  confirmFileExists();
  console.log(fileDir);
}

export function printHelpText(): void {
  const helpText = `
    [NO ARGUMENT]\n\t\tRead feeds.\n
    --src, -s\n\t\tPrint the RSS URLs for your feed.\n
    --add [URL], -a [URL]\n\t\tAdd a RSS URL for your feed (https://www.reddit.com/.rss).\n
    --remove [URL], -r [URL]\n\t\tRemove a RSS URL for your feed (https://www.reddit.com/.rss).\n
    --path, -p\n\t\t Print the path of the text file containing your feed URLs.\n
    `;
  console.log(helpText);
}

function confirmFileExists(): void {
  const exists = fs.existsSync(fileDir);
  if (!exists) {
    fs.writeFileSync(fileDir, 'https://www.reddit.com/.rss\n');
    console.log(`${fileDir} was created.`);
  }
}

function isValidURL(url: string): boolean {
  const pattern = new RegExp('^(https?:\\/\\/)?' + // protocol
    '((([a-z\\d]([a-z\\d-]*[a-z\\d])*)\\.)+[a-z]{2,}|' + // domain name
    '((\\d{1,3}\\.){3}\\d{1,3}))' + // OR ip (v4) address
    '(\\:\\d+)?(\\/[-a-z\\d%_.~+]*)*' + // port and path
    '(\\?[;&a-z\\d%_.~+=-]*)?' + // query string
    '(\\#[-a-z\\d_]*)?$', 'i'); // fragment locator
  return !!pattern.test(url);
}

function isDuplicateUrl(url: string): boolean {
  const urls = getUrls();
  return urls.includes(url);
}
