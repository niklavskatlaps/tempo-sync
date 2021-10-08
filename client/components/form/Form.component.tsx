import React, { useEffect, useRef, useState } from 'react';
import { useForm } from 'react-hook-form';
import axios, { AxiosResponse } from 'axios';
import { toast } from 'react-toastify';
import { Popup } from 'reactjs-popup';
import { RequestResponse, FormValues } from '../../types';
import Loader from '../loader';
import { addToLocalStorage, getFromLocalStorage } from '../../utils';

const FORM_DATA = 'FORM_DATA';

const FormComponent: React.FC = () => {
    const isFirstRender = useRef(true);
    const [isLoading, setIsLoading] = useState(false);
    const [response, setResponse] = useState<RequestResponse>();
    const { 
        register, 
        handleSubmit, 
        formState: { errors } 
    } = useForm<FormValues>({ defaultValues: getFromLocalStorage<FormValues>(FORM_DATA) });

    useEffect(() => {
        if (isFirstRender.current) {
            isFirstRender.current = false;
            return;
        }

        sendNotification();
    }, [response]);

    async function onSubmit(formData: FormValues): Promise<void> {
        setIsLoading(true);
        addToLocalStorage(FORM_DATA, formData);

        const { data } = await axios.post<FormValues, AxiosResponse<RequestResponse>>('/api/submit', formData);

        setResponse(data);
        setIsLoading(false);
    }

    function sendNotification(): void {
        const { 
            created: createdWorklogCount = undefined, 
            message = 'Something went wrong' 
        } = response || {};

        if (createdWorklogCount === undefined) {
            toast.error(message);
            return;
        }

        if (!createdWorklogCount) {
            toast.info('Your worklogs are up-to-date! There is nothing to sync in the selected period.');
            return;
        }

        toast.success(`Success! ${ createdWorklogCount } new worklogs created!`);
    }

    function renderInfo(): JSX.Element {
        return (
            <Popup 
              trigger={ <button type="button" className="btn btn-link">What are these fields?</button> }
              modal
              lockScroll
              overlayStyle={ { overflow: 'auto' } }
            >
                <div className="px-3 py-3">
                    <div className="row mb-3">
                        <span className="sm-12">
                            <b>Source Account ID:&nbsp;</b>Atlassian account you want to extract and copy the worklogs from.
                        </span>
                        <span className="sm-12">
                            <a 
                              className="link-primary" 
                              href="https://community.atlassian.com/t5/Jira-questions/where-can-i-find-my-Account-ID/qaq-p/976527"
                              target="_blank" rel="noreferrer"
                            >
                                Where can I find my Atlassian account ID?
                            </a>
                        </span>
                    </div>
                    <div className="row mb-3">
                        <span className="sm-12">
                            <b>Source Token:&nbsp;</b>Tempo OAuth 2.0 token for the source Atlassian account.
                        </span>
                        <span>To generate a new token:&nbsp;<i>Jira&#8594;Tempo&#8594;Settings, scroll down to Data Access, select API integration and click on New Token</i>.</span>
                    </div>
                    <div className="row mb-3">
                        <span className="sm-12">
                            <b>Destination Account ID:&nbsp;</b>Atlassian account you want to copy the worklogs to.&nbsp;
                        </span>
                        <span className="sm-12">
                            <a 
                              className="link-primary" 
                              href="https://community.atlassian.com/t5/Jira-questions/where-can-i-find-my-Account-ID/qaq-p/976527"
                              target="_blank" rel="noreferrer"
                            >
                                Where can I find my Atlassian account ID?
                            </a>
                        </span>
                    </div>
                    <div className="row mb-3">
                        <span className="sm-12">
                            <b>Destination Token:&nbsp;</b>Tempo OAuth 2.0 token for the destination Atlassian account.
                        </span>
                        <span>To generate a new token:&nbsp;<i>Jira&#8594;Tempo&#8594;Settings, scroll down to Data Access, select API integration and click on New Token</i>.</span>
                    </div>
                    <div className="row mb-3">
                        <span className="sm-12">
                            <b>Issue Key:&nbsp;</b>Issue key from the destination that you want your worklogs to be copied to, e.g., <i>PROJECT-1234</i>.
                        </span>
                        <span className="sm-12">
                            Total time logged in the source account is added up and copied to the destination account in a single ticket.
                        </span>
                    </div>
                    <div className="row mb-3">
                        <span className="sm-12">
                            <b>Period:&nbsp;</b>Your preferred time period for copying the worklogs.
                        </span>
                    </div>
                    <div className="row mb-3">
                        <span className="sm-12">
                            <b>Description:&nbsp;</b>Description of the worklog that will be created in the destination account.&nbsp;
                        </span>
                    </div>
                </div>
            </Popup>
        );
    }


    function renderContent(): JSX.Element {
        return (
            <form 
              className={ `mt-4 mt-md-5 pb-5 ${ isLoading ? 'opacity-25' : 'opacity-100' }` } 
              onSubmit={ handleSubmit(onSubmit) }
            >
                <fieldset className="mx-lg-5" disabled={ isLoading ? true : false }>
                    <div className="row g-4 mx-lg-5">
                        <div className="col-md-6">
                            <input
                              { ...register('sourceAccountId', { required: 'Source account id is required' }) }
                              className={ `form-control shadow-none ${ errors.sourceAccountId ? 'border-danger' : '' }` }
                              placeholder="Source Account ID"
                            />
                            <small className="text-danger position-absolute">{ errors.sourceAccountId?.message }</small>
                        </div>
                        <div className="col-md-6">
                            <input
                              { ...register('sourceToken', { required: 'Source token is required' }) }
                              className={ `form-control shadow-none ${ errors.sourceToken ? 'border-danger' : '' }` }
                              placeholder="Source Token"
                            />
                            <small className="text-danger position-absolute">{ errors.sourceToken?.message }</small>
                        </div>
                        <div className="col-md-6">
                            <input
                              { ...register('destinationAccountId', { required: 'Destination account id is required' }) }
                              className={ `form-control shadow-none ${ errors.destinationAccountId ? 'border-danger' : '' }` }
                              placeholder="Destination Account ID"
                            />
                            <small className="text-danger position-absolute">{ errors.destinationAccountId?.message }</small>
                        </div>
                        <div className="col-md-6">
                            <input
                              { ...register('destinationToken', { required: 'Destination token is required' }) }
                              className={ `form-control shadow-none ${ errors.destinationToken ? 'border-danger' : '' }` }
                              placeholder="Destination Token"
                            />
                            <small className="text-danger position-absolute">{ errors.destinationToken?.message }</small>
                        </div>
                        <div className="col-md-6">
                            <input
                              { ...register('issueKey', { required: 'Issue key is required' }) }
                              className={ `form-control shadow-none ${ errors.issueKey ? 'border-danger' : '' }` }
                              placeholder="Issue Key"
                            />
                            <small className="text-danger position-absolute">{ errors.issueKey?.message }</small>
                        </div>
                        <div className="col-md-6">
                            <select 
                              { ...register('period', { required: 'Period is required' }) } 
                              className={ `form-control shadow-none ${ errors.period ? 'border-danger' : '' }` }
                            >
                                <option value="">Select period...</option>
                                <option value="day">This day</option>
                                <option value="week">This week</option>
                                <option value="month">This month</option>
                            </select>
                            <small className="text-danger position-absolute">{ errors.period?.message }</small>
                        </div>
                        <div className="col-md-12">
                            <textarea
                              { ...register('description', { required: 'Description is required' }) }
                              className={ `form-control shadow-none ${ errors.description ? 'border-danger' : '' }` }
                              placeholder="Description"
                          />
                            <small className="text-danger position-absolute">{ errors.description?.message }</small>
                        </div>
                        <div className="col-lg-8 col-xs-12 text-center">
                            <button type="submit" className="btn btn-primary btn-lg form-control fixed-content">Submit</button>
                        </div>
                        <div className="col-lg-4 col-xs-12 text-center">
                            { renderInfo() }
                        </div>
                    </div>
                </fieldset>
            </form>
        );
    }


    return (
        <div className="container">
            <Loader isLoading={ isLoading } />
            { renderContent() }
        </div>
    );
};

export default FormComponent;
