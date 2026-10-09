
import { useState } from "react";
import styled from "styled-components";
import { Sparkles } from "lucide-react";

const GenerateButton = styled.button`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  padding: 0.75rem 1rem;
  border: 1px solid #000;
  border-radius: 8px;
  background: #000;
  color: #fff;
  cursor: pointer;

  &:hover {
    background: #333;
  }

  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
`;

const ErrorMessage = styled.p`
  color: #d00;
  font-size: 0.875rem;
`;

export default function GenerateCategories({ onGenerate, accountName }) {
  const [isGenerating, setIsGenerating] = useState(false);
  const [error, setError] = useState("");

  async function handleGenerate() {
    setIsGenerating(true);
    setError("");

    try {
      const response = await fetch("/api/gemini/generate-categories", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ accountName }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Could not generate categories.");
      }

      if (!Array.isArray(data.categories)) {
        throw new Error("The API did not return a category list.");
      }

      onGenerate(data.categories);
    } catch (error) {
      console.error("Generate categories error:", error);
      setError(error.message || "Something went wrong.");
    } finally {
      setIsGenerating(false);
    }
  }

  return (
    <>
      <GenerateButton
        type="button"
        onClick={handleGenerate}
        disabled={isGenerating || !accountName.trim()}
      >
        <Sparkles size={16} />
        {isGenerating ? "Generating..." : "Generate 5 Categories"}
      </GenerateButton>

      {error && <ErrorMessage role="alert">{error}</ErrorMessage>}
    </>
  );
}