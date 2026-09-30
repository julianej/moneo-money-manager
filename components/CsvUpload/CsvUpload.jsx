import { useRef, useState } from "react";
import Papa from "papaparse";
import styled from "styled-components";
import { cleanTitle } from "../../utils/cleanTitle";

const UploadWrapper = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: 0.5rem;
`;

const UploadButton = styled.button`
  display: flex;
  align-items: center;
  gap: 0.5rem;

  padding: 0.7rem 1rem;

  border: 1px solid #0d0d0d;
  border-radius: 0.5rem;

  background: white;
  color: #0d0d0d;

  cursor: pointer;

  &:hover {
    background: #0d0d0d;
    color: white;
  }
`;

const HiddenFileInput = styled.input`
  display: none;
`;

const ErrorMessage = styled.p`
  margin: 0;
  font-size: 14px;
  color: #c62828;
`;

const requiredHeaders = [
  "date",
  "title",
  "amount",
];

export default function CsvUpload({ onFileSelect }) {
  const fileInputRef = useRef(null);
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

// clean DATE 
  function parseDate(value) {
      if (!value) {
        return null;
      }

      const trimmedDate = value.trim();

      if (trimmedDate.includes("-")) {
        return trimmedDate;
      }

      const [day, month, year] = trimmedDate.split(".");

      return `${year}-${month}-${day}`;
    }

  // clean AMOUNT
  function parseAmount(value) {
    if (!value) {
      return 0;
    }

    return Number(value.trim().replace(",", "."));
  }

  // BUTTON CSV SELECT
  function handleFileSelection(event) {
    const file = event.target.files[0];

    if (!file) {
      return;
    }

    setLoading(true);
    setErrorMessage("");

  // PAPA PARSING
    Papa.parse(file, {
      header: true,
      delimiter: ";",
      skipEmptyLines: true,

      complete: function (results, file) {
        const headers = results.meta.fields || [];

        const cleanHeaders = headers.map((header) =>
          header.trim().toLowerCase()
        );

        const hasRequiredHeaders = requiredHeaders.every((header) =>
          cleanHeaders.includes(header)
        );

        if (!hasRequiredHeaders) {
          setErrorMessage(
            "CSV must contain date, title and amount."
          );
          setLoading(false);
          return;
        }

        // PAPA PARSE RESULT DATA
        const transactions = results.data.map((row) => {
            const amount = parseAmount(row.amount);

          return {
            date: parseDate(row.date),
            title: cleanTitle(row.title),
            amount,
            type: amount < 0 ? "expense" : "income",
            category: "set-category",
          };
        });

        onFileSelect(transactions);
        setLoading(false);
      },

      error: () => {
        setErrorMessage("Could not read the CSV file.");
        setLoading(false);
      },
    });

    event.target.value = "";
  }


  return (
    <UploadWrapper>
      <UploadButton
        type="button"
        onClick={() => fileInputRef.current?.click()}
        >
        {loading ? (
            <span>Reading CSV...</span>
        ) : (
            <span>Upload CSV</span>
        )}
        </UploadButton>

        {/*UPLOAD INPUT BUTTON */}
        <HiddenFileInput
            ref={fileInputRef}
            type="file"
            accept=".csv"
            // When the input detects a change I trigger a handleFileUpload function.
            onChange={handleFileSelection}
        />

      {errorMessage ? (
        <ErrorMessage>{errorMessage}</ErrorMessage>
      ) : null}
    </UploadWrapper>
  );
}
