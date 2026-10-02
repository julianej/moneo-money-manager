import styled from "styled-components";
import PeriodCard from "./PeriodCard";

const Cards = styled.div`
  display: grid;
  gap: 16px;
  margin: 2rem 0;

  @media (min-width: 740px) {
    grid-template-columns: repeat(3, 1fr);
  }
`;

const YearCard = styled(PeriodCard)`
  grid-column: 1 / -1;
`;

export default function TransactionPeriod({
  selectedDate,
  transactions,
}) {
  const date = new Date(selectedDate);

  // TODAY
  const startOfToday = new Date(date);
  startOfToday.setHours(0, 0, 0, 0);

  const endOfToday = new Date(date);
  endOfToday.setHours(23, 59, 59, 999);

  // WEEK
  const startOfWeek = new Date(date);
  const day = startOfWeek.getDay();
  const difference = day === 0 ? -6 : 1 - day;

  startOfWeek.setDate(startOfWeek.getDate() + difference);
  startOfWeek.setHours(0, 0, 0, 0);

  const endOfWeek = new Date(startOfWeek);
  endOfWeek.setDate(endOfWeek.getDate() + 6);
  endOfWeek.setHours(23, 59, 59, 999);

  // MONTH
  const startOfMonth = new Date(
    date.getFullYear(),
    date.getMonth(),
    1
  );

  const endOfMonth = new Date(
    date.getFullYear(),
    date.getMonth() + 1,
    0
  );

  // YEAR
  const startOfYear = new Date(
    date.getFullYear(),
    0,
    1
  );

const endOfYear = new Date(
  date.getFullYear(),
  11,
  31
);

endOfYear.setHours(23, 59, 59, 999);
endOfMonth.setHours(23, 59, 59, 999);

// GET TRANSACTION FOR PERIOD -START-END
  function getTransactionsForPeriod(startDate, endDate) {
    //return
    return transactions.filter((transaction) => {
      const transactionDate = new Date(transaction.date);
      //return
      return (
        transactionDate >= startDate &&
        transactionDate <= endDate
      );
    });
  }

  const yearTransactions = getTransactionsForPeriod(
    startOfYear,
    endOfYear
  );

  const monthTransactions = getTransactionsForPeriod(
    startOfMonth,
    endOfMonth
  );

  const weekTransactions = getTransactionsForPeriod(
    startOfWeek,
    endOfWeek
  );

  const todayTransactions = getTransactionsForPeriod(
    startOfToday,
    endOfToday
  );


  return (
    <Cards>
     <PeriodCard
        title={`Year ${date.getFullYear()}`}
        transactions={yearTransactions}
        variant="year"
      />

      <PeriodCard
        title="Month"
        date={`${date.getMonth() + 1} / ${date.getFullYear()}`}
        transactions={monthTransactions}
      />

      <PeriodCard
        title="Week"
        date={`${startOfWeek.toLocaleDateString("en-GB")} – ${endOfWeek.toLocaleDateString("en-GB")}`}
        transactions={weekTransactions}
      />

      <PeriodCard
        title="Today"
        date={date.toLocaleDateString("en-GB")}
        transactions={todayTransactions}
      />
    </Cards>
  );
}