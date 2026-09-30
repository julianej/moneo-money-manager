import useSWR from "swr";
import styled from "styled-components";

const Select = styled.select`
  padding: 0.5rem;
`;

export default function CategoryDropdown({ 
  value, 
  onChange,
  selectedAccount,
}) {

  // Selected ACCOUNT maped to CATEGORIES
  const { data: categories, error } = useSWR(
        selectedAccount ? `/api/categories?account=${selectedAccount}`
              : null
        );

  console.log("SELECTED ACCOUNT:", selectedAccount);
  console.log("CATEGORIES:", categories);
  console.log("CATEGORY ERROR:", error);
        
  if (error) {
    return <p>Could not load categories.</p>;
  }

  if (!categories) {
    return <p>Loading categories...</p>;
  }

   return (
    <Select value={value || ""} onChange={onChange}>
      <option value="">Select category</option>

      {categories.map((category) => (
        <option key={category._id} value={category._id}>
          {category.name}
        </option>
      ))}
    </Select>
  );
}