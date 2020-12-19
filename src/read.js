
import inquirer from 'inquirer';
import open from 'open';
import Parser from 'rss-parser';
import { getUrls } from './io'

export async function promptAndRead() {
    let urls = getUrls();

    await inquirer.prompt({
      type: 'checkbox',
      name: 'urls',
      message: 'What rss feeds do you want to read?',
      choices: urls,
    }).then(async (answer) => {
      if (answer.urls.length === 0) {
        console.log('No RSS feed selected. Exiting.\n');
        return;
      };

      let parser = new Parser();
      let articles = [];

      await Promise.all(answer.urls.map(async (url) => {
        let feed = await parser.parseURL(url);
        articles = articles.concat(feed.items);
      }));

      let titles = articles.map((article) => article.title);

      await inquirer.prompt({
        type: 'checkbox',
        name: 'articles',
        message: 'What articles do you want to read?',
        choices: titles,
      }).then((answer) => {
        answer.articles.forEach(async (title) => {
          let match = articles.find((article) => article.title === title);
          await open(match.link);
        });
      });
    });
  }