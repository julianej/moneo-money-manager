import styled from "styled-components";
import {
  House,
  Wallet,
  ChartColumnBig,
  List,
} from "lucide-react";

const FloatingNavigationWrapper = styled.nav`
  position: fixed;

  left: 50%;
  bottom: -1rem;

  transform: translateX(-50%);

  z-index: 1000;
  width: auto;
  margin: 0 auto 2rem;

  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: space-around;

  height: 50px;
  padding: 0.5rem;

  background: #000;
  border: 2px solid #000;
  border-radius: 999px;
  gap: 0rem;

  @media (min-width: 740px) {
    gap: 0rem;
    left: 13%;
    bottom: 1rem;
  }
`;

const MenuItem = styled.button`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.4rem;

  width: auto;
  height: 43px;
  padding: 0 1rem;

  border: 0;
  border-radius: 3rem;

  background: transparent;
  color: #fff;

  cursor: pointer;

  svg {
    flex-shrink: 0;
    display: block;
  }

  span {
    font-size: 1rem;
    line-height: 1;
  }

  ${({ $active }) =>
    $active &&
    `
      background: #000;
      color: #fff;
      border: 1px solid #575757;
    `}
`;

export default function FloatingNavigation({
  activeSection,
  selectedAccount,
  onHome,
  onAccounts,
  transactionView,
  onTransactionViewChange,
  setIsSidebarCollapsed,
}) {
  

  return (
    <FloatingNavigationWrapper>
      <MenuItem
        type="button"
        $active={activeSection === "home"}
        onClick={() => {
          onHome();
        }}
      >
        <House size={20} />
        <span>Home</span>
      </MenuItem>

      {!selectedAccount && (
        <MenuItem
          type="button"
          $active={activeSection === "accounts"}
          onClick={() => {
            onAccounts();
          }}
        >
          <Wallet size={20} />
          <span>Accounts</span>
        </MenuItem>
      )}

      {selectedAccount && (
        <>
          <MenuItem
            type="button"
            $active={transactionView === "list"}
            onClick={() => onTransactionViewChange("list")}
          >
            <List size={22} />
            <span>List</span>
          </MenuItem>

          <MenuItem
            type="button"
            $active={transactionView === "chart"}
            onClick={() => onTransactionViewChange("chart")}
          >
            <ChartColumnBig size={22} />
            <span>Charts</span>
          </MenuItem>
        </>
      )}
    </FloatingNavigationWrapper>
  );
}