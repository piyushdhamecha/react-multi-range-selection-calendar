import { DateUtils } from 'react-day-picker'

export const getYearOptions = () => {
  const startYear = new Date().getFullYear() - 5
  const currentYear = new Date().getFullYear() + 5;
  const years = []

  for(var i=startYear;i<=currentYear;i++){
      years.push({
        label: i,
        value: i
      });
  } 
  
  return years;
}

export const monthNames = [
  "January", 
  "February", 
  "March", 
  "April", 
  "May", 
  "June",
  "July", 
  "August", 
  "September", 
  "October", 
  "November", 
  "December"
];

export const getMonthOptions = () => monthNames.map((month) => ({ label: month, value: month}))

export const isSelectingFirstDay = (from, to, day) => {
  // const isBeforeFirstDay = from && DateUtils.isDayBefore(day, from)
  const isRangeSelected = from && to

  // return !from || isBeforeFirstDay || isRangeSelected
  return !from || isRangeSelected
}

const setWeekDay = (date, setBackward) => {
  const newDate = new Date(date)

  const dayOfWeek = newDate.getDay();

  if((dayOfWeek === 6) || (dayOfWeek  === 0)) {
    if(setBackward) {
      newDate.setDate(newDate.getDate() -1)  
    } else {
      newDate.setDate(newDate.getDate() + 1)  
    }
    
    return setWeekDay(newDate, setBackward)
  }

  return newDate
}

export const splitRanges = (tempUnSelectedRange, ranges) => {
  let newRanges = []

  ranges.forEach((range) => {
    const {from, to} = range

    if(from && to) {
      // When un-selected from and to are same as selected range from and to
      if(
        (DateUtils.isSameDay(from, tempUnSelectedRange.from) && DateUtils.isSameDay(to, tempUnSelectedRange.to))
        || (DateUtils.isSameDay(tempUnSelectedRange.from, from) && DateUtils.isDayAfter(tempUnSelectedRange.to, to))
        || (DateUtils.isDayBefore(tempUnSelectedRange.from, from) && DateUtils.isSameDay(tempUnSelectedRange.to, to))
        || (DateUtils.isDayBefore(tempUnSelectedRange.from, from) && DateUtils.isDayAfter(tempUnSelectedRange.to, to))
      ) {
        return
      }

      const isFromInTempRange = DateUtils.isDayInRange(tempUnSelectedRange.from, range)
      const isToInTempRange = DateUtils.isDayInRange(tempUnSelectedRange.to, range)  
      
      if(isFromInTempRange && isToInTempRange) {
        const firstTempToDate = new Date(tempUnSelectedRange.from.valueOf())
        const secondTempFromDate = new Date(tempUnSelectedRange.to.valueOf())
        
        firstTempToDate.setDate(firstTempToDate.getDate() - 1)
        secondTempFromDate.setDate(secondTempFromDate.getDate() + 1)
        
        newRanges.push({ from, to: firstTempToDate})
        newRanges.push({ from: secondTempFromDate, to })
      }

      if(isFromInTempRange && !isToInTempRange) {
        const firstTempToDate = new Date(tempUnSelectedRange.from.valueOf())
        firstTempToDate.setDate(firstTempToDate.getDate() - 1)

        newRanges.push({ from , to: firstTempToDate })
      }

      if(!isFromInTempRange && isToInTempRange) {
        const secondTempFromDate = new Date(tempUnSelectedRange.to.valueOf())
        secondTempFromDate.setDate(secondTempFromDate.getDate() + 1)

        newRanges.push({ from: secondTempFromDate , to })
      }

      if(!isFromInTempRange && !isToInTempRange) {
        newRanges.push({ from ,to })
      }
    }
  })
  
  newRanges = newRanges.map(({ from , to}) => ({ from : setWeekDay(from) ,to: setWeekDay(to, true)}))

  return newRanges
}

export const increaseSmallerRanges = (tempRangeNullable, ranges) => {
  let shouldIncrease = false
  const tempRange = tempRangeNullable

  const increasedRanges = ranges.map((r) => {
    const { from, to } = r
    const isFromInTempRange = DateUtils.isDayInRange(from, tempRange)
    const isToInTempRange = DateUtils.isDayInRange(to, tempRange)

    if (isFromInTempRange && isToInTempRange) {
      shouldIncrease = true
      return tempRange
    } else if (isFromInTempRange && !isToInTempRange) {
      shouldIncrease = true
      return { from: tempRange.from, to }
    } else {
      return r
    }
  })

  return {
    shouldIncrease,
    increasedRanges: [...new Set(increasedRanges)]
  }
}