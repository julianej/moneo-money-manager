import useSWR from "swr";
import { useState } from "react";
import { useRouter } from "next/router"; // MENU LINK

import { X, Plus,LogOut, User } from "lucide-react";
import styled from "styled-components";
import { Spinner } from "@/styles/LoadingStyles";

import MenuProfile from "@/components/MenuProfile/MenuProfile";
import FloatingNavigation from "@/components/FloatingNavigation/FloatingNavigation";

import Welcome from "@/components/Welcome/Welcome";
import Profile from "@/components/MenuProfile/MenuProfileSettings";

import BankSideBar from "@/components/BankSideBar/BankSideBar";
import BankAccountForm from "@/components/BankSideBar/BankAccountForm";
import PricingPlanCard from "@/components/PricingPlanCard/PricingPlanCard";

import AccountBalance from "@/components/AccountBalance/AccountBalance";
import TransactionForm from "@/components/TransactionForm/TransactionForm";
import TransactionList from "@/components/TransactionList/TransactionList";

import TransactionSearch from "@/components/TransactionSearch/TransactionSearch";
import TransactionFilter from "@/components/TransactionFilter/TransactionFilter";
import TransactionPeriod from "@/components/TransactionCharts/TransactionPeriod";

import ToastMessage from "@/components/ToastMessage/ToastMessage";
import DialogPopup from "@/components/DialogPopup/DialogPopup";

// ====================
// STYLES
// ====================


const Main = styled.main`
  display: flex;
  flex-direction: column;

  @media (min-width: 740px) {
   flex-direction: row;
  }
`;

const MainContent = styled.div`
  width: 100%;
  padding: 0 20px;
  margin: 0 auto;
   @media (min-width: 740px) {
   width: 70%;
  }
`;

const MenuProfileWrapper = styled.div`
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: space-between;
    width: 100%;
    height: 55px;
    border-top: 1rem solid black;
    /* border: 2px solid black; */
    background-color: transparent;
    margin-bottom: 2rem;
    border-radius: 1rem;
    /* position: fixed; */
    margin-bottom: 2rem;
    @media (min-width: 740px) {
    width: 100%;
    height: 63px;
    margin-top: 5rem;
  }
`;

const SidebarWrapper = styled.aside`
  padding: 1.5rem 1rem;
  width: 100%;
  border-right: 2px solid black;
    @media (min-width: 740px) {
     width: 25%;}
`;

const AddButton = styled.button`
  background: white;
  width: 100%;
  text-align: left;
  padding: 0.7rem 0.7rem 0.6rem;
  border-radius: 0.5rem;
  border: 1px solid lightgray;
  color: #0d0d0d ;
  cursor: pointer;
  font-size: 16px;
  position: relative;
  margin-bottom: 2rem;

  svg {
    position: absolute;
    right: 1rem;
  }
`;

const Title = styled.h1`
    font-size: 40px;
    text-transform: uppercase;
    margin-bottom: 30px;
    background-color: white;
    padding: 3rem;
    text-align: center; 
    justify-content: center;
    border-radius: 1rem;
    display: flex;
    flex-direction: row;
    margin: 0;
    gap: 1rem;

  span {
    font-size: 2rem;
    font-weight: 700;
  }

  @media (min-width: 740px) {
    span {
    font-size: 4rem;}}

`;


const PrimaryButton = styled.button`
  padding: 10px 18px;
  border: none;
  border-radius: 8px;
  background: #000;
  color: #fff;
  font-size: 14px;
  font-weight: 600;
  cursor: pointer;

  &:hover {
    opacity: 0.8;
  }

  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
`;


const CardWrapper = styled.div`
  display: flex;
  gap: 1rem;
  margin-top: 2rem;
  overflow-x: auto;
  flex-direction: column;
  text-align: center;
  margin-bottom: 15rem;

  @media (min-width: 740px) {
    overflow-x: visible;
    flex-direction: row;
    text-align: left;
  }
`;


// ====================
// COMPONENT
// ====================


export default function Dashboard() {

    const router = useRouter();

  // ====================
  // STATE
  // ====================
  const [transactionView, setTransactionView] = useState("list");
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);

  // DASHBOARD DEFAULT
  const [activeSection, setActiveSection] = useState("home"); 
  const [selectedAccount, setSelectedAccount] = useState(null);
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(true);
  
  const [isBankFormOpen, setIsBankFormOpen] = useState(false);

  const [searchTerm, setSearchTerm] = useState("");

  const today = new Date();
  const [selectedYear, setSelectedYear] = useState(today.getFullYear());
  const [selectedMonth, setSelectedMonth] = useState(today.getMonth()); 
  // const [selectedYear, setSelectedYear] = useState("all");
  // const [selectedMonth, setSelectedMonth] = useState("all");
  const [selectedType, setSelectedType] = useState("all");
  const [selectedCategories, setSelectedCategories] = useState([]);

  // ADD ACCOUNT FORM STATE
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [accountLimitMessage, setAccountLimitMessage] = useState("");
  const [showAccountOnboarding, setShowAccountOnboarding] = useState(false);

  // TOAST MESSAGE
  const [toastMessage, setToastMessage] = useState("");
  const [toastType, setToastType] = useState("success");

  const [isAddingAccount, setIsAddingAccount] = useState(false);
  const [isDeletingAccount, setIsDeletingAccount] = useState(false);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [selectedTransaction, setSelectedTransaction] = useState(null);

  const [pdfLoading, setPdfLoading] = useState(false);


      const profileItems = [
        {
          label: "Profile Settings",
          icon: <User size={20} />,
          onClick: () => {
            setIsProfileOpen(true);
            setIsMenuOpen(false);
          },
        // onClick: () => {
        //     console.log("Profile Settings");
        // },
        },
        {
        label: "Log Out",
        icon: <LogOut size={20} />,
        onClick: () => {
            router.push("/");
        },
        },
    ];


  // ====================
  // DATA
  // ====================

  const {
    data: accounts = [],
    mutate: mutateAccounts,
  } = useSWR("/api/bankaccounts");

  const {
    data: user,
    error: userError,
    isLoading: userLoading,
  } = useSWR("/api/user");

    const {
    data: transactions = [],
    error: transactionsError,
    isLoading: transactionsLoading,
    mutate,
  } = useSWR(
    selectedAccount
      ? `/api/transactions?account=${selectedAccount}`
      : null
  );

  const { 
    data: categories, 
    error: categoriesError, 
    mutate: mutateCategories,
  } = useSWR(
    selectedAccount
      ? `/api/categories?account=${selectedAccount}`
      : null
  );

console.log("DASHBOARD selectedAccount:", selectedAccount);
console.log("DASHBOARD categories:", categories);
console.log("DASHBOARD categoriesError:", categoriesError);

const hasReachedAccountLimit = accounts?.length >= 1;

// ====================
// FLOATING NAVIGATION
// ====================


function onHome() {
  setActiveSection("home");
  setIsProfileOpen(false);
  setSelectedAccount(null);
  setIsSidebarCollapsed(true);
  setShowAccountOnboarding(false);
}

function onAccounts() {
  setActiveSection("accounts");
  setIsProfileOpen(false);

  if (accounts.length === 0) {
    // No account → open onboarding
    setSelectedAccount(null);
    setIsSidebarCollapsed(false);
    setShowAccountOnboarding(true);
    return;
  }

  // Account exists → directly open List View
  setSelectedAccount(accounts[0]._id);
  setTransactionView("list");
  setIsSidebarCollapsed(true);
  setShowAccountOnboarding(false);
}

function onTransactionViewChange(view) {
  setTransactionView(view);
  setIsProfileOpen(false);
}

  // ====================
  // TRANSACTION DELETE
  // ====================

async function handleDeleteTransaction(transactionId) {
  try {
    const response = await fetch(
      `/api/transactions/${transactionId}`,
      {
        method: "DELETE",
      }
    );

    const data = await response.json();

    if (!response.ok) {
      console.error(data);
      showToast("Failed to delete transaction.", "error");
      return;
    }

    await mutate();

    showToast("Transaction deleted successfully.", "success");

    setShowDeleteDialog(false);

  } catch (error) {
    console.error("DELETE TRANSACTION ERROR:", error);
    showToast("Failed to delete transaction.", "error");
  }
}

  // ====================
  // ACCOUNT
  // ====================

  function handleAccountSelect(accountId) {
    setActiveSection("accounts");
    setSelectedAccount(accountId);
    setTransactionView("list");
    setIsBankFormOpen(false);
    setIsFormOpen(false);
    setIsSidebarCollapsed(true);
    }

const handleAddAccount = () => {
  if (user?.plan === "free" && accounts.length >= 1) {
    setAccountLimitMessage(
      "Your free plan allows only one bank account."
    );
  } else {
    setAccountLimitMessage("");
  }
  setIsBankFormOpen(true);
};

 async function handleDeleteAccount() {
  console.log("DELETE ACCOUNT CLICKED");
  console.log("selectedAccount:", selectedAccount);

  if (!selectedAccount) {
    console.log("NO SELECTED ACCOUNT");
    return;
  }

  setIsDeletingAccount(true);

  try {
    const response = await fetch(
      `/api/bankaccounts/${selectedAccount}`,
      {
        method: "DELETE",
      }
    );

    const data = await response.json();

    console.log("DELETE RESPONSE:", response.status, data);

    if (!response.ok) {
      console.error("DELETE FAILED:", data);
      return;
    }

    await mutateAccounts();

    showToast("Bank Account deleted successfully.", "success");

    setSelectedAccount(null);
    setIsFormOpen(false);

  } catch (error) {
    console.error("DELETE ERROR:", error);
  } finally {
    setIsDeletingAccount(false);
  }
}
  // ====================
  // FILTER
  // ====================

    const matchesFilter = (transaction) => {
    const transactionDate = new Date(transaction.date);

    const matchesSearch =
    transaction.title
      .toLowerCase()
      .includes(searchTerm.toLowerCase());

    const matchesYear =
    selectedYear === "all" ||
    new Date(transaction.date).getFullYear().toString() === selectedYear;

    const matchesMonth =
    selectedMonth === "all" ||
    transactionDate.getMonth() === Number(selectedMonth);

    const matchesType =
      selectedType === "all" ||
      transaction.type === selectedType;

    const matchesCategory =
      selectedCategories.length === 0 ||
      selectedCategories.includes(transaction.category);

    return (
      matchesSearch &&
      matchesYear &&
      matchesMonth &&
      matchesType &&
      matchesCategory
    );
  };

const filteredTransactions = transactions.filter((transaction) => {
  const date = new Date(transaction.date);

  const transactionYear = date.getFullYear();
  const transactionMonth = date.getMonth() + 1;

  return (
    transactionYear === selectedYear &&
    transactionMonth === selectedMonth
  );
});


    if (transactionsLoading) {
      return <p>Loading transactions...</p>;
    }

    if (transactionsError) {
      return (
        <div>
          <p>Could not load transactions.</p>

          <PrimaryButton
            type="button"
            onClick={() => mutate()}
          >
            Try again
          </PrimaryButton>
        </div>
      );
    }


  // TOAST MESSAGE 
 function showToast(toastMessage, toastType = "success") {
    setToastMessage(toastMessage);
    setToastType(toastType);

    setTimeout(() => {
      setToastMessage("");
    }, 2000);
}

// ACCOUNT DATA OBJECT
  const selectedAccountData = accounts.find(
  (account) => String(account._id) === String(selectedAccount)
);

 return (
  <Main>

    {toastMessage && (
      <ToastMessage
        toastMessage={toastMessage}
        toastType={toastType}
        onClose={() => setToastMessage("")}
      />
    )}

    <SidebarWrapper>
      <BankSideBar
        accounts={accounts}
        selectedAccount={selectedAccount}
        setSelectedAccount={handleAccountSelect}
        onAddAccount={handleAddAccount}
        isBankFormOpen={isBankFormOpen}
        isMenuOpen={isMenuOpen}
        showAccountOnboarding={showAccountOnboarding}
        setShowAccountOnboarding={setShowAccountOnboarding}
        isSidebarCollapsed={isSidebarCollapsed}
        setIsSidebarCollapsed={setIsSidebarCollapsed}
      />
    </SidebarWrapper>

    <MainContent>

      <MenuProfileWrapper>
        <p>Hallo Juliane</p>

        <MenuProfile
          isMenuOpen={isMenuOpen}
          onDelete={handleDeleteAccount}
          isProfileOpen={isProfileOpen}
          setIsProfileOpen={setIsProfileOpen}
          setIsMenuOpen={setIsMenuOpen}
          isLoggedIn={true}
          listItems={profileItems}
        />
      </MenuProfileWrapper>

      {/* FLOATING NAVIGATION — ALWAYS VISIBLE */}

      <FloatingNavigation
        activeSection={activeSection}
        selectedAccount={selectedAccount}
        onHome={onHome}
        onAccounts={onAccounts}
        transactionView={transactionView}
        onTransactionViewChange={onTransactionViewChange}
        setIsSidebarCollapsed={setIsSidebarCollapsed}
      />

      {/* PROFILE OR DASHBOARD CONTENT */}

      {isProfileOpen ? (

        <Profile
          user={user}
          userLoading={userLoading}
          userError={userError}
          onClose={() => setIsProfileOpen(false)}
        />

      ) : (

        <>
          {/* BANK ACCOUNT SPINNER */}

          {isAddingAccount || isDeletingAccount ? (
            <div>
              <p>
                {isAddingAccount
                  ? "Adding bank account..."
                  : "Deleting bank account..."}
              </p>

              <Spinner />
            </div>

          ) : selectedAccount ? (

            <>
              <Title>
                <span>{selectedAccountData?.bank}</span>
                <span>{selectedAccountData?.name}</span>
              </Title>

              {transactionView === "chart" && (
                <TransactionPeriod
                  selectedDate={selectedDate}
                  transactions={transactions}
                />
              )}

              <AccountBalance
                transactions={filteredTransactions}
              />

              <TransactionSearch
                searchTerm={searchTerm}
                setSearchTerm={setSearchTerm}
                hasSearch={searchTerm !== ""}
              />

              <TransactionFilter
                transactions={transactions}
                categories={categories}
                accounts={accounts}
                selectedAccountData={selectedAccountData}
                filteredTransactions={filteredTransactions}
                selectedYear={selectedYear}
                setSelectedYear={setSelectedYear}
                selectedMonth={selectedMonth}
                setSelectedMonth={setSelectedMonth}
                selectedType={selectedType}
                setSelectedType={setSelectedType}
                selectedCategories={selectedCategories}
                setSelectedCategories={setSelectedCategories}
                setPdfLoading={setPdfLoading}
                mutateCategories={mutateCategories}
              />

              <AddButton
                onClick={() => setIsFormOpen((isOpen) => !isOpen)}
              >
                {isFormOpen ? (
                  <>
                    Close Transaction Form
                    <X />
                  </>
                ) : (
                  <>
                    Add Transaction
                    <Plus />
                  </>
                )}
              </AddButton>

              {isFormOpen && (
                <TransactionForm
                  categories={categories}
                  selectedAccount={selectedAccount}
                  onCancel={() => setIsFormOpen(false)}
                  showToast={showToast}
                  mutate={mutate}
                />
              )}

              <TransactionList
                transactions={filteredTransactions}
                categories={categories}
                selectedAccount={selectedAccount}
                onDeleteAccount={handleDeleteAccount}
                mutate={mutate}
                showToast={showToast}
                pdfLoading={pdfLoading}
                onRequestDelete={(transaction) => {
                  setSelectedTransaction(transaction);
                  setShowDeleteDialog(true);
                }}
              />
            </>

          ) : (

            <>
              <Welcome variant="dashboard" />

              <CardWrapper>
                <PricingPlanCard variant="current" />
                <PricingPlanCard variant="upgrade" />
                <PricingPlanCard variant="referral" />
              </CardWrapper>
            </>

          )}
        </>
      )}

    </MainContent>

    {/* BANK ACCOUNT FORM */}

    {isBankFormOpen && (
      <BankAccountForm
        onCancel={() => setIsBankFormOpen(false)}
        mutate={mutateAccounts}
        isAddingAccount={isAddingAccount}
        setIsAddingAccount={setIsAddingAccount}
        accountLimitMessage={accountLimitMessage}
      />
    )}

    {/* DELETE TRANSACTION DIALOG */}

    {showDeleteDialog && selectedTransaction && (
      <DialogPopup
        transaction={selectedTransaction}
        onDelete={() =>
          handleDeleteTransaction(selectedTransaction._id)
        }
        onCancel={() => {
          setShowDeleteDialog(false);
          setSelectedTransaction(null);
        }}
      />
    )}

  </Main>
);}