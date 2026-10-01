import {
  Document,
  Page,
  Text,
  View,
  StyleSheet,
  Font
} from "@react-pdf/renderer";


Font.register({
  family: "Silkscreen",
  src: "/lib/fonts/Silkscreen-Regular.ttf",
});

const styles = StyleSheet.create({
  page: {
    padding: 48,
    fontFamily: "Helvetica",
    fontSize: 11,
  },

  title: {
    fontFamily: "Silkscreen",
    fontSize: 50,
    marginBottom: 40,
  },

  transaction: {
  flexDirection: "row",
  justifyContent: "space-between",
  paddingVertical: 10,
  borderBottomWidth: 1,
  borderBottomColor: "#eeeeee",
},

transactionInfo: {
  flex: 1,
},

transactionTitle: {
  fontSize: 11,
  marginBottom: 3,
},

transactionDate: {
  fontSize: 9,
  color: "#666666",
},

accountSection: {
  marginBottom: 24,
  paddingVertical: 16,
  borderBottomWidth: 1,
  borderBottomColor: "#eeeeee",
},

accountBank: {
  fontSize: 12,
  fontWeight: "bold",
  marginBottom: 4,
},

accountName: {
  fontSize: 10,
  marginBottom: 8,
},

amount: {
  fontSize: 11,
  marginLeft: 20,
},

summary: {
  marginBottom: 24,
  paddingVertical: 20,
  borderBottomWidth: 1,
  borderBottomColor: "#eeeeee",
},

balance: {
  alignItems: "center",
  marginBottom: 24,
},

balanceAmount: {
  fontSize: 23,
  fontWeight: "bold",
  marginTop: 4,
},

balancePositive: {
  color: "#000",
},

balanceNeutral: {
  color: "#000000",
},

balanceNegative: {
  color: "#d00000",
},

incomeExpenses: {
  flexDirection: "row",
  justifyContent: "center",
},

summaryItem: {
  width: 140,
  alignItems: "center",
},

summaryLabel: {
  fontSize: 9,
  color: "#666666",
  marginBottom: 4,
},

expensesAmount: {
  color: "#cf0404",
},
});

export default function MoneyManagerReport({
  transactions = [], 
  categories = [],
  selectedAccount,
}) {

  // =========================
  // CALCULATE TOTALS
  // =========================

  const totalIncome = transactions
    .filter((transaction) => transaction.type === "income"
    )
    .reduce((sum, transaction) =>
        sum + Number(transaction.amount || 0), 
    0 // initialValue
    );

  const totalExpenses = transactions
    .filter(
      (transaction) => transaction.type === "expense"
    )
    .reduce(
      // (accumulator, currentValue)
      (sum, transaction) =>
        sum + Math.abs(Number(transaction.amount || 0)),
      0 // initialValue
    );

  const balance = totalIncome - totalExpenses;


  // =========================
  // PDF
  // =========================

  return (
    <Document>
      <Page
        size="A4"
        style={styles.page}
      >

        <Text style={styles.title}>Money Manager</Text>

     <View style={styles.summary}>
        {/* BALANCE */}
        <View style={styles.balance}>
          <Text style={styles.summaryLabel}>
            Balance
          </Text>

          <Text
            style={[
              styles.balanceAmount,
                balance > 0
                  ? styles.balancePositive
                  : balance < 0
                  ? styles.balanceNegative
                  : styles.balanceNeutral
                   ]}
               >
            {balance.toFixed(2)} €
          </Text>
        </View>

         {/* INCOME + EXPENSES */}
        <View style={styles.incomeExpenses}>
          <View style={styles.summaryItem}>
            <Text style={styles.summaryLabel}>
              Income
            </Text>

            <Text style={styles.incomeAmount}>
              {totalIncome.toFixed(2)} €
            </Text>
          </View>

          <View style={styles.summaryItem}>
            <Text style={styles.summaryLabel}>
              Expenses
            </Text>

            <Text style={styles.expensesAmount}>
             {/* // VALUE */}
              {(-totalExpenses).toFixed(2)} €
            </Text>
          </View>
        </View>
      </View>

        {/* ACCOUNT */}
        {selectedAccount ? (
          <View style={styles.accountSection}>
            <Text>Bankname: {account.bank}</Text>
            <Text>Accountname: {account.name}</Text>
            <Text>IBAN: {account.iban}</Text>
            <Text>BIC: {account.bic}</Text>
          </View>
        ) : (
          null
        )}

        {/* TRANSACTIONS */}
        {transactions.map((transaction) => (
          <View
            key={transaction._id}
            style={styles.transaction}
          >
            <View style={styles.transactionInfo}>
              <Text style={styles.transactionTitle}>
                {transaction.title}
              </Text>

              <Text style={styles.transactionDate}>
                {categories?.find(
                    (category) =>
                      String(category._id) === String(transaction.category)
                  )?.category || "No category"}
                  {" · "}
                {transaction.date
                  ? new Date(transaction.date).toLocaleDateString("de-DE")
                  : "No date"}
              </Text>
            </View>

            <Text
              style={
                transaction.type === "income"
                  ? styles.incomeAmount
                  : styles.expensesAmount
              }
            >
              {Number(transaction.amount || 0).toFixed(2)} €
            </Text>
          </View>
        ))}

      </Page>
    </Document>
  );
}