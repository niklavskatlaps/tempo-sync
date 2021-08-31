import { NextFunction, Request, Response } from 'express';
import HttpException from 'src/libs/HttpException';
 
function errorMiddleware(
    error: HttpException, 
    _request: Request, 
    response: Response, 
    _next: NextFunction
): void {
    const status = error.status || 500;
    const message = error.message || 'Something went wrong!';

    console.error(error);

    response.status(status).json({
        status,
        message
    });
}
 
export default errorMiddleware;
