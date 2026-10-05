import styled from "styled-components";


const Card = styled.div`
  flex: 1;
  min-width: 0;

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
  font-size: 2rem;
  font-weight: 600;
`;

const PlanName = styled.p`
  margin: 0.5rem 0 0;
`;

const Text = styled.p`
  margin: 0 0 1.5rem;
  line-height: 1.4;
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

export default function PricingPlanCard({
  variant = "current",
  onUpgrade,
}) {
  return (
<>
      {variant === "current" && (
        <Card variant="current">
          <Label>Bank Accounts</Label>

          <AccountCount>
            1 / 1
          </AccountCount>

          <PlanName>
            Free Plan
          </PlanName>
        </Card>
      )}

      {variant === "upgrade" && (
        <UpgradeCard variant="upgrade">
          <Label>Upgrade Your Plan</Label>

          <Text>
            Need more bank accounts? Upgrade your plan.
          </Text>

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

          <Text>
            Get 20% Discount.
          </Text>

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