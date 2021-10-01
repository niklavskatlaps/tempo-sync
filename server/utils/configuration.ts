import HttpException from 'libs/HttpException';

export const getEndpointUrl = (): string => {
    if (!process.env.TEMPO_REST_API_ENDPOINT) {
        throw new HttpException('Error! Missing Tempo REST API endpoint.');
    }

    return process.env.TEMPO_REST_API_ENDPOINT;
};
