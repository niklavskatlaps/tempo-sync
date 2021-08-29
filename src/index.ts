import express from 'express';
import index from 'src/routes';

const CONTAINER_PORT = process.env.CONTAINER_PORT;
const HOST_PORT = process.env.HOST_PORT;

if (!CONTAINER_PORT || !HOST_PORT) {
    throw new Error('Error! Missing ports.');
}

const app = express();

app.use(express.json());
app.use('/', index);

app.listen(CONTAINER_PORT, () => { 
    console.log(`App ready at http://localhost:${ HOST_PORT }`);
});
