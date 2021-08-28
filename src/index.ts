import express from 'express';

const server = express();

server.listen(process.env.APP_PORT, () => console.log('Server ready!'));
