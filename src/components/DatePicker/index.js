import { useState } from "react";
import { DateTime } from "luxon";

const DatePicker = ({ onSubmit }) => {
  const [dateRange, setDateRange] = useState({
    from: DateTime.now().toISODate(),
    to: DateTime.now().toISODate(),
  });

  return (
    <div id="date-range-wrapper">
      <div id="date-range-container">
        <label>Desde:</label>
        <input
          type="date"
          value={dateRange.from}
          onChange={(event) =>
            setDateRange({ ...dateRange, from: event.target.value })
          }
        />
        <label>Hasta:</label>
        <input
          type="date"
          value={dateRange.to}
          onChange={(event) =>
            setDateRange({ ...dateRange, to: event.target.value })
          }
        />
        <input type="submit" onClick={(event) => onSubmit(event, dateRange)} />
      </div>
    </div>
  );
};

export default DatePicker;
