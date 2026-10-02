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


export default function WeekPicker() {
      const today = new Date();
      const [selectedDate, setSelectedDate] = useState(today);

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

    const week = [
        // 7 days
    ]


return (
    <div>
        <WrapperWeekPicker>
             {week.map((date) => (
            <button
                key={date.toISOString()}
                onClick={() => setSelectedDate(date)}
            >
                {date.toLocaleDateString("en-US", {
                weekday: "short",
                })}
                {date.getDate()}
            </button>
            ))}
      </WrapperWeekPicker>
    </div>
  );
}