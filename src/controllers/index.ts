import { Request, Response, NextFunction } from 'express';
import { ParamsDictionary } from 'express-serve-static-core';
import { RequestBody } from 'src/types';
import { getTransformedWorklogs, getWorklogs, loadWorklogs } from 'src/utils/etl';
import { validateRequest } from 'src/utils/validation';
import { getStartAndEndDates } from 'src/utils/date';
import HttpException from 'src/exceptions/HttpException';

export const get = (_request: Request, response: Response): void => {
    response.json({
        status: 200,
        message: 'App is running'
    });
};

export const post = async (
    request: Request<ParamsDictionary, Record<string, string | number>, RequestBody>, 
    response: Response,
    next: NextFunction
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
        const extractedCount = worklogs.length;

        if (!extractedCount) {
            throw new HttpException('There are no worklogs to copy. Please choose a different time period.', 406);
        }

        const transformedWorklogs = getTransformedWorklogs(worklogs, destinationAccountId, destinationIssueKey, description);
        
        const responses = await loadWorklogs(transformedWorklogs, destinationToken);
        const loadedCount = responses.filter(({ status }) => status === 200).length;

        response.json({
            status: 200,
            message: 'Success!',
            extracted: extractedCount,
            loaded: loadedCount
        });
    } catch(error) {
        next(error);
    }
};
