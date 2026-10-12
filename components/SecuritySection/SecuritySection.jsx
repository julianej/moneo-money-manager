import styled from "styled-components";

export default function SecuritySection() {
  return (
    <Section id="security">
      <SecurityHeader>
        <Eyebrow>MONEO / SECURITY & PRIVACY</Eyebrow>
        <Description>
          Financial clarity starts with trust. MONEO is designed to help
          you organize your financial information with transparency,
          control, and privacy in mind.
        </Description>
      </SecurityHeader>

      {/* <SecurityGrid>
        <SecurityCard>
          <Number>01 / PRIVACY</Number>
          <h3>Your data matters.</h3>
          <p>
            Your financial information is personal. MONEO aims to keep
            privacy at the center of the product experience.
          </p>
        </SecurityCard>

        <SecurityCard>
          <Number>02 / ACCESS</Number>
          <h3>Account-based access.</h3>
          <p>
            Access to personal financial information should be limited
            to authorized users through appropriate authentication
            and access controls.
          </p>
        </SecurityCard>

        <SecurityCard>
          <Number>03 / TRANSPARENCY</Number>
          <h3>Know what you share.</h3>
          <p>
            As MONEO evolves, data handling and connected services
            should be clearly explained so you can make informed
            decisions.
          </p>
        </SecurityCard>
      </SecurityGrid> */}
    </Section>
  );
}

const Section = styled.section`
    padding: 8rem 5vw;
    scroll-margin-top: 5rem;
    background-color: white;
    border-top: 0.5rem solid black;
    border-radius: 2rem;
    margin: 0 1rem;
`;

const SecurityHeader = styled.div`
  max-width: 760px;
  margin-bottom: 4rem;

  h2 {
    font-family: "IBM Plex Mono", monospace;
    font-size: clamp(2.5rem, 6vw, 5rem);
    line-height: 1.05;
    letter-spacing: -0.06em;
    margin: 1.5rem 0;
  }
`;

const Eyebrow = styled.p`
  font-family: "IBM Plex Mono", monospace;
  font-size: 0.75rem;
  letter-spacing: 0.08em;
  text-transform: uppercase;
`;

const Description = styled.p`
  max-width: 580px;
  font-size: 1.1rem;
  line-height: 1.7;
`;

const SecurityGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 1rem;

  @media (max-width: 740px) {
    grid-template-columns: 1fr;
  }
`;

const SecurityCard = styled.article`
  border: 1px solid #d8d8d8;
  padding: 1.75rem;
  min-height: 220px;

  h3 {
    font-family: "IBM Plex Mono", monospace;
    font-size: 1.15rem;
    margin: 2.5rem 0 1rem;
  }

  p {
    font-size: 0.95rem;
    line-height: 1.7;
    color: #555;
  }
`;

const Number = styled.p`
  font-family: "IBM Plex Mono", monospace;
  font-size: 0.7rem;
  letter-spacing: 0.05em;
`;
