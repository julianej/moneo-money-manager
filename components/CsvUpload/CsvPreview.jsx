import styled from "styled-components";
import CategoryDropdown from "../CategoriesDropdown/CategoriesDropdown";
import DialogPopup from "../DialogPopup/DialogPopup";
import { useState } from "react";
import { Trash2 } from "lucide-react";

import { cleanTitle, isValidTitle } from "../../utils/cleanTitle";
import { cleanAmount } from "../../utils/cleanAmount";

const TransactionCsvHeader = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 1rem;
`;

const TransactionCard = styled.div`
  border: 3px solid
    ${({ $hasError }) => ($hasError ? "#e51255" : "lightgray")};
  border-radius: 12px;
  padding: 1rem;
  margin-bottom: 0.75rem;
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

  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
`;

const EmptyMessage = styled.p`
  margin: 0;
`;

const ErrorMessage = styled.p`
  margin: 0.25rem 0 0;
  color: #e51255;
  font-size: 0.8rem;
`;

export default function CsvPreview({
  transactions,
  categories = [],
  selectedAccount,
  onCategoryChange,
  onTitleChange,
  onCancel,
  mutate,
  showToast,
}) {
  const [isImporting, setIsImporting] = useState(false);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);

  /*
   * Validate every transaction.
   *
   * Each transaction gets an errors object.
   *
   * Example:
   *
   * {
   *   title: "Invalid title.",
   *   amount: "Invalid amount."
   * }
   */
  const validatedTransactions = transactions.map((transaction) => {
    const errors = {};

    const amount = cleanAmount(transaction.amount);

    if (amount === null) {
      errors.amount = "Invalid amount.";
    }

    if (!isValidTitle(transaction.title)) {
      errors.title = "Invalid title.";
    }

    if (
      !transaction.category ||
      transaction.category === "set-category"
    ) {
      errors.category = "Please select a category.";
    }

    return {
      ...transaction,

      // Keep the cleaned number separately.
      parsedAmount: amount,

      // Store validation errors.
      errors,
    };
  });

  /*
   * Import all transactions.
   */
  async function handleSubmitImport() {
    console.log("SELECTED ACCOUNT:", selectedAccount);

    /*
     * Check whether at least one transaction
     * contains a validation error.
     */
    const hasErrors = validatedTransactions.some(
      (transaction) =>
        Object.keys(transaction.errors).length > 0
    );

    if (hasErrors) {
      showToast(
        "Please fix the transactions \n before importing.",
        "error"
      );

      return;
    }

    try {
      /*
       * Send every valid transaction to the API.
       */
      for (const transaction of validatedTransactions) {
        const cleanedTransaction = {
          ...transaction,

          /*
           * Send the parsed numeric amount.
           *
           * Example:
           * "-1.234,56"
           * becomes
           * -1234.56
           */
          amount: transaction.parsedAmount,

          title: cleanTitle(transaction.title),

          account: selectedAccount,
        };

        /*
         * These properties are only needed
         * by the preview and validation.
         *
         * They don't need to be sent to MongoDB.
         */
        delete cleanedTransaction.errors;
        delete cleanedTransaction.parsedAmount;

        console.log(
          "SENDING IMPORT:",
          cleanedTransaction
        );

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

      /*
       * Refresh transactions after import.
       */
      await mutate();

      showToast(
        "Transaction file imported successfully.",
        "success"
      );

      /*
       * Close CSV preview.
       */
      onCancel();
    } catch (error) {
      console.error("IMPORT ERROR:", error);

      showToast(
        `Import failed: ${error.message}`,
        "error"
      );
    }
  }

  /*
   * Nothing to preview.
   */
  if (!transactions.length) {
    return (
      <EmptyMessage>
        No transactions to preview.
      </EmptyMessage>
    );
  }

  return (
    <>
      <PreviewWrapper>
        <PreviewHeader>
          <TransactionCsvHeader>
            {transactions.length} transactions ready to Import

            <ButtonWrapper>
              <CancelButton
                type="button"
                onClick={() => setShowDeleteDialog(true)}
                aria-label="Remove CSV preview"
              >
                <Trash2 size={18} />
              </CancelButton>

              <ImportButton
                  type="button"
                  onClick={handleSubmitImport}
                  disabled={isImporting}
                >
                  {/* IMPORTING STATE */}
                  {isImporting ? "Importing..." : "Import All"}
              </ImportButton>
            </ButtonWrapper>
          </TransactionCsvHeader>
        </PreviewHeader>

        {/* Transaction Headers */}

        <TransactionRow>
          <strong>Date</strong>
          <strong>Title</strong>
          <strong>Amount</strong>
          <strong>Type</strong>
          <strong>Category</strong>
        </TransactionRow>

        {/* Transactions */}

        {validatedTransactions.map(
          (transaction, index) => {
            const hasError =
              Object.keys(transaction.errors).length > 0;

            return (
              <TransactionCard
                key={index}
                $hasError={hasError}
              >
                <TransactionRow>
                  {/* DATE */}

                  <span>
                    {transaction.date}
                  </span>

                  {/* TITLE */}

                  <div>
                    <input
                      type="text"
                      value={transaction.title || ""}
                      onChange={(event) =>
                        onTitleChange(
                          index,
                          event.target.value
                        )
                      }
                    />

                    {transaction.errors.title && (
                      <ErrorMessage>
                        {transaction.errors.title}
                      </ErrorMessage>
                    )}
                  </div>

                  {/* AMOUNT */}

                  <div>
                    <span>
                      {transaction.parsedAmount !== null
                        ? transaction.parsedAmount.toFixed(2)
                        : transaction.amount}
                    </span>

                    {transaction.errors.amount && (
                      <ErrorMessage>
                        {transaction.errors.amount}
                      </ErrorMessage>
                    )}
                  </div>

                  {/* TYPE */}

                  <span>
                    {transaction.type}
                  </span>

                  {/* CATEGORY */}

                  <div>
                    <CategoryDropdown
                      value={transaction.category}
                      categories={categories}
                      selectedAccount={selectedAccount}
                      onChange={(event) =>
                        onCategoryChange(
                          index,
                          event.target.value
                        )
                      }
                    />

                    {transaction.errors.category && (
                      <ErrorMessage>
                        {transaction.errors.category}
                      </ErrorMessage>
                    )}
                  </div>
                </TransactionRow>
              </TransactionCard>
            );
          }
        )}
      </PreviewWrapper>

      {/* DELETE PREVIEW DIALOG */}

      {showDeleteDialog && (
        <DialogPopup
          title="Remove CSV preview?"
          message="Are you sure you want to remove the imported transactions?"
          onDelete={onCancel}
          onCancel={() =>
            setShowDeleteDialog(false)
          }
        />
      )}
    </>
  );
}