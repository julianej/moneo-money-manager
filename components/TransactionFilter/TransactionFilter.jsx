import styled from "styled-components";
import DownloadButton from "../DownloadReport/DownloadButton";
import CategoryDropdown from "../CategoriesDropdown/CategoriesDropdown";
import { Plus, ChevronDown } from "lucide-react";

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
  gap: 1rem;
  flex-wrap: nowrap;
`;
const FilterGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.4rem;
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

const AddCategoryInput = styled.input`
  width: 100%;
  padding: 0.75rem 1rem;
  margin: 1rem 0;

  border: 1px solid #000;
  border-radius: 6px;

  font: inherit;
`;

const AddCategoryActions = styled.div`
  display: flex;
  justify-content: flex-end;
  gap: 10px;
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
  gap: 1rem;

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



export default function TransactionFilter({
  transactions = [],
   categories = [],
  filteredTransactions,
  setPdfLoading,
  //SELECTED ACCOUNT OBJECT
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
        {/* ==================== YEAR ==================== */}
        <FilterGroup>
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
        <FilterGroup>
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

        {/* ==================== TYPE ==================== */}
        <FilterGroup>
         <FilterDropdownWrapper>
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
</FilterDropdownWrapper>
        </FilterGroup>

      {/* ==================== ROW 2: CATEGORY ==================== */}
        <FilterGroup>
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
              placeholder="Category name"
            />

            <div>
              <button
                type="button"
                onClick={() => setIsAddCategoryOpen(false)}
              >
                Cancel
              </button>

              <button type="button">
                Add
              </button>
            </div>
          </AddCategoryBox>
        </AddCategoryOverlay>
      )}
  </>
);}