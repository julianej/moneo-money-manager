
import { useEffect, useState } from "react";
import { Trash2 } from "lucide-react";
import useSWR from "swr";
import styled from "styled-components";


// ====================
// STYLES
// ====================

const CreateForm = styled.form`
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
  margin: 0  auto 2rem;
  padding: 2rem;
  border: 1px solid #e5e5e5;
  border-radius: 16px;
  background: #ffffff;
`;

const EditForm = styled(CreateForm)`
  width: 100%;
  gap: 0.75rem;
  padding: 1rem;
  border-radius: 10px;

  ${({ $isSelected }) =>
    $isSelected &&
    `
      border: 2px solid black;
      background-color: #f0f0f0;
    `}
`;

const Heading = styled.h2`
  margin: 0 0 0.5rem;
  font-size: 1.5rem;
`;

const Field = styled.div`
  display: flex;
  width: 100%;
  flex-direction: column;
  gap: 0.5rem;
`;

const Label = styled.label`
  font-weight: 600;
  font-size: 0.9rem;
`;

const Input = styled.input`
  width: 100%;
  padding: 0.75rem 1rem;
  border: 1px solid #ccc;
  border-radius: 8px;
  font: inherit;
  box-sizing: border-box;

  &:focus {
    outline: none;
    border-color: #000;
  }
`;

const Select = styled.select`
  width: 100%;
  padding: 0.75rem 1rem;
  border: 1px solid #ccc;
  border-radius: 8px;
  background: white;
  font: inherit;
  box-sizing: border-box;

  &:focus {
    outline: none;
    border-color: #000;
  }
`;

const Fieldset = styled.fieldset`
  display: flex;
  flex-direction: column;
  gap: 0.50rem;
  border: none;
  width: 35%;
  margin: 0;
  padding: 0;
`;

const RadioGroup = styled.div`
  display: flex;
  gap: 0.5rem;
  width: 100%;
`;

const RadioLabel = styled.label`
  display: flex;
  align-items: center;
  gap: 0.5rem;    
  width: 50%;
  cursor: pointer;
  padding: 0.8rem;
  border: 1px solid lightgrey;
  border-radius: 0.5rem;

  input[type="radio"] {
    width: 16px;
    height: 16px;
    margin: 0;
    accent-color: #000;
  }
`;

const DeleteButton = styled.button`
  background: lightgrey;
  padding: 0.5rem 0.5rem 0.4rem;
  border-radius: 0.5rem;
  border: 1px solid lightgray;
  color: #0d0d0d ;
`;

const Button = styled.button`
  padding: 0.8rem 1.2rem;
  border: none;
  border-radius: 8px;

  background: #000;
  color: #fff;

  font: inherit;
  font-weight: 600;

  cursor: pointer;

  &:hover {
    opacity: 0.8;
  }
`;

const SubmitButton = styled.button`
  padding: 12px 20px;
  border: none;
  border-radius: 8px;
  cursor: pointer;

  background: #111;
  color: white;

  font-size: 16px;
`;

const ButtonWrapper = styled.div`
  display: flex;
  width:100%;
  gap: 12px;
  justify-content: flex-end;
  align-items: center;
`;

const SaveButton = styled(Button)`
  background: black;
  width: 70%;
  color: white;
`;

const CancelButton = styled(Button)`
  background: transparent;
  width: 30%;
  color: black;
  border: 1px solid black;
`;

// Used ONLY by the edit form
const EditRow = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1rem;

  @media (min-width: 740px) {
    flex-direction: row;}

  > ${Field},
  > ${Fieldset} {
   flex: 1 1 0;
  }
`;


// ====================
// COMPONENT
// ====================

export default function TransactionForm({
  transaction,
  selectedAccount,
  onCancel,
  onDelete,
  onSave,
  isDeleting,
  showToast,
  mutate
}) {

  // ====================
  // STATE
  // ====================

  const [submitError, setSubmitError] = useState("");

  const [title, setTitle] = useState("");
  const [amount, setAmount] = useState("");
  const [category, setCategory] = useState("");
  const [type, setType] = useState("");
  const [date, setDate] = useState("");

  // const { data: errors, .. } = useFormState();
  const {data: categories, error, isLoading } = useSWR("/api/categories");

  // ====================
  // POPULATE FORM
  // ====================

  // useEffect(()=>{
  //   setTrigger(); // After this the errors are re/generated 
  // },[someDependency])

  useEffect(() => {
    if (transaction) {

      // Edit mode INPUTS
      setTitle(transaction.title);
      setAmount(Math.abs(transaction.amount));
      setCategory(transaction.category);
      setType(transaction.type);

      // transaction.date from "2024-07-01T00:00:00"
      const transactionDate = new Date(transaction.date);

      // Expected Output:
      // getFullYear() → 2026
      // getMonth()    → 8 + 1 → 09 //// January  = 0
      // getDate()     → 16
      // .padStart(2, "0")}` // month always has two digits "12"

      setDate(
        `${transactionDate.getFullYear()}-${String(
          transactionDate.getMonth() + 1 
        ).padStart(2, "0")}-${String(
          transactionDate.getDate()
        ).padStart(2, "0")}` 
      );

    } else {

      // Create mode EMPTY INPUTS
      setTitle("");
      setAmount("");
      setCategory("");
      setType("");

      const now = new Date();

      // date NOW
      setDate(
        `${now.getFullYear()}-${String(
          now.getMonth() + 1
        ).padStart(2, "0")}-${String(
          now.getDate()
        ).padStart(2, "0")}`
      );
    }
  }, [transaction]);


  // ====================
  // FORM SUBMIT 
  // ====================

  async function handleSubmit(event) {
    event.preventDefault();

    // current date and time
    const now = new Date();

    const [year, month, day] = date
      .split("-")
      .map(Number);

    // current transactionDate
    const transactionDate = new Date(
      year,
      month - 1,
      day,
      now.getHours(),
      now.getMinutes(),
      now.getSeconds()
    );

    try {

      // EDIT MODE = Boolean true _id 
      const isEditing = Boolean(transaction);

      const response = await fetch(
      isEditing
        ? `/api/transactions/${transaction._id}`
        : "/api/transactions",
      {
        method: isEditing ? "PATCH" : "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          title,
          amount:
            type === "expense"
              ? -Math.abs(Number(amount))
              : Math.abs(Number(amount)),
          category,
          type,
          date: transactionDate.toISOString(),
          account: selectedAccount,
        }),
      }
    );

    const data = await response.json();

    if (!response.ok) {
      setSubmitError(
        data.error || "Failed to save transaction."
      );
      return;
    }

    // setSuccessMessage
    showToast(
      isEditing
        ? "Transaction updated successfully."
        : "Transaction added successfully."
    );

  // ====================
  // TRANSACTION MUTATE
  // ====================

    await mutate();

    // If editing, call onSave updates the TransactionCard
    if (isEditing) {
      onSave(transaction._id);
      showToast("Transaction updated successfully.");
      return;
    }


    // ====================
    // RESET FORM
    // ====================

      setAmount("");
      setTitle("");
      setCategory("");
      setType("");

      setDate(
        `${now.getFullYear()}-${String(
          now.getMonth() + 1
        ).padStart(2, "0")}-${String(
          now.getDate()
        ).padStart(2, "0")}`
      );

    } catch (error) {

      setSubmitError(
        "Something went wrong. Please try again."
      );
    }
  }


  // ====================
  // LOADING / ERROR
  // ====================

  if (isLoading) {
    return <p>Loading categories...</p>;
  }

  if (error) {
    return <p>Failed to load categories.</p>;
  }


  // Select which form style to use
  const FormComponent = transaction
    ? EditForm
    : CreateForm;


  // ====================
  // RENDER
  // ====================

 return (
  <FormComponent onSubmit={handleSubmit}>
    <Heading>
      {transaction ? "Edit Transaction" : "Add Transaction"}
    </Heading>

    {submitError && <p>{submitError}</p>}

  <EditRow>
      <Field>
        <Label htmlFor="title">Transaction Title</Label>
        <Input
          id="title"
          type="text"
          value={title}
          onChange={(event) => setTitle(event.target.value)}
          minLength={3}
          pattern="[A-Za-zÄÖÜäöüß ]+"
          required
        />
      </Field>

      <Field>
        <Label htmlFor="amount">Transaction Amount</Label>
        <Input
          id="amount"
          type="number"
          value={amount}
          onChange={(event) => setAmount(event.target.value)}
          required
        />
      </Field>
  </EditRow>
  <EditRow>
    <Field>
      <Label htmlFor="category">Transaction Category</Label>
      <Select
        id="category"
        value={category}
        onChange={(event) => setCategory(event.target.value)}
        required
      >
        <option value="">Please select a category</option>

        {categories.map((item) => (
          <option key={item._id} value={item.category}>
            {item.category}
          </option>
        ))}
      </Select>
    </Field>

    <Fieldset>
      <Label>Transaction Type</Label>

      <RadioGroup>
        {["income", "expense"].map((option) => (
          <RadioLabel key={option}>
            <input
              type="radio"
              name="type"
              value={option}
              checked={type === option}
              onChange={(event) => setType(event.target.value)}
              required={option === "income"}
            />
            {option === "income" ? "Income" : "Expense"}
          </RadioLabel>
        ))}
      </RadioGroup>
    </Fieldset>
</EditRow>
    <Field>
      <Label htmlFor="date">Transaction Date</Label>
      <Input
        id="date"
        type="date"
        value={date}
        onChange={(event) => setDate(event.target.value)}
        required
      />
    </Field>
      {transaction ? (
        <EditRow>
          <ButtonWrapper>
            <SaveButton type="submit">
              Save
            </SaveButton>

            <CancelButton type="button" onClick={onCancel}>
              Cancel
            </CancelButton>

              <DeleteButton
                type="button"
                onClick={onDelete}
              >
                <Trash2 size={18} />
              </DeleteButton>
          </ButtonWrapper>
        </EditRow>
      ) : (
        <SubmitButton type="submit">
          Add transaction
        </SubmitButton>
      )}
  </FormComponent>
)};