import styled from "styled-components";
import { Trash2 } from "lucide-react";
import { getCategoryIcon } from "../../helpers/categoryHelper";

const CategoryList = styled.div`
  margin-top: 1.5rem;
`;

const CategoryListTitle = styled.span`
  display: block;
  margin-bottom: 0.75rem;

  font-size: 0.75rem;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.05em;
`;

const CategoryTiles = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 0.75rem;
`;

const CategoryItem = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.4rem;

  width: 4.5rem;
`;

const CategoryIconWrapper = styled.div`
  position: relative;

  display: flex;
  align-items: center;
  justify-content: center;

  width: 3.5rem;
  height: 3.5rem;

  border: 1px solid #e5e5e5;
  border-radius: 0.5rem;
  background: #fff;
`;

const CategoryIcon = styled.span`
  display: flex;
  align-items: center;
  justify-content: center;

  color: #111;

  svg {
    width: 20px;
    height: 20px;
  }
`;

const DeleteCategoryButton = styled.button`
  position: absolute;
  top: -0.4rem;
  right: -0.4rem;

  display: flex;
  align-items: center;
  justify-content: center;

  width: 1.25rem;
  height: 1.25rem;

  padding: 0;

  border: 1px solid #e5e5e5;
  border-radius: 50%;

  background: #fff;
  color: #111;

  cursor: pointer;

  &:hover {
    background: #111;
    color: #fff;
  }
`;

const CategoryName = styled.span`
  text-align: center;
`;

export default function CategoryManager({
  categories = [],
  mutateCategories,
  selectedCategories,
  setSelectedCategories,
}) {
  async function handleDeleteCategory(categoryId) {
    try {
      const response = await fetch(`/api/categories/${categoryId}`, {
        method: "DELETE",
      });

      const data = await response.json();

      if (!response.ok) {
        console.error(data.error);
        return;
      }

      await mutateCategories();

      if (selectedCategories.includes(categoryId)) {
        setSelectedCategories([]);
      }
    } catch (error) {
      console.error(error);
    }
  }

  return (
    <CategoryList>
      <CategoryListTitle>
        Existing Categories
      </CategoryListTitle>

      <CategoryTiles>
        {categories.length > 0 ? (
          categories.map((category) => (
            <CategoryItem key={category._id}>
              <CategoryIconWrapper>
                <CategoryIcon>
                  {getCategoryIcon(category.category)}
                </CategoryIcon>

                <DeleteCategoryButton
                  type="button"
                  onClick={() =>
                    handleDeleteCategory(category._id)
                  }
                  aria-label={`Delete ${category.category}`}
                >
                  <Trash2 size={12} />
                </DeleteCategoryButton>
              </CategoryIconWrapper>

              <CategoryName>
                {category.category}
              </CategoryName>
            </CategoryItem>
          ))
        ) : (
          <span>No categories yet.</span>
        )}
      </CategoryTiles>
    </CategoryList>
  );
}