import Welcome from "@/components/Welcome/Welcome";
import styled from "styled-components";
import MenuProfile from "@/components/MenuProfile/MenuProfile";
import AsciiBackground from "@/components/AsciiBackground/AsciiBackground";
import LoginForm from "@/components/Authentification/LogInForm";


import { useState } from "react";
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

export default function HomePage() {
  // const router = useRouter();
  
  const [isLoginFormOpen, setIsLoginFormOpen] = useState(false); // HERE SET LOGIN-FORM LATERs
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const listMenuItems = [
    {
      label: "About",
      href: "#about",
    },
    {
      label: "Benefits",
      href: "#projects",
    },
    {
      label: "Prices",
      href: "#projects",
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

      <AsciiBackground />

       <MenuProfile 
          isMenuOpen={isMenuOpen} 
          setIsMenuOpen={setIsMenuOpen} 
          isLoggedIn={false} 
          onLogIn={onLogIn}
          // onLogin={onLogIn} 
          listItems={listMenuItems} />

    {/* LOGIN FORM AS ANOTHER FEATURE*/} 
         {isLoginFormOpen && ( 
          <LoginOverlay>
            <LoginForm
              onClose={() => setIsLoginFormOpen(false)}
            />
          </LoginOverlay>
        )}
    </main>
  )};