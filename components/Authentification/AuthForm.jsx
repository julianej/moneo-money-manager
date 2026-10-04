import styled from "styled-components";
import { useState } from "react";

import LogInForm from "./LogInForm";
import RegisterForm from "./RegisterForm";
import ForgotPwForm from "./ForgotPwForm";

export default function AuthView({ onClose }) {
  const [activeView, setActiveView] = useState("login");

  return (
    <AuthCard>
      <CloseButton
        type="button"
        onClick={onClose}
        aria-label="Close authentication"
      >
        ×
      </CloseButton>

      {activeView !== "forgot-pw" && (
        <Tabs>
          <Tab
            type="button"
            $active={activeView === "login"}
            onClick={() => setActiveView("login")}
          >
            Login
          </Tab>

          <Tab
            type="button"
            $active={activeView === "register"}
            onClick={() => setActiveView("register")}
          >
            Register
          </Tab>
        </Tabs>
      )}

      {activeView === "login" && (
        <LogInForm
          onForgotPassword={() => setActiveView("forgot-pw")}
        />
      )}

      {activeView === "register" && (
        <RegisterForm
          onRegistered={() => setActiveView("login")}
        />
      )}

      {activeView === "forgot-pw" && (
        <ForgotPwForm
          onBackToLogin={() => setActiveView("login")}
        />
      )}
    </AuthCard>
  );
}

const AuthCard = styled.div`
  position: relative;
  width: 100%;
  max-width: 420px;
  padding: 1.5rem;
  background: #fff;
  border-radius: 1rem;
  box-sizing: border-box;
`;

const CloseButton = styled.button`
  position: absolute;
  top: 1rem;
  right: 1rem;

  width: 2rem;
  height: 2rem;

  border: 0;
  background: transparent;

  font-size: 1.5rem;
  cursor: pointer;
`;

const Tabs = styled.div`
  display: flex;
  margin-bottom: 1.5rem;
  border-bottom: 2px solid #000;
`;

const Tab = styled.button`
  flex: 1;

  padding: 0.75rem 1rem;

  border: 0;
  border-bottom: 3px solid
    ${({ $active }) => ($active ? "#000" : "transparent")};

  background: transparent;

  font-size: 1rem;
  font-weight: 600;

  cursor: pointer;
`;