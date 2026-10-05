import styled from "styled-components";
import { useState } from "react";
import { ChevronDown } from "lucide-react";
import TransactionChart from "../TransactionChart/TransactionChart";

const Card = styled.div`
  width: 100%;
  padding: 1rem;
  border: 2px solid black;
  border-radius: 20px;

  ${({ $variant }) =>
    $variant === "year" &&
    ` padding: 1rem;
      grid-column: 1 / -1;
      @media (min-width: 740px) {
      padding: 2rem 2rem 2rem 3rem;}` 
    }
`;

const CardHeader = styled.button`
  width: 100%;
  padding: 0;
  border: none;
  background: none;
  text-align: left;
  cursor: pointer;

  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  gap: 1rem;

  @media (min-width: 740px) {
      padding: 2rem;}
`;

const CardHeaderRight = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
`;

const CardTitle = styled.h2`
  margin: 0 0 4px;
  font-size: 2rem;
  @media (min-width: 740px) {
      font-size: 4rem;;}
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
  /* align-items: center; */
  justify-content: space-between;
  gap: 0rem;
  padding: 0rem 0rem 0 3rem;
  font-size: 0.8rem;

  p,
  strong {
    margin: 0;
  }

   @media (min-width: 740px) {
     font-size: 1rem;
     gap: 2rem;

    strong {
    font-size: 0.8rem;
    }
   }
`;

const SumWrapper = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 1rem;
`;

const YearHeader = styled.div`
  display: grid;
  grid-template-columns: 1fr 2fr 0fr;
  align-items: center;
  justify-content: space-between;
  gap: 1rem;
  @media (min-width: 740px) {
      grid-template-columns: 2.5fr 4fr 0.5fr;
      gap: 2rem;
    }
`;

const YearSum = styled.div`
  display: flex;
  flex-direction: column;
  grid-template-columns: auto auto;
  gap: 1rem;
  margin: 0;
  font-size: 1rem;

  @media (min-width: 740px) {
     margin: 0 2rem 0 0;
     flex-direction: row;
      gap: 2rem;
     }
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
  period
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
                <TransactionChart
                    transactions={transactions}
                    period={period}
                  />
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

                <ChartArea>
                  <TransactionChart
                    transactions={transactions}
                    period={period}
                  />
                </ChartArea>
              </CardContent>
            )}
        </>
      )}
    </Card>
  );
}