#!/usr/bin/env node

import { program } from 'commander';
import { addUrl, printPath, printUrls, removeUrl } from './src/io.js';
import { promptAndRead } from './src/read.js';

program.command("go")
  .description("Read from RSS URLs.")
  .action(promptAndRead);

program.command("list")
  .description("List the RSS URLs used for your feed.")
  .action(printUrls);

program.command("add <URL>")
  .description("Add a RSS URL to your feed (https://www.reddit.com/.rss).")
  .action(addUrl);

program.command("remove <URL>")
  .description("Remove a RSS URL to your feed.")
  .action(removeUrl);

program.command("path")
  .description("Print the path to the file containing your feed URLs.")
  .action(printPath);

program.parse();
