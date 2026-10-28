import styled from "styled-components";


const Card = styled.div`
  /* flex: 1; */
  min-width: 0;
  font-family: "IBM Plex Mono", monospace;
  padding: 2rem;
  border-radius: 1rem;
  border: 0.125rem solid #000;

  background: ${({ variant }) =>
    variant === "current" ? "#000" : "#fff"};

  color: ${({ variant }) =>
    variant === "current" ? "#fff" : "#000"};
`;

const UpgradeCard = styled(Card)`
  flex: 2;
`;

const Label = styled.p`
  margin: 0 0 0.5rem;
  font-size: 0.8rem;
  text-transform: uppercase;
  letter-spacing: 0.08em;
`;

const AccountCount = styled.p`
  margin: 0;
  font-size: 8rem;
  font-weight: 600;
`;

const PlanName = styled.p`
  margin: 0.5rem 0 0;
`;

const Heading = styled.h2`
  margin: 0 0 0.5rem;
  font-size: clamp(1.2rem, 3vw, 1.7rem);
`;

const UpgradeButton = styled.button`
  padding: 0.7rem 1.2rem;
  border: none;
  border-radius: 0.5rem;
  background: #000;
  color: white;
  cursor: pointer;

  &:hover {
    opacity: 0.8;
  }
`;

const GetStartedButton = styled.button`
  /* display: none; */
  width: 98%;
  padding: 0.875rem 1rem;
  margin: 0 auto;
  border: 1px solid grey;
  border-radius: 2rem;
  background: black;
  color: grey;

  @media (min-width: 740px) {
    display: block;
    width: 40%;
    padding: 0.875rem 1rem;
    margin: 1.5rem auto;

    font: inherit;
    font-weight: 100;
    cursor: pointer;

    &:hover {
      background: white;
      color: black;
    }
  }
`;

export default function PricingPlanCard({
  variant = "current",
  onUpgrade, 
  onGetStarted
}) {

  return (
<>
      {variant === "current" && (
        <Card variant="current">
          <Label>Accounts Free Plan</Label>
           <PlanName>
            3x Manual Bank
          </PlanName>
          <AccountCount>
            ---
          </AccountCount>
            <GetStartedButton onClick={onGetStarted}>
              Get Started
            </GetStartedButton>
        </Card>
      )}

      {variant === "upgrade" && (
        <UpgradeCard variant="upgrade">
          <Label>Upgrade Your Plan</Label>

           <Heading>
            Need more bank accounts? <br></br>Upgrade your plan.
          </Heading>

          <UpgradeButton
            type="button"
            onClick={onUpgrade}
          >
            Upgrade Plan
          </UpgradeButton>
        </UpgradeCard>
      )}

      {variant === "referral" && (
        <Card variant="referral">
          <Label>Tell a friend</Label>

          <Heading>
            Share an Account.<br></br> Get 20% Discount.
          </Heading>

          <UpgradeButton
            type="button"
            onClick={onUpgrade}
          >
            Upgrade Plan
          </UpgradeButton>
        </Card>
      )}
      </>
  );
}