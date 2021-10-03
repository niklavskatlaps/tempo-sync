// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import axios, { AxiosError, AxiosResponse } from 'axios';
import type { NextApiRequest, NextApiResponse } from 'next';
import { RequestBody, RequestResponse } from '../../types';

export default async function handler(
    request: NextApiRequest,
    response: NextApiResponse<RequestResponse>
): Promise<void> {
    try {
        const { 
            body: {
                period, 
                sourceAccountId,
                sourceToken,
                destinationAccountId,
                destinationToken,
                issueKey,
                description
            }
        } = request;
    
        const { data } = await axios.request<RequestBody, AxiosResponse<RequestResponse>>({
            baseURL: process.env.SERVER_ENDPOINT,
            method: 'POST',
            params: { period },
            data: {
                source: {
                    accountId: sourceAccountId,
                    token: sourceToken
                },
                destination: {
                    accountId: destinationAccountId,
                    token: destinationToken,
                    issueKey: issueKey,
                    description: description
                }
            }
        });

        response.send(data);
    } catch (error) {
        if (axios.isAxiosError(error))  {
            const { 
                response: {
                    data: {
                        message: errorMessageFromApi
                    }
                } = { data: { message: 'Something went wrong' } }
            } = error as AxiosError<RequestResponse>;


            response.send({ status: 200, message: errorMessageFromApi });
            return;
        } 

        const message = error instanceof Error ? error.message : 'Something went wrong';

        response.send({ status: 200, message });
    }
}
