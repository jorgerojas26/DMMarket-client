import { useState } from 'react';
import { DateTime } from 'luxon';
import { Button } from 'react-bootstrap';

const DatePicker = ({ onSubmit, loading, submitDisabled }) => {
    const [dateRange, setDateRange] = useState({
        from: DateTime.now().toISODate(),
        to: DateTime.now().toISODate(),
    });

    return (
        <div className='d-flex flex-column flex-sm-row justify-content-center mb-3 gap-2'>
            <div className='d-flex flex-row justify-content-center align-items-center gap-2 text-light'>
                <label className='d-none d-sm-flex'>Desde:</label>
                <input
                    type='date'
                    value={dateRange.from}
                    onChange={(event) => setDateRange({ ...dateRange, from: event.target.value })}
                />
                <label className='d-none d-sm-flex'>Hasta:</label>
                <input
                    type='date'
                    value={dateRange.to}
                    onChange={(event) => setDateRange({ ...dateRange, to: event.target.value })}
                />
            </div>
            <Button
                variant='primary'
                onClick={(event) => onSubmit(event, dateRange)}
                disabled={loading || submitDisabled}
            >
                {loading && (
                    <div>
                        <span className='spinner-border spinner-border-sm' role='status' aria-hidden='true'></span>
                        <span className='visually-hidden'>Loading...</span>
                    </div>
                )}
                {!loading && <span className='mr-2'>Enviar</span>}
            </Button>
        </div>
    );
};

export default DatePicker;
