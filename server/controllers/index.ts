import { Request, Response, NextFunction } from 'express';
import { ParamsDictionary } from 'express-serve-static-core';
import { RequestBody } from 'types';
import { validateRequest } from 'utils/validation';
import { getStartAndEndDates } from 'utils/date';
import WorklogsService from 'services/WorklogsService';

export const getAppStatus = (_request: Request, response: Response): void => {
    response.json({
        status: 200,
        message: 'App is running'
    });
};

export const copyWorklogs = async (
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
        
        const worklogsToTransform = await WorklogsService.getWorklogs(
            sourceAccountId, 
            sourceToken, 
            startDate, 
            endDate
        );

        const worklogsToLoad = WorklogsService.getTransformedWorklogs(
            worklogsToTransform, 
            destinationAccountId, 
            destinationIssueKey, 
            description
        );
        
        const responses = await WorklogsService.loadWorklogs(worklogsToLoad, destinationToken);

        response.json({
            status: 200,
            message: 'Success!',
            created: responses.filter(({ status }) => status === 200).length
        });
    } catch(error) {
        next(error);
    }
};
