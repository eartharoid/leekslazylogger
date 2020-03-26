const Logger = require("./index.js");
const log = new Logger({
    // name: "Logger Test",
    custom: {
		ex1: {
            title: "normal example",
            foreground: "black",
            bacgkround: "bgCyan", // black text on cyan backgrond // does not fit any other, leeks colour
            styles: ["bold", "&n"]
        },
        ex2: {
            title: "hex example",
            foreground: "#00FF21" // starts with #, hex
        },
        ex3: {
            title: "rgb example",
            foreground: ['0', '255', '255'] // is an array, rgb 
        },
        ex4: {
            title: "8bit example",
            foreground: "16" // parses to a number, 8bit
        },
        ex5: {
            title: "another example",
            foreground: "&a", // starts with &, color code
            background: "&!2" // light green text on dark gren background 
        }
    },
    logToFile: true,
    maxAge: -1,
    keepSilent: false
});
const colour = log.c;
const style = log.s;

let awesome = colour.cyanBright;

console.log(awesome(log.options.name));

// let text1 = log.format("first part", {c: ["black", "bgBlueBright"], s: ["bold", "underline"]})
// let text2 = log.format("second part", {c: ["#000000"], s: ["bold", "underline"]})
// log.console(text1 + text2)
// log.console("text", {c: ["f", "b"], s: ["bold", "underline"]})

console.log(log.c.redBright("red"));
log.test("&a&lThis should be light &c&o&kgreen&a&l and &nbold");
log.test("&00&r     &11&r     &22&r     &33&r     &44&r     &55&r     &66&r     &77&r     &88&r     &99");
log.test("&aa&r     &bb&r     &cc&r     &dd&r     &ee&r     &ff");
log.test("&!0!0&r    &!1!1&r    &!2!2&r    &!3!3&r    &!4!4&r    &!5!5&r    &!6!6&r    &!7!7&r    &!8!8&r    &!9!9&r");
log.test("&!a!a&r    &!b!b&r    &!c!c&r    &!d!d&r    &!e!e&r    &!f!f&r");
setTimeout(() => {
    log.test("&a&l&!3(codes)");
}, 1000);
console.log("should be white");

