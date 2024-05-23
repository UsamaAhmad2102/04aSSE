const express = require('express');
const app = express();
const port = 3000;

app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    next();
});

app.get('/events', (req, res) => {
    res.setHeader('Content-Type', 'text/event-stream');
    res.setHeader('Cache-Control', 'no-cache');
    res.setHeader('Connection', 'keep-alive');
    res.flushHeaders(); // flush the headers to establish SSE connection

    let counter = 0;
    const intervalId = setInterval(() => {
        counter++;
        res.write(`data: ${JSON.stringify({ message: 'Hello from the server', counter })}\n\n`);

        if (counter === 10) { // close the connection after 10 messages
            clearInterval(intervalId);
            res.end();
        }
    }, 1000);

    req.on('close', () => {
        clearInterval(intervalId);
        res.end();
    });
});

app.listen(port, () => {
    console.log(`SSE server running at http://localhost:${port}`);
});
