import { Period } from 'src/types';
import { DateTime } from 'luxon';

export interface StartEndDates {
    startDate: string,
    endDate: string
}

export const getStartAndEndDates = (selectedPeriod: Period): StartEndDates => {
    const startDate = DateTime.local().startOf(selectedPeriod).toFormat('yyyy-MM-dd');
    const endDate = DateTime.local().endOf(selectedPeriod).toFormat('yyyy-MM-dd');

    return { startDate, endDate };
};
