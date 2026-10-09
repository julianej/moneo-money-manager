import styled from "styled-components";
import { Loading, Spinner } from "@/styles/LoadingStyles";
import InvoiceUpload from "../InvoiceUpload/InvoiceUpload";

// ====================
// STYLES
// ====================

const TransactionWrapperInfos = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1rem;

  width: 100%;

  @media (min-width: 739px) {
    flex-direction: row;
    align-items: center;

    /* flex: 1; */
    > div:nth-child(1) {
     width: 100%;}
  }
`;


const TransactionWrapperAmount = styled.div`
  display: flex;
  align-items: center;
  gap: 1rem;
     > div:nth-child(1) {
     width: 80%;}

  @media (max-width: 738px) {
     > div:nth-child(1) {
     width: 80%;}
  }
`;

const Transaction = styled.article`
  position: relative;

  display: flex;
  gap: 0.5rem;
  padding: 1rem;

  border-radius: 8px;

  align-items: center;
  margin: 0;

  &:hover {
    background: #ffffff;
    color: black;
  }

  border: ${({ $isSelected }) =>
    $isSelected
      ? "0.1rem solid black"
      : "0.1rem solid #ccc"};

  background-color: ${({ $isSelected }) =>
    $isSelected ? "#e0e0e0" : "transparent"};

  ${({ $isHighlighted }) =>
    $isHighlighted &&
    `
      animation: highlight 1.5s ease-out;

      @keyframes highlight {
        0% {
          background-color: pink;
        }

        100% {
          background-color: white;
        }
      }
    `}

  > div:nth-child(1) {
     width: 60%;
       @media (min-width: 739px) {
      width: 90%;   
       }
  }

  > div:nth-child(2) {
      width: 65%;
       @media (min-width: 739px) {
      width: 65%;   
       }
  }

  > div:nth-child(3) {
    flex: 1 1 0;
  }

  > div:nth-child(4) {
    flex: 0 0 80px;
  }
`;

const TransactionTitle = styled.h2`
  margin: 0;

  font-size: 1.4rem;

  @media (min-width: 739px) {
    font-size: 2rem;
  }
`;

const DateText = styled.p`
  margin: 4px 0;
  font-size: 0.7rem;
`;

const Amount = styled.p`
  margin: 0;
  padding: 0;

  font-weight: bold;
  font-size: 1rem;

  text-align: right;

  color: ${({ $isIncome }) =>
    $isIncome ? "black" : "red"};

  @media (min-width: 739px) {
    font-size: 2rem;
    padding-right: 2rem;
  }
`;


const ButtonWrapper = styled.div`
  display: flex;
  gap: 12px;
  justify-content: flex-start;
  align-items: center;
`;

const EditButton = styled.button`
  background: transparent;
  border: 1px solid lightgray;
  border-radius: 0.5rem;
  padding: 0.7rem;
  color: grey;
  cursor: pointer;

  &:hover {
    border-color: #000;
    color: #000;
  }
`;

const ActionButton = styled.button`
  display: flex;
  align-items: center;
  justify-content: center;

  padding: 0.7rem 1rem;

  background: transparent;
  border: 1px solid lightgray;
  border-radius: 0.5rem;

  color: #555;
  font: inherit;

  cursor: pointer;

  &:hover {
    border-color: #000;
    color: #000;
  }
`;

// ====================
// COMPONENT
// ====================

export default function TransactionCard({
  transaction,
  categories = [],
  onEdit,
  isSelected,
  isHighlighted,
  isDeleting,
  onInvoiceUploaded,
}) {
  const date = new Date(transaction.date);

  const categoryName =
    categories?.find(
      (category) =>
        String(category._id) ===
        String(transaction.category)
    )?.category || transaction.category;

  return (
    <Transaction
      $isSelected={isSelected}
      $isHighlighted={isHighlighted}
    >
      {isDeleting && (
        <Loading>
          <Spinner />
        </Loading>
      )}

      {/* ====================
          TRANSACTION INFO
      ==================== */}
    <TransactionWrapperInfos>
      <div>
        <TransactionTitle>
          {transaction.title.length > 15
            ? `${transaction.title.slice(0, 15)}...`
            : transaction.title}
        </TransactionTitle>

        <DateText>
          {date.toLocaleDateString("de-DE")}
        </DateText>
      </div>

      {/* ====================
          ACTIONS
      ==================== */}

      <div>
        <ButtonWrapper>
          <InvoiceUpload
            transaction={transaction}
            // ON INVOICE UPLOAD from PARENT
            onUploaded={onInvoiceUploaded}
          />

          <ActionButton
            type="button"
            onClick={() => {
              // category action
            }}
          >
            {categoryName}
          </ActionButton>
        </ButtonWrapper>
      </div>
  </TransactionWrapperInfos>
  <TransactionWrapperAmount>
      {/* ====================
          AMOUNT
      ==================== */}
    <div>
      <Amount
        $isIncome={transaction.amount >= 0}
      >
        {Number(transaction.amount).toLocaleString(
          "de-DE",
          {
            style: "currency",
            currency: "EUR",
          }
        )}
      </Amount>
    </div>
      {/* ====================
          EDIT
      ==================== */}

      <ButtonWrapper>
        <EditButton
          type="button"
          onClick={onEdit}
        >
          Edit
        </EditButton>
      </ButtonWrapper>
      </TransactionWrapperAmount>
    </Transaction>

  );
}