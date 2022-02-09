import { DateUtils } from 'react-day-picker';
import { reduce, sortBy } from 'lodash';
import moment from 'moment';

export const getYearOptions = () => {
  const startYear = 2015;
  const currentYear = new Date().getFullYear() + 5;
  const years = [];

  for (let i = startYear; i <= currentYear; i++) { // eslint-disable-line
    years.push({
      label: i,
      value: i,
    });
  }

  return years;
};

export const monthNames = [
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

export const getMonthOptions = () => monthNames.map((month) => ({ label: month, value: month }));

export const isSelectingFirstDay = (from, to) => {
  // const isBeforeFirstDay = from && DateUtils.isDayBefore(day, from)
  const isRangeSelected = from && to;

  // return !from || isBeforeFirstDay || isRangeSelected
  return !from || isRangeSelected;
};

// const setWeekDay = (date, setBackward) => {
//   const newDate = new Date(date);

//   const dayOfWeek = newDate.getDay();

//   if (dayOfWeek === 6 || dayOfWeek === 0) {
//     if (setBackward) {
//       newDate.setDate(newDate.getDate() - 1);
//     } else {
//       newDate.setDate(newDate.getDate() + 1);
//     }

//     return setWeekDay(newDate, setBackward);
//   }

//   return newDate;
// };

const addDays = (date, days) => {
  date.setDate(date.getDate() + days);
};

export const splitRanges = (tempUnSelectedRange, ranges) => {
  if (!ranges.length) {
    return [];
  }

  const newRanges = [];

  ranges.forEach((range) => {
    const { from, to } = range;

    if (from && to) {
      // When un-selected from and to are same as selected range from and to
      if (
        (DateUtils.isSameDay(from, tempUnSelectedRange.from) &&
          DateUtils.isSameDay(to, tempUnSelectedRange.to)) ||
        (DateUtils.isSameDay(tempUnSelectedRange.from, from) &&
          DateUtils.isDayAfter(tempUnSelectedRange.to, to)) ||
        (DateUtils.isDayBefore(tempUnSelectedRange.from, from) &&
          DateUtils.isSameDay(tempUnSelectedRange.to, to)) ||
        (DateUtils.isDayBefore(tempUnSelectedRange.from, from) &&
          DateUtils.isDayAfter(tempUnSelectedRange.to, to))
      ) {
        return;
      }

      const isFromSameAsTempFrom = DateUtils.isSameDay(from, tempUnSelectedRange.from);
      const isToSameAsTempTo = DateUtils.isSameDay(to, tempUnSelectedRange.to);

      const isFromInTempRange = DateUtils.isDayInRange(tempUnSelectedRange.from, range);
      const isToInTempRange = DateUtils.isDayInRange(tempUnSelectedRange.to, range);

      if (isFromInTempRange && isToInTempRange) {
        const firstTempToDate = new Date(tempUnSelectedRange.from.valueOf());
        const secondTempFromDate = new Date(tempUnSelectedRange.to.valueOf());

        addDays(firstTempToDate, -1);
        addDays(secondTempFromDate, 1);

        if (isFromSameAsTempFrom) {
          newRanges.push({ from: secondTempFromDate, to });
        } else if (isToSameAsTempTo) {
          newRanges.push({ from, to: firstTempToDate });
        } else {
          newRanges.push({ from, to: firstTempToDate });
          newRanges.push({ from: secondTempFromDate, to });
        }
      }

      if (isFromInTempRange && !isToInTempRange) {
        const firstTempToDate = new Date(tempUnSelectedRange.from.valueOf());
        firstTempToDate.setDate(firstTempToDate.getDate() - 1);

        newRanges.push({ from, to: firstTempToDate });
      }

      if (!isFromInTempRange && isToInTempRange) {
        const secondTempFromDate = new Date(tempUnSelectedRange.to.valueOf());
        secondTempFromDate.setDate(secondTempFromDate.getDate() + 1);

        newRanges.push({ from: secondTempFromDate, to });
      }

      if (!isFromInTempRange && !isToInTempRange) {
        newRanges.push({ from, to });
      }
    }
  });

  // newRanges = newRanges.map(({ from, to }) => ({
  //   from: setWeekDay(from),
  //   to: setWeekDay(to, true),
  // }));

  return newRanges;
};

export const increaseSmallerRanges = (tempRangeNullable, ranges) => {
  let shouldIncrease = false;
  const tempRange = tempRangeNullable;

  const increasedRanges = ranges.map((r) => {
    const { from, to } = r;
    const isFromInTempRange = DateUtils.isDayInRange(from, tempRange);
    const isToInTempRange = DateUtils.isDayInRange(to, tempRange);

    if (isFromInTempRange && isToInTempRange) {
      shouldIncrease = true;
      return tempRange;
    }

    if (isFromInTempRange && !isToInTempRange) {
      shouldIncrease = true;
      return { from: tempRange.from, to };
    }

    return r;
  });

  return {
    shouldIncrease,
    increasedRanges: [...new Set(increasedRanges)],
  };
};

export const updateRanges = (tempRange, ranges) => {
  let shouldIncrease = false;
  const sortedRanges = sortBy(ranges, 'from');

  let newRanges = sortedRanges.map((range) => {
    const { from, to } = range;
    const isFromInTempRange = DateUtils.isDayInRange(from, tempRange);
    const isToInTempRange = DateUtils.isDayInRange(to, tempRange);

    if (isFromInTempRange && isToInTempRange) {
      shouldIncrease = true;
      return tempRange;
    }

    if (isFromInTempRange && !isToInTempRange) {
      shouldIncrease = true;
      return { from: tempRange.from, to };
    }

    return range;
  });

  newRanges = [...new Set(newRanges)];

  let finalRanges;

  if (shouldIncrease) {
    finalRanges = newRanges;
  } else {
    finalRanges = [...newRanges, tempRange];
  }

  return reduce(
    sortBy(finalRanges, 'from'),
    (result, range) => {
      if (!result.length) {
        return [range];
      }

      const resultCopy = [...result];

      const prevIndex = resultCopy.length - 1;
      const { from: prevFrom, to: prevTo } = resultCopy[prevIndex];
      const { from, to } = range;

      if (DateUtils.isSameDay(moment(prevTo).add(1, 'd').toDate(), from)) {
        resultCopy[prevIndex] = { from: prevFrom, to };
      } else {
        resultCopy.push(range);
      }

      return resultCopy;
    },
    [],
  );
};
