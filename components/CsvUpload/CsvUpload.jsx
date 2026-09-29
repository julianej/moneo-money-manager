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

export default function CsvUpload({ onFileSelect }) { //   <CsvUpload onFileSelect={(transactions) => {} >
  const fileInputRef = useRef(null);
  const [errorMessage, setErrorMessage] = useState("");
  const [loading, setLoading] = useState(false);

  function handleFileSelection(event) {
    setLoading(true);
    // INPUT event from type
    const file = event.target.files[0];
    console.log("event:", event);
    console.log("files:", event.target.files);
    console.log("file:", event.target.files[0]);

// read FILE
//   const reader = new FileReader();
//   reader.onload = (evt) => {
//     console.log(evt.target.result);
//   };

    const reader = new FileReader();
    reader.onload = (event) => {
         console.log(event.target.result);
        const csvText = event.target.result;

    // TRANSFORM COLUMNS
    //     CSV text
    //    ↓ split("\n")
    //     row 1
    //     row 2
    //     row 3

      const rows = csvText
    //  "Hello World ".trim()
        .trim() //whitespace

    //  const text = "Hello World";
    //  const result = text.split(" ");
    //  ["Hello", "World"]
        .split("\n")
        .map((row) => row.split(";"));
    // ["date", "title", "amount"]

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
          "CSV must contain date, title and amount.");
            setLoading(false);
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
      setLoading(false);
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
        {loading ? (
            <span>Reading CSV...</span>
        ) : (
            <span>Upload CSV</span>
        )}
        </UploadButton>

        {/*INPUT */}
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

// https://dev.to/patriciosalazar/how-i-added-csv-importing-in-my-react-nodejs-project-2mij
// https://developer.mozilla.org/en-US/docs/Web/HTML/Reference/Elements/input/file
// https://levelup.gitconnected.com/csv-parsing-in-react-8d2a05f844f3