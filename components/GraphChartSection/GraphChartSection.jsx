
import { useState } from "react";
import styled from "styled-components";
import CategoryHeatmap from "@/components/CategoryHeatmap/CategoryHeatmap";

const tabs = [
  { id: "overview", label: "Overview" },
  { id: "categories", label: "Categories" },
  { id: "monthly", label: "Monthly Spending" },
  { id: "income", label: "Income vs. Expenses" },
];

export default function GraphSection() {
  const [activeTab, setActiveTab] = useState("overview");

  return (
    <Section id="graphs">
      <GraphLayout>
        {/* RIGHT COLUMN: Tabs + Graph */}
        <GraphColumn>
          <TabNavigation
            role="tablist"
            aria-label="Financial visualizations"
          >
            {tabs.map((tab) => (
              <Tab
                key={tab.id}
                id={`tab-${tab.id}`}
                type="button"
                role="tab"
                aria-selected={activeTab === tab.id}
                aria-controls={`panel-${tab.id}`}
                $active={activeTab === tab.id}
                onClick={() => setActiveTab(tab.id)}
              >
                {tab.label}
              </Tab>
            ))}
          </TabNavigation>

          <GraphPanel
            id={`panel-${activeTab}`}
            role="tabpanel"
            aria-labelledby={`tab-${activeTab}`}
          >
            {activeTab === "overview" && <CategoryHeatmap />}

            {activeTab === "categories" && (
              <Placeholder>
                <h3>Spending by category</h3>
                <p>
                  Compare your spending across different categories.
                </p>
              </Placeholder>
            )}

            {activeTab === "monthly" && (
              <Placeholder>
                <h3>Monthly spending</h3>
                <p>
                  Explore how your expenses change throughout the year.
                </p>
              </Placeholder>
            )}

            {activeTab === "income" && (
              <Placeholder>
                <h3>Income vs. expenses</h3>
                <p>
                  Compare income with outgoing expenses.
                </p>
              </Placeholder>
            )}
          </GraphPanel>
         {/* LEFT COLUMN: Text */}
        </GraphColumn>
         <TextColumn>
          <Eyebrow>MONEO / ANALYTICS</Eyebrow>

          <h2>Your finances, visualized.</h2>
            <GraphTextDescription>
              Explore your financial overview with clear, interactive visualizations.
            </GraphTextDescription>
        </TextColumn>
      </GraphLayout>
    </Section>
  );
}

const Section = styled.section`
  margin: 0 auto;
  padding: 5rem 5rem;
  @media (max-width: 740px) {
    padding: 3rem 1rem;
  }
`;

const GraphLayout = styled.div`
  display: grid;
  grid-template-columns: minmax(50%, 0.8fr) minmax(0, 1.6fr);
  gap: 4rem;
  align-items: start;
  max-width: 1440px;
  margin: 0 auto;

  @media (max-width: 900px) {
    grid-template-columns: minmax(180px, 0.7fr) minmax(0, 1.3fr);
    gap: 2rem;
  }

  @media (max-width: 740px) {
    grid-template-columns: minmax(0, 1fr);
    gap: 2rem;
  }
`;

const GraphTextDescription = styled.span`
  display: block;
  margin-top: 1rem;
  font-size: 4rem;
  font-weight: 400;
  line-height: 4rem;

  @media (max-width: 740px) {
    font-size: 0.9rem;
  }
`;

const TextColumn = styled.div`
  min-width: 0;  
  align-self: center;

  h2 {
    margin: 0 0 1rem;
    font-size: clamp(2rem, 4vw, 4rem);
    line-height: 1.1;
  }

  p {
    max-width: 420px;
    line-height: 1.7;
    color: #666;
  }
`;

const GraphColumn = styled.div`
  min-width: 0;
  width: 100%;
`;

const Eyebrow = styled.span`
  font-family: "IBM Plex Mono", monospace;
  font-size: 0.75rem;
  letter-spacing: 0.08em;
`;

const TabNavigation = styled.div`
  display: flex;
  gap: 0.5rem;
  overflow-x: auto;
  border-bottom: 1px solid #ddd;
  padding-bottom: 0.75rem;
`;

const Tab = styled.button`
  flex-shrink: 0;
  padding: 0.8rem 1rem;

  border: 1px solid ${({ $active }) =>
    $active ? "#111" : "transparent"};

  background: ${({ $active }) => ($active ? "#111" : "transparent")};
  color: ${({ $active }) => ($active ? "#fff" : "#555")};

  font: inherit;
  font-size: 0.875rem;
  cursor: pointer;
  transition: background 0.2s ease, color 0.2s ease;

  &:hover {
    border-color: #111;
    color: ${({ $active }) => ($active ? "#fff" : "#111")};
  }

  &:focus-visible {
    outline: 2px solid #555;
    outline-offset: 3px;
  }
`;

const GraphPanel = styled.div`
  min-width: 0;
  min-height: 320px;
  padding-top: 2rem;
`;

const Placeholder = styled.div`
  min-height: 280px;
  padding: 2rem;
  border: 1px solid #e5e5e5;
  display: flex;
  flex-direction: column;
  justify-content: center;

  h3 {
    margin-top: 0;
  }

  p {
    max-width: 500px;
    color: #666;
    line-height: 1.7;
  }
`;