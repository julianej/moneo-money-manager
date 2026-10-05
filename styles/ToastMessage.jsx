import styled from "styled-components";

export const Toast = styled.div`
  position: fixed;
  top: 0;
  width: 100%;
  box-sizing: border-box;
  z-index: 9999;

  display: flex;
  text-align: center;
  justify-content: space-between;
  gap: 2rem;

  padding: 1.25rem 1.5rem;

  background: #090909;
  color: white;

  animation: slideDown 0.4s ease-out;

  @keyframes slideDown {
    from {
      top: -150px;
    }

    to {
      top: 0;
    }
  }
`;

export const ToastContent = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.35rem;
  padding: 4rem 1rem 4rem;

  flex: 1;
  text-align: center;
`;

export const ToastTitle = styled.strong`
  font-size: 0.85rem;
  font-weight: 100;
  text-transform: uppercase;
  letter-spacing: 0.08em;
`;

export const ToastText = styled.span`
  white-space: pre-line;

  font-size: 1rem;
  line-height: 1.4;
  line-height: 1.4;

  @media (min-width: 740px) {
    font-size: 5rem;
    line-height: 5rem;
  }
`;

export const ToastClose = styled.button`
  border: none;
  background: transparent;
  color: white;

  font-size: 1.5rem;
  line-height: 1;

  cursor: pointer;
  padding: 0;
`;