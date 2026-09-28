import { PDFDownloadLink } from "@react-pdf/renderer";
import { Download } from "lucide-react";
import styled from "styled-components";

import MoneyManagerReport from "./MoneyManagerReport";

const DownloadIconButton = styled.button`
  display: flex;
  align-items: center;
  gap: 8px;
`;

export default function DownloadButton() {
  return (
    <PDFDownloadLink
      document={<MoneyManagerReport />}
      fileName="money-manager-report.pdf"
    >
      {({ loading }) => (
        <DownloadIconButton type="button">
          <Download size={16} />
          {loading ? "Preparing document..." : "Download PDF"}
        </DownloadIconButton>
      )}
    </PDFDownloadLink>
  );
}
