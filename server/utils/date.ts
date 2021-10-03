import { Period, StartEndDates } from '../types';
import { DateTime } from 'luxon';

export const getStartAndEndDates = (selectedPeriod: Period): StartEndDates => {
    const startDate = DateTime.local().startOf(selectedPeriod).toFormat('yyyy-MM-dd');
    const endDate = DateTime.local().endOf(selectedPeriod).toFormat('yyyy-MM-dd');

    return { startDate, endDate };
};
