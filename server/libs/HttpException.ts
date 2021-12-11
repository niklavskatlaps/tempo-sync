class HttpException extends Error {
    constructor(public message: string, public status = 500) {
        super(message);
    }
}

export default HttpException;
