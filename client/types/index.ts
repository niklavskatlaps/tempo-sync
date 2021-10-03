export type RequestResponse = {
    message: string,
    status: number,
    created?: number
}
  
export type RequestBody = {
    source: {
        accountId: string,
        token: string
    },
    destination: {
        accountId: string,
        token: string,
        issueKey: string,
        description: string
    }
}

export type FormValues = {
    sourceAccountId: string,
    sourceToken: string,
    destinationAccountId: string,
    destinationToken: string,
    issueKey: string,
    description: string,
    period: string
};
