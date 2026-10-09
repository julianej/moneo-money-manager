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
  font-size: 3.5rem;
  text-transform: uppercase;

  margin: 0 0 2rem;
  line-height: 3rem;

  @media (min-width: 740px) {
      font-size: 3.5rem;
  }
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
  color: #6e6d6d;;

  cursor: pointer;

  @media (min-width: 740px) {
    display: none;
  }`;

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

  border: 2px solid #555454;
  border-radius: 8px;

  background: ${({ $selected }) =>
    $selected ? "#000" : "transparent"};

  color: ${({ $selected }) =>
    $selected ? "#fff" : "#555454"};

  cursor: pointer;

  position: relative;

  @media (min-width: 740px) {
    border: 2px solid #000;
    color: ${({ $selected }) =>
      $selected ? "#fff" : "#000"};
    }

  ${({ $onboarding }) =>
    $onboarding &&
    `
      border: 2px solid #000;
      transform: translateY(-2px);

      &::before {
        content: "START HERE";
        position: absolute;
        left: 0;
        bottom: calc(100% + 8px);

        font-family: "Silkscreen", sans-serif;
        font-size: 0.65rem;
        letter-spacing: 0.05em;

        color: #000;
        white-space: nowrap;
      }

      svg {
        animation: onboardingArrow 1.2s ease-in-out infinite;
      }

      @keyframes onboardingArrow {
        0%,
        100% {
          transform: translateX(0);
        }

        50% {
          transform: translateX(4px);
        }
      }
    `}
`;

const OnboardingPulse = styled.span`
    position: absolute;
    top: 50%;
    right: -30px;
    width: 95px;
    height: 95px;
    border-radius: 50%;
    background: transparent;
    transform: translateY(-50%);

  &::before {
    content: "";
    position: absolute;
    inset: -5px;

    border: 1px solid #000;
    border-radius: 50%;

    animation: pulse 1.5s ease-out infinite;
  }

  @keyframes pulse {
    0% {
      transform: scale(0.7);
      opacity: 1;
    }

    70% {
      transform: scale(1.8);
      opacity: 0;
    }

    100% {
      transform: scale(1.8);
      opacity: 0;
    }
  }
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
    padding: 2rem 0rem;
    max-width: 400px;
  }
`;

const SidebarContent = styled.div`
  display: ${({ $isCollapsed }) =>
    $isCollapsed ? "none" : "block"};

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
  showAccountOnboarding,
  setShowAccountOnboarding,
  isSidebarCollapsed,
  setIsSidebarCollapsed,
}) {
  const [lastSyncedAt, setLastSyncedAt] = useState(null);

 return (
  <SidebarSection>
    <SidebarHeader>
      <Title>Money Manager</Title>
    </SidebarHeader>
    <SidebarTitle>Bank Accounts</SidebarTitle>
    <CollapseButton
        type="button"
        onClick={() => setIsSidebarCollapsed((current) => !current)}
        aria-expanded={!isSidebarCollapsed}
        aria-label={
          isSidebarCollapsed ? "Open bank accounts" : "Close bank accounts"
        }
      >
        {isSidebarCollapsed ? (
          <ChevronDown size={20} />
        ) : (
          <ChevronUp size={20} />
        )}
      </CollapseButton>
        <SidebarContent $isCollapsed={isSidebarCollapsed}>

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

{/*/ ADD BANK ACCOUNT BUTTON */}
     <AddBankAccountButton
        type="button"
        $selected={isBankFormOpen}
        $onboarding={showAccountOnboarding}
        onClick={() => {
          setShowAccountOnboarding(false);
          onAddAccount();
        }}
      >
          <span>Add Bank Account</span>
          <Plus size={18} />

      {showAccountOnboarding && <OnboardingPulse />}
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
);
}