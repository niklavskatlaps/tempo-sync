import axios, { AxiosResponse } from 'axios';
import { Promise } from 'bluebird';
import { groupBy } from 'lodash';
import HttpException from 'libs/HttpException';
import { Worklog, GetWorklogsResponse, NewWorklog } from 'types';
import { getEndpointUrl } from 'utils/configuration';

const MAX_CONCURRENT_REQUESTS = 12;

class WorklogService {
    baseUrl = getEndpointUrl();

    constructor(
        protected sourceAccountId: string,
        protected sourceToken: string,
        protected destinationAccountId: string,
        protected destinationToken: string,
        protected destinationIssueKey: string
    ) {}

    async getWorklogs(startDate: string, endDate: string): Promise<Worklog[]> {
        try {
            const { data: { results } } = await axios.get<GetWorklogsResponse>(
                `${this.baseUrl}/user/${this.sourceAccountId}`,
                {
                    headers: {
                        Authorization: `Bearer ${this.sourceToken}`
                    },
                    params: {
                        from: startDate,
                        to: endDate,
                        limit: 1000
                    }
                }
            );

            return results;
        } catch (error) {
            throw new HttpException('Error! Worklog extraction failed.');
        }
    }

    /**
     * Using bluebird library to handle worklog loading.
     * Tempo API doesn't have an endpoint for creating worklogs in bulk and has a limit for concurrent requests.
     * If we don't set a limit, promise is rejected and we get a "429 Too Many Requests" response.
     * https://community.atlassian.com/t5/Jira-Service-Management/Rate-Limit-Too-Many-Requests/qaq-p/1020846
     *
     * @param worklogs
     * @returns a promise that is resolved with an array of axios responses
     */
    async loadWorklogs(worklogs: NewWorklog[]): Promise<AxiosResponse[]> {
        try {
            return await Promise.map(worklogs, (worklog) => axios.post(
                this.baseUrl,
                worklog,
                { headers: { Authorization: `Bearer ${this.destinationToken}` } }
            ), { concurrency: MAX_CONCURRENT_REQUESTS });
        } catch(error) {
            throw new HttpException('Error! Worklog creation failed.');
        }
    }

    transformWorklogs(worklogs: Worklog[], description: string): NewWorklog[] {
        const worklogDictionary = groupBy(worklogs, ({ startDate }) => startDate);

        return Object.values(worklogDictionary).map((worklogsGroupedByDay) => {
            return worklogsGroupedByDay.reduce((prev, curr) => {
                const { timeSpentSeconds: prevTimeSpentSeconds, billableSeconds: prevBillableSeconds } = prev;
                const { timeSpentSeconds, billableSeconds, startDate } = curr;

                return {
                    ...prev,
                    timeSpentSeconds: prevTimeSpentSeconds + timeSpentSeconds,
                    billableSeconds: prevBillableSeconds + billableSeconds,
                    startDate
                };
            }, {
                issueKey: this.destinationIssueKey,
                authorAccountId: this.destinationAccountId,
                startTime: '09:00:00',
                description,
                timeSpentSeconds: 0,
                billableSeconds: 0,
                startDate: ''
            });
        });
    }
}

export default WorklogService;
