import axios, { AxiosResponse } from 'axios';
import { Worklog, GetWorklogsResponse, NewWorklog } from 'src/types';
import { groupBy } from 'lodash';
import HttpException from 'src/exceptions/HttpException';

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
        throw new HttpException('Error fetching worklogs.');
    }
};

export const loadWorklogs = async (
    worklogs: NewWorklog[], 
    token: string
): Promise<AxiosResponse[]> => {
    try {
        return await Promise.all(worklogs.map(
            (worklog) => axios.post(
                `${ BASE_URL }`, 
                worklog,
                { headers: { Authorization: `Bearer ${ token }` } }
            )
        ));
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
            const { timeSpentSeconds, billableSeconds, startDate, startTime  } = curr;

            return {
                issueKey,
                authorAccountId,
                timeSpentSeconds: prevTimeSpentSeconds + timeSpentSeconds,
                billableSeconds: prevBillableSeconds + billableSeconds,
                startDate,
                startTime,
                description
            };
        }, { timeSpentSeconds: 0, billableSeconds: 0 } as NewWorklog);
    });
};
