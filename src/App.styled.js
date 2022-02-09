import styled, { createGlobalStyle } from 'styled-components';

const HOVER_COLOR = '#84d9cf';
const SELECTED_COLOR = '#2DC1B0';

export const GlobalStyle = createGlobalStyle`
  body {
    font-family: 'Open Sans', sans-serif;
  }

  div {
    box-sizing: border-box;
  }

  * {
    box-sizing: border-box;
    margin: 0;
    padding: 0;
  }
`;

export const StyledDayContainer = styled.div`
  display: flex;
  -webkit-box-pack: center;
  justify-content: center;
  -webkit-box-align: center;
  align-items: center;
  height: 36px;
  width: 36px;
  padding: 2px;
  box-sizing: border-box;
  position: relative;
  z-index: 3;
`;

export const StyledContainer = styled.div`
  display: grid;
  grid-gap: 20px;
  max-width: 900px;
  margin-left: auto;
  margin-right: auto;
  padding: 10px 0;
`;

export const StyledFilterContainer = styled.div`
  display: flex;
  grid-gap: 20px;
  z-index: 10;
`;

export const StyledCalendarContainer = styled.div`
  &&& {
    .DayPicker-Caption {
      text-align: center;
    }

    .DayPicker-Months {
      justify-content: flex-start;
    }

    .DayPicker:not(.DayPicker--interactionDisabled) .DayPicker-Day {
      padding: 0px;
      border: none;
      position: relative;
      border-radius: 0px;
    }

    .DayPicker:not(.DayPicker--interactionDisabled)
      .DayPicker-Day:not(.DayPicker-Day--disabled):not(.DayPicker-Day--outside):not(.DayPicker-Day--weekend),
    .DayPicker:not(.DayPicker--interactionDisabled)
      .DayPicker-Day:not(.DayPicker-Day--disabled):not(.DayPicker-Day--outside):not(.DayPicker-Day--weekend):hover {
      background: transparent;
    }

    .DayPicker-Day--disabled:not(.DayPicker-Day--outside) ${StyledDayContainer} {
      background: #ededed;
      color: #989898;
      border-radius: 0;
      cursor: pointer;
    }

    .DayPicker:not(.DayPicker--interactionDisabled)
      .DayPicker-Day:not(.DayPicker-Day--disabled):not(.DayPicker-Day--selected):not(.DayPicker-Day--outside):not(.DayPicker-Day--from):not(.DayPicker-Day--to):hover::after {
      content: '';
      inset: 0px;
      position: absolute;
      background-color: #e9f7f5;
      z-index: 1;
      border-radius: 50%;
    }

    .DayPicker-Day--selected:not(.DayPicker-Day--outside) ${StyledDayContainer} {
      position: relative;
      background-color: ${HOVER_COLOR};
      color: #fff;

      svg {
        fill: #fff;
      }
    }

    .DayPicker-Day--selected:not(.DayPicker-Day--outside).DayPicker-Day--firstDayFromRange
      ${StyledDayContainer} {
      border-top-left-radius: 50%;
      border-bottom-left-radius: 50%;
    }

    .DayPicker-Day--selected:not(.DayPicker-Day--outside).DayPicker-Day--lastDayFromRange
      ${StyledDayContainer} {
      border-top-right-radius: 50%;
      border-bottom-right-radius: 50%;
    }

    .DayPicker-Day--selected:not(.DayPicker-Day--outside).DayPicker-Day--alreadyInRange
      ${StyledDayContainer} {
      background-color: ${SELECTED_COLOR};
    }

    .DayPicker:not(.DayPicker--interactionDisabled)
      .DayPicker-Day--unSelected.DayPicker-Day--selected
      ${StyledDayContainer} {
      background-color: ${HOVER_COLOR};
    }

    .DayPicker-Day--from:not(.DayPicker-Day--outside) ${StyledDayContainer} {
      border-radius: 50%;
      background-color: ${SELECTED_COLOR};
      position: relative;
      color: #fff;

      svg {
        fill: #fff;
      }
    }

    .DayPicker-Day--from:not(.DayPicker-Day--outside)::before {
      position: absolute;
      background-color: ${HOVER_COLOR};
      left: 50%;
      top: 0;
      width: 50%;
      content: '';
      height: 100%;
      z-index: -1;
    }

    .DayPicker-Day--to:not(.DayPicker-Day--outside) ${StyledDayContainer} {
      border-radius: 50%;
      background-color: ${SELECTED_COLOR};
      position: relative;
      color: #fff;

      svg {
        fill: #fff;
      }
    }

    .DayPicker-Day--to:not(.DayPicker-Day--outside)::before {
      position: absolute;
      background-color: ${HOVER_COLOR};
      left: 0;
      top: 0;
      width: 50%;
      content: '';
      height: 100%;
      z-index: -1;
    }

    .DayPicker:not(.DayPicker--interactionDisabled)
      .DayPicker-Day--alreadyInRange:hover
      ${StyledDayContainer} {
      background-color: #09ab98;
    }
  }
`;
