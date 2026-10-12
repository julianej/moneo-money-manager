
import { useMemo, useState } from "react";
import styled from "styled-components";

const MONTHS = [
  "Jan", "Feb", "Mar", "Apr",
  "May", "Jun", "Jul", "Aug",
  "Sep", "Oct", "Nov", "Dec",
];

const demoTransactions = [
  // January
  { category: "Housing", amount: -950, date: "2026-01-01", type: "expense" },
  { category: "Food & Groceries", amount: -320, date: "2026-01-12", type: "expense" },
  { category: "Transport", amount: -85, date: "2026-01-20", type: "expense" },
  { category: "Entertainment", amount: -140, date: "2026-01-25", type: "expense" },
  { category: "Health", amount: -45, date: "2026-01-14", type: "expense" },
  { category: "Shopping", amount: -210, date: "2026-01-18", type: "expense" },

  // February
  { category: "Housing", amount: -950, date: "2026-02-01", type: "expense" },
  { category: "Food & Groceries", amount: -280, date: "2026-02-08", type: "expense" },
  { category: "Transport", amount: -120, date: "2026-02-17", type: "expense" },
  { category: "Entertainment", amount: -90, date: "2026-02-19", type: "expense" },
  { category: "Health", amount: -60, date: "2026-02-11", type: "expense" },
  { category: "Shopping", amount: -160, date: "2026-02-22", type: "expense" },

  // March
  { category: "Housing", amount: -950, date: "2026-03-01", type: "expense" },
  { category: "Food & Groceries", amount: -390, date: "2026-03-15", type: "expense" },
  { category: "Transport", amount: -65, date: "2026-03-21", type: "expense" },
  { category: "Entertainment", amount: -175, date: "2026-03-18", type: "expense" },
  { category: "Health", amount: -75, date: "2026-03-10", type: "expense" },
  { category: "Shopping", amount: -320, date: "2026-03-24", type: "expense" },

  // April
  { category: "Housing", amount: -950, date: "2026-04-01", type: "expense" },
  { category: "Food & Groceries", amount: -340, date: "2026-04-09", type: "expense" },
  { category: "Transport", amount: -95, date: "2026-04-16", type: "expense" },
  { category: "Entertainment", amount: -110, date: "2026-04-22", type: "expense" },
  { category: "Health", amount: -35, date: "2026-04-12", type: "expense" },
  { category: "Shopping", amount: -180, date: "2026-04-25", type: "expense" },

  // May
  { category: "Housing", amount: -950, date: "2026-05-01", type: "expense" },
  { category: "Food & Groceries", amount: -365, date: "2026-05-13", type: "expense" },
  { category: "Transport", amount: -75, date: "2026-05-19", type: "expense" },
  { category: "Entertainment", amount: -220, date: "2026-05-23", type: "expense" },
  { category: "Health", amount: -90, date: "2026-05-08", type: "expense" },
  { category: "Shopping", amount: -250, date: "2026-05-27", type: "expense" },

  // June
  { category: "Housing", amount: -950, date: "2026-06-01", type: "expense" },
  { category: "Food & Groceries", amount: -310, date: "2026-06-11", type: "expense" },
  { category: "Transport", amount: -130, date: "2026-06-17", type: "expense" },
  { category: "Entertainment", amount: -280, date: "2026-06-21", type: "expense" },
  { category: "Health", amount: -50, date: "2026-06-09", type: "expense" },
  { category: "Shopping", amount: -190, date: "2026-06-25", type: "expense" },

  // July
  { category: "Housing", amount: -950, date: "2026-07-01", type: "expense" },
  { category: "Food & Groceries", amount: -400, date: "2026-07-14", type: "expense" },
  { category: "Transport", amount: -105, date: "2026-07-18", type: "expense" },
  { category: "Entertainment", amount: -350, date: "2026-07-22", type: "expense" },
  { category: "Health", amount: -40, date: "2026-07-07", type: "expense" },
  { category: "Shopping", amount: -420, date: "2026-07-26", type: "expense" },

  // August
  { category: "Housing", amount: -950, date: "2026-08-01", type: "expense" },
  { category: "Food & Groceries", amount: -375, date: "2026-08-12", type: "expense" },
  { category: "Transport", amount: -80, date: "2026-08-20", type: "expense" },
  { category: "Entertainment", amount: -190, date: "2026-08-24", type: "expense" },
  { category: "Health", amount: -65, date: "2026-08-06", type: "expense" },
  { category: "Shopping", amount: -230, date: "2026-08-28", type: "expense" },

  // September
  { category: "Housing", amount: -950, date: "2026-09-01", type: "expense" },
  { category: "Food & Groceries", amount: -330, date: "2026-09-10", type: "expense" },
  { category: "Transport", amount: -115, date: "2026-09-16", type: "expense" },
  { category: "Entertainment", amount: -125, date: "2026-09-19", type: "expense" },
  { category: "Health", amount: -80, date: "2026-09-08", type: "expense" },
  { category: "Shopping", amount: -175, date: "2026-09-23", type: "expense" },

  // October
  { category: "Housing", amount: -950, date: "2026-10-01", type: "expense" },
  { category: "Food & Groceries", amount: -385, date: "2026-10-13", type: "expense" },
  { category: "Transport", amount: -90, date: "2026-10-17", type: "expense" },
  { category: "Entertainment", amount: -160, date: "2026-10-21", type: "expense" },
  { category: "Health", amount: -55, date: "2026-10-06", type: "expense" },
  { category: "Shopping", amount: -290, date: "2026-10-25", type: "expense" },

  // November
  { category: "Housing", amount: -950, date: "2026-11-01", type: "expense" },
  { category: "Food & Groceries", amount: -360, date: "2026-11-11", type: "expense" },
  { category: "Transport", amount: -100, date: "2026-11-18", type: "expense" },
  { category: "Entertainment", amount: -210, date: "2026-11-22", type: "expense" },
  { category: "Health", amount: -70, date: "2026-11-09", type: "expense" },
  { category: "Shopping", amount: -480, date: "2026-11-27", type: "expense" },

  // December
  { category: "Housing", amount: -950, date: "2026-12-01", type: "expense" },
  { category: "Food & Groceries", amount: -430, date: "2026-12-14", type: "expense" },
  { category: "Transport", amount: -140, date: "2026-12-18", type: "expense" },
  { category: "Entertainment", amount: -320, date: "2026-12-20", type: "expense" },
  { category: "Health", amount: -95, date: "2026-12-08", type: "expense" },
  { category: "Shopping", amount: -650, date: "2026-12-23", type: "expense" },
];

const currencyFormatter = new Intl.NumberFormat("de-DE", {
  style: "currency",
  currency: "EUR",
  maximumFractionDigits: 0,
});

export default function CategoryHeatmap({
  transactions = demoTransactions,
  year = 2026,
}) {
  const [selectedCell, setSelectedCell] = useState(null);

  // Aggregate expenses by category and month.
  const heatmapData = useMemo(() => {
    const categories = new Map();

    transactions.forEach((transaction) => {
      const date = new Date(transaction.date);
      const amount = Number(transaction.amount);

      if (
        !Number.isFinite(amount) ||
        Number.isNaN(date.getTime()) ||
        date.getFullYear() !== year
      ) {
        return;
      }

      // Exclude income transactions.
      if (
        transaction.type === "income" ||
        (transaction.type !== "expense" && amount >= 0)
      ) {
        return;
      }

      const category =
        transaction.category?.trim() || "Uncategorized";

      if (!categories.has(category)) {
        categories.set(category, Array(12).fill(0));
      }

      categories.get(category)[date.getMonth()] +=
        Math.abs(amount);
    });

    return Array.from(categories, ([category, months]) => ({
      category,
      months,
      total: months.reduce((sum, amount) => sum + amount, 0),
    })).sort((a, b) => b.total - a.total);
  }, [transactions, year]);

  const maxAmount = Math.max(
    0,
    ...heatmapData.flatMap((item) => item.months)
  );

  function getIntensity(amount) {
    if (amount === 0 || maxAmount === 0) return 0;

    return Math.ceil((amount / maxAmount) * 4);
  }

  return (
    <HeatmapSection>
      <Header>
        <div>
          <Eyebrow>[ MONEO / ANALYTICS ]</Eyebrow>
          <h2>Spending patterns</h2>
          <p>Explore your expenses by category and month.</p>
        </div>

        <YearLabel>{year}</YearLabel>
      </Header>

      {heatmapData.length === 0 ? (
        <EmptyState>
          No expense data available for {year}.
        </EmptyState>
      ) : (
        <>
          <HeatmapScroll>
            <HeatmapGrid>
              <CategoryLabel />

              {MONTHS.map((month) => (
                <MonthLabel key={month}>
                  {month}
                </MonthLabel>
              ))}

              {heatmapData.map((item) => (
                <RowContents key={item.category}>
                  <CategoryName title={item.category}>
                    {item.category}
                  </CategoryName>

                  {item.months.map((amount, monthIndex) => (
                    <HeatCell
                      key={`${item.category}-${monthIndex}`}
                      $intensity={getIntensity(amount)}
                      $selected={
                        selectedCell?.category === item.category &&
                        selectedCell?.monthIndex === monthIndex
                      }
                      type="button"
                      title={`${item.category}, ${MONTHS[monthIndex]}: ${currencyFormatter.format(amount)}`}
                      aria-label={`${item.category}, ${MONTHS[monthIndex]}, ${currencyFormatter.format(amount)}`}
                      aria-pressed={
                        selectedCell?.category === item.category &&
                        selectedCell?.monthIndex === monthIndex
                      }
                      onClick={() =>
                        setSelectedCell({
                          category: item.category,
                          monthIndex,
                          amount,
                        })
                      }
                    />
                  ))}
                </RowContents>
              ))}
            </HeatmapGrid>
          </HeatmapScroll>

          <Legend>
            <span>Less</span>
            {[0, 1, 2, 3, 4].map((level) => (
              <LegendCell key={level} $intensity={level} />
            ))}
            <span>More</span>
          </Legend>

          {selectedCell && (
            <CellDetails aria-live="polite">
              <div>
                <DetailLabel>SELECTED CATEGORY</DetailLabel>
                <strong>{selectedCell.category}</strong>
              </div>

              <div>
                <DetailLabel>MONTH</DetailLabel>
                <strong>
                  {MONTHS[selectedCell.monthIndex]} {year}
                </strong>
              </div>

              <div>
                <DetailLabel>TOTAL SPENT</DetailLabel>
                <strong>
                  {currencyFormatter.format(selectedCell.amount)}
                </strong>
              </div>
            </CellDetails>
          )}
        </>
      )}
    </HeatmapSection>
  );
}

const HeatmapSection = styled.section`
  width: 100%;
  padding: 1.5rem 0;
  color: #111;
  padding: 6rem 5.5%;
  background: #fff;
  color: #111;
  scroll-margin-top: 5rem;
`;

const Header = styled.div`
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 1rem;
  margin-bottom: 2rem;

  h2 {
    margin: 0.5rem 0;
    font-family: "IBM Plex Mono", monospace;
    font-size: 1.25rem;
  }

  p {
    margin: 0;
    color: #666;
    font-size: 0.875rem;
  }
`;

const Eyebrow = styled.p`
  font-family: "IBM Plex Mono", monospace;
  font-size: 0.7rem;
  letter-spacing: 0.04em;
`;

const YearLabel = styled.span`
  font-family: "IBM Plex Mono", monospace;
  font-size: 0.875rem;
`;

const HeatmapScroll = styled.div`
  width: 100%;
  overflow-x: auto;
  padding-bottom: 0.5rem;
`;

const HeatmapGrid = styled.div`
  display: grid;
  grid-template-columns: 130px repeat(12, minmax(30px, 1fr));
  gap: 5px;
  min-width: 550px;
`;

const CategoryLabel = styled.div`
  grid-column: 1;
`;

const MonthLabel = styled.span`
  padding-bottom: 0.5rem;
  color: #666;
  font-family: "IBM Plex Mono", monospace;
  font-size: 0.7rem;
  text-align: center;
`;

const RowContents = styled.div`
  display: contents;
`;

const CategoryName = styled.span`
  overflow: hidden;
  align-self: center;
  font-size: 0.8rem;
  text-overflow: ellipsis;
  white-space: nowrap;
`;

const HeatCell = styled.button`
  width: 100%;
  min-width: 0;
  height: 30px;
  padding: 0;
  border: 1px solid
    ${({ $selected }) => ($selected ? "#000" : "transparent")};
  border-radius: 3px;
  background: ${({ $intensity }) =>
    ["#f1f1f1", "#d4d4d4", "#a0a0a0", "#626262", "#202020"][
      $intensity
    ]};
  cursor: pointer;
  transition:
    opacity 0.15s ease,
    transform 0.15s ease;

  &:hover {
    opacity: 0.75;
    transform: scale(1.06);
  }

  &:focus-visible {
    outline: 2px solid #000;
    outline-offset: 2px;
  }
`;

const Legend = styled.div`
  display: flex;
  justify-content: flex-end;
  align-items: center;
  gap: 5px;
  margin-top: 1.25rem;
  color: #666;
  font-family: "IBM Plex Mono", monospace;
  font-size: 0.7rem;
`;

const LegendCell = styled.span`
  width: 14px;
  height: 14px;
  border-radius: 2px;
  background: ${({ $intensity }) =>
    ["#f1f1f1", "#d4d4d4", "#a0a0a0", "#626262", "#202020"][
      $intensity
    ]};
`;

const CellDetails = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 1.5rem;
  margin-top: 1.5rem;
  padding: 1rem;
  border: 1px solid #ddd;
  border-radius: 6px;

  > div {
    display: flex;
    flex-direction: column;
    gap: 0.4rem;
  }

  strong {
    font-family: "IBM Plex Mono", monospace;
    font-size: 0.875rem;
  }
`;

const DetailLabel = styled.span`
  color: #666;
  font-family: "IBM Plex Mono", monospace;
  font-size: 0.65rem;
`;

const EmptyState = styled.p`
  padding: 2rem 1rem;
  border: 1px dashed #ccc;
  color: #666;
  text-align: center;
`;
