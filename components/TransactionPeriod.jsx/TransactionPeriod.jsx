import styled from "styled-components";

const Cards = styled.div`
  display: grid;
  gap: 16px;

  @media (min-width: 740px) {
    grid-template-columns: repeat(3, 1fr);
  }
`;

const Card = styled.div`
  width: 100%;
  padding: 20px;
  border: 2px solid black;
  border-radius: 20px;
`;

const CardTitle = styled.h2`
  margin: 0 0 4px;
`;

const CardDate = styled.p`
  margin: 0 0 20px;
`;

const Transaction = styled.div`
  display: flex;
  justify-content: space-between;
  padding: 12px 0;
  border-bottom: 1px solid #eee;

  &:last-child {
    border-bottom: none;
  }
`;

function PeriodCard({
  title,
  date,
  transactions,
}) {
  return (
    <Card>
      <CardTitle>{title}</CardTitle>

      <CardDate>{date}</CardDate>

      {transactions.length === 0 ? (
        <p>No transactions.</p>
      ) : (
        transactions.map((transaction) => (
          <Transaction key={transaction._id}>
            <span>{transaction.title}</span>

            <span>
              {transaction.amount.toFixed(2)} €
            </span>
          </Transaction>
        ))
      )}
    </Card>
  );
}

export default function TransactionPeriods({
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

  endOfMonth.setHours(23, 59, 59, 999);

  function getTransactionsForPeriod(startDate, endDate) {
    return transactions.filter((transaction) => {
      const transactionDate = new Date(transaction.date);

      return (
        transactionDate >= startDate &&
        transactionDate <= endDate
      );
    });
  }

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
        title="This month"
        date={`${date.getMonth() + 1} / ${date.getFullYear()}`}
        transactions={monthTransactions}
      />

      <PeriodCard
        title="This week"
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