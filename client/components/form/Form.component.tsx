import React, { useEffect, useRef, useState } from 'react';
import { useForm } from 'react-hook-form';
import axios, { AxiosResponse } from 'axios';
import { toast } from 'react-toastify';
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


    function renderForm(): JSX.Element {
        return (
            <form 
              className={ `mt-4 mt-md-5 pb-5 ${ isLoading ? 'opacity-25' : 'opacity-100' }` } 
              onSubmit={ handleSubmit(onSubmit) }
            >
                <fieldset disabled={ isLoading ? true : false }>
                    <div className="row g-4">
                        <div className="col-md-6">
                            <input
                              { ...register('sourceAccountId', { required: 'Source account id is required' }) }
                              className={ `form-control shadow-none ${ errors.sourceAccountId ? 'border-danger' : '' }` }
                              placeholder="Source account id"
                          />
                            <small className="text-danger position-absolute">{ errors.sourceAccountId?.message }</small>
                        </div>
                        <div className="col-md-6">
                            <input
                              { ...register('sourceToken', { required: 'Source token is required' }) }
                              className={ `form-control shadow-none ${ errors.sourceToken ? 'border-danger' : '' }` }
                              placeholder="Source token"
                          />
                            <small className="text-danger position-absolute">{ errors.sourceToken?.message }</small>
                        </div>
                        <div className="col-md-6">
                            <input
                              { ...register('destinationAccountId', { required: 'Destination account id is required' }) }
                              className={ `form-control shadow-none ${ errors.destinationAccountId ? 'border-danger' : '' }` }
                              placeholder="Destination account id"
                          />
                            <small className="text-danger position-absolute">{ errors.destinationAccountId?.message }</small>
                        </div>
                        <div className="col-md-6">
                            <input
                              { ...register('destinationToken', { required: 'Destination token is required' }) }
                              className={ `form-control shadow-none ${ errors.destinationToken ? 'border-danger' : '' }` }
                              placeholder="Destination token"
                          />
                            <small className="text-danger position-absolute">{ errors.destinationToken?.message }</small>
                        </div>
                        <div className="col-md-6">
                            <input
                              { ...register('issueKey', { required: 'Issue key is required' }) }
                              className={ `form-control shadow-none ${ errors.issueKey ? 'border-danger' : '' }` }
                              placeholder="Issue key"
                          />
                            <small className="text-danger position-absolute">{ errors.issueKey?.message }</small>
                        </div>
                        <div className="col-md-6">
                            <select 
                              { ...register('period', { required: 'Period is required' }) } 
                              className={ `form-control shadow-none ${ errors.period ? 'border-danger' : '' }` }
                            >
                                <option value="">Select period</option>
                                <option value="day">This day</option>
                                <option value="week">This week</option>
                                <option value="month">This month</option>
                            </select>
                            <small className="text-danger position-absolute">{ errors.period?.message }</small>
                        </div>
                        <div>
                            <textarea
                              { ...register('description', { required: 'Description is required' }) }
                              className={ `form-control shadow-none ${ errors.description ? 'border-danger' : '' }` }
                              placeholder="Description"
                          />
                            <small className="text-danger position-absolute">{ errors.description?.message }</small>
                        </div>
                        <div className="col text-center">
                            <button type="submit" className="btn btn-primary btn-lg form-control fixed-content">Submit</button>
                        </div>
                    </div>
                </fieldset>
            </form>
        );
    }


    return (
        <div className="container">
            <Loader isLoading={ isLoading } />
            { renderForm() }
        </div>
    );
};

export default FormComponent;
