
import styled from "styled-components";

export default function Welcome({ variant = "default" }) {
  return (
    <WelcomeWrapper $variant={variant}>
      <h1> Welcome to Money Manager [MONEO]</h1>
       <h2>Keep track of your finances, manage your bank accounts,
        and stay informed about your transactions.
      </h2> 
    </WelcomeWrapper>
  );
}

const WelcomeWrapper = styled.section`
  padding: 3rem;
  background: transparent;
  border: 2px solid black;
  border-radius: 1rem;
  width: 100%;

  p {
    font-size: 2rem;
    line-height: 1.5;
  }

  h1 {
    font-size: 2rem;
    text-transform: uppercase;
    margin-bottom: 1.5rem;
    margin-top: 4rem;
  }
  
  h2 {
      font-size: 2rem;
    }


   @media (min-width: 740px) {
   width: 100%;
   padding-right: 40%;
   font-size: 3rem; }

    @media (min-width:1024px) {

    h2 {
      font-size: 4rem;
    }}


  /* DASHBOARD */
  ${({ $variant }) =>
    $variant === "dashboard" && `
      h1 {
        font-size: 1rem;
        margin-top: 1rem;
      }
      h2 {
       font-size: 1.7rem;
       }

    @media (min-width: 740px) {
      h1 {
        font-size: 1rem;
        padding-right: 0;
        }

    `}

`;