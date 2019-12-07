/**
 *
 * @name leeksLazyLogger
 * @author Eartharoid <eartharoid@gmail.com>
 * @license GNU-GPLv3
 *
 */

const fs = require('fs');
const leeks = require('leeks.js'); // ultra light weight alternative to chalk
const timestamp = require('./timestamp.js');
const package = require('./package.json');
const today = new Date();

global.customTypes = {};
global.format = 'hh:mm:ss';

const time = () => {
  const now = new Date();
  return `${('0' + now.getHours()).slice(-2)}:${('0' + now.getMinutes()).slice(-2)}:${('0' + now.getSeconds()).slice(-2)}`;
}

const stamp = () => {
  return timestamp(global.format);
}

let d = ('0' + today.getDate()).slice(-2);

let path = `./logs/${timestamp('DD-MM-YYYY-hh-mm-ss')}.log`;

global.log = true;

const init = (o, is) => {
  global.init = true;
  if (!is) {
    is = 'INIT'
  };

  if (o) {
    global.options = o;
    if (o.logToFile === false) {
      global.log = false;
    };
    if (o.timestamp) {
      global.format = o.timestamp;
    };
    if (o.maxAge) {
      global.maxAge = o.maxAge;
    } else {
      global.maxAge = 7;
    }


    console.log(`[${stamp()} | ${is}] Initialising logger (v${package.version})`);
    if (o && o.logToFile === false) {
      return console.log(`[${stamp()} | ${is}] File logging set to ${leeks.colours.redBright("false")}`);
    }

    if (!fs.existsSync('./logs')) {
      fs.mkdirSync(`./logs`);
      console.log(`[${stamp()} | ${is}] No logs directory found, creating one for you`);
    }
    const files = fs.readdirSync('./logs/').filter(file => file.endsWith('.log'));

    let logs = 0;

    for (const file of files) {
      if (parseInt(file.substr(0, 2)) < parseInt(d - global.maxAge) || (parseInt(file.substr(0, 2)) > parseInt(d) && file.substr(3, 2) < ('0' + (today.getMonth() + 1)).slice(-2)) || (file.substr(3, 2) > ('0' + (today.getMonth() + 1)).slice(-2) && file.substr(6, 4) < today.getFullYear())) {
        fs.unlinkSync(`./logs/${file}`);
        logs++
        // console.log(`[${stamp()} | ${is}] Deleting "./logs/${file}"`);
      };
    };

    if (logs >= 1) {
      console.log(`[${stamp()} | ${is}] Deleted ${logs} old log files`)
    }


    try {
      if (o.name) {
        fs.appendFileSync(path, `${o.name} [ using leeksLazyLogger v${package.version} by Eartharoid (github.com/eartharoid/leeksLazyLogger) ] | Log File (${timestamp('DD/MM/YY hh:mm:ss')}) -->\n`, (error) => {
          if (error) throw error;
        });
      } else {
        fs.appendFileSync(path, `leeksLazyLogger v${package.version} by Eartharoid (github.com/eartharoid/leeksLazyLogger) | Log File (${timestamp('DD/MM/YY hh:mm:ss')}) -->\n`, (error) => {
          if (error) throw error;
        });
      }

      console.log(`[${stamp()} | ${is}] Creating new log file ("${path}")`);
    } catch (error) {
      console.error(leeks.colours.red(error));
    }




    let customTypes = global.options.custom;
    let typesList = [];
    for (let type in customTypes) {
      typesList.push(type);

      // module.exports[type] = (m, c) => {
      global.customTypes[type] = (m, c) => {
        let msg = typeof m === 'object' ? JSON.stringify(m) : m;
        if (global.log) {
          fs.appendFileSync(path, `[${stamp()} | ${customTypes[type].title.toUpperCase()}] ${strip(msg)}\n`, (error) => {
            if (error) throw error;
          });
        }

        if (!leeks.supportsColour) {
          return console.log(`[${stamp()} | ${customTypes[type].title.toUpperCase()}] ${msg}`);
        };

        if (c) {
          console.info(leeks.colours[c](`[${stamp()} | ${customTypes[type].title.toUpperCase()}] ${msg}`))
        } else {
          console.info(leeks.colours[customTypes[type].colour](`[${stamp()} | ${customTypes[type].title.toUpperCase()}] ${msg}`))
        };
      }
    };

    if (leeks.supportsColour) {
      console.log(`[${stamp()} | ${is}] Initialised logger with the following custom types: ` + leeks.colours.green(typesList.join(', ')));
    } else {
      console.log(`[${stamp()} | ${is}] Initialised logger with the following custom types: ` + typesList.join(', '));
    }

  } else {
    console.log(`[${stamp()} | ${is}] Initialised logger with no additional custom types`);
  }



};

const initError = () => {
  console.error(leeks.colours.redBright(`[${stamp()} | ERROR] leeksLazyLogger has not been initialised`));
  console.warn(leeks.colours.yellowBright(`[${stamp()} | WARN] Please read the documentation at github.com/eartharoid/leekslazylogger`));
  console.warn(leeks.colours.yellowBright(`[${stamp()} | WARN] You should initiate the logger with ${leeks.colours.bgYellowBright(leeks.colors.black("log.init()"))} ${leeks.colours.yellowBright("at the start of your application")}`));
  init();
  console.log(leeks.colours.greenBright(`[${stamp()} | INIT] leeksLazyLogger has been auto-initiated (manual initialisation is recommended)`));
};

const strip = (t) => {
  if (!t) return;
  return t.replace(/\u001b\[.*?m/g, '');
};

module.exports.init = (o) => {
  init(o, 'INIT')
};
module.exports.startup = (o) => {
  init(o, 'STARTUP')
};
module.exports.setup = (o) => {
  init(o, 'SETUP')
};

module.exports.basic = (m, c) => {
  if (!global.init) return initError();
  let msg = typeof m === 'object' ? JSON.stringify(m) : m;
  if (global.log) {
    fs.appendFileSync(path, `[${stamp()}] ${strip(msg)}\n`, (error) => {
      if (error) throw error;
    });
  }

  if (!leeks.supportsColour) {
    return console.log(`[${stamp()}] ${msg}`);
  };

  if (c) {
    console.log(leeks.colours[c](`[${stamp()}] ${msg}`));
  } else {
    console.log(`[${stamp()}] ${msg}`);
  };
};

module.exports.console = (m, c) => {
  if (!global.init) return initError();
  let msg = typeof m === 'object' ? JSON.stringify(m) : m;
  if (global.log) {
    fs.appendFileSync(path, `[${stamp()} | INFO] ${strip(msg)}\n`, (error) => {
      if (error) throw error;
    });
  };

  if (!leeks.supportsColour) {
    return console.log(`[${stamp()} | INFO] ${msg}`);
  };

  if (c) {
    console.log(leeks.colours[c](`[${stamp()} | INFO] ${msg}`));
  } else {
    console.log(`[${stamp()} | INFO] ${msg}`);
  };
};

module.exports.info = (m, c) => {
  if (!global.init) return initError();
  let msg = typeof m === 'object' ? JSON.stringify(m) : m;
  if (global.log) {
    fs.appendFileSync(path, `[${stamp()} | INFO] ${strip(msg)}\n`, (error) => {
      if (error) throw error;
    });
  }

  if (!leeks.supportsColour) {
    return console.log(`[${stamp()} | INFO] ${msg}`)
  };

  if (c) {
    console.info(leeks.colours[c](`[${stamp()} | INFO] ${msg}`))
  } else {
    console.info(leeks.colours.cyan(`[${stamp()} | INFO] ${msg}`))
  };
};

module.exports.success = (m, c) => {
  if (!global.init) return initError();
  let msg = typeof m === 'object' ? JSON.stringify(m) : m;
  if (global.log) {
    fs.appendFileSync(path, `[${stamp()} | INFO] ${strip(msg)}\n`, (error) => {
      if (error) throw error;
    });
  }

  if (!leeks.supportsColour) {
    return console.log(`[${stamp()} | INFO] ${msg}`)
  };

  if (c) {
    console.info(leeks.colours[c](`[${stamp()} | INFO] ${msg}`))
  } else {
    console.info(leeks.colours.green(`[${stamp()} | INFO] ${msg}`))
  };
};

module.exports.debug = (m, c) => {
  if (!global.init) return initError();
  let msg = typeof m === 'object' ? JSON.stringify(m) : m;
  if (global.log) {
    fs.appendFileSync(path, `[${stamp()} | DEBUG] ${strip(msg)}\n`, (error) => {
      if (error) throw error;
    });
  }

  if (!leeks.supportsColour) {
    return console.log(`[${stamp()} | DEBUG] ${msg}`)
  };

  if (c) {
    console.info(leeks.colours[c](`[${stamp()} | DEBUG] ${msg}`))
  } else {
    console.info(leeks.colours.blueBright(`[${stamp()} | DEBUG] ${msg}`))
  };
};

module.exports.warn = (m, c) => {
  if (!global.init) return initError();
  let msg = typeof m === 'object' ? JSON.stringify(m) : m;
  if (global.log) {
    fs.appendFileSync(path, `[${stamp()} | WARN] ${strip(msg)}\n`, (error) => {
      if (error) throw error;
    });
  }

  if (!leeks.supportsColour) {
    return console.log(`[${stamp()} | WARN] ${msg}`)
  };

  if (c) {
    console.warn(leeks.colours[c](`[${stamp()} | WARN] ${msg}`))
  } else {
    console.warn(leeks.colours.yellowBright(`[${stamp()} | WARN] ${msg}`))
  };
};

module.exports.error = (m, c) => {
  if (!global.init) return initError();
  let msg = typeof m === 'object' ? JSON.stringify(m) : m;
  if (global.log) {
    fs.appendFileSync(path, `[${stamp()} | ERROR] ${strip(msg)}\n`, (error) => {
      if (error) throw error;
    });
  }

  if (!leeks.supportsColour) {
    return console.log(`[${stamp()} | ERROR] ${msg}`)
  };
  if (c) {
    console.error(leeks.colours[c](`[${stamp()} | ERROR] ${msg}`))
  } else {
    console.error(leeks.colours.redBright(`[${stamp()} | ERROR] ${msg}`))
  };
};

module.exports.custom = (t, m, c) => {
  if (!global.init) return initError();
  let msg = typeof m === 'object' ? JSON.stringify(m) : m;
  if (global.log) {
    fs.appendFileSync(path, `[${stamp()} | ${t.toUpperCase()}] ${strip(msg)}\n`, (error) => {
      if (error) throw error;
    });
  }

  if (!leeks.supportsColour) {
    return console.log(`[${stamp()} | ${t.toUpperCase()}] ${msg}`)
  };

  if (c) {
    console.log(leeks.colours[c](`[${stamp()} | ${t.toUpperCase()}] ${msg}`))
  } else {
    console.log(`[${stamp()} | ${t.toUpperCase()}] ${msg}`)
  };
};

module.exports.newLine = () => {
  if (!global.init) return initError();
  if (global.log) {
    fs.appendFileSync(path, `\n`, (error) => {
      if (error) throw error;
    });
  }

  console.log('');
};

module.exports.getPath = () => {
  if (!global.init) return initError();
  return path; // this will return the path of the current log file
};

module.exports.getFile = () => {
  if (!global.init) return initError();
  return fs.readFileSync(path); // this will return the contents of the current log file (won't log it though)
};

module.exports.timestamp = () => {
  return stamp();
};

module.exports.colors = leeks.colors;
module.exports.colours = leeks.colours;
module.exports.color = leeks.colors;
module.exports.colour = leeks.colours;
module.exports.style = leeks.styles;
module.exports.styles = leeks.styles;
module.exports.options = this.options;
module.exports.type = global.customTypes;
module.exports.types = global.customTypes;
module.exports.time = time();