import { Request, Response } from 'express';
import { ParamsDictionary } from 'express-serve-static-core';
import { RequestBody } from 'src/types';
import { getTransformedWorklogs, getWorklogs, loadWorklogs } from 'src/utils/etl';
import { validateRequest } from 'src/utils/validation';
import { getStartAndEndDates } from 'src/utils/date';

export const get = (_request: Request, response: Response): void => {
    response.send('App is running');
};

export const post = async (
    request: Request<ParamsDictionary, string, RequestBody>, 
    response: Response
): Promise<void> => {
    try {
        const { 
            sourceAccountId, 
            sourceToken,
            period,
            destinationAccountId,
            destinationToken,
            destinationIssueKey,
            description
        } = validateRequest(request);

        const { startDate, endDate } = getStartAndEndDates(period);
        const worklogs = await getWorklogs(sourceAccountId, sourceToken, startDate, endDate);

        const worklogsForLoad = getTransformedWorklogs(worklogs,destinationAccountId, destinationIssueKey, description);
        
        const responses = await loadWorklogs(worklogsForLoad, destinationToken);
        const totalCount = responses.filter(({ status }) => status === 200).length;

        response.send(`Success! ${ totalCount } worklogs copied.`);
    } catch(error) {
        if (error instanceof Error) {
            const { message } = error;

            response.send(message);
        }
    }
};
