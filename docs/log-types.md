# Default log types

If you don't like one of the defaults, you can override it with a custom log type with the same name.

If you want to override the colours on some but not all:

```js
log.info(text, [foregroundColour]);
log.info(text, [foregroundColour, backgroundColour]);
log.info(text, [backgroundColour]);
```

where `foregroundColour` and `backgroundColour` are resolvable [colours](/colours).

## basic

```js
log.basic(text); // default: white
// -> [00:00:00] text
```

## console

```js
log.console(text); // default: white
// -> [00:00:00 | INFO] text
```

## info

```js
log.info(text); // default: cyan
// -> [00:00:00 | INFO] text
```

## success

```js
log.success(text); // default: green
// -> [00:00:00 | INFO] text
```

## debug

```js
log.debug(text); // default: blue
// -> [00:00:00 | DEBUG] text
```

## notice

```js
log.notice(text); // default: black on bgYellow
// -> [00:00:00 | NOTICE] text
```

## warn

```js
log.warn(text); // default: yellow
// -> [00:00:00 | WARN] text
```

## error

```js
log.error(text); // default: red
// -> [00:00:00 | ERROR] text
```
