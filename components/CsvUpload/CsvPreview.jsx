
import styled from "styled-components";
import CategoryDropdown from "../CategoriesDropdown/CategoriesDropdown";

const PreviewWrapper = styled.div`
  width: 100%;
  padding-top: 2rem;
  border-top: 1px solid grey;
`;

const PreviewHeader = styled.h3`
  margin: 0 0 1rem;
`;

const TransactionRow = styled.div`
  display: grid;
  grid-template-columns: 100px 1fr 100px 100px 160px;
  gap: 1rem;
  align-items: center;

  padding: 0.75rem 0;

  border-bottom: 1px solid #e5e5e5;
`;

const Select = styled.select`
  padding: 0.5rem;
`;

const EmptyMessage = styled.p`
  margin: 0;
`;

export default function CsvPreview({
  transactions,
  onCategoryChange,
}) {
  if (!transactions.length) {
    return (
      <EmptyMessage>
        No transactions to preview.
      </EmptyMessage>
    );
  }

  return (
    <PreviewWrapper>
      <PreviewHeader>
        {transactions.length} transactions ready to Import
        </PreviewHeader>

      <TransactionRow>
        <strong>Date</strong>
        <strong>Title</strong>
        <strong>Amount</strong>
        <strong>Type</strong>
        <strong>Category</strong>
      </TransactionRow>

      {transactions.map((transaction, index) => (
        <TransactionRow key={index}>
          <span>{transaction.date}</span>
          <span>{transaction.title}</span>
          <span>{transaction.amount.toFixed(2)} </span>
          <span>{transaction.type}</span>
         
          <CategoryDropdown
            value={transaction.category || ""}
            onChange={(event) =>
                onCategoryChange(index, event.target.value)
            }
            />
        </TransactionRow>
      ))}
    </PreviewWrapper>
  );
}

