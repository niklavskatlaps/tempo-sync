import express from 'express';
import indexRouter from 'src/routes';
import errorMiddleware from 'src/middlewares/error';
import HttpException from 'src/libs/HttpException';

const CONTAINER_PORT = process.env.CONTAINER_PORT;
const HOST_PORT = process.env.HOST_PORT;

if (!CONTAINER_PORT || !HOST_PORT) {
    throw new HttpException('Error! Missing ports.');
}

const app = express();

app.use(express.json());
app.use('/', indexRouter);
app.use(errorMiddleware);

app.listen(CONTAINER_PORT, () => { 
    console.log(`App ready at http://localhost:${ HOST_PORT }`);
});
