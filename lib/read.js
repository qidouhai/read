const inquirer = require('inquirer');
const open = require('open');
const Parser = require('rss-parser');
const io = require('./io');

async function promptAndRead() {
  const urls = io.getUrls();

  await inquirer.prompt({
    type: 'checkbox',
    name: 'urls',
    message: 'What rss feeds do you want to read?',
    choices: urls
  }).then(async (answer) => {
    if (answer.urls.length === 0) {
      console.log('No RSS feed selected. Exiting.\n');
      return;
    }

    const parser = new Parser();
    let articles = [];

    await Promise.all(answer.urls.map(async (url) => {
      const feed = await parser.parseURL(url);
      articles = articles.concat(feed.items);
    }));

    const titles = articles.map((article) => article.title);

    await inquirer.prompt({
      type: 'checkbox',
      name: 'articles',
      message: 'What articles do you want to read?',
      choices: titles
    }).then((articleAnswer) => {
      articleAnswer.articles.forEach(async (title) => {
        const match = articles.find((article) => article.title === title);
        await open(match.link);
      });
    });
  });
}
