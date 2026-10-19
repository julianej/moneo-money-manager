import styled, { createGlobalStyle } from "styled-components";

export const GlobalStyle = createGlobalStyle`

  *,
  *::before,
  *::after {
    box-sizing: border-box;
  }

  :root {
      --input-radius: 0.5rem;
    }

  @font-face {
    font-family: "IBM Plex Mono";
    src: url("/lib/fonts/IBM_Plex_Mono/IBMPlexMono-Regular.ttf")
      format("truetype");
    font-weight: 400;
    font-style: normal;
  }

  @font-face {
    font-family: "Silkscreen";
    src: url("/lib/fonts/Silkscreen-Regular.ttf")
      format("truetype");
    font-weight: 400;
    font-style: normal;
  }


  body {
    margin: 0;
    background-color: #f2f2f2;
    font-family: Arial, sans-serif;
    background-repeat: repeat;
    background-size: 600px 300px;
  }

  h1 {
  font-family: "IBM Plex Mono", monospace;
  font-weight: 100;
  font-style: normal;
}

  a {
    color: black;
    text-decoration: none;
  }
  
  input,
  select,
  textarea {
    width: 100%;
    padding: 0.8rem;

    border: 1px solid #000;
    border-radius: var(--input-radius);


    background: #fff;
    color: #000;

    font-family: inherit;
    font-size: 1rem;

    outline: none;
  }

  input:focus,
  select:focus,
  textarea:focus {
    border-color: #666;
  }

  input::placeholder,
  textarea::placeholder {
    color: #999;
  }

  button {
    font-family: inherit;
  }

  .hidden {
  position: absolute;
  width: 1px;
  height: 1px;
  padding: 0;
  margin: -1px;
  overflow: hidden;
  clip: rect(0, 0, 0, 0);
  white-space: nowrap;
  border: 0;}
`;

  
export const HiddenLabel = styled.label`
  position: absolute;
  width: 1px;
  height: 1px;
  padding: 0;
  margin: -1px;
  overflow: hidden;
  clip: rect(0, 0, 0, 0);
  white-space: nowrap;
  border: 0;
`;

export const Input = styled.input`
  width: 100%;
  box-sizing: border-box;
  padding: 0.9rem 1rem;

  border: 1px solid #ccc;
  border-radius: 8px;

  background: #fff;
  color: #111;
  font: inherit;

  &::placeholder {
    color: #777;
  }

  &:focus-visible {
    outline: 2px solid #111;
    outline-offset: 2px;
  }
`;

export const Message = styled.textarea`
  width: 100%;
  box-sizing: border-box;
  min-height: 10rem;
  padding: 0.9rem 1rem;

  border: 1px solid #ccc;
  border-radius: 8px;

  background: #fff;
  color: #111;
  font: inherit;
  line-height: 1.6;

  resize: vertical;

  &::placeholder {
    color: #777;
  }

  &:focus-visible {
    outline: 2px solid #111;
    outline-offset: 2px;
  }
`;

export const Select = styled.select`
  width: 100%;
  box-sizing: border-box;
  padding: 0.9rem 1rem;

  border: 1px solid #ccc;
  border-radius: 8px;

  background: #fff;
  color: #111;
  font: inherit;

  cursor: pointer;

  &:hover:not(:disabled) {
    border-color: #777;
  }

  &:focus-visible {
    outline: 2px solid #111;
    outline-offset: 2px;
  }

  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
`;
