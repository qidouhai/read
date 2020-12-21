import arg from 'arg'
import { printPath, printUrls, addUrl, removeUrl, printHelpText } from './io'
import { promptAndRead } from './read'

function parseArgumentsIntoOptions (rawArgs) {
  const args = arg(
    {
      '--src': Boolean,
      '--add': [String],
      '--remove': [String],
      '--path': Boolean,
      '--help': Boolean,
      // Aliases
      '-s': '--src',
      '-a': '--add',
      '-r': '--remove',
      '-p': '--path',
      '-h': '--help'
    },
    {
      permissive: false,
      argv: rawArgs.slice(2),
      stopAtPositional: false
    }
  )
  return {
    printUrls: args['--src'] || false,
    addUrl: args['--add'],
    removeUrl: args['--remove'],
    printPath: args['--path'] || false,
    help: args['--help'] || false
  }
}

async function handleOptions (options) {
  // if trying to read
  if (options.printUrls === false &&
    options.addUrl === undefined &&
    options.removeUrl === undefined &&
    options.printPath === false &&
    options.help === false) {
    promptAndRead()
  }

  if (options.printUrls) {
    printUrls()
  }

  if (options.addUrl) {
    options.addUrl.forEach((source) => {
      addUrl(source)
    })
  }

  if (options.removeUrl) {
    options.removeUrl.forEach((source) => {
      removeUrl(source)
    })
  }

  if (options.printPath) {
    printPath()
  }

  if (options.help) {
    printHelpText()
  }
}

export async function cli (args) {
  try {
    const options = parseArgumentsIntoOptions(args)
    await handleOptions(options)
  } catch (err) {
    if (err.code === 'ARG_UNKNOWN_OPTION' || err.code === 'ARG_MISSING_REQUIRED_SHORTARG') {
      console.log(err.message)
    } else {
      throw err
    }
  }
}
