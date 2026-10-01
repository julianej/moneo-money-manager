import styled from "styled-components";
import DownloadButton from "../DownloadReport/DownloadButton";
import CategoryDropdown from "../CategoriesDropdown/CategoriesDropdown";

import { useEffect, useState,} from "react";

const FilterWrapper = styled.div`
  display: flex;
  flex-direction: row;
  gap: 1rem;
  padding: 2rem 0;
  overflow: scroll;

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

const FilterLabel = styled.label`
  font-size: 14px;
  font-weight: 600;
  color: #0d0d0d;
`;

const FilterSelect = styled.select`
  width: 100%;
  padding: 0.7rem 0.8rem;

  border: 1px solid lightgray;
  border-radius: 0.5rem;

  background: white;
  color: #0d0d0d;

  font-size: 16px;
  cursor: pointer;

  &:focus {
    outline: none;
    border-color: black;
  }

  @media (min-width: 740px) {
    width: auto;
    min-width: 160px;
  }
`;


const MonthSelect = styled.select`
  width: 100%;
  padding: 0.7rem 0.8rem;

  border: 1px solid lightgray;
  border-radius: 2rem;

  background: white;
  color: #0d0d0d;

  font-size: 16px;
  cursor: pointer;

  &:focus {
    outline: none;
    border-color: black;
  }

  @media (min-width: 740px) {
    width: auto;
    min-width: 160px;
  }
`;

export default function TransactionFilter({
  transactions = [],
   categories = [],
  filteredTransactions,
  setPdfLoading,
  //SELECTED ACCOUNT
  selectedAccount,
  selectedYear,
  setSelectedYear,
  selectedMonth,
  setSelectedMonth,
  selectedType,
  setSelectedType,
  selectedCategories,
  setSelectedCategories,
}) {

  console.log("categories:", categories);

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
// CATEGORIES
// ====================

  const availableCategories = [
    ...new Set(
      transactions
        .filter((transaction) => {
          const transactionYear = new Date(transaction.date)
            .getFullYear()
            .toString();

          const matchesYear =
            selectedYear === "all" || transactionYear === selectedYear;

          const matchesType =
            selectedType === "all" || transaction.type === selectedType;

          return matchesYear && matchesType;
        })
          .map((transaction) => transaction.category)
          // .map((transaction) => {
          //   const category = categories.find((
          //     category) => category._id === transaction.category
          // );
          // return category?.category;
        // })

      .filter(Boolean)
  ),
].sort();


// ====================
// RESET CATEGORY
// ====================

useEffect(() => {
  setSelectedCategories([]);
}, [selectedYear, selectedType, setSelectedCategories]);

  return (
    <FilterWrapper>
        {/* ... / PDF DOWNLAOD */}
      <DownloadButton
          transactions={filteredTransactions}
          categories={categories}
          account={selectedAccount}
          setPdfLoading={setPdfLoading}
          selectedType={selectedType}
        />
 <FilterRow>
{/* ==================== YEAR ==================== */}
      <FilterGroup>
  <FilterLabel htmlFor="year-filter">
    Year
  </FilterLabel>

  <FilterSelect
    id="year-filter"
    value={selectedYear}
    onChange={(event) => setSelectedYear(event.target.value)}
  >
    <option value="all">All Years</option>

    {years.map((year) => (
      <option key={year} value={year}>
        {year}
      </option>
    ))}
  </FilterSelect>
</FilterGroup>
{/* ==================== MONTH ==================== */}

<FilterGroup>
  <FilterLabel htmlFor="month-filter">
    Month
  </FilterLabel>

  <MonthSelect
    id="month-filter"
    value={selectedMonth}
    onChange={(event) => setSelectedMonth(event.target.value)}
  >
    <option value="all">All Months</option>
    <option value="0">January</option>
    <option value="1">February</option>
    <option value="2">March</option>
    <option value="3">April</option>
    <option value="4">May</option>
    <option value="5">June</option>
    <option value="6">July</option>
    <option value="7">August</option>
    <option value="8">September</option>
    <option value="9">October</option>
    <option value="10">November</option>
    <option value="11">December</option>
  </MonthSelect>
</FilterGroup>

  {/* ==================== TYPE ==================== */}
  <FilterGroup>
    <FilterLabel htmlFor="type-filter">
      Type
    </FilterLabel>

    <FilterSelect
      id="type-filter"
      value={selectedType}
      onChange={(event) => setSelectedType(event.target.value)}
    >
      <option value="all">All Types</option>
      <option value="income">Income</option>
      <option value="expense">Expense</option>
    </FilterSelect>
  </FilterGroup>
  </FilterRow>
  {/* ==================== ROW 2: CATEGORY ==================== */}
  <FilterRow>
  <FilterGroup>
          <FilterLabel htmlFor="category-filter">
            Category
          </FilterLabel>

           <CategoryDropdown
                value={selectedCategories[0] || ""}
                categories={categories}
                placeholder="All Categories"
                onChange={(event) => {
                  const value = event.target.value;

                  setSelectedCategories(value ? [value] : []);
                }}
              />
        </FilterGroup>
      </FilterRow>
    </FilterWrapper>
  );
}