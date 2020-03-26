/**
 * @name leekslazylogger
 * @author eartharoid <contact@eartharoid.me>
 * @description An easy-to-use and lightweight console logger for Node.JS
 * @license MIT
 * 
 * default styles and formatting codes storage
 * 
 */

module.exports.defaultTypes = {
    basic: {title: null, c: null},
    console: {title: "INFO", c: null},
    info: {title: "INFO", c: ["cyan"]},
    success: {title: "SUCCESS", c: ["green"]},
    debug: {title: "DEBUG", c: ["blue"]},
    notice: {title: "NOTICE", c: ["black", "bgYellowBright"]},
    warn: {title: "WARN", c: ["yellowBright"]},
    error: {title: "ERROR", c: ["red"]}
};

// 24 colouring and styling codes 
module.exports.codes = {
    // first 10 of 16 colours           --FOREGROUND---
    "&0": "black",
    "&1": "blue",
    "&2": "green",
    "&3": "cyan",
    "&4": "red",
    "&5": "magenta",
    "&6": "yellow",
    "&7": "blackBright",
    "&8": "whiteBright",
    "&9": "cyanBright",
    // last 6 of 16 colours, lighter    ---FOREGROUND---
    "&a": "greenBright",
    "&b": "blueBright",
    "&c": "redBright",
    "&d": "magentaBright",
    "&e": "yellowBright",
    "&f": "white",
    // 8 styling codes                    ---STYLES---
    "&i": "inverse",
    "&j": "dim",
    "&k": "blink",
    "&l": "bold",
    "&m": "strikethrough",
    "&n": "underline",
    "&o": "italic",
    "&r": "reset",   
    // first 10 of 16 colours           ---BACKGROUND---
    "&!0": "bgBlack",
    "&!1": "bgBlue",
    "&!2": "bgGreen",
    "&!3": "bgCyan",
    "&!4": "bgRed",
    "&!5": "bgMagenta",
    "&!6": "bgYellow",
    "&!7": "bgBlackBright",
    "&!8": "bgBlackBright",
    "&!9": "bgCyanBright",
    // last 6 of 16 colours, lighter    ---BACKGROUND---
    "&!a": "bgGreenBright",
    "&!b": "bgBlueBright",
    "&!c": "bgRedBright",
    "&!d": "bgMagentaBright",
    "&!e": "bgYellowBright",
    "&!f": "bgWhite",
};

