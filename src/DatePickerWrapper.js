import React from 'react';

import DayPicker from 'react-day-picker';

function DatePickerWrapper({
  selectedDays,
  onDayClick,
  onDayMouseEnter,
  modifiers,
  renderDayComponent,
  month,
}) {
  return (
    <DayPicker
      canChangeMonth={false}
      firstDayOfWeek={1}
      numberOfMonths={1}
      selectedDays={selectedDays}
      onDayClick={onDayClick}
      onDayMouseEnter={onDayMouseEnter}
      modifiers={modifiers}
      renderDay={renderDayComponent}
      disabledDays={[{ daysOfWeek: [0, 6] }]}
      month={month}
    />
  );
}

export default React.memo(DatePickerWrapper);
