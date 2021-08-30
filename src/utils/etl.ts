import axios, { AxiosResponse } from 'axios';
import { Promise } from 'bluebird';
import { groupBy } from 'lodash';
import HttpException from 'src/exceptions/HttpException';
import { Worklog, GetWorklogsResponse, NewWorklog } from 'src/types';

const MAX_CONCURRENT_REQUESTS = 12;
const BASE_URL = process.env.TEMPO_REST_API_ENDPOINT;

if (!BASE_URL) {
    throw new HttpException('Error! Missing Tempo REST API endpoint.');
}

export const getWorklogs = async (
    accountId: string, 
    token: string, 
    startDate: string, 
    endDate: string
): Promise<Worklog[]> => {
    try {
        const { data: { results } } = await axios.get<GetWorklogsResponse>(
            `${ BASE_URL }/user/${ accountId }?from=${ startDate }&to=${ endDate }&limit=1000`, 
            { headers: { Authorization: `Bearer ${ token }` } }
        );

        return results;
    } catch (error) {
        throw new HttpException('Error extracting worklogs.');
    }
};

/**
 * Using bluebird library to handle worklog loading.
 * Tempo API doesn't have an endpoint for creating worklogs in bulk and has a limit for concurrent requests. 
 * If we don't set a limit, promise is rejected and we get a "429 Too Many Requests" response.
 * https://community.atlassian.com/t5/Jira-Service-Management/Rate-Limit-Too-Many-Requests/qaq-p/1020846
 * 
 * @param worklogs 
 * @param token 
 * @returns a promise that is resolved with an array of axios responses
 */
export const loadWorklogs = async (
    worklogs: NewWorklog[], 
    token: string
): Promise<AxiosResponse[]> => {
    try {
        return await Promise.map(worklogs, (worklog) => axios.post(
            BASE_URL, 
            worklog,
            { headers: { Authorization: `Bearer ${ token }` } }
        ), { concurrency: MAX_CONCURRENT_REQUESTS });
    } catch(error) {
        throw new HttpException('Error creating new worklogs.');
    }
};

export const getTransformedWorklogs = (
    worklogs: Worklog[], 
    authorAccountId: string,  
    issueKey: string,
    description: string
): NewWorklog[] => {
    const grouped = groupBy(worklogs, ({ startDate }) => startDate);

    return Object.values(grouped).map((worklogsGroupedByDay) => {
        return worklogsGroupedByDay.reduce((prev, curr) => {
            const { timeSpentSeconds: prevTimeSpentSeconds, billableSeconds: prevBillableSeconds } = prev;
            const { timeSpentSeconds, billableSeconds, startDate } = curr;

            return {
                issueKey,
                authorAccountId,
                timeSpentSeconds: prevTimeSpentSeconds + timeSpentSeconds,
                billableSeconds: prevBillableSeconds + billableSeconds,
                startDate,
                startTime: '08:00:00',
                description
            };
        }, { timeSpentSeconds: 0, billableSeconds: 0 } as NewWorklog);
    });
};
