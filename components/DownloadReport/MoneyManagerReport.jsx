import {Document, Page, Text, StyleSheet,} from "@react-pdf/renderer";

const styles = StyleSheet.create({
  page: {
    padding: 48,
    fontSize: 11,
    lineHeight: 1.6,
    color: "#3f3f46",
  },

  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    borderBottomWidth: 1,
    borderBottomColor: "#e4e4e7",
    paddingBottom: 12,
  },

  title: {
    fontSize: 26,
    color: "#18181b",
    marginTop: 40,
    paddingBottom: 16,
    borderBottomWidth: 3,
    borderBottomColor: "#e0301e",
  },

  paragraph: {
    marginTop: 20,
  },
});

export default function MoneyManagerReport() {
  return (
    <Document
      title="Money Manager Report"
      author="Juli's Money Manager"
    >
      <Page size="A4" style={styles.page}>

        <Text style={styles.title}>
          Juli's Money Manager
        </Text>

        <Text style={styles.paragraph}>
          Transaction Report
        </Text>

      </Page>
    </Document>
  );
}