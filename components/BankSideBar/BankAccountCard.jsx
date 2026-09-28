import styled from "styled-components";

const AccountCard = styled.button`
  width: 100%;
  padding: 1rem;

  border: 2px solid #000;
  border-radius: 1rem;

  background: #fff;
  color: #000;

  text-align: left;
  font: inherit;

  cursor: pointer;

  ${({ $selected }) =>
    $selected &&
    `
      background: #000;
      color: #fff;
      border: 2px solid #4f4f4f;;
    `}

  &:disabled {
    cursor: not-allowed;
      background: grey;
      color: black
  }
`;

const EditButton = styled.button`
  display: flex;
  align-items: center;
  justify-content: center;

  width: 32px;
  height: 32px;
  padding: 0;

  border: 1px solid currentColor;
  border-radius: 6px;

  background: transparent;
  color: inherit;

  cursor: pointer;

  &:hover {
    opacity: 0.7;
  }

  &:focus-visible {
    outline: 2px solid currentColor;
    outline-offset: 2px;
  }
`;

const CardHeader = styled.div`
  width: 100%;

  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 1rem;
`;

const AccountDetails = styled.div`
  margin-top: 1rem;

  display: flex;
  flex-direction: column;
  gap: 0.5rem;
`;

const Detail = styled.div`
  display: flex;
  flex-direction: row;
  gap: 0.15rem;

  font-size: 0.8rem;

  span {
    opacity: 0.6;
  }

  strong {
    font-weight: 500;
  }
`;

export default function BankAccountCard({
  account,
  selected,
  disabled,
  onClick,
}) {
  return (
    <AccountCard
      type="button"
      $selected={selected}
      disabled={disabled}
      onClick={onClick}
    >
      <CardHeader>
        <div className="accountInfo">
          <div className="itemBank">{account.bank}</div>
          <div className="itemName">{account.name}</div>
        </div>
      </CardHeader>

      {selected && !disabled && (
        <AccountDetails>
          <Detail>
            <span>IBAN</span>
            <strong>{account.iban}</strong>
          </Detail>

          <Detail>
            <span>BIC</span>
            <strong>{account.bic}</strong>
          </Detail>
        </AccountDetails>
      )}
    </AccountCard>
  );
}