import inquirer from 'inquirer';
import open from 'open';
import Parser from 'rss-parser';
import { getUrls } from './io';

export async function promptAndRead(): Promise<void> {
  const urls = getUrls();

  await inquirer.prompt({
    type: 'checkbox',
    name: 'urls',
    message: 'What rss feeds do you want to read?',
    choices: urls
  }).then(async (answer): Promise<void> => {
    if (answer.urls.length === 0) {
      console.log('No RSS feed selected. Exiting.\n');
      return;
    }

    const parser = new Parser();
    let articles = [];

    await Promise.all(answer.urls.map(async (url): Promise<void> => {
      const feed = await parser.parseURL(url);
      articles = articles.concat(feed.items);
    }));

    const titles = articles.map((article): string => article.title);

    await inquirer.prompt({
      type: 'checkbox',
      name: 'articles',
      message: 'What articles do you want to read?',
      choices: titles
    }).then((articleAnswer): void => {
      articleAnswer.articles.forEach(async (title): Promise<void> => {
        const match = articles.find((article): boolean => article.title === title);
        await open(match.link);
      });
    });
  });
}
