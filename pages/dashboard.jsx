import useSWR from "swr";
import { useState } from "react";
import { useRouter } from "next/router"; // MENU LINK

import { X, Plus,LogOut } from "lucide-react";
import styled from "styled-components";
import { Spinner } from "@/styles/LoadingStyles";
import MenuProfile from "@/components/MenuProfile/MenuProfile";
import FloatingNavigation from "@/components/FloatingNavigation/FloatingNavigation";

import Welcome from "@/components/Welcome/Welcome";
import BankSideBar from "@/components/BankSideBar/BankSideBar";
import BankAccountForm from "@/components/BankSideBar/BankAccountForm";
import AccountBalance from "@/components/AccountBalance/AccountBalance";
import TransactionForm from "@/components/TransactionForm/TransactionForm";
import TransactionList from "@/components/TransactionList/TransactionList";

import TransactionSearch from "@/components/TransactionSearch/TransactionSearch";
import TransactionFilter from "@/components/TransactionFilter/TransactionFilter";


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
  padding: 40px 20px;
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
    border: 2px solid black;
    background-color: white;
    margin-bottom: 2rem;
    border-radius: 1rem;
    /* position: fixed; */
    margin-bottom: 2rem;
    @media (min-width: 740px) {
    width: 100%;
    height: 63px;
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


const Toast = styled.div`
  position: fixed;
  top: 2rem;
  left: 0;
  right: 0;

  width: fit-content;
  margin: 0 auto;

  z-index: 9999;

  padding: 0.75rem 1.5rem;
  border-radius: 8px;

  background: black;
  color: white;
`;

const BankAccountFormWrapper = styled.div`
    position: absolute;
    width: 100%;
    height: 100%;
    background-color: rgba(255, 255, 255, 0.8);
    left: 0%;
    top: 0%;
    z-index: 77777;
    height: 100vh;
    @media (min-width: 740px) {
     left: 25%;}
`;

// ====================
// COMPONENT
// ====================


export default function Dashboard() {

    const profileItems = [
        // {
        // label: "Profile Settings",
        // icon: <User size={20} />,
        // onClick: () => {
        //     router.push("/profile.jsx");
        // },
        // // onClick: () => {
        // //     console.log("Profile Settings");
        // // },
        // },
        {
        label: "Log Out",
        icon: <LogOut size={20} />,
        onClick: () => {
            router.push("/");
        },
        },
    ];


  // ====================
  // STATE
  // ====================
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const [activeSection, setActiveSection] = useState("home"); // DASHBOARD DEFAULT
  const [selectedAccount, setSelectedAccount] = useState(null);
  
  const [isBankFormOpen, setIsBankFormOpen] = useState(false);

  const [searchTerm, setSearchTerm] = useState("");

  const [selectedYear, setSelectedYear] = useState("all");
  const [selectedType, setSelectedType] = useState("all");
  const [selectedCategories, setSelectedCategories] = useState([]);

  const [isFormOpen, setIsFormOpen] = useState(false);
  const [message, setSuccessMessage] = useState("");

  const [isAddingAccount, setIsAddingAccount] = useState(false);
  const [isDeletingAccount, setIsDeletingAccount] = useState(false);


  // ====================
  // DATA
  // ====================

  const {
    data: accounts = [],
    mutate: mutateAccounts,
  } = useSWR("/api/bankaccounts");

  const { data, error, isLoading, mutate } = useSWR(
    selectedAccount
      ? `/api/transactions?account=${selectedAccount}`
      : null
  );


  const router = useRouter();

// ====================
// FLOATING NAVIGATION
// ====================

function handleHomeClick() {
  setActiveSection("home");
  setSelectedAccount(null);
}

function handleAccountsClick() {
  setActiveSection("accounts");

  if (accounts?.length > 0) {
    setSelectedAccount(accounts[0]._id);
  }
}


  // ====================
  // ACCOUNT
  // ====================

  function handleAccountSelect(accountId) {
    setActiveSection("accounts");
    setSelectedAccount(accountId);
    setIsBankFormOpen(false);
    setIsFormOpen(false);
    }

  function handleAddAccount() {
    setIsBankFormOpen(true);
  }

  async function handleDeleteAccount() {
  if (!selectedAccount) return;

  setIsDeletingAccount(true);

  try {
    const response = await fetch(
      `/api/bankaccounts/${selectedAccount}`,
      {
        method: "DELETE",
      }
    );

    const data = await response.json();

    if (!response.ok) {
      console.error(data);
      return;
    }

    await mutateAccounts();

    setSelectedAccount(null);
    setIsFormOpen(false);

    showToast("Bank account deleted successfully.");
  } catch (error) {
    console.error(error);
  } finally {
    setIsDeletingAccount(false);
  }
}

  // ====================
  // FILTER
  // ====================


  const matchesFilter = (transaction) => {
    const matchesSearch =
    transaction.title
      .toLowerCase()
      .includes(searchTerm.toLowerCase());

    const matchesYear =
    selectedYear === "all" ||
    new Date(transaction.date).getFullYear().toString() === selectedYear;

    const matchesType =
      selectedType === "all" ||
      transaction.type === selectedType;

    const matchesCategory =
      selectedCategories.length === 0 ||
      selectedCategories.includes(transaction.category);

    return (
      matchesSearch &&
      matchesYear &&
      matchesType &&
      matchesCategory
    );
  };

  const filteredTransactions =
    data?.filter(matchesFilter) ?? [];


  if (isLoading) {
    return <p>Loading...</p>;
  }

  if (error) {
    return (
      <div>
        <p>Failed to load transactions.</p>

        <PrimaryButton
          type="button"
          onClick={() => mutate()}
        >
          Try again
        </PrimaryButton>
      </div>
    );
  }

  function showToast(message) {
    setSuccessMessage(message);

    setTimeout(() => {
      setSuccessMessage("");
    }, 2000);
  }


  const selectedAccountData = accounts.find(
  (account) => account._id === selectedAccount
);


  return (
    <Main>

      {message && <Toast>{message}</Toast>}

      <SidebarWrapper>
        <BankSideBar
            accounts={accounts}
            selectedAccount={selectedAccount}
            setSelectedAccount={handleAccountSelect}
            onAddAccount={handleAddAccount}
            isBankFormOpen={isBankFormOpen}
            isMenuOpen={isMenuOpen}
            />
      </SidebarWrapper>


   <MainContent>
     <FloatingNavigation
        activeSection={activeSection}
        onHome={handleHomeClick}
        onAccounts={handleAccountsClick}
        onAddTransaction={() => setIsFormOpen(true)}
        />

      <MenuProfileWrapper>
        <p>Hallo Juliane</p>
       <MenuProfile
            isMenuOpen={isMenuOpen}
            setIsMenuOpen={setIsMenuOpen}
            isLoggedIn={true}
            listItems={profileItems}
            />
    </MenuProfileWrapper>

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
        {selectedAccountData?.bank} <br />
        {selectedAccountData?.name}
      </Title>

      <TransactionSearch
        searchTerm={searchTerm}
        setSearchTerm={setSearchTerm}
        hasSearch={searchTerm !== ""} // SET RESET BUTTON
      />

      <TransactionFilter
        transactions={data ?? []}
        selectedYear={selectedYear}
        setSelectedYear={setSelectedYear}
        selectedType={selectedType}
        setSelectedType={setSelectedType}
        selectedCategories={selectedCategories}
        setSelectedCategories={setSelectedCategories}
      />

      <AccountBalance
        transactions={filteredTransactions}
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
          selectedAccount={selectedAccount}
          onCancel={() => setIsFormOpen(false)}
          showToast={showToast}
          mutate={mutate}
        />
      )}

      <TransactionList
        transactions={filteredTransactions}
        selectedAccount={selectedAccount}
        onDeleteAccount={handleDeleteAccount}
        mutate={mutate}
        showToast={showToast}
      />
    </>
  ) : (
         <Welcome variant="dashboard" />
    )}
  </MainContent>
      {/* BANK ACCOUNT FORM */}
      {isBankFormOpen && (
        <BankAccountFormWrapper>
          <BankAccountForm
            onCancel={() => setIsBankFormOpen(false)}
            mutate={mutateAccounts}
            setIsAddingAccount={setIsAddingAccount}
          />
        </BankAccountFormWrapper>
        )}

      {/* )} */}

    </Main>
  );
}