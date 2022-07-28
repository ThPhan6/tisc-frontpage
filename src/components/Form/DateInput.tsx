import React, { useState, useRef, useLayoutEffect, useEffect, useCallback } from 'react';
import { DatePicker } from 'antd';
import { ReactComponent as CalendarIcon } from '@/assets/icons/calendar-icon.svg';
import type { DatePickerProps } from 'antd';
import moment, { Moment } from 'moment';
import { uniqueId } from 'lodash';
import CustomButton from '@/components/Button';
import styles from './styles/date-input.less';

interface DateInputProps {
  value?: string | null;
  onChange?: (date: Moment | null) => void;
  containerClass?: string;
}

const DateInput: React.FC<DateInputProps> = ({ value, onChange, containerClass }) => {
  const datepickerRef = useRef<any>();
  const [open, setOpen] = useState(false);
  const [selectedDate, setSelectedDate] = useState<Moment | null>(null);
  const [uniqueClassName] = useState(uniqueId('tisc_datepicker_'));

  const onSelectDate: DatePickerProps['onChange'] = (chosenDate) => {
    setSelectedDate(chosenDate);
  };

  const handleDoneButton = () => {
    setOpen(() => false);
    if (onChange) {
      onChange(selectedDate);
    }
  };

  const handleOpenDatePicker = useCallback(
    (event: any) => {
      const activeDatepickerPanelClassName = `.ant-picker-dropdown.${uniqueClassName}:not(.ant-picker-dropdown-hidden)`;
      if (
        (datepickerRef && datepickerRef.current.contains(event.target)) ||
        document.querySelector(activeDatepickerPanelClassName)?.contains(event.target)
      ) {
        setOpen(() => true);
      } else {
        setOpen(() => false);
        if (value) {
          setSelectedDate(moment(value));
        } else {
          setSelectedDate(null);
        }
      }
    },
    [value],
  );

  useLayoutEffect(() => {
    window.addEventListener('mousedown', handleOpenDatePicker);
    return () => {
      window.removeEventListener('mousedown', handleOpenDatePicker);
    };
  }, [value]);

  useEffect(() => {
    if (value) {
      setSelectedDate(moment(value));
    }
  }, [value]);

  return (
    <div ref={datepickerRef} className={containerClass}>
      <DatePicker
        onChange={onSelectDate}
        suffixIcon={<CalendarIcon />}
        className={`${styles.datepickerWrapper}`}
        dropdownClassName={`${styles.popupDatepickerWrapper} ${uniqueClassName}`}
        placeholder="select estimated date"
        showToday={false}
        inputReadOnly={true}
        allowClear={false}
        open={open}
        value={selectedDate}
        renderExtraFooter={() => {
          return (
            <div className={styles.datePickerFooter}>
              <CustomButton
                size="small"
                variant="primary"
                properties="rounded"
                buttonClass="cancel-btn"
                onClick={handleDoneButton}
              >
                Done
              </CustomButton>
            </div>
          );
        }}
      />
    </div>
  );
};
export default DateInput;
