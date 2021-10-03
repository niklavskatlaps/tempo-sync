import { SUPPORTED_PERIODS } from 'utils/validation';

export interface RequestBody {
    source: Source,
    destination: Destination
}

export interface Source {
    accountId: string
    token: string
}

export interface Destination {
    accountId: string
    token: string
    issueKey: string
    description: string
}

export interface ValidatedRequestData {
    sourceAccountId: string
    sourceToken: string
    destinationAccountId: string
    destinationToken: string
    destinationIssueKey: string
    period: Period
    description: string
}

export type Period = typeof SUPPORTED_PERIODS[number];

export interface GetWorklogsResponse {
    self: string,
    metadata: {
        count: number,
        offset: number,
        limit: number
    },
    results: Worklog[]
}

export interface Worklog {
    self: string,
    tempoWorklogId: number
    jiraWorklogId: number
    issue: {
        self: string
        key: string
        id: number
    }
    timeSpentSeconds: number
    billableSeconds: number
    startDate: string
    startTime: string
    description: string
    createdAt: string
    updatedAt: string
    author: {
        self: string
        accountId: string
        displayName: string
    }
    attributes: { 
        self: string
        values: WorklogAttribute[] 
    }
}

export interface WorklogAttribute {
    key: string
    value: string
}

export interface NewWorklog {
    issueKey: string
    authorAccountId: string
    timeSpentSeconds: number
    billableSeconds: number
    startDate: string
    startTime: string
    description: string
}

export interface StartEndDates {
    startDate: string,
    endDate: string
}
