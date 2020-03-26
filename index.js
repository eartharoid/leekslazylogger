/**
 * @name leekslazylogger
 * @author eartharoid <contact@eartharoid.me>
 * @description An easy-to-use and lightweight console logger for Node.JS
 * @license MIT
 */

const timestamp = require("dtstamp"); // date & timestamp formatter, originally made for this (by me :D)
const leeks = require("leeks.js"); // Like chalk but cooler, adds colour to terminal
const { version } = require("./package.json");
const fs = require("fs");
const header = require("./header.js");
const data = require("./data.js");
const codes = data.codes;
const defaultTypes = data.defaultTypes;
const termCodes = require("./term.js");
const codesRegex = /&[0-9a-fi-or]|&![0-9a-f]/g; // https://regex101.com/r/3VB0K7/7

const plural = (word, num) => {
    return num !== 1 ? word + "s" : word;
};

const replaceCodes = (string) => {
    return string.replace(codesRegex, (cs) => { return `\x1b[${termCodes[codes[cs]]}m`; }) + "\x1b[0m";
};


/**
 * @description Logger object with options (o)
 * @param {object} o - customise your logger with options
 * @param {string} o.name - name of your project, will appear at the top of log files
 * @param {boolean} o.logToFile - log everything to a file?
 * @param {boolean} o.daily - Make a new file at the start of every day?
 * @param {boolean} o.keepSilent - Hide startup messages from the logger? 
 * @param {string} o.timestamp - timestamp format
 * @param {string} o.dateFormat - datestamp format (only used in log file's name)
 * @param {number} o.maxAge - number of days to keep old log files (-1 to delete all)
 * @param {object} o.custom - object of custom types, see wiki for help
 */
module.exports = class Logger {
    constructor(o) {
        this.options = {};

        // make leeks colours and styles available
        this.c = leeks.colours;
        this.color = leeks.colors;
        this.colors = leeks.colors;
        this.colour = leeks.colours;
        this.colours = leeks.colours;
        this.s = leeks.styles;
        this.style = leeks.styles;
        this.styles = leeks.styles;

        this.supportsColor = leeks.supportsColor;
        this.supportsColour = leeks.supportsColour;

        this.hex = leeks.hex;
        this.hexBg = leeks.hexBg;
        this.rgb = leeks.rgb;
        this.rgbBg = leeks.rgbBg;
        this.eight = leeks.eightBit;
        this.eightBg = leeks.eightBitBg;

        this.dtf = (str) => {
            return timestamp(str);
        };

        // name of project
        o.name ? this.options.name = o.name : this.options.name = "A leekslazylogger project";

        // log everything to a file?
        o.logToFile === false ? this.options.logToFile = false : this.options.logToFile = true;
        
        // timestamp format to be used in log file and console
        o.timestamp ? this.options.timestamp = o.timestamp : this.options.timestamp = "HH:mm:ss";

        // datestamp format to be used in log file's name
        o.dateFormat ? this.options.dateFormat = o.dateFormat : this.options.dateFormat = "DD-MM-YY";

        // how long to keep files (in days)
        o.maxAge ? this.options.maxAge = o.maxAge : this.options.maxAge = 7;

        // hide logger startup messages? cleaner but less informative.
        o.keepSilent ? this.options.keepSilent = o.keepSilent : this.options.keepSilent = false;

        // 1 log file per day or 1 per run?
        if (o.daily === false) {
            this.options.daily = false;
            this.path = `./logs/${timestamp(`${this.options.dateFormat}-HH-mm-ss`)}.log`;
        } else {
            this.options.daily = true;
            this.path = `./logs/${timestamp(this.options.dateFormat)}.log`;
        };

        for (let type in defaultTypes) {
            // log, UPDATE CUSTOM LOG TOOOOOOOOOOOOOOO!!
            console.log(type)
        }
        

        // custom log types
        // if (o.custom) {
        //     this.custom = o.custom;
        //     for (let type in this.custom) {
        //         this[type] = (m, c) => {
        //             let msg = typeof m === 'object' ? JSON.stringify(m) : m;
        //             if (global.log) {
        //                 fs.appendFileSync(this.path, `[${timestamp(this.timestamp)} | ${this.custom[type].title.toUpperCase()}] ${strip(msg)}\n`, (error) => {
        //                     if (error) throw error;
        //                 });
        //             }

        //             if (!leeks.supportsColour) {
        //                 return console.log(`[${timestamp(this.timestamp)} | ${this.custom[type].title.toUpperCase()}] ${msg}`);
        //             };

        //             if (c) {
        //                 console.info(leeks.colours[c](`[${timestamp(this.timestamp)} | ${this.custom[type].title.toUpperCase()}] ${msg}`))
        //             } else {
        //                 console.info(leeks.colours[this.custom[type].colour || this.custom[type].color](`[${timestamp(this.timestamp)} | ${this.custom[type].title.toUpperCase()}] ${msg}`))
        //             };
        //         };
        //     };
        // } else {
        //     this.custom = null;
        // };

        // timestamp
        this.stamp = () => { return timestamp(this.options.timestamp); } ;

        // check if unecessary messages have been disabled and if not, send them
        const verbose = (text) => {
            if (this.options.keepSilent === true) return;
            return console.log(text);
        };

        // send startup messages
        verbose(`[${this.stamp()} | LOGGER] Initialising logger (v${version})`);
        if (!this.options.logToFile === true) { return verbose(`[${this.stamp()} | LOGGER] Logging to file is ${leeks.colours.redBright("disabled")}`); };

        // create logs folder if it doesnt exist
        if (!fs.existsSync('./logs')) {
            fs.mkdirSync(`./logs`);
            verbose(`[${this.stamp()} | LOGGER] No logs directory found, creating one for you`);
        };

        // delete any log files older than options.maxAge days
        const files = fs.readdirSync('./logs/').filter(file => file.endsWith('.log'));
        let logs = 0;
        let today = new Date();
        for (const file of files) {
            let lastMod = new Date(fs.statSync(`./logs/${file}`).mtime);
            if (Math.floor((today - lastMod) / (1000 * 60 * 60 * 24)) > this.options.maxAge) {
                fs.unlinkSync(`./logs/${file}`);
                logs++
            };
        };

        if (logs >= 1) { verbose(`[${this.stamp()} | LOGGER] Deleted ${logs} old log ${plural("file", logs)}`) };

        // create new log file (if it doesnt alrady exist) and send header
        try {
            verbose(`[${this.stamp()} | LOGGER] Preparing log file ("${this.path}")`);
            fs.appendFileSync(this.path, header(this.options, version), (error) => {
                if (error) throw error;
            });
        } catch (error) {
            console.error(leeks.colours.red(error));
        };
    };
    test = (string) => { console.log(`[${this.stamp()} | CODE TEST] ${replaceCodes(string)}`); };
}