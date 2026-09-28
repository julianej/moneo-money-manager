import { createGlobalStyle } from "styled-components";


export const GlobalStyle = createGlobalStyle`

  *,
  *::before,
  *::after {
    box-sizing: border-box;
  }

  body {
    margin: 0;
    background-color: #f2f2f2;
    font-family: Arial, sans-serif;
    background-repeat: repeat;
    background-size: 600px 300px;
  }
  
   input,
  select,
  textarea {
    width: 100%;
    padding: 1rem;

    border: 1px solid #000;
    border-radius: 8px;

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

  