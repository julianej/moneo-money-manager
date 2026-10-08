import styled from "styled-components";


export const MenuButton = styled.button`
  display: flex;
  align-items: center;
  justify-content: center;

  width: 48px;
  height: 48px;

    padding: 0;
    right: 2rem;
    position: absolute;
    border: 2px solid #000;
    border-radius: 50%;
    background: #fff;
    color: #000;
    cursor: pointer;
    top: 3rem;

  border: 2px solid #000;
  border-radius: 50%;

  background: #fff;
  color: #000;

  cursor: pointer;

  &:hover {
    background: #000;
    color: #fff;
  }

  @media (min-width: 740px) {
    display:block;
    right: 5rem;
  }
`;

export const SubmitButton = styled.button`
  width: 100%;
  padding: 1rem;

  border: 2px solid #000;
  border-radius: 8px;

  background: #000;
  color: #fff;

  font-family: inherit;
  font-size: 1rem;
  font-weight: 600;

  cursor: pointer;

  &:hover {
    opacity: 0.8;
  }
`;

export const CancelButton = styled.button`
  width: 100%;
  padding: 1rem;

  border: 2px solid #000;
  border-radius: 8px;

  background: #fff;
  color: #000;

  font-family: inherit;
  font-size: 1rem;
  font-weight: 600;

  cursor: pointer;

  &:hover {
    background: #f5f5f5;
  }
`;

export const CloseButton = styled.button`
  position: absolute;
  top: 1rem;
  right: 1rem;

  display: flex;
  align-items: center;
  justify-content: center;

  width: 40px;
  height: 40px;
  padding: 0;

  border: 0;
  background: transparent;
  cursor: pointer;
`;

export const DeleteButton = styled.button`
  width: 100%;
  padding: 1rem;

  border: 2px solid #000;
  border-radius: 8px;

  background: black;
  color: #fff;

  font-family: inherit;
  font-size: 1rem;
  font-weight: 600;

  cursor: pointer;

  &:hover {
    background: #000;
    color: #fff;
  }
`;

export const DeleteAccountButton = styled.button`
 display: flex;
    align-items: center;
    gap: 0.75rem;
    bottom: 0;
    position: relative;
    position: relative;
    bottom: 0;
    padding: 0.75rem 1rem;
    border-radius: 2rem;
    border: 0.1rem solid lightgrey;
    background: transparent;
    color: #000;
    cursor: pointer;
    text-align: left;
    display: flex;
  cursor: pointer;
  text-align: left;

  span {
    font-size: 0.875rem;
  }

  &:hover {
    background: grey;
    color: #000;
  }

    @media (min-width: 740px) {
        margin: 0.5rem;
    }
`;

export const IconButton = styled.button`
  display: flex;
  align-items: center;
  justify-content: center;

  width: 48px;
  height: 48px;
  padding: 0;

  border: 2px solid #000;
  border-radius: 50%;

  cursor: pointer;

  ${({ $variant }) =>
    $variant === "dark"
      ? `
        background: #000;
        color: #fff;

        &:hover {
          background: #fff;
          color: #000;
        }
      `
      : `
        background: #fff;
        color: #000;

        &:hover {
          background: #000;
          color: #fff;
        }
      `}
`;

export const UploadButton = styled.button`
  display: flex;
  align-items: center;
  gap: 0.5rem;

  padding: 0.7rem 1rem;

  border: 1px solid #0d0d0d;
  border-radius: 0.5rem;

  background: white;
  color: #0d0d0d;

  cursor: pointer;

  &:hover {
    background: #0d0d0d;
    color: white;
  }
`;