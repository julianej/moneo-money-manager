import styled from "styled-components";
import { useState } from "react";

import LogInForm from "./LogInForm";
import RegisterForm from "./RegisterForm";

export default function AuthView({ onClose }) {
    
  const [activeTab, setActiveTab] = useState("login");

  function handleRegistered() {
    setActiveTab("login");
  }

  return (
    <AuthCard>
      <CloseButton
        type="button"
        onClick={onClose}
        aria-label="Close authentication"
      >
        ×
      </CloseButton>

      <Tabs>
        <Tab
          type="button"
          $active={activeTab === "login"}
          onClick={() => setActiveTab("login")}
        >
          Login
        </Tab>

        <Tab
          type="button"
          $active={activeTab === "register"}
          onClick={() => setActiveTab("register")}
        >
          Register
        </Tab>
      </Tabs>

      {activeTab === "login" && (
        <LogInForm
          onClose={onClose}
        />
      )}

      {activeTab === "register" && (
        <RegisterForm
          onClose={onClose}
          onRegistered={handleRegistered}
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