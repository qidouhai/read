import os from 'os';
import fs from 'fs'

const fileDir = `${os.homedir()}/readr.txt`;

export function addUrl(url) {
    fs.appendFileSync(fileDir, `${url}\n`);
    console.log(`Added source ${url}.\n`);
}

export function removeUrl(url) {
    confirmFileExists();
    let file = fs.readFileSync(fileDir, 'utf8');
    // split string on new line, remove given url, join on new line, add a new line to end of doc
    let removed = file.split('\n').filter((line) => (line != url) && (line != '')).join('\n').concat('\n');
    if (file === removed) {
        console.log(`${url} does not exist in ${fileDir}\n`);
    } else {
        fs.writeFileSync(fileDir, removed);
        console.log(`${url} was removed.\n`);
    }
}

export function printUrls() {
    confirmFileExists();
    console.log(fs.readFileSync(fileDir, 'utf8'));
}

export function getUrls() {
    confirmFileExists();
    return fs.readFileSync(fileDir, 'utf8').split('\n').filter((line) => line != '');
}

export function printPath() {
    confirmFileExists();
    console.log(fileDir);
}

export function printHelpText() {
    const helpText = `
    [NO ARGUMENT]\n\t\tRead feeds.\n
    --src, -s\n\t\tPrint the RSS URLs for your feed.\n
    --add [URL], -a [URL]\n\t\tAdd a RSS URL for your feed (https://www.reddit.com/.rss).\n
    --remove [URL], -r [URL]\n\t\tRemove a RSS URL for your feed (https://www.reddit.com/.rss).\n
    --path, -p\n\t\t Print the path of the text file containing your feed URLs.\n
    `;
    console.log(helpText);
}

function confirmFileExists() {
    let exists = fs.existsSync(fileDir);
    if (!exists) {
        fs.writeFileSync(fileDir, 'https://www.reddit.com/.rss\n');
        console.log(`${fileDir} was created.`);
    }
}