import { useState, useEffect, useRef } from 'react';
import { DateTime } from 'luxon';
import { DateRangePicker as ReactDateRangePicker, createStaticRanges } from 'react-date-range';
import { es } from 'date-fns/locale';
import {
  addDays,
  startOfMonth,
  endOfMonth,
  startOfYear,
  endOfYear,
  subMonths,
  subYears,
} from 'date-fns';
import 'react-date-range/dist/styles.css';
import 'react-date-range/dist/theme/default.css';
import './styles.css';

const IconCalendar = () => (
  <svg width='18' height='18' viewBox='0 0 24 24' fill='none' stroke='currentColor' strokeWidth='2' strokeLinecap='round' strokeLinejoin='round'>
    <rect x='3' y='4' width='18' height='18' rx='2' ry='2' />
    <line x1='16' y1='2' x2='16' y2='6' />
    <line x1='8' y1='2' x2='8' y2='6' />
    <line x1='3' y1='10' x2='21' y2='10' />
  </svg>
);

const IconChevron = ({ open }) => (
  <svg
    width='16'
    height='16'
    viewBox='0 0 24 24'
    fill='none'
    stroke='currentColor'
    strokeWidth='2'
    strokeLinecap='round'
    strokeLinejoin='round'
    style={{ transform: open ? 'rotate(180deg)' : 'rotate(0deg)', transition: 'transform 0.2s ease' }}
  >
    <polyline points='6 9 12 15 18 9' />
  </svg>
);

const staticRanges = createStaticRanges([
  { label: 'Hoy', range: () => ({ startDate: new Date(), endDate: new Date() }) },
  { label: 'Ayer', range: () => ({ startDate: addDays(new Date(), -1), endDate: addDays(new Date(), -1) }) },
  { label: 'Últimos 7 días', range: () => ({ startDate: addDays(new Date(), -7), endDate: new Date() }) },
  { label: 'Últimos 30 días', range: () => ({ startDate: addDays(new Date(), -30), endDate: new Date() }) },
  { label: 'Este mes', range: () => ({ startDate: startOfMonth(new Date()), endDate: endOfMonth(new Date()) }) },
  { label: 'Mes pasado', range: () => ({ startDate: startOfMonth(subMonths(new Date(), 1)), endDate: endOfMonth(subMonths(new Date(), 1)) }) },
  { label: 'Este año', range: () => ({ startDate: startOfYear(new Date()), endDate: endOfYear(new Date()) }) },
  { label: 'Año pasado', range: () => ({ startDate: startOfYear(subYears(new Date(), 1)), endDate: endOfYear(subYears(new Date(), 1)) }) },
]);

const DateRangePicker = ({
  initialFrom = DateTime.now().minus({ years: 1 }).toISODate(),
  initialTo = DateTime.now().toISODate(),
  onChange,
}) => {
  const wrapperRef = useRef(null);
  const [isOpen, setIsOpen] = useState(false);
  const [state, setState] = useState([
    {
      startDate: new Date(initialFrom),
      endDate: new Date(initialTo),
      key: 'selection',
    },
  ]);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (wrapperRef.current && !wrapperRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen]);

  const handleChange = (ranges) => {
    const { selection } = ranges;
    const from = DateTime.fromJSDate(selection.startDate).toISODate();
    const to = DateTime.fromJSDate(selection.endDate).toISODate();
    setState([{ ...state[0], startDate: selection.startDate, endDate: selection.endDate }]);
    if (onChange) {
      onChange({ from, to });
    }
  };

  const { startDate, endDate } = state[0];
  const fromLabel = DateTime.fromJSDate(startDate).toFormat('dd/MM/yyyy', { locale: 'es' });
  const toLabel = DateTime.fromJSDate(endDate).toFormat('dd/MM/yyyy', { locale: 'es' });

  return (
    <div className='date-range-picker-wrapper' ref={wrapperRef}>
      <button
        type='button'
        className='date-range-trigger'
        onClick={() => setIsOpen((prev) => !prev)}
        aria-expanded={isOpen}
      >
        <IconCalendar />
        <span className='date-range-label'>
          {fromLabel} - {toLabel}
        </span>
        <IconChevron open={isOpen} />
      </button>

      {isOpen && (
        <div className='date-range-dropdown'>
          <ReactDateRangePicker
            ranges={state}
            onChange={handleChange}
            locale={es}
            staticRanges={staticRanges}
            inputRanges={[]}
            rangeColors={['#0d6efd']}
            moveRangeOnFirstSelection={false}
            retainEndDateOnFirstSelection
            months={1}
            direction='horizontal'
            showSelectionPreview={false}
          />
          <div className='date-range-footer'>
            <button type='button' className='btn btn-primary btn-sm' onClick={() => setIsOpen(false)}>
              Listo
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default DateRangePicker;
