import styled from "styled-components";
import { Paperclip } from "lucide-react";
import { useState } from "react";

// ====================
// STYLES
// ====================

const InvoiceInput = styled.input`
  display: none;
`;

const InvoiceButton = styled.button`
  display: flex;
  align-items: center;
  justify-content: center;

  width: 40px;
  height: 40px;

  background: ${({ $hasInvoice }) =>
    $hasInvoice ? "#000" : "transparent"};

  border: 1px solid
    ${({ $hasInvoice }) =>
      $hasInvoice ? "#000" : "lightgray"};

  border-radius: 0.5rem;

  color: ${({ $hasInvoice }) =>
    $hasInvoice ? "#fff" : "grey"};

  cursor: pointer;

  &:hover {
    border-color: #000;

    color: ${({ $hasInvoice }) =>
      $hasInvoice ? "#fff" : "#000"};
  }

  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
`;

// ====================
// COMPONENT
// ====================

export default function InvoiceUpload({
  transaction,
  onUploaded,
}) {
  const [isUploading, setIsUploading] = useState(false);

  const invoiceInputId = `invoice-${transaction._id}`;


  async function handleInvoiceUpload(event) {
    const file = event.target.files?.[0];

    if (!file) return;

    // Only PDF files are allowed
    if (file.type !== "application/pdf") {
      console.error("Please select a PDF file.");
      event.target.value = "";
      return;
    }

    setIsUploading(true);

     try {
    // ====================
    // 2. PREPARE PDF
    // ====================

    const formData = new FormData();

    formData.append("file", file);

    console.log("Selected PDF:", file);
    console.log("FormData:", formData.get("file"));

    // ====================
    // 3. UPLOAD TO MONGODB
    // ====================

    const uploadResponse = await fetch(
      "/api/invoices/upload",
      {
        method: "POST",
        body: formData,
      }
    );

    const uploadData = await uploadResponse.json();

    if (!uploadResponse.ok) {
    throw new Error(
        uploadData.error ||
        "Invoice upload failed"
    );
    }

    console.log(
    "MongoDB invoice upload:",
    uploadData
    );
    // ====================
    // 3. SAVE INVOICE
    // ====================

    const transactionResponse = await fetch(
    `/api/transactions/${transaction._id}`,
    {
        method: "PATCH",
        headers: {
        "Content-Type": "application/json",
        },
        body: JSON.stringify({
        invoice: {
            fileId: uploadData.fileId,
            filename: uploadData.filename,
            uploadedAt: new Date(),
        },
        }),
    }
    );

    const transactionData =
    await transactionResponse.json();

    if (!transactionResponse.ok) {
    throw new Error(
        transactionData.error ||
        "Could not save invoice to transaction"
    );
    }

    console.log(
    "Invoice attached to transaction:",
    transactionData
    );

    // TAKE onUNPLOADED
    if (onUploaded) {
    onUploaded(transactionData);
    }


    } catch (error) {
      console.error(
        "Invoice upload failed:",
        error
      );
    } finally {
      setIsUploading(false);

      // Allow selecting the same PDF again
      event.target.value = "";
    }
  }

  return (
    <>
        <InvoiceButton
        type="button"
        $hasInvoice={Boolean(transaction.invoice?.fileId)}
        disabled={isUploading}
        onClick={() =>
            document
            .getElementById(invoiceInputId)
            ?.click()
        }
        aria-label={
            transaction.invoice?.fileId
            ? "Invoice attached"
            : "Attach invoice PDF"
        }
        >
        <Paperclip size={16} />
        </InvoiceButton>

        <InvoiceInput
        id={invoiceInputId}
        type="file"
        accept="application/pdf,.pdf"
        onChange={handleInvoiceUpload}
        />
    </>
  );
}