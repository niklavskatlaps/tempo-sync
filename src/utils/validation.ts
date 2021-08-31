import { RequestBody, ValidatedRequestData } from 'src/types';
import { Request } from 'express';
import { ParamsDictionary } from 'express-serve-static-core';
import HttpException from 'src/libs/HttpException';

export const SUPPORTED_PERIODS = ['month', 'week', 'day'] as const;

export const validateRequest = (
    request: Request<ParamsDictionary, Record<string, string | number>, RequestBody>
): ValidatedRequestData => {
    const { 
        query: { period: selectedPeriod }, 
        body: { source, destination } 
    } = request;

    if (!source || !destination) {
        throw new HttpException('Error! Invalid request body. Please provide source and destination.', 400);
    }

    const { accountId: sourceAccountId, token: sourceToken } = source;
    const { 
        accountId: destinationAccountId,
        token: destinationToken, 
        issueKey: destinationIssueKey, 
        description
    } = destination;


    if (
        Object.values(source).some((value) => typeof value !== 'string') ||
        Object.values(destination).some((value) => typeof value !== 'string')
    ) {
        throw new HttpException(
            'Error! All input values for both source and destinition should be of type string.', 
            400
        );
    }

    const period = SUPPORTED_PERIODS.find((supportedPeriod) => supportedPeriod === selectedPeriod);

    if (!period) {
        throw new HttpException(
            `Error! Selected period is not supported. Supported periods: ${ SUPPORTED_PERIODS.join(', ') }.`,
            400
        );
    }

    return {
        sourceAccountId,
        sourceToken,
        destinationAccountId,
        destinationToken,
        period,
        destinationIssueKey,
        description
    };
};
