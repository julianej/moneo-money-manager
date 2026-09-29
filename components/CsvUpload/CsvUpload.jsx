import { useRef } from "react";
import { Upload } from "lucide-react";
import styled from "styled-components";

export default function CsvUpload({ onFileSelect }) {
  const fileInputRef = useRef(null);

  function handleFileChange(event) {
    const file = event.target.files[0];

    if (!file) return;

    const isCsv = file.name.toLowerCase().endsWith(".csv");

    if (!isCsv) {
      return;
    }

    onFileSelect(file);

    // Allows selecting the same file again
    event.target.value = "";
  }

  return (
    <>
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
        onChange={handleFileChange}
      />
    </>
  );
}

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