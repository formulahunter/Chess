const express = require('express');

const host = '192.168.1.214';
const port = 8010;

const server = express();
server.use('/', express.static('app'));

server.listen(port, host, () => console.log(`serving http on ${host}:${port}`));
