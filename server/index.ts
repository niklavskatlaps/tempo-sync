import express from 'express';
import indexRouter from 'routes';
import errorMiddleware from 'middlewares/error';
import HttpException from 'libs/HttpException';

const CONTAINER_PORT = process.env.CONTAINER_PORT;
const SERVER_PORT = process.env.SERVER_PORT;

if (!CONTAINER_PORT || !SERVER_PORT) {
    throw new HttpException('Error! Missing ports.');
}

const app = express();

app.use(express.json());
app.use('/', indexRouter);
app.use(errorMiddleware);

app.listen(CONTAINER_PORT, () => { 
    console.log(`App ready at http://localhost:${ SERVER_PORT }`);
});
