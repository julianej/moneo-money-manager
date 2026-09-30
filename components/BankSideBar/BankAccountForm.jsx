import { useState } from "react";
import styled from "styled-components";
import { X, } from "lucide-react";
import {SubmitButton,CancelButton,} from "@/styles/ButtonStyles";


const Form = styled.form`
  display: flex;
  flex-direction: column;
  gap: 1rem;

  padding: 5rem;
  border: 2px solid #000;
  border-radius: 16px;
  background: rgba(255, 255, 255, 0.9);

  width: 100%;
  height: 100%;
  position: fixed;
  z-index: 7777;

  @media (min-width: 740px) {
    width: 50%;
    left: 25%;
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
  margin: 0 0 1rem;
  font-size: 1rem;
  line-height: 1.1;
  font-weight: 600;
  text-transform: uppercase;
`;

const CloseButton = styled.button`
  position: absolute;
  top: 1rem;
  right: 1rem;

  display: flex;
  align-items: center;
  justify-content: center;

  width: 40px;
  height: 40px;
  padding: 0;

  border: 0;
  background: transparent;
  cursor: pointer;
`;


const CategorySection = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
`;

const CategoryTitle = styled.h2`
  margin: 0;
  font-size: 1rem;
  text-transform: uppercase;
`;

const CategoryListWrapper = styled.div`
  display: flex;
  flex-direction: row;
  gap: 0.5rem;
`;

const CategoryItem = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  width: 135px;
  padding: 0.6rem 0.75rem;

  border: 1px solid #000;
  border-radius: 8px;
`;

const CategoryInputWrapper = styled.div`
  display: flex;
  gap: 0.5rem;

  input {
    flex: 1;
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
  color: #d00;
`;


export default function BankAccountForm({
  onCancel,
  mutate,
  setIsAddingAccount,
}) {
  const [name, setName] = useState("");
  const [bank, setBank] = useState("");
  const [iban, setIban] = useState("");
  const [bic, setBic] = useState("");
  // const [balance, setBalance] = useState("");
  const [errors, setErrors] = useState({});

  const [categories, setCategories] = useState([]);
  const [newCategory, setNewCategory] = useState("");

  function validateForm() {
    const newErrors = {};

    // Account name
    if (!name.trim()) {
      newErrors.name = "Account name is required.";
    } else if (name.trim().length < 2) {
      newErrors.name =
        "Account name must contain at least 2 characters.";
    }

    // Bank
    if (!bank.trim()) {
      newErrors.bank = "Bank is required.";
    }

    // IBAN
    if (!iban.trim()) {
      newErrors.iban = "IBAN is required.";
    } else {
      const cleanIBAN = iban
        .replace(/\s/g, "")
        .toUpperCase();

      if (
        !/^[A-Z]{2}[0-9]{2}[A-Z0-9]{11,30}$/.test(cleanIBAN)
      ) {
        newErrors.iban = "Please enter a valid IBAN.";
      }
    }

    // BIC
    if (!bic.trim()) {
      newErrors.bic = "BIC is required.";
    } else {
      const cleanBIC = bic
        .replace(/\s/g, "")
        .toUpperCase();

      if (
        !/^[A-Z]{4}[A-Z]{2}[A-Z0-9]{2}([A-Z0-9]{3})?$/.test(
          cleanBIC
        )
      ) {
        newErrors.bic =
          "BIC must contain 8 or 11 characters.";
      }
    }

    // Balance
  //   if (balance === "") {
  //     newErrors.balance = "Balance is required.";
  //   } else if (isNaN(Number(balance))) {
  //     newErrors.balance = "Balance must be a number.";
  //   }



    setErrors(newErrors);

    return Object.keys(newErrors).length === 0;
  }


    // Add Categories
    function handleAddCategory() {
      const name = newCategory.trim();

      if (!name) return;

      const alreadyExists = categories.some(
        (category) => category.toLowerCase() === name.toLowerCase()
      );

      if (alreadyExists) {
        return;
      }

      setCategories((currentCategories) => [
        ...currentCategories,
        name,
      ]);

      setNewCategory("");
    }
    // Remove Categories
    function handleRemoveCategory(categoryToRemove) {
      setCategories((currentCategories) =>
        currentCategories.filter(
          (category) => category !== categoryToRemove
        )
      );
    }


  async function handleSubmit(event) {
  event.preventDefault();

  // 01.Validate Form
  if (!validateForm()) {
    return;
  }

  // 02. add Account
  setIsAddingAccount(true);

  try {
    // 1. Create bank account
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
      console.error("BANK ACCOUNT ERROR:", data);
      return;
    }

    console.log("BANK ACCOUNT CREATED:", data);

    // 2. Create categories for the new account
    for (const category of categories) {
      console.log("SENDING CATEGORY:", {
        category: category,
        account: data._id,
      });

      const categoryResponse = await fetch("/api/categories", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          category: category,
          account: data._id,
        }),
      });

      const categoryData = await categoryResponse.json();

      console.log(
        "CATEGORY RESPONSE:",
        categoryResponse.status,
        categoryData
      );

      if (!categoryResponse.ok) {
        console.error("CATEGORY ERROR:", categoryData);
        throw new Error("Category creation failed");
      }
    }
    // 3. Refresh bank accounts
    await mutate();

    // 4. Close form
    onCancel();
  } catch (error) {
  console.error("CREATE ACCOUNT ERROR:", error);
  } finally {
    setIsAddingAccount(false);
  }
}

  return (
    <Form onSubmit={handleSubmit} noValidate>
      <CloseButton
        type="button"
        onClick={onCancel}
        aria-label="Close"
      >
        <X size={20} />
      </CloseButton>

      <FormTitle>
        Add New Bank
        <br />
        Account Details
      </FormTitle>

      <FormSubTitle>Bank Account Info</FormSubTitle>

      <Field>
         <label htmlFor="account-name">Account Name</label>
        <input
          type="text"
          placeholder="Account name"
          value={name}
          onChange={(event) =>
            setName(event.target.value)
          }
        />

        {errors.name && (
          <ErrorMessage>{errors.name}</ErrorMessage>
        )}
      </Field>

      <Field>
        <label htmlFor="bank-name">Bank Name</label>
        <input
          type="text"
          placeholder="Bank"
          value={bank}
          onChange={(event) =>
            setBank(event.target.value)
          }
        />

        {errors.bank && (
          <ErrorMessage>{errors.bank}</ErrorMessage>
        )}
      </Field>

      <Field>
          <label htmlFor="account-iban">IBAN</label>

        <input
          type="text"
          placeholder="IBAN"
          value={iban}
          onChange={(event) =>
            setIban(event.target.value)
          }
        />

        {errors.iban && (
          <ErrorMessage>{errors.iban}</ErrorMessage>
        )}
      </Field>

      <Field>
        <label htmlFor="account-bic">BIC</label>

        <input
          type="text"
          placeholder="BIC"
          value={bic}
          onChange={(event) =>
            setBic(event.target.value)
          }
        />

        {errors.bic && (
          <ErrorMessage>{errors.bic}</ErrorMessage>
        )}
      </Field>

      {/* <Field>
          <label htmlFor="account-balance">Balance</label>

        <input
          type="number"
          placeholder="Balance"
          value={balance}
          onChange={(event) =>
            setBalance(event.target.value)
          }
        />

        {errors.balance && (
          <ErrorMessage>
            {errors.balance}
          </ErrorMessage>
        )}
      </Field> */}
      <CategorySection>
        <CategoryTitle>Categories</CategoryTitle>
  <CategoryListWrapper>
        {categories.map((category) => (
          <CategoryItem key={category}>
            <span>{category}</span>

            <button
              type="button"
              onClick={() => handleRemoveCategory(category)}
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
          />

          <button
            type="button"
            onClick={handleAddCategory}
          >
            + Add category
          </button>
        </CategoryInputWrapper>
      </CategorySection>

      <SubmitButton type="submit">
        Add Bank Account
      </SubmitButton>

      <CancelButton
        type="button"
        onClick={onCancel}
      >
        Cancel
      </CancelButton>
    </Form>
  );
}