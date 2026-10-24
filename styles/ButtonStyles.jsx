
import styled, { css } from "styled-components";


// Base button
export const BaseButton = styled.button`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;

  padding: 0.75rem 1rem;
  border: none;

  font: inherit;
  font-weight: 500;
  cursor: pointer;

  transition:
    opacity 0.2s ease,
    transform 0.2s ease;

  &:hover:not(:disabled) {
    opacity: 0.85;
  }

  &:active:not(:disabled) {
    transform: translateY(1px);
  }

  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
`;

// Sync bank button
export const SyncBankButton = styled(BaseButton)`
  width: 100%;
  background: transparent;
  color: #ddd;

  @media (min-width: 740px) {
    color: #0b0b0b;
  }
`;

// Add bank account button
export const AddButton = styled(BaseButton)`
  width: 100%;
  justify-content: space-between;

  padding: 0.75rem;
  border: 2px solid #555454;
  border-radius: 8px;

  background: ${({ $selected }) =>
    $selected ? "#000" : "transparent"};

  color: ${({ $selected }) =>
    $selected ? "#fff" : "#555454"};

  @media (min-width: 740px) {
    border-color: #000;
    color: ${({ $selected }) =>
      $selected ? "#fff" : "#000"};
  }
`;

// Primary action button
export const PrimaryButton = styled(BaseButton)`
  background: #000;
  color: #fff;
  border: 1px solid #000;
  border-radius: 8px;
`;

// Secondary action button
export const SecondaryButton = styled(BaseButton)`
  background: transparent;
  color: #000;
  border: 1px solid #000;
  border-radius: 8px;
`;

const fullWidthButton = css`
  ${BaseButton}

  width: 100%;
  padding: 1rem;

  border: 2px solid #000;
  border-radius: 8px;
`;


export const MenuButton = styled(BaseButton)`
  position: absolute;
  top: 3rem;
  right: 2rem;
  z-index: 10;

  box-sizing: border-box;
  display: inline-flex;

  width: 48px;
  min-width: 48px;
  height: 48px;
  min-height: 48px;

  padding: 0;
  flex: 0 0 48px;
  aspect-ratio: 1 / 1;

  border: 2px solid #000;
  border-radius: 50%;
  background: #fff;
  color: #000;

  &:hover:not(:disabled) {
    background: #000;
    color: #fff;
    opacity: 1;
  }

  @media (min-width: 740px) {
    right: 5rem;
  }
`;

export const SubmitButton = styled.button`
  ${fullWidthButton}

  background: ${({ $variant }) =>
    $variant === "secondary" ? "#fff" : "#000"};
  color: ${({ $variant }) =>
    $variant === "secondary" ? "#000" : "#fff"};

  &:hover:not(:disabled) {
    opacity: 0.8;
  }
`;

export const CancelButton = styled.button`
  ${fullWidthButton}

  background: #fff;
  color: #000;

  &:hover:not(:disabled) {
    background: #f5f5f5;
  }
`;

export const CloseButton = styled.button`
  ${BaseButton}

    top: 5rem;
    right: 1rem;
    width: 40px;
    height: 40px;
    padding: 0;
    border: 0;
    background: transparent;
    color: #000;
    right: 4rem;
    position: absolute;

  &:hover:not(:disabled) {
    background: #f5f5f5;
  }
`;

export const DeleteButton = styled.button`
  ${fullWidthButton}

  background: #000;
  color: #fff;

  &:hover:not(:disabled) {
    background: #333;
  }
`;

export const DeleteAccountButton = styled.button`
  ${BaseButton}

  position: relative;
  bottom: 0;

  justify-content: flex-start;
  padding: 0.75rem 1rem;

  border: 1px solid lightgrey;
  border-radius: 2rem;

  background: transparent;
  color: #000;
  text-align: left;

  span {
    font-size: 0.875rem;
  }

  &:hover:not(:disabled) {
    background: #f0f0f0;
  }

  @media (min-width: 740px) {
    margin: 0.5rem;
  }
`;


export const IconButton = styled.button`
  ${BaseButton}

  box-sizing: border-box;
  display: inline-flex;
  align-items: center;
  justify-content: center;

  width: 48px;
  min-width: 48px;
  max-width: 48px;

  height: 48px;
  min-height: 48px;
  max-height: 48px;

  flex: 0 0 48px;
  padding: 0;

  border: 2px solid #000;
  border-radius: 50%;

  background: ${({ $variant }) =>
    $variant === "dark" ? "#000" : "#fff"};

  color: ${({ $variant }) =>
    $variant === "dark" ? "#fff" : "#000"};

  &:hover:not(:disabled) {
    background: ${({ $variant }) =>
      $variant === "dark" ? "#fff" : "#000"};

    color: ${({ $variant }) =>
      $variant === "dark" ? "#000" : "#fff"};

    opacity: 1;
  }

  svg {
    width: 24px;
    height: 24px;
    flex-shrink: 0;
  }
`;


export const UploadButton = styled.button`
  ${BaseButton}

  padding: 0.7rem 1rem;

  border: 1px solid #0d0d0d;
  border-radius: 0.5rem;

  background: #fff;
  color: #0d0d0d;

  &:hover:not(:disabled) {
    background: #0d0d0d;
    color: #fff;
  }
`;

export const EditButton = styled.button`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;

  padding: 0.5rem 0.75rem;
  margin-top: 1rem;

  border-top: 1px solid #807f7f;
  border-left: 0;
  border-right: 0;
  border-bottom: 0;
  font-family: inherit;
  font-size: 0.875rem;
  font-weight: 500;

  width: 100%;
  background: transparent;
  color: ${({ $disabled, $selected }) => {
    if ($disabled) return "#202020";
    if ($selected) return "#7c7c7c";
    return "#000";
  }};
  /* border: 1px solid #000; */
  border-radius: 4px;

  cursor: pointer;
  transition:
    background-color 0.2s ease,
    color 0.2s ease;

  &:hover {
    color: #6c6c6c;
  }

  &:focus-visible {
    outline: 2px solid #000;
    outline-offset: 3px;
  }

  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
`;
