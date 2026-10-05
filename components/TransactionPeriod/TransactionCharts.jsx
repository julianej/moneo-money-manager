
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
} from "recharts";

export default function TransactionChart({
  transactions = [],
  period = "month",
}) {
  const chartData = transactions.reduce((data, transaction) => {
    const date = new Date(transaction.date);
    const amount = Math.abs(Number(transaction.amount));

    let label;
    let sortDate;

    // =========================
    // DAY
    // =========================

    if (period === "day") {
      label = date.toLocaleTimeString("en-GB", {
        hour: "2-digit",
        minute: "2-digit",
      });

      // Sort by exact time
      sortDate = date.getTime();
    }

    // =========================
    // WEEK
    // =========================

    if (period === "week") {
      label = date.toLocaleDateString("en-GB", {
        weekday: "short",
        day: "2-digit",
      });

      // Monday = 0
      // Tuesday = 1
      // ...
      // Sunday = 6
      const day = date.getDay();
      sortDate = day === 0 ? 6 : day - 1;
    }

    // =========================
    // MONTH
    // =========================

    if (period === "month") {
      label = date.toLocaleDateString("en-GB", {
        day: "2-digit",
        month: "2-digit",
      });

      // Sort by actual date
      sortDate = date.getTime();
    }

    // =========================
    // YEAR
    // =========================

    if (period === "year") {
      label = date.toLocaleDateString("en-GB", {
        month: "short",
      });

      // January = 0
      // February = 1
      // ...
      // December = 11
      sortDate = date.getMonth();
    }

    // =========================
    // FIND EXISTING PERIOD
    // =========================

    const existingItem = data.find(
      (item) => item.date === label
    );

    // =========================
    // ADD TO EXISTING PERIOD
    // =========================

    if (existingItem) {
      if (transaction.type === "income") {
        existingItem.income += amount;
      }

      if (transaction.type === "expense") {
        existingItem.expenses += amount;
      }
    }

    // =========================
    // CREATE NEW PERIOD
    // =========================

    else {
      data.push({
        date: label,
        sortDate,
        income:
          transaction.type === "income"
            ? amount
            : 0,
        expenses:
          transaction.type === "expense"
            ? amount
            : 0,
      });
    }

    return data;
  }, []);

  // =========================
  // SORT CHRONOLOGICALLY
  // =========================

  chartData.sort((a, b) => a.sortDate - b.sortDate);

  // =========================
  // EMPTY STATE
  // =========================

  if (chartData.length === 0) {
    return <p>No transactions for this period.</p>;
  }

  // =========================
  // CHART
  // =========================

  return (
    <ResponsiveContainer width="100%" height={350}>
      <BarChart
        data={chartData}
        margin={{
          top: 20,
          right: 20,
          left: 0,
          bottom: 20,
        }}
      >
        <CartesianGrid strokeDasharray="3 3" />

        <XAxis dataKey="date" />

        <YAxis
          tickFormatter={(value) =>
            `${value} €`
          }
        />

        <Tooltip
          formatter={(value) =>
            `${Number(value).toFixed(2)} €`
          }
        />

        <Legend />

        <Bar
          dataKey="income"
          name="Income"
          fill="#000000"
        />

        <Bar
          dataKey="expenses"
          name="Expenses"
          fill="#777777"
        />
      </BarChart>
    </ResponsiveContainer>
  );
}

