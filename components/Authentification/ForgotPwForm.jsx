import styled from "styled-components";
import { useState } from "react";

const Title = styled.h1`
  margin: 0 0 8px;
  font-size: 2.5rem;
`;

const Intro = styled.p`
  margin: 0 0 32px;
`;

const Form = styled.form`
  display: flex;
  flex-direction: column;
  gap: 20px;
`;

const Field = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
`;

const Label = styled.label`
  font-size: 0.9rem;
  font-weight: 600;
`;

const Input = styled.input`
  width: 100%;
  padding: 14px 16px;
  border: 2px solid black;
  border-radius: 12px;
  font-size: 1rem;
  box-sizing: border-box;
`;

const SubmitButton = styled.button`
  padding: 14px 20px;
  border: 2px solid black;
  border-radius: 12px;
  background: black;
  color: white;
  font-size: 1rem;
  font-weight: 600;
  cursor: pointer;

  &:hover {
    opacity: 0.8;
  }
`;

const Message = styled.p`
  margin: 0;
`;

const BackButton = styled.button`
  align-self: flex-start;

  padding: 0;
  border: 0;
  background: transparent;

  font-size: 0.9rem;
  text-decoration: underline;
  cursor: pointer;
`;

export default function ForgotPwForm({ onBackToLogin }) {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  async function handleSubmit(event) {
    event.preventDefault();

    setMessage("");
    setError("");

    try {
      const response = await fetch("/api/auth/forgot-pw", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        setError(data.message);
        return;
      }

      setMessage(data.message);
    } catch (error) {
      setError("Something went wrong. Please try again.");
    }
  }

  return (
    <>
      <Title>Forgot password?</Title>

      <Intro> Enter your email address and we&apos;ll send you a password reset link. </Intro>

      <Form onSubmit={handleSubmit}>
        <Field>
          <Label htmlFor="forgot-email">
            Email
          </Label>

          <Input
            id="forgot-email"
            type="email"
            value={email}
            onChange={(event) =>
              setEmail(event.target.value)
            }
            required
          />
        </Field>

        {message && <Message>{message}</Message>}

        {error && <Message>{error}</Message>}

        <SubmitButton type="submit">
          Send reset link
        </SubmitButton>

        <BackButton
          type="button"
          onClick={onBackToLogin}
        >
          Back to login
        </BackButton>
      </Form>
    </>
  );
}