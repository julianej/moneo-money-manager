import { useRef, useState } from "react"; 
import { Upload } from "lucide-react"; 
import styled from "styled-components";

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
  const [errorMessage, setErrorMessage] = useState("");

  function handleFileSelection(event) {
    const file = event.target.files[0];

    if (!file) return;

    setErrorMessage("");

    const isCsv = file.name.toLowerCase().endsWith(".csv");

    if (!isCsv) {
      setErrorMessage("Please select a CSV file.");
      return;
    }

    const reader = new FileReader();

    reader.onload = (event) => {
      const csvText = event.target.result;

      const rows = csvText
        .trim()
        .split("\n")
        .map((row) => row.split(";"));

      const [headers, ...dataRows] = rows;

      const cleanHeaders = headers.map((header) =>
        header.trim().toLowerCase()
      );

        console.log("CSV headers:", headers);
        console.log("Clean headers:", cleanHeaders);

      const hasRequiredHeaders = requiredHeaders.every((header) =>
        cleanHeaders.includes(header)
      );

      if (!hasRequiredHeaders) {
        setErrorMessage(
          "CSV must contain date, title and amount."
        );
        return;
      }

      const transactions = dataRows.map((row) => {
        const transaction = {};

        cleanHeaders.forEach((header, index) => {
          transaction[header] = row[index]?.trim();
        });

        const amount = Number(transaction.amount);

        return {
          title: transaction.title,
          amount,
          date: transaction.date,
          type: amount < 0 ? "expense" : "income",
          category: null,
        };
      });

      onFileSelect(transactions);
    };

    reader.readAsText(file);

    event.target.value = "";
  }

  return (
    <UploadWrapper>
      <UploadButton
        type="button"
        onClick={() => fileInputRef.current?.click()}
      >
        <Upload size={16} />
        Upload CSV
      </UploadButton>

      <HiddenFileInput
        ref={fileInputRef}
        type="file"
        accept=".csv,text/csv"
        onChange={handleFileSelection}
      />

      {errorMessage ? (
        <ErrorMessage>{errorMessage}</ErrorMessage>
      ) : null}
    </UploadWrapper>
  );
}

