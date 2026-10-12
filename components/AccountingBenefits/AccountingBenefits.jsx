
import styled from "styled-components";

const BenefitsSection = styled.section`
  padding: 6rem 5.5%;
  background: #fff;
  color: #111;
  scroll-margin-top: 5rem;
`;


const BenefitNumber = styled.span`
  font-family: "IBM Plex Mono", monospace;
  font-size: 0.875rem;
  font-weight: 500;
  opacity: 0.6;
  font-variant-numeric: tabular-nums;
`;

const SectionLabel = styled.p`
  display: flex;
  align-items: center;
  gap: 0.75rem;
  margin-bottom: 2rem;
  font-size: 0.8rem;
  letter-spacing: 0.12em;
  text-transform: uppercase;

  &::before {
    content: "";
    width: 42px;
    height: 1px;
    background: currentColor;
  }
`;

// const SectionTitle = styled.h2`
//  max-width: 800px;
//   margin: 0 0 1.5rem;
//   font-size: clamp(2.5rem, 6vw, 5rem);
//   line-height: 1.05;
//   font-weight: 500;
//   letter-spacing: -0.04em;
// `;

const Intro = styled.p`
  max-width: 580px;
  margin-bottom: 4rem;
  font-size: 1.1rem;
  line-height: 1.8;
  color: #444;
  font-family: "IBM Plex Mono";
`;

const BenefitsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 4rem 3rem;

  @media (max-width: 900px) {
    grid-template-columns: repeat(2, minmax(0, 1fr));
    gap: 3rem 2rem;
  }

  @media (max-width: 540px) {
    grid-template-columns: 1fr;
    gap: 2.5rem;
  }
`;

const BenefitCard = styled.article`
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: 1rem;

  svg {
    width: 42px;
    height: 42px;
    stroke-width: 1.5;
    margin-bottom: 0.5rem;
  }

  h3 {
    margin: 0;
    font-size: 1.25rem;
    font-weight: 500;
  }

  p {
    max-width: 320px;
    margin: 0;
    color: #555;
    line-height: 1.8;
  }
`;

const SectionFooter = styled.p`
  margin-top: 4rem;
  padding-top: 1.5rem;
  border-top: 1px solid #ddd;
  font-size: 0.75rem;
  letter-spacing: 0.1em;
  text-transform: uppercase;
`;


const benefits = [
  {
    number: "01",
    title: "Clear Overview",
    description:
      "See your income, expenses and balance at a glance. Always up to date, always in control.",
  },
  {
    number: "02",
    title: "Secure & Private",
    description:
      "Keep your financial information organized in one place with privacy in mind.",
  },
  {
    number: "03",
    title: "Save Time",
    description:
      "Organize transactions and generate reports with less manual work.",
  },
  {
    number: "04",
    title: "Access Anywhere",
    description:
      "Access your financial overview on your devices, wherever you manage your money.",
  },
  {
    number: "05",
    title: "Reach Your Goals",
    description:
      "Understand your spending habits and make informed decisions for your financial future.",
  },
  {
    number: "06",
    title: "Minimal & Focused",
    description:
      "No unnecessary complexity. Just the tools you need to manage your everyday finances.",
  },
];


export default function Benefits() {
  return (
    <BenefitsSection id="benefits">
      <SectionLabel>Benefits</SectionLabel>
{/* 
      <SectionTitle>
        Take Control
        <br />
        of Your Finances
      </SectionTitle> */}

      <Intro>
        MONEO helps you organize your money, save time
        and make better financial decisions. Simple,
        focused and built for everyday life.
      </Intro>

      <BenefitsGrid>
       {benefits.map(({ number, title, description }) => (
            <BenefitCard key={number}>
                <BenefitNumber>{number}</BenefitNumber>
                <h3>{title}</h3>
                <p>{description}</p>
            </BenefitCard>
        ))}
      </BenefitsGrid>

      <SectionFooter>
        MONEO. For a brighter future.
      </SectionFooter>
    </BenefitsSection>
  );
}
