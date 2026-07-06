import { useState } from 'react';
import { DateTime } from 'luxon';
import { DateRange } from 'react-date-range';
import 'react-date-range/dist/styles.css';
import 'react-date-range/dist/theme/default.css';
import './styles.css';

const DateRangePicker = ({
  initialFrom = DateTime.now().minus({ years: 1 }).toISODate(),
  initialTo = DateTime.now().toISODate(),
  onChange,
}) => {
  const [state, setState] = useState([
    {
      startDate: new Date(initialFrom),
      endDate: new Date(initialTo),
      key: 'selection',
    },
  ]);

  const handleChange = (ranges) => {
    const { selection } = ranges;
    const from = DateTime.fromJSDate(selection.startDate).toISODate();
    const to = DateTime.fromJSDate(selection.endDate).toISODate();
    setState([{ ...state[0], startDate: selection.startDate, endDate: selection.endDate }]);
    if (onChange) {
      onChange({ from, to });
    }
  };

  return (
    <div className='date-range-picker-wrapper'>
      <DateRange
        ranges={state}
        onChange={handleChange}
        rangeColors={['#0d6efd']}
        moveRangeOnFirstSelection={false}
        retainEndDateOnFirstSelection
        months={1}
        direction='horizontal'
        showSelectionPreview={false}
      />
    </div>
  );
};

export default DateRangePicker;
