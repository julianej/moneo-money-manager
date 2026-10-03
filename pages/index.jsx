import Welcome from "@/components/Welcome/Welcome";
import MenuProfile from "@/components/MenuProfile/MenuProfile";
import AsciiBackground from "@/components/AsciiBackground/AsciiBackground";
import LoginForm from "@/components/Auth/LoginForm";


import { useState } from "react";
// import { useRouter } from "next/router";


export default function HomePage() {
  // const router = useRouter();

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

  // function onLogIn() {
  //   router.push("/dashboard");
  // }

  const [isLoginFormOpen, setIsLoginFormOpen] = useState(false); // HERE SET LOGIN-FORM LATER

  return (
    <main>
      <Welcome variant="default" />
      <AsciiBackground />
       <MenuProfile 
       isMenuOpen={isMenuOpen} 
       setIsMenuOpen={setIsMenuOpen} 
       isLoggedIn={false} 
      // onLogin={onLogIn} 
       listItems={listMenuItems} />

    {/* LOGIN FORM AS ANOTHER FEATURE*/} 
         {isLoginFormOpen && ( 
          <LoginForm
            onClose={() => setIsLoginFormOpen(false)}
          />
        )}
    </main>
  )};