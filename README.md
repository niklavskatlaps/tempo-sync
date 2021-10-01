# tempo-sync
App for copying your tempo worklogs from one account to another

## Docker local setup guide

### Prerequisites

- Make sure that port `4000` is free on your local machine (port can be changed in the `.env` file)
- Docker version `>= 20.10`
- Docker-compose version `>= 1.29`

### Setup Guide

1. Clone the repository:
```bash
git clone git@github.com:niklavskatlaps/tempo-sync.git
```
2. Install dependencies on your host machine:
```bash
yarn install
```
3. Create `.env` file and edit the content if needed:
```bash
cp .env.example .env
```
6. Build and start containers (add -d flag to start the container in a detached mode):
```bash
docker-compose up --build
```
7. Observe that the app is up and running by sending a GET request to http://localhost:4000

### How to copy your worklogs

In order to copy your worklogs from one Atlassian account to another, you need to:

1. [Find your Atlassian account IDs](https://community.atlassian.com/t5/Jira-questions/where-can-i-find-my-Account-ID/qaq-p/976527)
2. Generate Tempo OAuth 2.0 token for both Atlassian accounts: 
    * Go to **Tempo -> Settings**, scroll down to **Data Access**, select **API integration** and click on **New Token**.
3. Add JSON data to the POST request body:
    ```
    {
        "source": {
            "accountId": "<SOURCE ACCOUNT ID>",
            "token": "<SOURCE TEMPO TOKEN>"
        },
        "destination": {
            "accountId": "<DESTINATION ACCOUNT ID>",
            "token": "<DESTINATION TEMPO ID>",
            "issueKey": "<ISSUE KEY THAT YOU WANT YOUR WORKLOGS TO BE COPIED TO, E.G., PROJECT-777>",
            "description": "<DESCRIPTION OF THE WORKLOG>"
        }
    }
    ```
4. Send a POST request to `http://localhost:4000?period=<YOUR PERIOD OF CHOICE>`. Currently, you can choose between three supported periods:
    * day (copy worklogs from this day)
    * week (copy worklogs from this week)
    * month (copy worklogs from this month)
5. Profit

