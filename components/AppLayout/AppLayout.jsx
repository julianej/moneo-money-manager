// components/Layout/Layout.jsx

import styled from "styled-components";
import BankSideBar from "../BankSideBar/BankSideBar";

const Main = styled.main`
  display: flex;
  flex-direction: column;

  @media (min-width: 740px) {
    flex-direction: row;
  }
`;

const SidebarWrapper = styled.aside`
  padding: 1.5rem 1rem;
  width: 100%;
  border-right: 2px solid black;

  @media (min-width: 740px) {
    width: 25%;
  }
`;

const MainContent = styled.div`
  width: 100%;
  padding: 0 20px;
  margin: 0 auto;

  @media (min-width: 740px) {
    width: 70%;
  }
`;

export default function Layout({ children }) {
  return (
    <Main>
      <SidebarWrapper>
        <BankSideBar />
      </SidebarWrapper>

      <MainContent>
        {children}
      </MainContent>
    </Main>
  );
}