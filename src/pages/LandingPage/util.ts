import moment, { Moment } from 'moment';

export const startDate = moment().add(24, 'hours');

export const endDate = moment(moment(), 'DD-MM-YYYY').add(90, 'days');

type TypeDate = 'startDate' | 'endDate';

let typeDate: TypeDate = 'startDate';

export const getAvailableDateInMonth = (date: Moment) => {
  let selectedDate = date;
  if (endDate.diff(selectedDate) < 0) {
    selectedDate = endDate;
    typeDate = 'endDate';
  }
  if (startDate.diff(selectedDate) > 0) {
    selectedDate = startDate;
    typeDate = 'startDate';
  }
  if (moment(selectedDate).day() == 0) {
    selectedDate =
      typeDate === 'startDate'
        ? moment(selectedDate).add(1, 'days')
        : moment(selectedDate).subtract(2, 'days');
  }
  if (moment(selectedDate).day() == 6) {
    selectedDate =
      typeDate === 'startDate'
        ? moment(selectedDate).add(2, 'days')
        : moment(selectedDate).subtract(1, 'days');
  }
  return selectedDate.format('YYYY-MM-DD');
};
