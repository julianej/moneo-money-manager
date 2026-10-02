import styled from "styled-components";
import { useState } from "react";
import { ChevronDown } from "lucide-react";

const Card = styled.div`
  width: 100%;
  padding: 20px;
  border: 2px solid black;
  border-radius: 20px;

  ${({ $variant }) =>
    $variant === "year" &&
    `
      grid-column: 1 / -1;
    `}
`;

const CardHeader = styled.button`
  width: 100%;
  padding: 20px;
  border: none;
  background: none;
  text-align: left;
  cursor: pointer;

  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  gap: 1rem;
`;

const CardHeaderRight = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
`;

const CardTitle = styled.h2`
  margin: 0 0 4px;
  font-size: 4rem;
`;

const CardDate = styled.p`
  margin: 0;
`;

const ToggleIcon = styled(ChevronDown)`
  margin-top: 12px;
  transition: transform 0.2s ease;

  transform: ${({ $isOpen }) =>
    $isOpen ? "rotate(180deg)" : "rotate(0deg)"};
`;

const CardContent = styled.div`
  padding: 0 20px 20px;
`;

const FlexWrapperSum = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  gap: 2rem;

  p,
  strong {
    margin: 0;
  }

  strong {
    font-size: 1rem;
  }
`;

const SumWrapper = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 1rem;
`;

const YearHeader = styled.div`
  display: grid;
  grid-template-columns: 2.5fr 4fr 0.5fr;;
  align-items: center;
  gap: 2rem;
`;

const YearSum = styled.div`
  display: flex;
  flex-direction: row;
  /* grid-template-columns: auto auto; */
  gap: 2rem;
  margin: 0 2rem 0 0;
  font-size: 1rem;
`;

const ToggleButton = styled.button`
  border: none;
  background: none;
  padding: 0;
  cursor: pointer;
`;

const ChartArea = styled.div`
  padding: 20px;
  margin-top: 20px;
  border-top: 1px solid black;
`;

export default function PeriodCard({
  title,
  date,
  transactions,
  variant = "default",
}) {
  const [isOpen, setIsOpen] = useState(false);

  const isYear = variant === "year";

  const income = transactions
    .filter((transaction) => transaction.type === "income")
    .reduce(
      (sum, transaction) => sum + Math.abs(transaction.amount),
      0
    );

  const expenses = transactions
    .filter((transaction) => transaction.type === "expense")
    .reduce(
      (sum, transaction) => sum + Math.abs(transaction.amount),
      0
    );

  return (
    <Card $variant={variant}>
      {isYear ? (
        <>
          <YearHeader>
            <CardTitle>
              {title} {date}
            </CardTitle>

            <YearSum>
              <FlexWrapperSum>
                <p>Income</p>
                <strong>{income.toFixed(2)} €</strong>
              </FlexWrapperSum>

              <FlexWrapperSum>
                <p>Expenses</p>
                <strong>{expenses.toFixed(2)} €</strong>
              </FlexWrapperSum>
            </YearSum>

            <ToggleButton
              type="button"
              onClick={() => setIsOpen((current) => !current)}
              aria-expanded={isOpen}
            >
              <ToggleIcon $isOpen={isOpen} size={24} />
            </ToggleButton>
          </YearHeader>

          {isOpen && (
            <ChartArea>
              {/* Charts will go here later */}
              Charts
            </ChartArea>
          )}
        </>
      ) : (
        <>
          <CardHeader
            type="button"
            onClick={() => setIsOpen((current) => !current)}
            aria-expanded={isOpen}
          >
            <CardTitle>{title}</CardTitle>

            <CardHeaderRight>
              <CardDate>{date}</CardDate>

              <ToggleIcon $isOpen={isOpen} size={24} />
            </CardHeaderRight>
          </CardHeader>

          {isOpen && (
            <CardContent>
              <SumWrapper>
                <div>
                  <p>Income</p>
                  <strong>{income.toFixed(2)} €</strong>
                </div>

                <div>
                  <p>Expenses</p>
                  <strong>{expenses.toFixed(2)} €</strong>
                </div>
              </SumWrapper>

              <p>{transactions.length} transactions</p>
            </CardContent>
          )}
        </>
      )}
    </Card>
  );
}