import { useRef, useState } from "react";
import { Trash2, X } from "lucide-react";
import { LoaderCircle } from "lucide-react";
import styled from "styled-components";
import TransactionCard from "../TransactionCard/TransactionCard";
import TransactionForm from "../TransactionForm/TransactionForm";
import formatDate from "@/helpers/dateFormating";

// new IMPORTS
import CsvUpload from "../CsvUpload/CsvUpload";
import CsvPreview from "../CsvUpload/CsvPreview";

import DialogPopup from "../DialogPopup/DialogPopup";
import { CloseButton } from "@/styles/ButtonStyles";

// ====================
// STYLES
// ====================

const TransactionListWrapper = styled.section`
  position: relative;
  min-width: 0;
  max-height: 100vh;
  overflow-y: auto;
`;


const CardWrapper = styled.div`
  display: flex;
  flex-direction: column;

  ${({ $isEditing }) =>
    $isEditing &&
    `
      border: 2px solid black;
      border-radius: 16px;
      padding: 1rem;
      background-color: #f0f0f0;
    `}
`;

const ListWrapper = styled.div`
  position: relative;
  width: 100%;
`;

const List = styled.section`
  max-height: 500px;
  position: relative;
  overflow-y: auto;
  display: flex;
  flex-direction: column;
  gap: 12px;

  border-radius: 1rem;
  padding: 0 0.7rem 2rem;
  border: ${({ $isEmpty }) =>
    $isEmpty ? "none" : "2px solid #000"};
`;

const EmptyState = styled.p`
  text-align: center;
  padding: 40px 20px;
`;

const DeleteAccountButton = styled.button`
 display: flex;
    align-items: center;
    gap: 0.75rem;
    bottom: 0;
    position: relative;
    position: relative;
    bottom: 0;
    padding: 0.75rem 1rem;
    border-radius: 2rem;
    border: 0.1rem solid lightgrey;
    background: transparent;
    color: #000;
    cursor: pointer;
    text-align: left;
    display: flex;
    margin: 4rem auto 7rem; 
  cursor: pointer;
  text-align: left;

  span {
    font-size: 0.875rem;
  }

  &:hover {
    background: grey;
    color: #000;
  }

    @media (min-width: 740px) {
       left: 82%;
        margin: 5rem 0 0.5rem;
    }
`;


const SlideInContainer = styled.aside`
  position: relative;
  z-index: 11;

  box-sizing: border-box;
  overflow: hidden;
  padding: ${({ $isOpen }) =>
    $isOpen ? "1rem 1.5rem 1.5rem" : "0 1.5rem"};

  max-height: ${({ $isOpen }) => ($isOpen ? "400px" : "0")};

  background: white;

  visibility: ${({ $isOpen }) =>
    $isOpen ? "visible" : "hidden"};

  transition:
    max-height 0.35s ease,
    padding 0.35s ease,
    visibility 0.35s ease;
`;

const InfoWrapper = styled.div`
  display: flex;

  flex-direction: column;
  gap: 0rem;
  font-family: 'IBM Plex Mono';

  > p {
    flex: 1 1 0;
  }

  @media (min-width: 740px) {
    flex-direction: row;}
`;

const LoadingOverlay = styled.div`
  position: absolute;
  inset: 0;
  z-index: 100;

  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 12px;

  background: rgba(255, 255, 255, 0.7);
  backdrop-filter: blur(2px);
`;

const Spinner = styled(LoaderCircle)`
  animation: spin 0.8s linear infinite;

  @keyframes spin {
    from {
      transform: rotate(0deg);
    }

    to {
      transform: rotate(360deg);
    }
  }
`;

const DownloadText = styled.span`
  display: inline;
`;


// ====================
// COMPONENT
// ====================


export default function TransactionList({
  transactions,
  mutate,
  showToast,
  categories=[],
  selectedAccount,
  onDeleteAccount,
  pdfLoading,
}) {

    // new USESTATE 
  const [importedTransactions, setImportedTransactions] = useState([]);

  const [editingTransaction, setEditingTransaction] = useState(null);
  const [highlightedId, setHighlightedId] = useState(null);
  const [deletingTransactionPopup, setDeletingTransactionPopup] = useState(null);
  const [deletingId, setDeletingId] = useState(null);
  const [showDeleteAccountPopup, setShowDeleteAccountPopup] = useState(false);

  const [selectedTransaction, setSelectedTransaction] = useState(null);
  const [isSlideInOpen, setIsSlideInOpen] = useState(false);

  // FOR FANCY SCROLL
const transactionListRef = useRef(null);

function handleTransactionClick(transaction) {
  setSelectedTransaction(transaction);
  setIsSlideInOpen(true);

  transactionListRef.current?.scrollTo({
    top: 0,
    behavior: "smooth",
  });
}

  function handleEdit(transaction) {
    setEditingTransaction(transaction);
  }

  function handleSave(id) {
    setEditingTransaction(null);
    setHighlightedId(id);

    setTimeout(() => {
      setHighlightedId(null);
    }, 1500);
  }

  function handleCancel() {
    setEditingTransaction(null);
  }

  function handleDeleteClick(transaction) {
    setDeletingTransactionPopup(transaction);
  }

  function handleCancelDelete() {
    setDeletingTransactionPopup(null);
  }

  async function handleConfirmDelete(id) {
    setEditingTransaction(null);
    setDeletingTransactionPopup(null);
    setDeletingId(id);

    //DELETE TRANSACTION
    try {
      const response = await fetch(`/api/transactions/${id}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        throw new Error("Failed to delete transaction");
      }

      await new Promise((resolve) => setTimeout(resolve, 1200));

      setDeletingId(null);

      await mutate();

    } catch (error) {
      console.error(error);
      setDeletingId(null);
    }
  }

return (
  <>
<TransactionListWrapper ref={transactionListRef}>
    <ListWrapper>
      <List>
        <h2>Your Transaction List</h2>

      {/* Empty State */}
       {transactions.length === 0 ? (
          <>
            <EmptyState>
              No transactions yet.
            </EmptyState>

       {/* CSV UPLOAD */}
           {importedTransactions.length > 0 ? (
                <CsvPreview
                    transactions={importedTransactions}
                    categories={categories}
                    selectedAccount={selectedAccount}
                    onTitleChange={(index, title) => {
                      setImportedTransactions((currentTransactions) =>
                        currentTransactions.map(
                          (transaction, transactionIndex) =>
                            transactionIndex === index
                              ? { ...transaction, title }
                              : transaction
                        )
                      );
                    }}
                    onCategoryChange={(index, category) => {
                      setImportedTransactions((currentTransactions) =>
                        currentTransactions.map(
                          (transaction, transactionIndex) =>
                            transactionIndex === index
                              ? { ...transaction, category }
                              : transaction
                        )
                      );
                    }}
                    // onImport={handleSubmitImport}
                    onCancel={() => setImportedTransactions([])}
                    mutate={mutate}
                    showToast={showToast}
                  />
              ) : (
                <CsvUpload
                  onFileSelect={(csvData) => {
                    setImportedTransactions(csvData);
                  }}
                />
              )}
          </>
        ) : (
          transactions.map((transaction) => (
            <CardWrapper
              key={transaction._id}
              $isEditing={editingTransaction?._id === transaction._id}
              onClick={() => handleTransactionClick(transaction)}
            >
              <TransactionCard
                transaction={transaction}
                categories={categories}
                onEdit={() => handleEdit(transaction)}
                isSelected={editingTransaction?._id === transaction._id}
                isHighlighted={highlightedId === transaction._id}
                onDelete={() => handleDeleteClick(transaction)}
                isDeleting={deletingId === transaction._id}
                // for INVOICE UPLOAD, you create the function here in the PARENT,
                onInvoiceUploaded={() => mutate()}
              />

              {editingTransaction?._id === transaction._id && (
                <TransactionForm
                  transaction={editingTransaction}
                  categories={categories}
                  selectedAccount={selectedAccount}
                  onDelete={() => handleDeleteClick(transaction)}
                  onCancel={handleCancel}
                  onSave={handleSave}
                  mutate={mutate}
                  showToast={showToast}
                />
              )}
              {/* Slide-in panel inside TransactionList */}
               {selectedTransaction?._id === transaction._id && (
                  <SlideInContainer $isOpen={isSlideInOpen}>
                    <CloseButton
                      type="button"
                      onClick={(event) => {
                        event.stopPropagation();
                        setIsSlideInOpen(false);
                      }}
                      aria-label="Close transaction details"
                    >
                    <X size={20} />
                    </CloseButton>
                {/* <div className="InfoWrapper"> */}
                  <InfoWrapper>
                    <p>
                      <strong>Buchungsdatum:</strong>{" "}
                      {selectedTransaction?.date
                        ? formatDate(selectedTransaction.date)
                        : "—"}
                    </p>

                    <p>
                      <strong>Rechnungsdatum:</strong>{" "}
                      {selectedTransaction?.invoiceDate
                        ? formatDate(selectedTransaction.invoiceDate)
                        : "—"}
                    </p>
                    <p>
                      <strong>Rechnungsnummer:</strong>{" "}
                      {selectedTransaction?.invoiceTitle || "—"}
                    </p>
                   </InfoWrapper>
                  </SlideInContainer>
                )}
            </CardWrapper>
          ))
        )}
      </List>

      {/* PDF loading overlay */}
      {pdfLoading ? (
        <LoadingOverlay>
          <Spinner size={32} />

          <DownloadText>
            Preparing PDF download...
          </DownloadText>
        </LoadingOverlay>
      ) : (
        null
      )}
    </ListWrapper>

    {/* Delete account stays outside the overlay */}
    <DeleteAccountButton
      type="button"
      onClick={() => setShowDeleteAccountPopup(true)}
      aria-label="Delete bank account"
      title="Delete bank account"
    >
      <Trash2 size={18} />

      <span>
        Delete the Bank Account
      </span>
    </DeleteAccountButton>
    </TransactionListWrapper>
    {showDeleteAccountPopup && (
      <DialogPopup
        title="Delete bank account?"
        message="This will permanently delete the bank account and all of its transactions."
        onCancel={() => setShowDeleteAccountPopup(false)}
        onDelete={async () => {
          await onDeleteAccount();
          setShowDeleteAccountPopup(false);
        }}
      />
    )}

    {deletingTransactionPopup && (
      <DialogPopup
        transaction={deletingTransactionPopup}
        onCancel={handleCancelDelete}
        onDelete={() =>
          handleConfirmDelete(deletingTransactionPopup._id)
        }
      />
    )}
  </>
)};
