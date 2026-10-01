
import styled from "styled-components";
import CategoryDropdown from "../CategoriesDropdown/CategoriesDropdown";
import { Trash2 } from "lucide-react";
import { cleanTitle, isValidTitle } from "../../utils/cleanTitle";

const TransactionCsvHeader = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 1rem;
`;


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

const ButtonWrapper = styled.div`
  display: flex;
  justify-content: flex-end;
  gap: 0.75rem;
  margin-top: 1.5rem;
`;

const CancelButton = styled.button`
  padding: 0.7rem 1.2rem;

  border: 1px solid #ccc;
  border-radius: 0.5rem;

  background: grey;
  color: #000;

  cursor: pointer;

  &:hover {
    background: #f2f2f2;
  }
`;

const ImportButton = styled.button`
  padding: 0.7rem 1.2rem;

  border: 1px solid #000;
  border-radius: 0.5rem;
  min-width: 40%;

  background: #000;
  color: white;

  cursor: pointer;

  &:hover {
    background: #333;
  }
`;

const EmptyMessage = styled.p`
  margin: 0;
`;



export default function CsvPreview({
  transactions,
  categories = [],
  //SELECETD ACCOUNT
  selectedAccount,
  onCategoryChange,
  onTitleChange,
  onCancel,
  mutate,
  showToast
}) {

async function handleSubmitImport() {
  console.log("SELECTED ACCOUNT:", selectedAccount);

  try {
    // it there SOME transaction invalid ?
    const hasMissingCategory = transactions.some(
      // The transaction has no category at all || checks your CSV placeholder.
        (transaction) => !transaction.category || transaction.category === "set-category"
    );

    if (hasMissingCategory) {
      showToast("Please select a category for every transaction.");
      return;
    }

    const hasInvalidTitle = transactions.some(
      (transaction) => !isValidTitle(transaction.title)
    );

    if (hasInvalidTitle) {
      showToast(
        "Please check your transaction titles. Titles must contain at least 3 characters."
      );
      return;
    }

    for (const transaction of transactions) {
        const cleanedTransaction = {
          ...transaction,
          title: cleanTitle(transaction.title),
          account: selectedAccount,
        };

      console.log("SENDING IMPORT:", cleanedTransaction);

      // SENDING NEW TRANSACTIONS
      const response = await fetch("/api/transactions", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(cleanedTransaction),
      });

      if (!response.ok) {
        const errorText = await response.text();

        console.error(
          "IMPORT API ERROR:",
          response.status,
          errorText
        );

        throw new Error(errorText);
      }
    }

    await mutate();

    showToast("Transactions imported successfully");

    onCancel();
  } catch (error) {
    console.error("IMPORT ERROR:", error);
    showToast(`Import failed: ${error.message}`);
  }
}

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
        <TransactionCsvHeader>
            {transactions.length} transactions ready to Import
            <ButtonWrapper>
                  <CancelButton
                    type="button"
                    onClick={onCancel}
                  >
                    <Trash2 size={18} />
                  </CancelButton>

                  <ImportButton
                    type="button"
                    onClick={handleSubmitImport}
                  >
                    Import All
                  </ImportButton>
              </ButtonWrapper>
          </TransactionCsvHeader>
         </PreviewHeader>
             
           {/* Transaction Headers*/}
              <TransactionRow>
                <strong>Date</strong>
                <strong>Title</strong>
                <strong>Amount</strong>
                <strong>Type</strong>
                <strong>Category</strong>
              </TransactionRow>

            {/* Transaction Infos*/}
              {transactions.map((transaction, index) => (
                <TransactionRow key={index}>
                  <span>{transaction.date}</span>
                  <input
                    type="text"
                      value={transaction.title || ""}
                        onChange={(event) =>
                           onTitleChange(index, event.target.value)
                    }
                  />
                  <span>{transaction.amount.toFixed(2)} </span>
                  <span>{transaction.type}</span>
         
              <CategoryDropdown
                value={transaction.category}
                categories = {categories}
                selectedAccount={selectedAccount}
                onChange={(event) =>
                onCategoryChange(index, event.target.value)
            }
            />
        </TransactionRow>
      ))}
    </PreviewWrapper>
  );
}

