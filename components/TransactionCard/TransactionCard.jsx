import styled from "styled-components";
import { Loading, Spinner } from "@/styles/LoadingStyles";

// ====================
// STYLES
// ====================

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
  color:grey;
`;

const Transaction = styled.article`
  position: relative;
  display: flex;
  gap: 0.5rem;
  padding: 1rem;
  border-radius: 8px;
  align-items: center;
  margin: 0;

  border: ${({ $isSelected }) =>
    $isSelected ? "0.1rem solid black" : "0.1rem solid #ccc"};

  background-color: ${({ $isSelected }) =>
    $isSelected ? "#e0e0e0" : "white"};

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

  > div:first-child {
    flex: 2 0 0 ;
  }

  > div:nth-child(2) {
      flex: 1 0 0 ;
  }
  > div:nth-child(3) {
      flex: 2 0 0 ;
  }
`;

const TransactionTitle = styled.h2`

  @media (min-width: 739px) {
      font-size: 2rem;
  }

  margin: 0;
  flex: 2 0 0;
  font-size: 0.8rem;
`;

const Category = styled.p`
  margin: 0.1rem 0;
  font-size: 0.8rem;
`;

const DateText = styled.p`
  margin: 4px 0;
  font-size: 0.7rem;
`;

const Time = styled.p`
  margin: 4px 0;
  font-size: 0.7rem;
`;

const Amount = styled.p`
  font-weight: bold;
  font-size: 1rem;
  margin: 0;
  padding: 0;
  flex: 2 0 0;
  text-align: right;
  color: ${({ $isIncome }) =>
  $isIncome ? "black" : "red"};
  @media (min-width: 739px) {
      font-size: 2rem;
      padding-right: 2rem;
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
}) {
  
  // "2025-08-20"
  const date = new Date(transaction.date);

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

        <div>
          <TransactionTitle>
              {transaction.title.length > 15
                ? `${transaction.title.slice(0, 15)}...`
                : transaction.title}
            </TransactionTitle>

    <Category>
          {categories?.find(
            (category) =>
              String(category._id) === String(transaction.category)
          )?.category || transaction.category

            // categories?.find(
            //   // Find the category whose _id matches the transaction's category ID:
            //   (category) => category._id  === transaction.category)
            //   // Then get its name from the category property:
            //   ?.category
            //  // || if no matching category is found, you'll see the stored ID instead.
            //    || transaction.category)}
        }
          </Category>
        </div>

        <div>
          <DateText>
            {date.toLocaleDateString("de-DE")}
          </DateText>

          <Time>
            {date.toLocaleTimeString("de-DE", {
              hour: "2-digit",
              minute: "2-digit",
            })}
          </Time>
        </div>

        <Amount $isIncome={transaction.amount >= 0}>
          {transaction.amount} €
        </Amount>

        <ButtonWrapper>
          <EditButton type="button" onClick={onEdit}>
            Edit
          </EditButton>
        </ButtonWrapper>
      </Transaction>
    )}

