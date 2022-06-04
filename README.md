![Tests](https://github.com/brianbianchi/read/workflows/Tests/badge.svg)

> Command line interface that makes it easy to read RSS feeds.

```console
$ npm i # install dependencies
$ npm i -g # globally install package
$ readr go # read from RSS
```

```console
$ readr help
Usage: readr [options] [command]

Options:
  -h, --help      display help for command

Commands:
  go              Read from RSS URLs.
  list            List the RSS URLs used for your feed.
  add <URL>       Add a RSS URL to your feed (https://www.reddit.com/.rss).
  remove <URL>    Remove a RSS URL to your feed.
  path            Print the path to the file containing your feed URLs.
  help [command]  display help for command
```
