import styled from "styled-components";
import { House, Wallet, List, Plus } from "lucide-react";

const FloatingNavigationWrapper = styled.nav`
    position: fixed;

    left: 50%;
    bottom: 1rem;

    transform: translateX(-50%);

    z-index: 1000;
    width: auto;
    /* text-align: center; */
    margin: 0 auto 2rem;
    bottom: 1rem;
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
    display: flex;
    flex-direction: row;
    gap: 3rem;
    left: 58%;
    z-index: 77;
    bottom: 1rem;
  }
`;

const MenuItem = styled.button`
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: center;
  gap: 0.2rem;

  width: 64px;
  height: 43px;
  padding: 0 4rem;

  border: 0;
  border-radius: 3rem;

  background: transparent;
  color: #000;
  color: #fff;

  cursor: pointer;

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
  onHome,
  onAccounts,
  onAddTransaction,
}) {
  return (
    <FloatingNavigationWrapper>
      <MenuItem
        type="button"
        $active={activeSection === "home"}
        onClick={onHome}
      >
        <House size={20} />
        <span>Home</span>
      </MenuItem>

      <MenuItem
        type="button"
        $active={activeSection === "accounts"}
        onClick={onAccounts}
      >
        <Wallet size={20} />
        <span>Accounts</span>
      </MenuItem>

    {/* NEW FEATURE SITE */}
      {/* <MenuItem
        type="button"
        $active={activeSection === "transactions"}
        onClick={() => setActiveSection("transactions")}
      >
        <List size={20} />
        <span>Transactions</span>
      </MenuItem> */}

      <MenuItem
        type="button"
        onClick={onAddTransaction}
      >
        <Plus size={22} />
        <span>Add</span>
      </MenuItem>
    </FloatingNavigationWrapper>
  );
}