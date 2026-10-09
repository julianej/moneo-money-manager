
import { useState } from "react";
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

  input {
    width: 100%;
    padding: 0.75rem;
    border: 1px solid #000;
    border-radius: 8px;
  }
`;

const ErrorMessage = styled.span`
  font-size: 0.85rem;
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
  // Bank account state
  const [name, setName] = useState("");
  const [bank, setBank] = useState("");
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

    if (!name.trim()) {
      newErrors.name = "Account name is required.";
    } else if (name.trim().length < 2) {
      newErrors.name =
        "Account name must contain at least 2 characters.";
    }

    if (!bank.trim()) {
      newErrors.bank = "Bank is required.";
    }

    const cleanIBAN = iban.replace(/\s/g, "").toUpperCase();

    if (!cleanIBAN) {
      newErrors.iban = "IBAN is required.";
    } else if (
      !/^[A-Z]{2}[0-9]{2}[A-Z0-9]{11,30}$/.test(cleanIBAN)
    ) {
      newErrors.iban = "Please enter a valid IBAN.";
    }

    const cleanBIC = bic.replace(/\s/g, "").toUpperCase();

    if (!cleanBIC) {
      newErrors.bic = "BIC is required.";
    } else if (
      !/^[A-Z]{4}[A-Z]{2}[A-Z0-9]{2}([A-Z0-9]{3})?$/.test(
        cleanBIC
      )
    ) {
      newErrors.bic = "BIC must contain 8 or 11 characters.";
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

    if (categories.length < minimumCategories) {
      setCategoryError(
        `Please add at least ${minimumCategories} categories.`
      );
      return;
    }

    if (!validateForm()) {
      return;
    }

    setIsAddingAccount(true);

    try {
      // 1. Create the bank account
      const response = await fetch("/api/bankaccounts", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: name.trim(),
          bank: bank.trim(),
          iban: iban.replace(/\s/g, "").toUpperCase(),
          bic: bic.replace(/\s/g, "").toUpperCase(),
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.error || "Failed to create bank account."
        );
      }

      // Support either an account object or a direct ID,
      // depending on the API response shape.
      const accountId = data._id || data.account?._id;

      if (!accountId) {
        throw new Error(
          "The account was created, but its ID was not returned by the API."
        );
      }

      // 2. Create the categories for this account
      await Promise.all(
        categories.map(async (category) => {
          const categoryResponse = await fetch("/api/categories", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              category,
              account: accountId,
            }),
          });

          const categoryData = await categoryResponse.json();

          if (!categoryResponse.ok) {
            throw new Error(
              categoryData.error ||
                `Failed to create category "${category}".`
            );
          }
        })
      );

      // 3. Refresh the account data
      await mutate();

      // 4. Close the form after successful creation
      onCancel();
    } catch (error) {
      console.error("CREATE ACCOUNT ERROR:", error);

      setSubmitError(
        error.message ||
          "Something went wrong. Please try again."
      );
    } finally {
      setIsAddingAccount(false);
    }
  }

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

      <FormSubTitle>Bank Account Info</FormSubTitle>

      <Field>
       <HiddenLabel htmlFor="account-name">Account Wallet Name</HiddenLabel>
        <input
          id="account-name"
          type="text"
          placeholder="Wallet Name: Private / Business"
          value={name}
          onChange={(event) => setName(event.target.value)}
        />
        {errors.name && (
          <ErrorMessage>{errors.name}</ErrorMessage>
        )}
      </Field>

      <Field>
          <HiddenLabel htmlFor="bank-name">Bank Name</HiddenLabel>
        <input
          id="bank-name"
          type="text"
          placeholder="Bank"
          value={bank}
          onChange={(event) => setBank(event.target.value)}
        />
        {errors.bank && (
          <ErrorMessage>{errors.bank}</ErrorMessage>
        )}
      </Field>

      <Field>
          <HiddenLabel htmlFor="account-iban">IBAN-</HiddenLabel>
        <input
          id="account-iban"
          type="text"
          placeholder="IBAN"
          value={iban}
          onChange={(event) => setIban(event.target.value)}
        />
        {errors.iban && (
          <ErrorMessage>{errors.iban}</ErrorMessage>
        )}
      </Field>

      <Field>
          <HiddenLabel htmlFor="account-name">BIC</HiddenLabel>
        <input
          id="account-bic"
          type="text"
          placeholder="BIC"
          value={bic}
          onChange={(event) => setBic(event.target.value)}
        />
        {errors.bic && (
          <ErrorMessage>{errors.bic}</ErrorMessage>
        )}
      </Field>
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

