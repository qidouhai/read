const io = require('../lib/io');
const fs = require('fs');

const mockRc = 'https://news.ycombinator.com/rss/\nhttps://www.reddit.com/.rss\n';
jest.mock('fs');

describe('addUrl', () => {
    test('adds url to rc file', done => {
        const url = 'https://rss.nytimes.com/services/xml/rss/nyt/World.xml';
        const logSpy = jest.spyOn(console, 'log');
        fs.existsSync.mockReturnValue(true);
        fs.readFileSync.mockReturnValue(mockRc);

        io.addUrl(url);

        expect(fs.existsSync).toBeCalledWith(io.fileDir);
        expect(fs.readFileSync).toBeCalledWith(io.fileDir, 'utf8');
        expect(fs.appendFileSync).toBeCalledWith(io.fileDir, `${url}\n`);
        expect(logSpy).toBeCalledWith(`Added ${url}.`);
        done();
    });

    test('doesn\'t add invalid url', done => {
        const url = 'not-valid-url';
        const logSpy = jest.spyOn(console, 'log');
        fs.existsSync.mockReturnValue(true);

        io.addUrl(url);

        expect(fs.existsSync).toBeCalledWith(io.fileDir);
        expect(fs.readFileSync).toHaveBeenCalledTimes(0);
        expect(fs.appendFileSync).toHaveBeenCalledTimes(0);
        expect(logSpy).toBeCalledWith(`${url} is an invalid URL.`);
        done();
    });

    test('doesn\'t add duplicate url', done => {
        const url = 'https://www.reddit.com/.rss';
        const logSpy = jest.spyOn(console, 'log');
        fs.existsSync.mockReturnValue(true);
        fs.readFileSync.mockReturnValue(mockRc);

        io.addUrl(url);

        expect(fs.existsSync).toBeCalledWith(io.fileDir);
        expect(fs.readFileSync).toBeCalledWith(io.fileDir, 'utf8');
        expect(fs.appendFileSync).toHaveBeenCalledTimes(0);
        expect(logSpy).toBeCalledWith(`${url} is a duplicate URL.`);
        done();
    });
});

describe('removeUrl', () => {
    test('removes url to rc file', done => {
        const url = "https://www.reddit.com/.rss"
        const expectedWrite = "https://news.ycombinator.com/rss/\n";
        const logSpy = jest.spyOn(console, 'log');
        fs.existsSync.mockReturnValue(true);
        fs.readFileSync.mockReturnValue(mockRc);

        io.removeUrl(url);

        expect(fs.existsSync).toBeCalledWith(io.fileDir);
        expect(fs.readFileSync).toBeCalledWith(io.fileDir, 'utf8');
        expect(fs.writeFileSync).toBeCalledWith(io.fileDir, expectedWrite);
        expect(logSpy).toBeCalledWith(`Removed ${url}.`);
        done();
    });

    test('removed url dne in rc file', done => {
        const url = 'https://rss.nytimes.com/services/xml/rss/nyt/World.xml';
        const logSpy = jest.spyOn(console, 'log');
        fs.existsSync.mockReturnValue(true);
        fs.readFileSync.mockReturnValue(mockRc);

        io.removeUrl(url);

        expect(fs.existsSync).toBeCalledWith(io.fileDir);
        expect(fs.readFileSync).toBeCalledWith(io.fileDir, 'utf8');
        expect(fs.writeFileSync).toHaveBeenCalledTimes(0);
        expect(logSpy).toBeCalledWith(`${url} does not exist in \"${io.fileDir}\".`);
        done();
    });
});

describe('printUrls', () => {
    test('prints urls to console', done => {
        const logSpy = jest.spyOn(console, 'log');
        fs.existsSync.mockReturnValue(true);
        fs.readFileSync.mockReturnValue(mockRc);

        io.printUrls();

        expect(fs.existsSync).toBeCalledWith(io.fileDir);
        expect(fs.readFileSync).toBeCalledWith(io.fileDir, 'utf8');
        expect(logSpy).toBeCalledWith(mockRc);
        done();
    });
});

describe('printPath', () => {
    test('prints .readrc path', done => {
        const logSpy = jest.spyOn(console, 'log');
        fs.existsSync.mockReturnValue(true);

        io.printPath();

        expect(fs.existsSync).toBeCalledWith(io.fileDir);
        expect(logSpy).toBeCalledWith(io.fileDir);
        done();
    });

    test('creates a new .readrc file and prints path', done => {
        const logSpy = jest.spyOn(console, 'log');
        fs.existsSync.mockReturnValue(false);

        io.printPath();

        expect(fs.existsSync).toBeCalledWith(io.fileDir);
        expect(fs.writeFileSync).toBeCalledWith(io.fileDir, io.defaultRc);
        expect(logSpy).toBeCalledWith(`${io.fileDir} was created.`);
        expect(logSpy).toBeCalledWith(io.fileDir);
        done();
    });
});