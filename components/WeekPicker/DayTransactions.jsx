import styled from "styled-components";

const Card = styled.div`
  width: 100%;
  padding: 20px;
  margin-top: 20px;
  border: 2px solid black;
  border-radius: 20px;
`;

const Day = styled.div`
  margin-bottom: 24px;

  &:last-child {
    margin-bottom: 0;
  }
`;

const DayTitle = styled.h2`
  margin: 0 0 12px;
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

export default function DayTransactions({
  selectedDate,
  transactions,
}) {
  const yesterday = new Date(selectedDate);
  yesterday.setDate(selectedDate.getDate() - 1);

  const tomorrow = new Date(selectedDate);
  tomorrow.setDate(selectedDate.getDate() + 1);

  const days = [
    {
      label: "Yesterday",
      date: yesterday,
    },
    {
      label: "Today",
      date: selectedDate,
    },
    {
      label: "Tomorrow",
      date: tomorrow,
    },
  ];

  function getTransactionsForDay(date) {
    return transactions.filter((transaction) => {
      const transactionDate = new Date(transaction.date);

      return (
        transactionDate.toDateString() === date.toDateString()
      );
    });
  }

  return (
    <Card>
      {days.map((day) => {
        const dayTransactions = getTransactionsForDay(day.date);

        return (
          <Day key={day.date.toISOString()}>
            <DayTitle>
              {day.label}{" "}
              {day.date.toLocaleDateString("en-GB")}
            </DayTitle>

            {dayTransactions.length === 0 ? (
              <p>No transactions.</p>
            ) : (
              dayTransactions.map((transaction) => (
                <Transaction key={transaction._id}>
                  <span>{transaction.title}</span>

                  <span>
                    {transaction.amount.toFixed(2)} €
                  </span>
                </Transaction>
              ))
            )}
          </Day>
        );
      })}
    </Card>
  );
}