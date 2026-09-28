import styled from "styled-components";
import { Plus, RefreshCw, ChevronDown, ChevronUp } from "lucide-react";
import { useState } from "react";

import BankAccountCard from "./BankAccountCard";

const SidebarTitle = styled.h2`
  margin: 1rem 0 1.5rem;
  font-size: 1.2rem;
  text-align: center;
`;

const Title = styled.h1`
  font-family: "Silkscreen", sans-serif;
  font-weight: 400;
  font-style: normal;
  font-size: 4rem;
  text-transform: uppercase;

  margin: 0 0 2rem;

  line-height: 3rem;
`;

const SidebarHeader = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;

  @media (min-width: 740px) {
    display: block;
  }
`;

const CollapseButton = styled.button`
  display: flex;
  align-items: center;
  justify-content: center;

  width: 40px;
  height: 40px;

  padding: 0;
  position: relative;
  right: -45%;

  border: 1px solid currentColor;
  border-radius: 50%;

  background: transparent;
  color: inherit;

  cursor: pointer;

  @media (min-width: 740px) {
    display: none;
  }
`;

const AccountList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
`;

const AddBankAccountButton = styled.button`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 8px;

  width: 100%;
  margin: 1.5rem 0;
  padding: 0.75rem;

  border: 1px solid #000;
  border-radius: 8px;

  background: ${({ $selected }) => ($selected ? "#000" : "#fff")};
  color: ${({ $selected }) => ($selected ? "#fff" : "#000")};

  cursor: pointer;
`;

const SidebarSection = styled.section`
  display: flex;
  flex-direction: column;

  width: 100%;
  height: auto;

  position: sticky;
  top: 0;
  align-self: start;

  padding: 2rem;

  background: #000;
  color: #fff;

  border-radius: 1rem;

  @media (min-width: 740px) {
    background: transparent;
    min-height:90vh;
    color: #000;
  }
`;

const SidebarContent = styled.div`
  display: ${({ $isCollapsed }) => ($isCollapsed ? "none" : "block")};

  @media (min-width: 740px) {
    display: block;
  }
`;

const SyncSection = styled.div`
  margin-top: auto;

  display: flex;
  flex-direction: column;
  gap: 0.35rem;
`;

const SyncButton = styled.button`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;

  width: 100%;
  padding: 0.75rem 1rem;

  border: none;
  background-color: transparent;
  color: #ddd;

  font: inherit;
  font-weight: 500;

  cursor: pointer;

  &:hover {
    opacity: 0.85;
  }

  &:active {
    transform: translateY(1px);
  }

  @media (min-width: 740px) {
      color: #0b0b0b;
  }
`;

const SyncStatus = styled.span`
  font-size: 0.75rem;
  color: #666;
  text-align: center;
`;

export default function BankSideBar({
  accounts = [],
  selectedAccount,
  setSelectedAccount,
  onAddAccount,
  isBankFormOpen,
}) {
  const [lastSyncedAt, setLastSyncedAt] = useState(null);
  const [isCollapsed, setIsCollapsed] = useState(true);

 return (
  <SidebarSection>
    <SidebarHeader>
      <Title>Money Manager</Title>

    </SidebarHeader>


  <SidebarTitle>Bank Accounts</SidebarTitle>
   <CollapseButton
        type="button"
        onClick={() => setIsCollapsed((collapsed) => !collapsed)}
        aria-expanded={!isCollapsed}
        aria-label={
          isCollapsed ? "Open bank accounts" : "Close bank accounts"
        }
      >
        {isCollapsed ? (
          <ChevronDown size={20} />
        ) : (
          <ChevronUp size={20} />
        )}
      </CollapseButton>
          <SidebarContent $isCollapsed={isCollapsed}>
      <AccountList>
        {accounts.map((account) => (
          <BankAccountCard
            key={account._id}
            account={account}
            selected={selectedAccount === account._id}
            disabled={isBankFormOpen}
            onClick={() => setSelectedAccount(account._id)}
          />
        ))}
      </AccountList>

      <AddBankAccountButton
        type="button"
        $selected={isBankFormOpen}
        onClick={onAddAccount}
      >
        <span>Add Bank Account</span>
        <Plus size={18} />
      </AddBankAccountButton>

      <SyncSection>
        <SyncButton
          type="button"
          onClick={() => setLastSyncedAt(new Date())}
        >
          Synchronisieren
          <RefreshCw size={16} />
        </SyncButton>

        <SyncStatus>
          Zuletzt synchronisiert:{" "}
          {lastSyncedAt
            ? lastSyncedAt.toLocaleString("de-DE")
            : "Noch nie"}
        </SyncStatus>
      </SyncSection>
    </SidebarContent>
  </SidebarSection>
)};