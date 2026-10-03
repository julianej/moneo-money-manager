import styled from "styled-components";
import { useState } from "react";

const AuthWrapper = styled.main`
  min-height: 100vh;
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 20px;
`;

const AuthCard = styled.div`
  width: 100%;
  max-width: 420px;
  padding: 32px;
  border: 2px solid black;
  border-radius: 24px;
`;

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

const ErrorMessage = styled.p`
  margin: 0;
  color: #d00;
`;

export default function LoginForm() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  async function handleSubmit(event) {
    event.preventDefault();

    setError("");

    const response = await fetch("/api/auth/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        email,
        password,
      }),
    });

    const data = await response.json();

    if (!response.ok) {
      setError(data.message);
      return;
    }

    console.log("Logged in:", data.user);
  }

  return (
    <AuthWrapper>
      <AuthCard>
        <Title>Welcome back</Title>

        <Intro>
          Log in to your Money Manager.
        </Intro>

        <Form onSubmit={handleSubmit}>
          <Field>
            <Label htmlFor="email">Email</Label>

            <Input
              id="email"
              type="email"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              required
            />
          </Field>

          <Field>
            <Label htmlFor="password">Password</Label>

            <Input
              id="password"
              type="password"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              required
            />
          </Field>

          {error && <ErrorMessage>{error}</ErrorMessage>}

          <SubmitButton type="submit">
            Log in
          </SubmitButton>
        </Form>
      </AuthCard>
    </AuthWrapper>
  );
}