const ChildLogger = require(".").ChildLogger;
const log = new ChildLogger();
module.exports = () => {
    log.console(`This is ${log.options.name}, from ${log.c.greenBright('t2.js')}`)
    log.info("beep")
    log.ex1("wf")
    
    for (t in log.custom) {
        log[t](log.c.magentaBright(`${t} from t2`));
    };

    log.info("&a&l&!3hello from t2.js");
};