import styled from "styled-components";

const Card = styled.div`
  width: 100%;
  padding: 20px;
  margin-top: 20px;
  border: 2px solid black;
  border-radius: 20px;
`;

const Title = styled.h2`
  margin: 0 0 16px;
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
  return (
    <Card>
      <Title>
        Transactions for{" "}
        {selectedDate.toLocaleDateString("en-GB")}
      </Title>

      {transactions.length === 0 ? (
        <p>No transactions for this day.</p>
      )
       : 
      (
        transactions.map((transaction) => (
          <Transaction key={transaction._id}>
            <span>{transaction.title}</span>
            <span>{transaction.amount}</span>
          </Transaction>
        ))
      )}
    </Card>
  );
}