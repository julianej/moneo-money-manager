import { pdf } from "@react-pdf/renderer";
import styled from "styled-components";
import { Download } from "lucide-react";
import { useState } from "react";

import MoneyManagerReport from "./MoneyManagerReport";

const PDFDownloadButton = styled.button`
  border-radius: 2rem;
  border: 1px solid grey;
  background-color: black;
  color: #fff;
  padding: 0.25rem 1.25rem;
  cursor: pointer;

  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
`;

const DownloadIcon = styled.span`
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 0.25rem;
`;

const DownloadText = styled.span`
  display: inline;

  @media (min-width: 740px) {
    display: none;
  }
`;


export default function DownloadButton({
  transactions = [],
}) {
  const [loading, setLoading] = useState(false);

  async function handleDownload() {
    console.log("1. CLICK");

    setLoading(true);

    try {
      console.log("2. BEFORE PDF");

      const blob = await pdf(
        <MoneyManagerReport transactions={transactions} />
      ).toBlob();

      console.log("3. AFTER PDF", blob);

      const url = URL.createObjectURL(blob);

      const link = document.createElement("a");
      link.href = url;
      link.download = "money-manager-report.pdf";

      document.body.appendChild(link);
      link.click();
      link.remove();

      URL.revokeObjectURL(url);

      console.log("4. DOWNLOAD DONE");
    } catch (error) {
      console.error("PDF ERROR:", error);
    } finally {
      console.log("5. FINALLY");
      setLoading(false);
    }
  }

  return (
    <PDFDownloadButton
      type="button"
      onClick={handleDownload}
      disabled={loading}
    > <DownloadIcon><Download size={18} /></DownloadIcon>
       <DownloadText>
        {loading ? "Preparing..." : " "}
      </DownloadText>
    </PDFDownloadButton>
  );
}