import styled from "styled-components";
import DownloadButton from "../DownloadReport/DownloadButton";
import CategoryManager from "../CategoryManager/CategoryManager";
import {
  cleanCategory,
  isValidCategory,
  categoryExists,
} from "../../utils/cleanCategory";
import {
  Plus,
  ChevronDown,
} from "lucide-react";

import { useEffect, useState,} from "react";

const FilterWrapper = styled.div`
  display: flex;
  flex-direction: row;
  gap: 1rem;
  padding: 2rem 0;

  @media (min-width: 739px) {
        flex-direction: row;
  }
`;

const FilterRow = styled.div`
  display: flex;
  align-items: center;
  gap: 0rem;
  flex-wrap: wrap;


  @media (min-width: 738px) {
    gap: 1rem;
      flex-wrap: nowrap;
  }
`;

const FilterGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.4rem;
  width: 100%;
  order: ${({ $order }) => $order};

  @media (min-width: 738px) {
    order: ${({ $desktopOrder }) => $desktopOrder};
  }
`;


const AddCategoryButton = styled.button`
  display: flex;
  align-items: center;
  gap: 6px;

  width: 100%;
  padding: 0.65rem 0.75rem;

  margin-top: 0.25rem;
  border: none;
  border-top: 1px solid #ddd;

  background: transparent;
  color: #000;

  text-align: left;
  font: inherit;

  cursor: pointer;

  &:hover {
    background: #f2f2f2;
  }
`;


const AddCategoryOverlay = styled.div`
  position: fixed;
  inset: 0;
  z-index: 2000;

  display: flex;
  align-items: center;
  justify-content: center;

  padding: 20px;

  background: rgba(0, 0, 0, 0.5);
`;

const AddCategoryBox = styled.div`
  width: 100%;
  max-width: 400px;

  padding: 2rem;

  background: #fff;
  color: #000;

  border-radius: 12px;
  border: 2px solid #000;
`;

const FilterDropdownWrapper = styled.div`
  position: relative;
  width: 100%;

  @media (min-width: 740px) {
    width: 175px;
  }
`;

const FilterDropdownButton = styled.button`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 0rem;

  width: 100%;
  padding: 0.75rem 1rem;

  background: #fff;
  color: #000;

  border: 1px solid #000;
  border-radius: 8px;

  font: inherit;
  cursor: pointer;

  &:hover {
    background: #f5f5f5;
  }
    @media (min-width: 740px) {
      padding: 0.75rem 1rem;
        gap: 1rem;

  }
`;

const FilterDropdownMenu = styled.div`
  position: absolute;
  top: calc(100% + 6px);
  left: 0;
  z-index: 1000;

  width: 100%;
  max-height: 250px;
  overflow-y: auto;

  padding: 0.5rem;

  background: #fff;
  border: 1px solid #000;
  border-radius: 8px;

  box-shadow: 0 8px 20px rgba(0, 0, 0, 0.15);
`;

const FilterOption = styled.button`
  display: block;

  width: 100%;
  padding: 0.65rem 0.75rem;

  border: none;
  background: transparent;

  color: #000;
  text-align: left;
  font: inherit;

  cursor: pointer;

  &:hover {
    background: #f2f2f2;
  }
`;

const TypeToggle = styled.div`
  display: flex;
  align-items: center;
  width: 100%;
  border: 1px solid #000;
  border-radius: 8px;
  overflow: hidden;

  @media (min-width: 740px) {
    width: 160px;
  }
`;

const TypeOption = styled.button`
  flex: 1;
  padding: 0.75rem 0.5rem;

  border: ${({ $active }) => ($active ? "1px solid #000" : "1px solid #fff")};
  background: ${({ $active }) => ($active ? "#000" : "#fff")};
  color: ${({ $active }) => ($active ? "#fff" : "#000")};

  font: inherit;
  cursor: pointer;

  &:hover {
    background: ${({ $active }) => ($active ? "#000" : "#f2f2f2")};
  }
`;



export default function TransactionFilter({
  transactions = [],
  categories = [],
  mutateCategories,
  filteredTransactions,
  setPdfLoading,
  selectedAccountData,
  selectedYear,
  setSelectedYear,
  selectedMonth,
  setSelectedMonth,
  selectedType,
  setSelectedType,
  selectedCategories,
  setSelectedCategories,
}) {

const [openFilter, setOpenFilter] = useState(null);
const [isCategoryOpen, setIsCategoryOpen] = useState(false);

const [isAddCategoryOpen, setIsAddCategoryOpen] = useState(false);
const [newCategory, setNewCategory] = useState("");
const [categoryError, setCategoryError] = useState("");

async function handleAddCategory() {
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

  if (!selectedAccountData?._id) {
    setCategoryError("No account selected.");
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
        account: selectedAccountData._id,
      }),
    });

    const data = await response.json();

    if (!response.ok) {
      setCategoryError(
        data.error || "Could not add category."
      );
      return;
    }

    console.log("Category created:", data);

    await mutateCategories();

    setNewCategory("");
    setCategoryError("");
    setIsAddCategoryOpen(false);

  } catch (error) {
    console.error("Add category error:", error);
    setCategoryError("Something went wrong.");
  }
}


async function handleDeleteCategory(categoryId) {
  try {
    const response = await fetch(`/api/categories/${categoryId}`, {
      method: "DELETE",
    });

    const data = await response.json();

    if (!response.ok) {
      setCategoryError(data.error || "Could not delete category.");
      return;
    }

    await mutateCategories();

    if (selectedCategories.includes(categoryId)) {
      setSelectedCategories([]);
    }
  } catch (error) {
    console.error(error);
    setCategoryError("Something went wrong.");
  }
}


// ====================
// YEARS
// ====================

// years → data from database

  const years = [
    ...new Set(transactions
      .map((transaction) =>
      //"2026-09-17T10:30:00.000Z"
        new Date(transaction.date).getFullYear().toString()
      )
      // 2026
    ),
    ].sort((a, b) => Number(b) - Number(a));
  ;


// ====================
// RESET CATEGORY
// ====================
useEffect(() => {
  setSelectedCategories([]);
}, [
  selectedYear,
  selectedMonth,
  selectedType,
  setSelectedCategories,
]);

const selectedCategory = categories?.find(
  (category) => category._id === selectedCategories[0]
);

  return (
  <>
    <FilterWrapper>

      {/* PDF DOWNLOAD */}
      <DownloadButton
        transactions={filteredTransactions}
        categories={categories}
        account={selectedAccountData}
        setPdfLoading={setPdfLoading}
        selectedType={selectedType}
      >
        Download PDF
      </DownloadButton>

      <FilterRow>

    {/* ==================== TYPE ==================== */}
       <FilterGroup $order={1}>
          <TypeToggle>
              <TypeOption
                type="button"
                $active={
                  selectedType === "income" ||
                  selectedType === "all"
                }
                onClick={() => {
                  if (selectedType === "all") {
                    setSelectedType("income");
                  } else if (selectedType === "income") {
                    setSelectedType("all");
                  } else if (selectedType === "expense") {
                    setSelectedType("all");
                  } else {
                    setSelectedType("expense");
                  }
                }}
              >
                Income
              </TypeOption>

              <TypeOption
                type="button"
                $active={
                  selectedType === "expense" ||
                  selectedType === "all"
                }
                onClick={() => {
                  if (selectedType === "all") {
                    setSelectedType("expense");
                  } else if (selectedType === "expense") {
                    setSelectedType("all");
                  } else if (selectedType === "income") {
                    setSelectedType("all");
                  } else {
                    setSelectedType("income");
                  }
                }}
              >
              Expense
              </TypeOption>
            </TypeToggle>
         {/* <FilterDropdownWrapper>
              <FilterDropdownButton
                type="button"
                onClick={() =>
                  setOpenFilter(
                    openFilter === "type" ? null : "type"
                  )
                }
              >
                {selectedType === "all"
                  ? "All Types"
                  : selectedType === "income"
                  ? "Income"
                  : "Expense"}

                <ChevronDown size={16} />
              </FilterDropdownButton>

              {openFilter === "type" && (
                <FilterDropdownMenu>
                  <FilterOption
                    type="button"
                    onClick={() => {
                      setSelectedType("all");
                      setOpenFilter(null);
                    }}
                  >
                    All Types
                  </FilterOption>

                  <FilterOption
                    type="button"
                    onClick={() => {
                      setSelectedType("income");
                      setOpenFilter(null);
                    }}
                  >
                    Income
                  </FilterOption>

                  <FilterOption
                    type="button"
                    onClick={() => {
                      setSelectedType("expense");
                      setOpenFilter(null);
                    }}
                  >
                    Expense
                  </FilterOption>
                </FilterDropdownMenu>
              )}
            </FilterDropdownWrapper> */}
        </FilterGroup>


        {/* ==================== YEAR ==================== */}
       <FilterGroup $order={2}>
          <FilterDropdownWrapper>
            <FilterDropdownButton
              type="button"
              onClick={() =>
                setOpenFilter(
                  openFilter === "year" ? null : "year"
                )
              }
            >
              {selectedYear === "all" ? "All Years" : selectedYear}
              <ChevronDown size={16} />
          </FilterDropdownButton>

          {openFilter === "year" && (
            <FilterDropdownMenu>
              <FilterOption
                type="button"
                onClick={() => {
                  setSelectedYear("all");
                  setOpenFilter(null);
                }}
              >
                All Years
              </FilterOption>

              {years.map((year) => (
                <FilterOption
                  key={year}
                  type="button"
                  onClick={() => {
                    setSelectedYear(year);
                    setOpenFilter(null);
                  }}
                >
                  {year}
                </FilterOption>
              ))}
            </FilterDropdownMenu>
          )}
        </FilterDropdownWrapper>
        </FilterGroup>

        {/* ==================== MONTH ==================== */}
       <FilterGroup $order={3}>
          <FilterDropdownWrapper>
            <FilterDropdownButton
              type="button"
              onClick={() =>
                setOpenFilter(
                  openFilter === "month" ? null : "month"
                )
              }
            >
              {selectedMonth === "all"
                ? "All Months"
                : [
                    "January",
                    "February",
                    "March",
                    "April",
                    "May",
                    "June",
                    "July",
                    "August",
                    "September",
                    "October",
                    "November",
                    "December",
                  ][Number(selectedMonth)]}

              <ChevronDown size={16} />
            </FilterDropdownButton>

            {openFilter === "month" && (
              <FilterDropdownMenu>
                <FilterOption
                  type="button"
                  onClick={() => {
                    setSelectedMonth("all");
                    setOpenFilter(null);
                  }}
                >
                  All Months
                </FilterOption>

                {[
                  "January",
                  "February",
                  "March",
                  "April",
                  "May",
                  "June",
                  "July",
                  "August",
                  "September",
                  "October",
                  "November",
                  "December",
                ].map((month, index) => (
                  <FilterOption
                    key={month}
                    type="button"
                    onClick={() => {
                      setSelectedMonth(String(index));
                      setOpenFilter(null);
                    }}
                  >
                    {month}
                  </FilterOption>
                ))}
              </FilterDropdownMenu>
            )}
          </FilterDropdownWrapper>
        </FilterGroup>

        
      {/* ==================== ROW 2: CATEGORY ==================== */}
        <FilterGroup $order={4}>
         <FilterDropdownWrapper>
          <FilterDropdownButton
              type="button"
              onClick={() => setIsCategoryOpen((current) => !current)}
            >
              {selectedCategory?.category || "All Categories"}
              <ChevronDown size={16} />
            </FilterDropdownButton>
              {isCategoryOpen && (
                <FilterDropdownMenu>
                  <FilterOption
                    type="button"
                    onClick={() => {
                      setSelectedCategories([]);
                      setIsCategoryOpen(false);
                    }}
                  >
                    All Categories
                  </FilterOption>
                    {categories.map((category) => (
                      <FilterOption
                        key={category._id}
                        type="button"
                        onClick={() => {
                          setSelectedCategories([category._id]);
                          setIsCategoryOpen(false);
                        }}
                      >
                        {category.category}
                      </FilterOption>
                    ))}
                  {/* {categories.map((category) => (
                    <option key={category._id} value={category._id}>
                      {category.category}
                    </option>
                  ))} */} 
                     <AddCategoryButton
                    type="button"
                    onClick={() => {
                      setIsCategoryOpen(false);
                      setIsAddCategoryOpen(true);
                    }}
                  >
                    <Plus size={16} />
                    Add Category
                  </AddCategoryButton>
                </FilterDropdownMenu>
              )}
            </FilterDropdownWrapper>
        </FilterGroup>
      </FilterRow>

    </FilterWrapper>
    {isAddCategoryOpen && (
        <AddCategoryOverlay>
          <AddCategoryBox>
            <h3>Add Category</h3>

            <input
              type="text"
              value={newCategory}
              onChange={(event) => {
                setNewCategory(event.target.value);
                setCategoryError("");
              }}
              placeholder="Category name"
            />
            <div>
              <button
                type="button"
                onClick={() => {
                  setNewCategory("");
                  setCategoryError("");
                  setIsAddCategoryOpen(false);
                }}
              >
                Cancel
              </button>

              <button
                type="button"
                onClick={handleAddCategory}
              >
                Add
              </button>
            </div>

            {categoryError && (
              <p>{categoryError}</p>
            )}

            <CategoryManager
                categories={categories}
                mutateCategories={mutateCategories}
                selectedCategories={selectedCategories}
                setSelectedCategories={setSelectedCategories}
              />
          </AddCategoryBox>
        </AddCategoryOverlay>
      )}
  </>
);}