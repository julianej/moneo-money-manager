
import { useEffect, useState } from "react";
import styled from "styled-components";
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
  scrollbar-width: none;
  -ms-overflow-style: none;

  &::-webkit-scrollbar {
    display: none;
  }
`;

const Form = styled.form`
  box-sizing: border-box;
  display: flex;
  flex-direction: column;
  gap: 1rem;
  padding: 2rem 1.25rem;
  border: 2px solid #000;
  border-radius: 16px;
  background: #fff;
  width: calc(100% - 1rem);
  max-height: 95vh;
  overflow-y: auto;
  position: fixed;
  top: 0.5rem;
  left: 0.5rem;
  z-index: 77777;

  @media (min-width: 740px) {
    width: 50%;
    left: 25%;
    height: 99vh;
    max-height: 99vh;
    padding: 5rem;
    top: 0;
  }
`;

const FormSubTitle = styled.h2`
  margin: 1rem 0;
  font-size: 1rem;
  line-height: 1.1;
  font-weight: 600;
  text-transform: uppercase;
`;

const AccountModeSelector = styled.div`
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 0.75rem;
  margin: 1.5rem 0;
`;

const AccountModeButton = styled.button`
  min-width: 0;
  border: 1px solid #000;
  padding: 2rem 0.75rem;
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
  font-family: "IBM Plex Mono", monospace;
`;

const Field = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.35rem;

  input,
  select {
    box-sizing: border-box;
    width: 100%;
    min-width: 0;
    padding: 0.75rem;
    border: 1px solid #000;
    border-radius: 6px;
    background: #fff;
    color: #000;
    font: inherit;
  }
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
`;

const CategoryInputWrapper = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
  margin-bottom: 2rem;

  input {
    flex: 1;
    min-width: 140px;
    padding: 0.6rem;
  }

  button {
    padding: 0.5rem 0.75rem;
    border: 1px solid #000;
    border-radius: 8px;
    background: #fff;
    cursor: pointer;
  }
`;

const ErrorMessage = styled.span`
  display: block;
  font-size: 0.85rem;
  margin-bottom: 0.5rem;
  color: #d00;
`;

const InfoMessage = styled.p`
  font-size: 0.85rem;
  line-height: 1.5;
`;

// ====================
// COMPONENT
// ====================

export default function BankAccountForm({
  onCancel,
  account,
  mutate,
  isAddingAccount,
  setIsAddingAccount,
  accountLimitMessage,
}) {
  const isEditing = Boolean(account);
  const minimumCategories = 5;

  // Account mode and purpose
  const [accountMode, setAccountMode] = useState("manual");
  const [purpose, setPurpose] = useState("private");

  // Bank connection
  const [institutions, setInstitutions] = useState([]);
  const [institutionId, setInstitutionId] = useState("");
  const [isLoadingInstitutions, setIsLoadingInstitutions] =
    useState(false);

  // Account fields
  const [bank, setBank] = useState("");
  const [iban, setIban] = useState("");
  const [bic, setBic] = useState("");

  // Validation and errors
  const [errors, setErrors] = useState({});
  const [submitError, setSubmitError] = useState("");

  // Categories
  const [categories, setCategories] = useState([]);
  const [newCategory, setNewCategory] = useState("");
  const [categoryError, setCategoryError] = useState("");

  // ====================
  // POPULATE FORM
  // ====================

useEffect(() => {
  if (account) {
    setPurpose(account.purpose || "private");
    setBank(account.bank || "");
    setIban(account.iban || "");
    setBic(account.bic || "");
  } else {
    setPurpose("private");
    setBank("");
    setIban("");
    setBic("");
  }
}, [account]);

  console.log("Account being edited:", account);

  // ====================
  // LOAD EXISTING CATEGORIES
  // ====================

  useEffect(() => {
    let cancelled = false;

    async function loadCategories() {
      if (!account?._id) {
        setCategories([]);
        return;
      }

      setCategories([]);

      try {
        const response = await fetch(
          `/api/categories?account=${account._id}`
        );

        const data = await response.json();

        if (!response.ok) {
          throw new Error(
            data.error || "Failed to load account categories."
          );
        }

        const categoryData = Array.isArray(data)
          ? data
          : data.categories || [];

        const existingCategories = categoryData
          .map((item) =>
            typeof item === "string" ? item : item.category
          )
          .filter(Boolean);

        if (!cancelled) {
          setCategories(existingCategories);
        }
      } catch (error) {
        console.error("Error loading categories:", error);

        if (!cancelled) {
          setCategoryError(
            "Could not load existing categories."
          );
        }
      }
    }

    loadCategories();

    return () => {
      cancelled = true;
    };
  }, [account?._id]);

  // ====================
  // LOAD SUPPORTED BANKS
  // ====================

  useEffect(() => {
    if (accountMode !== "bank" || isEditing) return;

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
          setInstitutions(Array.isArray(data) ? data : []);
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
  }, [accountMode, isEditing]);

  // ====================
  // VALIDATE FORM
  // ====================

  function validateForm() {
    const newErrors = {};

    if (
      !isEditing &&
      accountMode === "purpose" &&
      !purpose.trim()
    ) {
      newErrors.name = "Please enter an account name.";
    }

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
      !/^[A-Z]{4}[A-Z]{2}[A-Z0-9]{2}([A-Z0-9]{3})?$/.test(
        cleanBIC
      )
    ) {
      newErrors.bic =
        "BIC must contain 8 or 11 valid characters.";
    }

    if (!isEditing && accountMode === "bank" && !institutionId) {
      newErrors.institutionId = "Please select your bank.";
    }

    setErrors(newErrors);

    return Object.keys(newErrors).length === 0;
  }

  // ====================
  // ADD CATEGORY
  // ====================

// ====================
// ADD CATEGORY
// ====================

async function handleAddCategory() {
  const categoryName = cleanCategory(newCategory);
  const accountId = account?._id;

  if (!accountId) {
    setCategoryError("Save the account before adding categories.");
    return;
  }

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

  try {
    const response = await fetch("/api/categories", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        category: categoryName,
        account: accountId,
      }),
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.error || "Failed to add category.");
    }

    setCategories((current) => [...current, categoryName]);
    setNewCategory("");
    setCategoryError("");
  } catch (error) {
    setCategoryError(error.message);
  }
}

  // ====================
  // REMOVE CATEGORY
  // ====================

  function handleRemoveCategory(categoryToRemove) {
    setCategories((current) =>
      current.filter((category) => category !== categoryToRemove)
    );

    setCategoryError("");
  }

  // ====================
  // GENERATE CATEGORIES
  // ====================

  function handleGeneratedCategories(suggestions) {
    if (!Array.isArray(suggestions)) {
      setCategoryError(
        "The AI returned an invalid category list."
      );
      return;
    }

    setCategories((current) => {
      const combined = [...current];

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

    if (!validateForm()) {
      return;
    }

    // Only require five categories when creating a manual wallet.
    if (
      !isEditing &&
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
      // FLOW 1: Update an existing account.
      if (isEditing) {
        const response = await fetch(
          `/api/bankaccounts/${account._id}`,
          {
            method: "PATCH",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              purpose,
              bank: bank.trim() || "Manual",
              iban: iban.trim(),
              bic: bic.trim(),
            }),
          }
        );

        const data = await response.json();

        if (!response.ok) {
          throw new Error(
            data.error || "Failed to update account."
          );
        }

        await mutate();
        onCancel();
        return;
      }

      // FLOW 2: Create a manual wallet.
      if (accountMode === "manual") {
        const response = await fetch("/api/bankaccounts", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            purpose,
            bank: bank.trim() || "Manual",
            accountType: "manual",
            iban: iban.trim(),
            bic: bic.trim(),
            balance: 0,
            provider: "manual",
            connectionStatus: "not_connected",
          }),
        });

        const data = await response.json();

        if (!response.ok) {
          throw new Error(
            data.error || "Failed to create manual wallet."
          );
        }

        const accountId = data._id || data.account?._id;

        if (!accountId) {
          throw new Error(
            "The created wallet ID was not returned."
          );
        }

        // Create categories for the new wallet.
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

        for (const categoryResponse of categoryResults) {
          if (!categoryResponse.ok) {
            let categoryData = {};

            try {
              categoryData = await categoryResponse.json();
            } catch {
              // Keep the fallback error below.
            }

            throw new Error(
              categoryData.error ||
                "Failed to create categories."
            );
          }
        }

        await mutate();
        onCancel();
        return;
      }

      // FLOW 3: Start real bank authorization.
      const response = await fetch("/api/banking/connect", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          institutionId,
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
        <FormSubTitle>
          {isEditing ? "Edit Account" : "Add Account"}
        </FormSubTitle>

        {!isEditing && accountLimitMessage && (
          <ErrorMessage role="alert">
            {accountLimitMessage}
          </ErrorMessage>
        )}

        {/* Account mode selector: creation only */}
        {isEditing && (
          <AccountModeSelector>
            <AccountModeButton
              type="button"
              $active={accountMode === "manual"}
              aria-pressed={accountMode === "manual"}
              onClick={() => setAccountMode("manual")}
            >
              Manual Account
              <ModeDescription>
                Cash wallet, manual transactions and CSV upload.
                Free plan.
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
                Import bank transactions and synchronize your
                account. Paid plan.
              </ModeDescription>
            </AccountModeButton>
          </AccountModeSelector>
        )}

        <FormSubTitle>Account Purpose</FormSubTitle>

        <Field>
          <HiddenLabel htmlFor="account-purpose">
            Account Purpose
          </HiddenLabel>
            <select
              id="account-purpose"
              value={purpose}
              onChange={(event) => setPurpose(event.target.value)}
              required
            >
              <option value="private">Private</option>
              <option value="business">Business</option>
              <option value="rent">Rent</option>
            </select>
        </Field>

        {/* Manual wallet fields, or editable account details */}
        {accountMode === "manual" || isEditing ? (
          <>
            <FormSubTitle>
              {isEditing ? "Account Details" : "Manual Wallet"}
            </FormSubTitle>

            <Field>
              <HiddenLabel htmlFor="bank-name">
                Bank Name
              </HiddenLabel>

              <input
                id="bank-name"
                type="text"
                placeholder="Bank or Wallet name (e.g. N26, Cash Wallet)"
                value={bank}
                onChange={(event) => setBank(event.target.value)}
              />

              {errors.bank && (
                <ErrorMessage>{errors.bank}</ErrorMessage>
              )}
            </Field>

            <Field>
              <HiddenLabel htmlFor="account-iban">
                IBAN
              </HiddenLabel>

              <input
                id="account-iban"
                type="text"
                placeholder="IBAN (optional)"
                value={iban}
                onChange={(event) => setIban(event.target.value)}
              />

              {errors.iban && (
                <ErrorMessage>{errors.iban}</ErrorMessage>
              )}
            </Field>

            <Field>
              <HiddenLabel htmlFor="account-bic">
                BIC
              </HiddenLabel>

              <input
                id="account-bic"
                type="text"
                placeholder="BIC (optional)"
                value={bic}
                onChange={(event) => setBic(event.target.value)}
              />

              {errors.bic && (
                <ErrorMessage>{errors.bic}</ErrorMessage>
              )}
            </Field>
          </>
        ) : (
          <>
            <FormSubTitle>Connect Your Bank</FormSubTitle>

            <Field>
              <HiddenLabel htmlFor="connected-account-name">
                Account Name
              </HiddenLabel>

              <input
                id="connected-account-name"
                type="text"
                placeholder="Account name"
                value={name}
                onChange={(event) => setName(event.target.value)}
                required
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
                onChange={(event) => {
                  const selectedId = event.target.value;
                  setInstitutionId(selectedId);

                  const selectedBank = institutions.find(
                    (institution) =>
                      institution.id === selectedId
                  );

                  if (selectedBank) {
                    const accountNames = {
                      "mock-dkb": "Mietkonto",
                      "mock-n26": "Geschäftskonto",
                      "mock-ing": "Privatkonto",
                    };

                    setName(
                      accountNames[selectedBank.id] ||
                        selectedBank.name
                    );
                  }
                }}
              >
                <option value="">Select a bank</option>

                {institutions.map((institution) => (
                  <option
                    key={institution.id}
                    value={institution.id}
                  >
                    {institution.name}
                  </option>
                ))}
              </select>

              {isLoadingInstitutions && (
                <InfoMessage>Loading supported banks...</InfoMessage>
              )}

              {errors.institutionId && (
                <ErrorMessage>
                  {errors.institutionId}
                </ErrorMessage>
              )}
            </Field>

            <InfoMessage>
              You will be redirected to authorize secure access.
            </InfoMessage>
          </>
        )}

        {/* Categories */}
        
{/* Categories */}
<CategorySection>
  <CategoryTitle>
    Categories ({categories.length}
    {!isEditing && `/${minimumCategories} minimum`})
  </CategoryTitle>

  {/* AI category generation */}
  <GenerateCategories
    accountId={account?._id}
    accountName={purpose}
    onCategoriesGenerated={handleGeneratedCategories}
  />

  {/* Existing categories */}
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

    {/* Manual category input */}
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
          disabled={
            isAddingAccount ||
            (!isEditing && Boolean(accountLimitMessage))
          }
        >
          {isAddingAccount
            ? isEditing
              ? "Saving changes..."
              : accountMode === "bank"
                ? "Connecting..."
                : "Adding account..."
            : isEditing
              ? "Save Changes"
              : accountMode === "bank"
                ? "Connect Bank"
                : "Add Bank Account"}
        </SubmitButton>

        <CancelButton type="button" onClick={onCancel}>
          Cancel
        </CancelButton>
      </FormScrollWrapper>
    </Form>
  );
}
