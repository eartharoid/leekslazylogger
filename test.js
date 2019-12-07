const log = require('./index.js');
// const readline = require('readline');
// const rl = readline.createInterface({
//   input: process.stdin,
//   output: process.stdout
// });

log.init({
  name: 'leeksLazyLogger',
  custom: {
    special: {
      title: 'Special',
      colour: 'greenBright'
    },
    database: {
      title: 'MySQL',
      colour: 'cyanBright'
    },
  },
  logToFile: true,
  timestamp: 'DD/MM/YY hh:mm:ss',
  maxAge: 7
});


log.basic(`some text here`); // white text with [timestamp] ...
log.console(`some info here`); // white text with [timestamp | INFO] ...
log.info(`some info here`); // cyan text with [timestamp | INFO] ...
log.debug(`some debugging info here`); // blue text with [timestamp | DEBUG] ...
log.success(`some info here`);// green text with [timestamp | INFO] ...
log.warn(`some warning here`); // yellow text with [timestamp | WARN] ...
log.error(`some error here`);// error text with [timestamp | ERROR] ...

log.basic(log.colour.magentaBright(`some kewl text here`)); // only the text after the timestamp will be coloured

log.warn(log.colour.bgYellowBright(log.colour.black(`stands out even more`)) + log.colour.red(` - but this bit is red`));

log.warn(log.colour.bgYellowBright(log.colour.black(`EXTRA IMPORTANT WARNING!`)));

// or colour the whole line
log.info(`my super important info`, 'magentaBright'); // colours the whole line magenta (including timestamp)
log.custom('TYPE', `my awesome info`); // [TYPE | timestamp], white
log.custom('TYPE', `my awesome info`, 'cyan'); // [TYPE | timestamp], cyan
// the example below is a custom type (defined in initialisation) - NOT A DEFAULT
log.type.database('Successful (fake) connection established with \'fakeuser@fakehost\''); // uses a custom type, useful if you use one often

log.console('ALL OF THE COLOURS');
// will go through all the possible colours
for (let c in log.colours) {
  log.custom('TEST', c, c);
}



log.type.special('special test');

// rl.on('line', (line) => { // this isn't required, but adding this will allow you to type `exit` or `quit` to exit
//   switch (line.trim().toLowerCase()) {
//     case 'exit':
//     case 'quit':
//       log.console('Exiting...')
//       process.exit(0);
//       break;
//      default:
//        log.warn(`Unkown command '${line.trim().toLowerCase()}'`);
//        break;
//   }
// });



// log.basic(log.getFile()) // log.getFile() will return the contents of the .log file currently being used

log.info(`Current log file: ${log.getPath()}`);
log.debug({
  custom: {
    special: {
      title: 'customType',
      colour: 'blueBright'
    },
    database: {
      title: 'MySQL',
      colour: 'cyanBright'
    }
  }
}); // objects must be printed on their own line, with no other text

log.newLine();
log.console(log.colour.cyanBright(log.style.underline('Important information:') + log.colour.cyanBright(' text')));
log.info(`log.time = ${log.time}`);
log.info(`log.timestamp() = ${log.timestamp()}`);