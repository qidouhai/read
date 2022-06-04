#!/usr/bin/env node

const { Command } = require('commander');
const io = require('./lib/io');
const read = require('./lib/read');
const program = new Command();

program.command("go")
  .description("Read from RSS URLs.")
  .action(read.promptAndRead);

program.command("list")
  .description("List the RSS URLs used for your feed.")
  .action(io.printUrls);

program.command("add <URL>")
  .description("Add a RSS URL to your feed (https://www.reddit.com/.rss).")
  .action(() => {
    let urls = program.args;
    urls.shift();
    urls.forEach((url) => {
      io.addUrl(url);
    });
  });

program.command("remove <URL>")
  .description("Remove a RSS URL to your feed.")
  .action(() => {
    let urls = program.args;
    urls.shift();
    urls.forEach((url) => {
      io.removeUrl(url);
    });
  });

program.command("path")
  .description("Print the path to the file containing your feed URLs.")
  .action(io.printPath);

program.parse();