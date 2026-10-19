import styled from "styled-components";
import { Plus, RefreshCw, ChevronDown, ChevronUp } from "lucide-react";
import { useState } from "react";

import BankAccountCard from "./BankAccountCard";

import {
  SyncBankButton,
} from "@/styles/ButtonStyles";

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

    /* Mobile */
  @media (min-width: 740px) {
    font-size: 2.5rem;
    line-height: 2.5rem;
  }

  /* Tablet */
  @media (min-width: 1040px) {
    font-size: 2.5rem;
    line-height: 2.5rem;
  }

  /* Desktop */
  @media (min-width: 1124px) {
    font-size: 4rem;
    line-height: 2rem;
    padding-top: 2rem;
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


const SidebarSection = styled.section`
  display: flex;
  flex-direction: column;

  width: 100%;
  height: auto;

  position: sticky;
  top: 0;
  align-self: start;

  padding: 1.5rem;

  background: #000;
  color: #fff;

  border-radius: 1rem;

  @media (min-width: 740px) {
    background: transparent;
    min-height:90vh;
    color: #000;
    background: #fff;
    min-height: 83vh;
    color: #000;
    padding: 2rem 2rem;
    max-width: 400px;
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
  onSyncComplete,
}) {
  const [isSyncing, setIsSyncing] = useState(false);
  const [syncMessage, setSyncMessage] = useState("");

  const selectedAccountData = accounts?.find(
    (account) => String(account._id) === String(selectedAccount)
  );

  async function handleSync() {
    if (!selectedAccount || isSyncing) return;

    setIsSyncing(true);
    setSyncMessage("");

    try {
      const response = await fetch("/api/bankaccounts/sync", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          accountId: selectedAccount,
        }),
      });

    const responseText = await response.text();
    let result;

    try {
      result = JSON.parse(responseText);
    } catch {
      console.error("Invalid API response:", responseText);

      throw new Error(
        `Sync API failed with HTTP ${response.status}.`
      );
    }

    if (!response.ok) {
      throw new Error(
        result.error || "Bank synchronization failed."
      );
    }

    if (onSyncComplete) {
      await onSyncComplete();
    }

    setSyncMessage(
      `Sync complete: ${result.imported ?? 0} new transactions.`
    );
  } catch (error) {
    console.error("Bank sync error:", error);
    setSyncMessage(error.message || "Synchronization failed.");
  } finally {
    setIsSyncing(false);
  }
}

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

      {showAccountOnboarding}
        </AddBankAccountButton>

      
      <SyncSection>
        {selectedAccountData?.accountType === "bank" &&
          selectedAccountData?.connectionStatus === "connected" && (
            <SyncBankButton
              onClick={handleSync}
              disabled={isSyncing}
            >
              {isSyncing ? "Synchronisiere..." : "Synchronisieren"}
            </SyncBankButton>
            )}

            <SyncStatus>
              Zuletzt synchronisiert:{" "} 
              {(() => {
                const account = accounts.find(
                  (item) =>
                    String(item._id) === String(selectedAccount)
                );

                const date = account?.lastSyncedAt
                  ? new Date(account.lastSyncedAt)
                  : null;

                return date && !Number.isNaN(date.getTime())
                  ? date.toLocaleString("de-DE")
                  : "Noch nie";
              })()}
            </SyncStatus>

            {syncMessage && (
              <p role="status" aria-live="polite">
                {syncMessage}
              </p>
            )}
          </SyncSection>

    </SidebarContent>
  </SidebarSection>
);
}