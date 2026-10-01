
import styled from "styled-components";

const Select = styled.select`
  padding: 0.5rem;
`;

export default function CategoryDropdown({ 
  value, 
  onChange,
  categories = [],
  placeholder = "Select category",
}) {

 console.log("TRANSACTION FORM categories:", categories);

   return (
    <Select value={value || ""} onChange={onChange}>
      <option value="">{placeholder}</option>

      {categories.map((category) => (
        <option key={category._id} value={category._id}>
          {/*current category object. and display its value 
            _id: "6abe25347f71929a582176d7",
            category: "Insurance",
            account: "6abe25347f71929a582176d6"
          */}
           {category.category}
        </option>
      ))}
    </Select>
  );
}