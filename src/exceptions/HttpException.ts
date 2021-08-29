class HttpException extends Error {
    status: number;
    message: string;
    
    constructor(message: string, status = 500) {
        super(message);
        this.status = status;
        this.message = message;
    }
}
   
export default HttpException;