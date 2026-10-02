import {useState } from "react";
import styled from "styled-components";

const WrapperWeekPicker = styled.div`
  width: 100%;
  padding: 0 20px;
  margin: 0 auto;
  border-radius: 2rem;
  border: 1px solid grey;
   @media (min-width: 740px) {
   width: 100%;
    margin-top: 5rem;
  }
`;

const DayButton = styled.button`
  border: 1px solid transparent;

  ${({ $isToday }) =>
    $isToday &&
    `
      border: 2px solid black;
      border-radius: 5rem;
    `}
`;

export default function WeekPicker({}) {
      const today = new Date();

      const monday = new Date(today);
      const day = today.getDay();

    // Sunday    → 0
    // Monday    → 1
    // Tuesday   → 2
    // Wednesday → 3
    // Thursday  → 4
    // Friday    → 5
    // Saturday  → 6

    // Sunday → go back 6 days → Monday
    const difference = day === 6 ? -5 : 1 - day;
    monday.setDate(today.getDate() + difference);

    console.log("WEEK PICKER:", day);
    console.log("Monday:", monday);

//     [
//   Date,
//   Date,
//   Date,
//   Date,
//   Date,
//   Date,
//   Date
// ]

    // This creates an Array with 7 positions.
    // const week = Array.from({ length: 7 },)
    const week = Array.from({ length: 7 }, 
    // (value, position) => {
    (value, index) => { 

    const date = new Date(monday);
        date.setDate(monday.getDate() + index);

        return date;
    });

    console.log("WEEK PICKER:", week);

return (
  <WrapperWeekPicker>
    {week.map((date) => {
      const isToday = date.toDateString() === today.toDateString();

      return (
        <DayButton
          key={date.toISOString()}
          onClick={() => setSelectedDate(date)}
          $isToday={isToday}
        >
          {date.toLocaleDateString("en-US", {
            weekday: "short",
          })}
          {date.getDate()}
        </DayButton>
      );
    })}
  </WrapperWeekPicker>
);}