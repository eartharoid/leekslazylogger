# Creating a transport

Look at the built-in [`ConsoleTransport`](https://github.com/eartharoid/leekslazylogger/blob/main/src/transports/console/index.ts) for guidance. Ideally use a class and extend `Transport`, but as long as your object has a `level` property and `write` function, it should work.

The `level` property tells the logger if a log should be sent to your transport.
The `write` function takes the `Log` object and does something with it, such as sending it to console, a file, or over the internet with a HTTP request.