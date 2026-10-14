
import styled, { css } from "styled-components";

const buttonBase = css`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;

  font-family: inherit;
  font-size: 1rem;
  font-weight: 600;

  cursor: pointer;
  transition:
    background 0.2s ease,
    color 0.2s ease,
    border-color 0.2s ease,
    opacity 0.2s ease;

  &:focus-visible {
    outline: 2px solid #000;
    outline-offset: 3px;
  }

  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
`;

const fullWidthButton = css`
  ${buttonBase}

  width: 100%;
  padding: 1rem;

  border: 2px solid #000;
  border-radius: 8px;
`;

export const MenuButton = styled.button`
  ${buttonBase}

  position: absolute;
  top: 3rem;
  right: 2rem;

  width: 48px;
  height: 48px;
  padding: 0;

  border: 2px solid #000;
  border-radius: 50%;
  background: #fff;
  color: #000;

  &:hover:not(:disabled) {
    background: #000;
    color: #fff;
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
  ${buttonBase}

  position: absolute;
  top: 1rem;
  right: 1rem;

  width: 40px;
  height: 40px;
  padding: 0;

  border: 0;
  background: transparent;
  color: #000;

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
  ${buttonBase}

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
  ${buttonBase}

  width: 48px;
  height: 48px;
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
  }
`;

export const UploadButton = styled.button`
  ${buttonBase}

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
