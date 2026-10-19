
import { useState } from "react";
import { useEffect } from "react";
import {styled} from "styled-components";
import { X } from "lucide-react";


import {
  SubmitButton,
  CancelButton,
  CloseButton,
} from "@/styles/ButtonStyles";

import {
  cleanCategory,
  isValidCategory,
  categoryExists,
} from "../../utils/cleanCategory";

import GenerateCategories from "../CategoryManager/GenerateCategories";
import { HiddenLabel } from "@/styles/GlobalStyles";

// ====================
// STYLES
// ====================

const FormScrollWrapper = styled.div`
  max-height: 80vh;
  overflow-y: auto;
  overflow-x: hidden;

  /* Hide scrollbar in Chrome and Safari */
  &::-webkit-scrollbar {
    display: none;
  }

  /* Hide scrollbar in Firefox and other browsers */
  scrollbar-width: none;
  -ms-overflow-style: none;
`;

const Form = styled.form`
  display: flex;
  flex-direction: column;
  gap: 1rem;
  padding: 3rem;
  border: 2px solid #000;
  border-radius: 16px;
  background: rgba(255, 255, 255, 1);
  margin-bottom: 2rem;
  width: 100%;
  overflow-y: scroll;
  height: auto;
  position: fixed;
  z-index: 7777;

  @media (min-width: 740px) {
    width: 50%;
    left: 25%;
    height: 100vh;
    padding: 5rem;
    overflow-y: auto;
    position: fixed;
    z-index: 77777;
  }
`;

const FormTitle = styled.h1`
  margin: 0 0 1rem;
  font-size: 2.5rem;
  line-height: 1.1;
  font-weight: 600;
  text-transform: uppercase;
`;

const FormSubTitle = styled.h2`
  margin: 1rem 0 1rem;
  font-size: 1rem;
  line-height: 1.1;
  font-weight: 600;
  text-transform: uppercase;
`;


const AccountModeSelector = styled.div`
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 0.75rem;
  margin-bottom: 1.5rem;
`;

const AccountModeButton = styled.button`
  padding: 1rem 0.75rem;
  border: 1px solid #000;
  border-radius: 8px;
  background: ${({ $active }) => ($active ? "#000" : "#fff")};
  color: ${({ $active }) => ($active ? "#fff" : "#000")};
  cursor: pointer;
  text-align: left;
  font: inherit;

  &:focus-visible {
    outline: 2px solid #555;
    outline-offset: 3px;
  }
`;

const ModeDescription = styled.span`
  display: block;
  margin-top: 0.4rem;
  font-size: 0.8rem;
  line-height: 1.4;
`;


const CategorySection = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
  padding-top: 2rem;
`;

const CategoryTitle = styled.h2`
  margin: 0;
  font-size: 1rem;
  text-transform: uppercase;
`;

const CategoryListWrapper = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
`;

const CategoryItem = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 0.5rem;
  width: 135px;
  padding: 0.6rem 0.75rem;
  border: 1px solid #000;
  border-radius: 8px;
  overflow-wrap: anywhere;

  button {
    border: none;
    background: transparent;
    cursor: pointer;
    font-size: 1.1rem;
  }

  button:disabled {
    opacity: 0.35;
    cursor: not-allowed;
  }
`;

const CategoryInputWrapper = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
  margin-bottom: 2rem;

  input {
    flex: 1;
    min-width: 140px;
  }

  button {
    padding: 0.5rem 0.75rem;
    border: 1px solid #000;
    border-radius: 8px;
    background: #fff;
    cursor: pointer;
  }
`;

const Field = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.35rem;
`;

const ErrorMessage = styled.span`
  font-size: 0.85rem;
  margin-bottom: 2rem;
  color: #d00;
`;

// ====================
// COMPONENT
// ====================

export default function BankAccountForm({
  onCancel,
  mutate,
  isAddingAccount,
  setIsAddingAccount,
  accountLimitMessage,
}) {

  // Acount Mode
  const [accountMode, setAccountMode] = useState("manual");
  const [accountType, setAccountType] = useState("bank");

  const [purpose, setPurpose] = useState("private");

  const [institutions, setInstitutions] = useState([]);
  const [institutionId, setInstitutionId] = useState("");
  const [isLoadingInstitutions, setIsLoadingInstitutions] = useState(false);

  // Bank account state
  const [bank, setBank] = useState("Manual");
  const [name, setName] = useState("");
  const [iban, setIban] = useState("");
  const [bic, setBic] = useState("");

  // Validation state
  const [errors, setErrors] = useState({});
  const [submitError, setSubmitError] = useState("");

  // Category state
  const [categories, setCategories] = useState([]);
  const [newCategory, setNewCategory] = useState("");
  const [categoryError, setCategoryError] = useState("");

  const minimumCategories = 5;

  // ====================
  // VALIDATE FORM
  // ====================

  
function validateForm() {
  const newErrors = {};

  if (accountMode === "manual") {
    if (bank.trim() && bank.trim().length < 2) {
      newErrors.bank = "Please enter a valid bank name.";
    }

    const cleanIBAN = iban.replace(/\s/g, "").toUpperCase();

    if (
      cleanIBAN &&
      !/^[A-Z]{2}[0-9]{2}[A-Z0-9]{11,30}$/.test(cleanIBAN)
    ) {
      newErrors.iban = "Please enter a valid IBAN.";
    }

    const cleanBIC = bic.replace(/\s/g, "").toUpperCase();

    if (
      cleanBIC &&
      !/^[A-Z]{4}[A-Z]{2}[A-Z0-9]{2}([A-Z0-9]{3})?$/.test(cleanBIC)
    ) {
      newErrors.bic = "BIC must contain 8 or 11 valid characters.";
    }
  }

  if (accountMode === "bank" && !institutionId) {
    newErrors.institutionId = "Please select your bank.";
  }

  setErrors(newErrors);
  return Object.keys(newErrors).length === 0;
}

  // ====================
  // ADD CATEGORY
  // ====================

  function handleAddCategory() {
    const categoryName = cleanCategory(newCategory);

    if (!categoryName) {
      setCategoryError("Category name is required.");
      return;
    }

    if (!isValidCategory(categoryName)) {
      setCategoryError(
        "Category must contain between 3 and 30 characters."
      );
      return;
    }

    if (categoryExists(categories, categoryName)) {
      setCategoryError("This category already exists.");
      return;
    }

    setCategories((currentCategories) => [
      ...currentCategories,
      categoryName,
    ]);

    setNewCategory("");
    setCategoryError("");
  }
  // ====================
  // REMOVE CATEGORY
  // ====================
  function handleRemoveCategory(categoryToRemove) {
    setCategories((currentCategories) =>
      currentCategories.filter(
        (category) => category !== categoryToRemove
      )
    );

    setCategoryError("");
  }

  // ====================
  // GENERATE CATEGORIES
  // ====================

  function handleGeneratedCategories(suggestions) {
    if (!Array.isArray(suggestions)) {
      setCategoryError("The AI returned an invalid category list.");
      return;
    }

    setCategories((currentCategories) => {
      const combined = [...currentCategories];

      suggestions.forEach((suggestion) => {
        if (typeof suggestion !== "string") return;

        const cleaned = cleanCategory(suggestion);

        if (
          cleaned &&
          isValidCategory(cleaned) &&
          !categoryExists(combined, cleaned)
        ) {
          combined.push(cleaned);
        }
      });

      return combined;
    });

    setCategoryError("");
  }

  // ====================
  // SUBMIT FORM
  // ====================


async function handleSubmit(event) {
  event.preventDefault();

  setSubmitError("");
  setCategoryError("");

  if (accountLimitMessage) {
    setSubmitError(accountLimitMessage);
    return;
  }

  if (!validateForm()) return;

  // Keep categories attached to manually created accounts.
  if (
    accountMode === "manual" &&
    categories.length < minimumCategories
  ) {
    setCategoryError(
      `Please add at least ${minimumCategories} categories.`
    );
    return;
  }

  setIsAddingAccount(true);

  try {
    // FLOW 1: Create a manual wallet.
    if (accountMode === "manual") {
      const response = await fetch("/api/bankaccounts", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
          body: JSON.stringify({
          name: bank.trim() || "Manual Bank Account",
          bank: bank.trim() || "Manual",
          accountType: "bank",
          purpose,
          iban: iban.replace(/\s/g, "").toUpperCase() || undefined,
          bic: bic.replace(/\s/g, "").toUpperCase() || undefined,
          balance: 0,
          provider: "manual",
          connectionStatus: "not_connected",
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.error || "Failed to create cash wallet."
        );
      }

      const accountId = data._id || data.account?._id;

      if (!accountId) {
        throw new Error(
          "The created wallet ID was not returned."
        );
      }

      const categoryResults = await Promise.all(
        categories.map((category) =>
          fetch("/api/categories", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              category,
              account: accountId,
            }),
          })
        )
      );

      for (const response of categoryResults) {
        if (!response.ok) {
          const data = await response.json();
          throw new Error(
            data.error || "Failed to create categories."
          );
        }
      }

      await mutate();
      onCancel();
      return;
    }

    // FLOW 2: Start real bank authorization.
    const response = await fetch("/api/banking/connect", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        institutionId,
        name: name.trim(),
        purpose,
      }),
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(
        data.error || "Could not start bank connection."
      );
    }

    if (!data.link) {
      throw new Error(
        "The bank authorization link was not returned."
      );
    }

    // Redirect the user to the bank authorization page.
    window.location.assign(data.link);
  } catch (error) {
    console.error("ACCOUNT FLOW ERROR:", error);

    setSubmitError(
      error.message || "Something went wrong."
    );
  } finally {
    setIsAddingAccount(false);
  }
}


// Load supported German banks
useEffect(() => {
  if (accountMode !== "bank") return;

  let cancelled = false;

  async function loadInstitutions() {
    setIsLoadingInstitutions(true);
    setSubmitError("");

    try {
      const response = await fetch(
        "/api/banking/institutions?country=DE"
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.error || "Could not load supported banks."
        );
      }

      if (!cancelled) {
        setInstitutions(data);
      }
    } catch (error) {
      if (!cancelled) {
        setSubmitError(error.message);
      }
    } finally {
      if (!cancelled) {
        setIsLoadingInstitutions(false);
      }
    }
  }

  loadInstitutions();

  return () => {
    cancelled = true;
  };
}, [accountMode]);

  // ====================
  // RENDER
  // ====================

  return (
    <Form onSubmit={handleSubmit} noValidate>
      <CloseButton
        type="button"
        onClick={onCancel}
        aria-label="Close"
      >
        <X size={20} />
      </CloseButton>
      <FormScrollWrapper>
      <FormTitle>
        Add New Bank
        <br />
        Account Details
      </FormTitle>

      {accountLimitMessage && (
        <ErrorMessage>{accountLimitMessage}</ErrorMessage>
      )}

 
<AccountModeSelector>
  <AccountModeButton
    type="button"
    $active={accountMode === "manual"}
    aria-pressed={accountMode === "manual"}
    onClick={() => setAccountMode("manual")}
  >
    Manual Account
    <ModeDescription>
      Cash wallet and manual transactions
    </ModeDescription>
  </AccountModeButton>

  <AccountModeButton
    type="button"
    $active={accountMode === "bank"}
    aria-pressed={accountMode === "bank"}
    onClick={() => setAccountMode("bank")}
  >
    Connect Bank
    <ModeDescription>
      Import transactions from your bank
    </ModeDescription>
  </AccountModeButton>
</AccountModeSelector>

<FormSubTitle>Account Purpose</FormSubTitle>

<Field>
  <HiddenLabel htmlFor="account-purpose">
    Account Purpose
  </HiddenLabel>
  <select
    id="account-purpose"
    value={purpose}
    onChange={(event) => setPurpose(event.target.value)}
  >
    <option value="private">Private</option>
    <option value="business">Business</option>
    <option value="rent">Rent</option>
  </select>
</Field>

{accountMode === "manual" ? (
  <>
    <FormSubTitle>Manual Wallet</FormSubTitle>

      <Field>
        <HiddenLabel htmlFor="bank-name">Bank Name</HiddenLabel>
        <input
          id="bank-name"
          type="text"
          placeholder="Bank Name (eg. Manual Wallet)"
          value={bank}
          required
          onChange={(event) => setBank(event.target.value)}
        />
        {errors.bank && <ErrorMessage>{errors.bank}</ErrorMessage>}
      </Field>

      <Field>
        <HiddenLabel htmlFor="account-iban">IBAN</HiddenLabel>
        <input
          id="account-iban"
          type="text"
          placeholder="IBAN (optional)"
          value={iban}
          onChange={(event) => setIban(event.target.value)}
        />
        {errors.iban && <ErrorMessage>{errors.iban}</ErrorMessage>}
      </Field>

      <Field>
        <HiddenLabel htmlFor="account-bic">BIC</HiddenLabel>
        <input
          id="account-bic"
          type="text"
          placeholder="BIC (optional)"
          value={bic}
          onChange={(event) => setBic(event.target.value)}
        />
        {errors.bic && <ErrorMessage>{errors.bic}</ErrorMessage>}
      </Field>
  </>
) : (
  <>
    <FormSubTitle>Connect Your Bank</FormSubTitle>

    <Field>
      <HiddenLabel htmlFor="account-name">
        Account Name
      </HiddenLabel>
      <input
        id="account-name"
        type="text"
        placeholder="Account name, e.g. Business Girokonto"
        value={name}
        onChange={(event) => setName(event.target.value)}
      />
      {errors.name && (
        <ErrorMessage>{errors.name}</ErrorMessage>
      )}
    </Field>

    <Field>
      <HiddenLabel htmlFor="institution">
        Select Bank
      </HiddenLabel>
      <select
        id="institution"
        value={institutionId}
        onChange={(event) =>
          setInstitutionId(event.target.value)
        }
        disabled={isLoadingInstitutions}
      >
        <option value="">
          {isLoadingInstitutions
            ? "Loading banks..."
            : "Select your bank"}
        </option>

        {institutions.map((institution) => (
          <option
            key={institution.id}
            value={institution.id}
          >
            {institution.name}
          </option>
        ))}
      </select>

      {errors.institutionId && (
        <ErrorMessage>
          {errors.institutionId}
        </ErrorMessage>
      )}
    </Field>

    <p>
      You will be redirected to authorize secure access.
      MONEO cannot connect to a bank using only an IBAN.
    </p>
  </>
)}


      <CategorySection>
        <CategoryTitle>
          Categories ({categories.length}/{minimumCategories} minimum)
        </CategoryTitle>

        <GenerateCategories
        accountName={name}
        onGenerate={handleGeneratedCategories}
        />

        <CategoryListWrapper>
          {categories.map((category) => (
            <CategoryItem key={category}>
              <span>{category}</span>

            <button
              type="button"
              onClick={() => handleRemoveCategory(category)}
              aria-label={`Remove ${category}`}
            >
              ×
            </button>
            </CategoryItem>
          ))}
        </CategoryListWrapper>

        <CategoryInputWrapper>
          <input
            type="text"
            value={newCategory}
            onChange={(event) => setNewCategory(event.target.value)}
            placeholder="Category name"
            aria-label="New category name"
          />

          <button type="button" onClick={handleAddCategory}>
            + Add Category
          </button>
        </CategoryInputWrapper>

        {categoryError && (
          <ErrorMessage role="alert">
            {categoryError}
          </ErrorMessage>
        )}
      </CategorySection>

      {submitError && (
        <ErrorMessage role="alert">
          {submitError}
        </ErrorMessage>
      )}

      <SubmitButton
        type="submit"
        disabled={isAddingAccount || Boolean(accountLimitMessage)}
      >
        {isAddingAccount ? "Adding account..." : "Add Bank Account"}
      </SubmitButton>

      <CancelButton type="button" onClick={onCancel}>
        Cancel
      </CancelButton>
      </FormScrollWrapper>
    </Form>

  );
}

