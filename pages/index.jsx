import Welcome from "@/components/Welcome/Welcome";
import styled from "styled-components";
import MenuProfile from "@/components/MenuProfile/MenuProfile";
import AsciiBackground from "@/components/AsciiBackground/AsciiBackground";
import AuthForm from "@/components/Authentification/AuthForm";
import Benefits from "@/components/AccountingBenefits/AccountingBenefits";

import { useState } from "react";
import GraphSection from "@/components/GraphChartSection/GraphChartSection";
// import { useRouter } from "next/router";


const LoginOverlay = styled.div`
  position: fixed;
  inset: 0;
  z-index: 1000;

  display: flex;
  justify-content: center;
  align-items: center;

  background: rgba(0, 0, 0, 0.5);
`;


const StartButton = styled.button`
  display: block;
  /* margin: 1.5rem auto; */
  padding: 0.9rem 1.5rem;
  left: 5rem;
  position: relative;

  font-family: inherit;
  font-size: 1rem;
  font-weight: 600;

  color: white;
  background: black;
  border: 1px solid black;
  border-radius: 4px;

  cursor: pointer;
  transition: background 0.2s ease, color 0.2s ease;

  &:hover {
    color: black;
    background: white;
  }

  &:focus-visible {
    outline: 2px solid black;
    outline-offset: 4px;
  }
`;

const Sections = styled.section`
  scroll-margin-top: 2rem;

`;

export default function HomePage() {
  // const router = useRouter();

  const [isLoginFormOpen, setIsLoginFormOpen] = useState(false); // HERE SET LOGIN-FORM LATERs
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const scrollToBenefits = () => {
    document.getElementById("benefits")?.scrollIntoView({
      behavior: "smooth",
      block: "start",
    });
  };

  const listMenuItems = [
    {
      label: "About",
      href: "#about",
    },
    {
      label: "Benefits",
      onClick: scrollToBenefits,
    },
    {
      label: "Analytics",
      href: "#analytics",
    },
    {
      label: "Contact",
      href: "#contact",
    },
  ];


  function onLogIn() {
        setIsLoginFormOpen(true);
    // router.push("/dashboard");
  }

  return (
    <main>
      <Welcome variant="default" />
      <StartButton onClick={onLogIn}>
          Start with a Free Account
        </StartButton>
        <Sections id="benefits">
          <Benefits />
        </Sections>
        <Sections id="analytics">
            <GraphSection />
          </Sections>
      <AsciiBackground />

       <MenuProfile 
          isMenuOpen={isMenuOpen} 
          setIsMenuOpen={setIsMenuOpen} 
          isLoggedIn={false} 
          onLogIn={onLogIn}
          onScrollToBenefits={scrollToBenefits}
          listItems={listMenuItems} />

    {/* LOGIN FORM */} 
         {isLoginFormOpen && ( 
          <LoginOverlay>
             <AuthForm
              onClose={() => setIsLoginFormOpen(false)}
            />
          </LoginOverlay>
        )}
    </main>
  )};