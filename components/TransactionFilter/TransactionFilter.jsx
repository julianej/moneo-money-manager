import styled from "styled-components";
import DownloadButton from "../DownloadReport/DownloadButton";

import { useEffect, useState } from "react";

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
  align-items: center;
  gap: 0.5rem;
`;

const FilterLabel = styled.span`
  font-weight: 600;
    margin-right: 4px;
  font-size: 14px;
`;

const FilterButton = styled.button`
  padding: 8px 14px;
  border: 1px solid #ccc;
  border-radius: 20px;
  background: ${({ $active }) =>
    $active ? "black" : "transparent"};
  color: ${({ $active }) =>
    $active ? "white" : "black"};

  cursor: pointer;
  transition: 0.2s ease;

  &:hover {
    background: #000;
    color: #fff;
  }
`;

export default function TransactionFilter({
  transactions = [],
  filteredTransactions,
  selectedYear,
  setSelectedYear,
  selectedType,
  setSelectedType,
  selectedCategories,
  setSelectedCategories,
}) {

const [showAllYears, setShowAllYears] = useState(false);
const [showAllCategories, setShowAllCategories] = useState(false);

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
      .filter(Boolean)
  ),
].sort();


function toggleCategory(category) {
  setSelectedCategories((current) => {
    if (current.includes(category)) {
      return current.filter((item) => item !== category);
    }

    return [...current, category];
  });
}

// First 4 categories
  const visibleCategories = showAllCategories
    ? availableCategories
    : availableCategories.slice(0, 4);

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
      />
       <FilterRow>
      {/* ==================== YEAR ==================== */}
      <FilterGroup>
        <FilterLabel>Year</FilterLabel>
      
      {/* ALL */}
      <FilterButton
        $active={selectedYear === "all"}
        onClick={() => setSelectedYear("all")}
      >
        All
      </FilterButton>

       {/* FIRST 2x YEARS */}
      {years
        .slice(0, 2)
        .map((year) => (
          <FilterButton
            key={year}
            $active={selectedYear === year}
            onClick={() => setSelectedYear(year)}
          >
            {year}
          </FilterButton>
        ))}

       {/* REMAINING YEARS */}
        {showAllYears &&
          years.slice(2).map((year) => (
            <FilterButton
              key={year}
              $active={selectedYear === year}
              onClick={() => setSelectedYear(year)}
            >
              {year}
            </FilterButton>
          ))}

      {/* ... EXTENDED YEARS */}
        {years.length > 2 &&
          (!showAllYears ? (
            <FilterButton onClick={() => setShowAllYears(true)}>
              ...
            </FilterButton>
          ) : (
            <FilterButton onClick={() => setShowAllYears(false)}>
              −
            </FilterButton>
          ))}
       </FilterGroup>

    {/* ==================== TYPE ==================== */}
        <FilterGroup>
            <FilterLabel>Type</FilterLabel>

            <FilterButton
            $active={selectedType === "all"}
            onClick={() => setSelectedType("all")}
            >
            All
            </FilterButton>

            <FilterButton
            $active={selectedType === "income"}
            onClick={() => setSelectedType("income")}
            >
            Income
            </FilterButton>

            <FilterButton
            $active={selectedType === "expense"}
            onClick={() => setSelectedType("expense")}
            >
            Expense
            </FilterButton>
        </FilterGroup>
    </FilterRow>

       {/* ==================== ROW 2: CATEGORY ==================== */}
<FilterRow>
  <FilterGroup>

    <FilterLabel>Category</FilterLabel>

    {/* ALL */}
      <FilterButton
        $active={selectedCategories.length === 0}
        onClick={() => setSelectedCategories([])}
      >
        All
          </FilterButton>

          {/* FIRST 4 CATEGORIES */}
          {visibleCategories.map((category) => (
            <FilterButton
              key={category}
              $active={selectedCategories.includes(category)}
              onClick={() => toggleCategory(category)}
            >
              {category}
            </FilterButton>
          ))}

          {/* ... / COLLAPSE */}
          {availableCategories.length > 4 &&
            (!showAllCategories ? (
              <FilterButton onClick={() => setShowAllCategories(true)}>
                ...
              </FilterButton>
            ) : (
              <FilterButton onClick={() => setShowAllCategories(false)}>
                −
              </FilterButton>
            ))}

        </FilterGroup>
      </FilterRow>
    </FilterWrapper>
  );
}