
import { useState } from "react";
import { pdf } from "@react-pdf/renderer";
import styled from "styled-components";
import { Download, X } from "lucide-react";

import MoneyManagerReport from "./MoneyManagerReport";

// ====================
// STYLES
// ====================

const DownloadDialogTrigger = styled.button`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  flex-direction: column;


  padding: 0.25rem 0.5rem;
  border: 1px solid grey;
  border-radius: 2rem;

  background: black;
  color: #fff;
  font: inherit;
  cursor: pointer;

  &:hover {
    background: #fff;
    color: #000;
  }

  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }

  @media (min-width: 740px) {
    padding: 0.25rem 1.25rem;
    flex-direction: row;
  }
`;

const VisuallyHiddenText = styled.span`
    display: none;
`;

const DownloadIcon = styled.span`
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 0.25rem;
`;

const DownloadDialogOverlay = styled.div`
  position: fixed;
  inset: 0;
  z-index: 3000;

  display: flex;
  align-items: center;
  justify-content: center;

  padding: 1rem;
  background: rgb(0 0 0 / 50%);
`;

const DownloadDialog = styled.div`
  position: relative;
  width: 100%;
  max-width: 420px;
  box-sizing: border-box;
  padding: 2rem;

  border-radius: 12px;
  background: #fff;
  color: #000;
  box-shadow: 0 8px 30px rgb(0 0 0 / 15%);

  h3 {
    margin: 0 2rem 0.75rem 0;
  }

  p {
    margin: 0;
    color: #666;
    line-height: 1.6;
  }
`;

const CloseButton = styled.button`
  position: absolute;
  top: 1rem;
  right: 1rem;

  display: flex;
  align-items: center;
  justify-content: center;

  padding: 0.25rem;
  border: none;
  background: transparent;
  color: #000;
  cursor: pointer;
`;

const DownloadDialogActions = styled.div`
  display: flex;
  gap: 0.75rem;
  margin-top: 1.5rem;

  button {
    flex: 1;
    min-width: 0;
  }
`;

const DialogButton = styled.button`
  padding: 0.75rem 1rem;
  border: 1px solid #000;
  border-radius: 8px;

  background: ${({ $primary }) => ($primary ? "#000" : "#fff")};
  color: ${({ $primary }) => ($primary ? "#fff" : "#000")};

  font: inherit;
  cursor: pointer;

  &:hover {
    background: ${({ $primary }) => ($primary ? "#333" : "#f2f2f2")};
  }

  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
`;

const ErrorMessage = styled.p`
  margin-top: 1rem !important;
  color: #c62828 !important;
`;

const TransactionCount = styled.span`
  display: inline-flex;
  align-items: center;
  justify-content: center;

  min-width: 28px;
  height: 28px;
  padding: 0 0.4rem;
  margin-right: 1rem;
  box-sizing: border-box;

  border: 1px solid #000;
  border-radius: 50%;

  background: #000;
  color: #fff;

  font-size: 0.8rem;
  font-weight: 600;
  font-variant-numeric: tabular-nums;
`;

// ====================
// COMPONENT
// ====================

export default function DownloadButton({
  transactions = [],
  categories = [],
  account,
  setPdfLoading,
  selectedType = "all",
}) {
  const [isDownloadConfirmOpen, setIsDownloadConfirmOpen] = useState(false);

  const [isDownloading, setIsDownloading] = useState(false);
  const [downloadError, setDownloadError] = useState("");

  function closeDialog() {
    if (isDownloading) return;

    setIsDownloadConfirmOpen(false);
    setDownloadError("");
  }

  async function handleDownload() {
    if (isDownloading) return;

    setIsDownloading(true);
    setPdfLoading?.(true);
    setDownloadError("");

    const startTime = Date.now();

    try {
      // Allow React to render the loading state first.
      await new Promise((resolve) =>
        requestAnimationFrame(resolve)
      );

      const filterName =
        selectedType === "all"
          ? "all"
          : selectedType.toLowerCase();

      const fileName = `money-manager-${filterName}.pdf`;

      const blob = await pdf(
        <MoneyManagerReport
          transactions={transactions}
          categories={categories}
          account={account}
        />
      ).toBlob();

      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");

      link.href = url;
      link.download = fileName;

      document.body.appendChild(link);
      link.click();
      link.remove();

      // Delay revocation so the browser can begin the download.
      window.setTimeout(() => {
        URL.revokeObjectURL(url);
      }, 1000);

      setIsDownloadConfirmOpen(false);
    } catch (error) {
      console.error("PDF download failed:", error);

      setDownloadError(
        "The PDF could not be generated. Please try again."
      );
    } finally {
      const elapsed = Date.now() - startTime;
      const remaining = Math.max(0, 800 - elapsed);

      window.setTimeout(() => {
        setPdfLoading?.(false);
        setIsDownloading(false);
      }, remaining);
    }
  }

  return (
    <>
      {/* DOWNLOAD TRIGGER */}
      <DownloadDialogTrigger
        type="button"
        onClick={() => {
          setDownloadError("");
          setIsDownloadConfirmOpen(true);
        }}
        aria-label="Download financial report"
      >
        <DownloadIcon>
          <Download size={18} />
        </DownloadIcon>
      <VisuallyHiddenText>PDF</VisuallyHiddenText>
      </DownloadDialogTrigger>

      {/* CONFIRMATION DIALOG */}
      {isDownloadConfirmOpen && (
        <DownloadDialogOverlay onClick={closeDialog}>
          <DownloadDialog
            role="dialog"
            aria-modal="true"
            aria-labelledby="download-dialog-title"
            onClick={(event) => event.stopPropagation()}
          >
            <CloseButton
              type="button"
              onClick={closeDialog}
              disabled={isDownloading}
              aria-label="Close dialog"
            >
              <X size={20} />
            </CloseButton>

            <h3 id="download-dialog-title">
              Download financial report?
            </h3>

            <p>
              Your MONEO report will be generated as a PDF using
              your currently selected account and transaction
              filters.
            </p>

            <h2>
              <TransactionCount>
                {transactions.length}
              </TransactionCount>
              Transactions included:{" "}
            </h2>

            {downloadError && (
              <ErrorMessage role="alert">
                {downloadError}
              </ErrorMessage>
            )}

            <DownloadDialogActions>
              <DialogButton
                type="button"
                onClick={closeDialog}
                disabled={isDownloading}
              >
                Cancel
              </DialogButton>

              <DialogButton
                type="button"
                $primary
                onClick={handleDownload}
                disabled={isDownloading}
              >
                {isDownloading
                  ? "Generating..."
                  : "Download PDF"}
              </DialogButton>
            </DownloadDialogActions>
          </DownloadDialog>
        </DownloadDialogOverlay>
      )}
    </>
  );
}
