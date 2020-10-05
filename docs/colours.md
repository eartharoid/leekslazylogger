# Colours

To use colours (other than &codes) inline, you must import leeks.js (which you have already installed as it is one of the two dependencies). **I recommend using &codes if you want to use inline colours,**

??? example
	**Require leeks.js** to use inline colours other than &codes:

	```js
	const leeks = require('leeks.js');
	```

	**BUT** I recommend using &codes instead if you want to use inline colours.

**Using overrides:**

```js
log.info(text, [foregroundColour]);
log.info(text, [foregroundColour, backgroundColour]);
log.info(text, [backgroundColour]);
```

where `foregroundColour` and `backgroundColour` are resolvable [colours](/colours).

!!! info
	If you give both a foreground and background colour, and the background colour given is the name or &code of a foreground colour, the background colour will be converted to an actual background colour. As RGB/HEX/8bit colours do not have specific foreground/background codes, if you wish to use an RGB/HEX/8bit colour for the background you must also give a foreground colour.

## Types of colours

### leeks.js / colour name

A name of a colour (string or function).

**A full list of leeks.js colour names and style names can be found [here](https://docs.derpyenterprises.org/#/leeks?id=colors).**

=== "Override"

	```js
	log.info('some text', ['blue', 'black']);
	// or
	log.info('some text', ['blue', 'bgBlack']);
	```

=== "Inline"

	```js
	log.info(`this part is normal info colour ${leeks.colours.red('but this part is red')},
	although this is also red :(`); // better to use &codes for inline
	```

### RGB

A string of numbers separated by commas (with or without spaces).

See [leeks.js docs](https://derpyenterprises.org/docs/#/leeks?id=usage) for inline usage.

```js
log.info('some text', ['123, 123, 123', '321, 321, 321']);
```

### HEX

A string with a HEX code (**with** hashtag).

See [leeks.js docs](https://derpyenterprises.org/docs/#/leeks?id=usage) for inline usage.

```js
log.info('some text', ['#AABBCC', '#123456']);
```

### 8bit

A number. *You will get an error if you try to put the number in a string.*

See [leeks.js docs](https://derpyenterprises.org/docs/#/leeks?id=usage) for inline usage.

```js
log.info('some text', [16, 1]);
```

### &code

A string containing an `&fg` or `&!bg` short code for a leeks.js colour. All short codes are [listed below](#leeksjs-short-codes).

Don't put a space between codes and text when using them inline (`&cred` not `&c red`) as the space will show.

Use `log.f(String)` or `log.format(String)` to use inline colours.

=== "Override"

	```js
	log.info('some text', ['&a', '&0']);
	// or
	log.info('some text', ['&a', '&!0']);
	```

=== "Inline"

	```js
	log.info(log.format(`this is normal info colour, &athis is light green
	&3,and it\'s easy to return to the normal colour`));
	```

#### leeks.js short codes

##### Foreground colours

|Code   |leeks.js  	 	|
|:------|:--------------|
|&0     |black         	|
|&1     |blue         	|
|&2     |green         	|
|&3     |cyan         	|
|&4     |red         	|
|&5     |magenta        |
|&6     |yellow         |
|&7     |blackBright    |
|&8     |whiteBright    |
|&9     |blueBright    	|
|&a     |greenBright    |
|&b     |cyanBright     |
|&c     |redBright      |
|&d     |magentaBright  |
|&e     |yellowBright   |
|&f     |white         	|

##### Background colours

|Code   |leeks.js  	 	|
|:------|:--------------|
|&!0    |bgBlack        |
|&!1    |bgBlue         |
|&!2    |bgGreen        |
|&!3    |bgCyan         |
|&!4    |bgRed         	|
|&!5    |bgMagenta      |
|&!6    |bgYellow       |
|&!7    |bgBlackBright  |
|&!8    |bgWhiteBright  |
|&!9    |bgBlueBright   |
|&!a    |bgGreenBright  |
|&!b    |bgCyanBright   |
|&!c    |bgRedBright    |
|&!d    |bgMagentaBright|
|&!e    |bgYellowBright |
|&!f    |bgWhite        |

##### Styles

|Code   |leeks.js  	 	|
|:------|:--------------|
|&i		|inverse		|
|&j		|dim			|
|&k		|blink			|
|&l		|bold			|
|&m		|strikethrough	|
|&n		|underline		|
|&o		|italic			|
|&r		|reset			|
