import { pdf } from "@react-pdf/renderer";
import styled from "styled-components";
import { Download} from "lucide-react";

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

export default function DownloadButton({
  transactions = [],
  categories = [],
  account,
  setPdfLoading,
  selectedType = "all"
}) {

  async function handleDownload() {

    const filterName =
      selectedType === "all"
        ? "all"
        : selectedType.toLowerCase();

    const fileName = `money-manager-${filterName}.pdf`;

    setPdfLoading(true);

    // set TimeOut
    const startTime = Date.now();

    // Give React one frame to render the loading overlay
    await new Promise((resolve) => requestAnimationFrame(resolve));


    try {
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

      URL.revokeObjectURL(url);

    } catch (error) {
    } finally {
    const elapsed = Date.now() - startTime;
    const remaining = Math.max(0, 800 - elapsed);

    setTimeout(() => {
      setPdfLoading(false);
    }, remaining);
  }
}

  return (
    <PDFDownloadButton
      type="button"
      onClick={handleDownload}
    > 
      <DownloadIcon>
        <Download size={18} />
        
      </DownloadIcon>
    </PDFDownloadButton>
  );
}