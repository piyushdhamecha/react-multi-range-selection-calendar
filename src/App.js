import React, { useState, useEffect } from 'react';
import Select from 'react-select';
import DayPicker, { DateUtils } from 'react-day-picker';
import { ImBlocked } from 'react-icons/im';

import {
  // GlobalStyle,
  StyledCalendarContainer,
  StyledContainer,
  StyledDayContainer,
  StyledFilterContainer,
} from './App.styled';
import {
  getMonthOptions,
  getYearOptions,
  // increaseSmallerRanges,
  isSelectingFirstDay,
  monthNames,
  splitRanges,
  updateRanges,
} from './helper';

import 'react-day-picker/lib/style.css';

function App() {
  const [tempRange, setTempRange] = useState({ from: null, to: null });
  const [ranges, setRanges] = useState([]);
  const [lastDayMouseEnter, setLastDayMouseEnter] = useState(null);
  const [selectedYear, setSelectedYear] = useState({
    label: new Date().getFullYear(),
    value: new Date().getFullYear(),
  });
  const [selectedMonth, setSelectedMonth] = useState({
    label: monthNames[new Date().getMonth()],
    value: monthNames[new Date().getMonth()],
  });

  const [tempUnSelectedRange, setTempUnSelectedRange] = useState({
    from: null,
    to: null,
  });
  const [lastDayUnselectedMouseEnter, setLastDayUnselectedMouseEnter] = useState(null);

  useEffect(() => {
    if (!!tempRange.from && !!tempRange.to) {
      const newRanges = updateRanges(tempRange, ranges);
      // const { shouldIncrease, increasedRanges } = increaseSmallerRanges(tempRange, ranges);
      // setRanges(shouldIncrease ? increasedRanges : [...ranges, tempRange]);

      setRanges(newRanges);
    }
  }, [tempRange]);

  useEffect(() => {
    if (!!tempUnSelectedRange.from && !!tempUnSelectedRange.to) {
      const newRanges = splitRanges(tempUnSelectedRange, ranges);

      setRanges(newRanges);
      setTempUnSelectedRange({ from: null, to: null });
      setLastDayUnselectedMouseEnter(null);
    }
  }, [tempUnSelectedRange]);

  useEffect(() => {
    setTempRange({ from: null, to: null });
    setLastDayMouseEnter(null);
  }, [ranges]);

  const handleDayClick = (day, modifiers) => {
    const { selected, alreadyInRange } = modifiers;

    const isDayInHoverRange = DateUtils.isDayInRange(day, {
      from: tempRange.from,
      to: lastDayMouseEnter,
    });

    // Clicking logic:
    // 1. startDate    -> selected: undefined, isDayInHoverRange: null
    // 2. endDate      -> selected: true,      isDayInHoverRange: true
    // 3. remove range -> selected: true,      isDayInHoverRange: null
    if (!selected || isDayInHoverRange) {
      setTempRange(DateUtils.addDayToRange(day, tempRange));

      return;
    }

    const isDayInUnselectedHoverRange = DateUtils.isDayInRange(day, {
      from: tempUnSelectedRange.from,
      to: lastDayUnselectedMouseEnter,
    });

    if ((selected && alreadyInRange) || isDayInUnselectedHoverRange) {
      setTempUnSelectedRange(DateUtils.addDayToRange(day, tempUnSelectedRange));
    }
  };

  const handleDayMouseEnter = (day) => {
    const { from, to } = tempRange;

    if (!isSelectingFirstDay(from, to, day)) {
      setLastDayMouseEnter(day);

      return;
    }

    const { from: unselectedFrom, to: unSelectedTo } = tempUnSelectedRange;

    if (!isSelectingFirstDay(unselectedFrom, unSelectedTo, day)) {
      setLastDayUnselectedMouseEnter(day);
    }
  };

  const getFromDate = () => {
    if (!tempRange.from && !lastDayMouseEnter) {
      return null;
    }

    if (tempRange.from && !lastDayMouseEnter) {
      return tempRange.from;
    }

    return DateUtils.isDayBefore(tempRange.from, lastDayMouseEnter)
      ? tempRange.from
      : lastDayMouseEnter;
  };

  const getToDate = () => {
    if (!lastDayMouseEnter) {
      return null;
    }

    return !DateUtils.isDayBefore(tempRange.from, lastDayMouseEnter)
      ? tempRange.from
      : lastDayMouseEnter;
  };

  const modifiers = {
    firstDayFromRange: (day) => ranges.some((r) => DateUtils.isSameDay(day, r.from)),
    lastDayFromRange: (day) => ranges.some((r) => DateUtils.isSameDay(day, r.to)),
    alreadyInRange: (day) => ranges.some((r) => DateUtils.isDayInRange(day, r)),
    unSelected: (day) =>
      DateUtils.isDayInRange(day, {
        from: tempUnSelectedRange.from,
        to: tempUnSelectedRange.from ? lastDayUnselectedMouseEnter : null,
      }),
    from: getFromDate(),
    to: getToDate(),
  };

  const yearOptions = getYearOptions();
  const monthOptions = getMonthOptions();
  const monthNumber = monthNames.findIndex((monthName) => monthName === selectedMonth.value);
  console.log({ ranges });
  return (
    <>
      {/* <GlobalStyle /> */}
      <StyledContainer>
        <StyledFilterContainer>
          <Select
            className="react-select"
            options={yearOptions}
            value={selectedYear}
            onChange={setSelectedYear}
          />
          <Select
            className="react-select"
            options={monthOptions}
            value={selectedMonth}
            onChange={setSelectedMonth}
          />
        </StyledFilterContainer>
        <StyledCalendarContainer>
          {[...Array(12)].map((test, index) => {
            const selectedDays = [
              { from: tempRange.from, to: lastDayMouseEnter },
              {
                from: tempUnSelectedRange.from,
                to: tempUnSelectedRange.from ? lastDayUnselectedMouseEnter : null,
              },
              ...ranges,
            ];
            return (
              <DayPicker
                key={index} // eslint-disable-line
                canChangeMonth={false}
                firstDayOfWeek={1}
                numberOfMonths={1}
                selectedDays={selectedDays}
                onDayClick={handleDayClick}
                onDayMouseEnter={handleDayMouseEnter}
                modifiers={modifiers}
                renderDay={(day) =>
                  day.getDate() % 9 === 0 ? (
                    <StyledDayContainer>
                      <ImBlocked color="black" />
                    </StyledDayContainer>
                  ) : (
                    <StyledDayContainer>{day.getDate()}</StyledDayContainer>
                  )
                }
                disabledDays={[{ daysOfWeek: [0, 6] }]}
                month={new Date(selectedYear.value, monthNumber + index)}
              />
            );
          })}
        </StyledCalendarContainer>
      </StyledContainer>
    </>
  );
}

export default App;
