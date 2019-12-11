// @flow
import React from 'react';

type Props = {
  date: Date,
  initialDate: Date,
  setDate: (Date | (Date => Date)) => void,
};

const monthNames = [
  'January',
  'February',
  'March',
  'April',
  'May',
  'June',
  'July',
  'August',
  'September',
  'October',
  'November',
  'December',
];

export default function MonthSelector({
  date,
  initialDate,
  setDate,
}: Props): React$Node {
  const moveForward = () => {
    setDate(curDate => {
      const newDate = new Date(curDate);
      newDate.setMonth(newDate.getMonth(), 1);
      return newDate;
    });
  }
  return (
    <h3 className="page-subtitle">
      <button type="button">
        <span className="fa fa-arrow-left" />
      </button>
      {date.getFullYear()} {monthNames[date.getMonth()]}
      <button type="button">
        <span className="fa fa-arrow-right" />
      </button>
    </h3>
  );
}
