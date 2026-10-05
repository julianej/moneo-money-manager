import styled from "styled-components";
import { useState } from "react";

export default function RegisterForm({ onClose, onRegistered }) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

 // handle form submission 
  async function handleSubmit(event) {
    event.preventDefault();

    // Reset error and success messages before making the request
    setError("");
    setSuccess("");
    setIsSubmitting(true);

    // TRY CATCH BLOCK FOR REGISTERING USER
    try {
      const response = await fetch("/api/auth/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name,
          email,
          password,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        setError(data.message || "Registration failed.");
        return;
      }

      setSuccess("Account created successfully.");

// Reset form fields after successful registration
      setName("");
      setEmail("");
      setPassword("");

// Call the onRegistered callback if provided
      if (onRegistered) {
        onRegistered(data.user);
      }
    } catch (error) {
      setError("Something went wrong. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <RegisterCard>
      <Title>Create Account</Title>

      <Intro>
        Create your Money Manager account.
      </Intro>

      <Form onSubmit={handleSubmit}>
        <Field>
          <Label htmlFor="name">Name</Label>

          <Input
            id="name"
            type="text"
            value={name}
            onChange={(event) => setName(event.target.value)}
            required
          />
        </Field>

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
            minLength={8}
          />
        </Field>

        {error && <ErrorMessage>{error}</ErrorMessage>}

        {success && <SuccessMessage>{success}</SuccessMessage>}

{/*Disable the submit button while submitting to prevent multiple submissions */}        
    <SubmitButton 
        type="submit" 
        disabled={isSubmitting}>
          {isSubmitting ? "Creating account..." : "Create account"}
        </SubmitButton>
      </Form>
    </RegisterCard>
  );
}

const RegisterCard = styled.div`
  position: relative;

  width: 100%;
  max-width: 420px;
  padding: 2rem;

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

const Title = styled.h1`
  margin: 0 0 0.5rem;
`;

const Intro = styled.p`
  margin: 0 0 2rem;
`;

const Form = styled.form`
  display: flex;
  flex-direction: column;
  gap: 1.25rem;
`;

const Field = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
`;

const Label = styled.label`
  font-weight: 600;
`;

const Input = styled.input`
  width: 100%;
  padding: 0.875rem 1rem;

  border: 2px solid #000;
  border-radius: 0.75rem;

  font-size: 1rem;
  box-sizing: border-box;
`;

const SubmitButton = styled.button`
  padding: 0.875rem 1rem;

  border: 2px solid #000;
  border-radius: 0.75rem;

  background: #000;
  color: #fff;

  font-size: 1rem;
  font-weight: 600;

  cursor: pointer;

  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
`;

const ErrorMessage = styled.p`
  margin: 0;
  color: #d00;
`;

const SuccessMessage = styled.p`
  margin: 0;
  color: #087f23;
`;