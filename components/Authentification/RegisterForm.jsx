
import styled from "styled-components";
import { useEffect, useState } from "react";

export default function RegisterForm({ onClose, onRegistered }) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  /*
   * Load Google Identity Services
   */
  useEffect(() => {
    const script = document.createElement("script");

    script.src = "https://accounts.google.com/gsi/client";
    script.async = true;
    script.defer = true;

    document.body.appendChild(script);

    return () => {
      if (document.body.contains(script)) {
        document.body.removeChild(script);
      }
    };
  }, []);

  /*
   * Normal registration
   */
  async function handleSubmit(event) {
    event.preventDefault();

    setError("");
    setSuccess("");
    setIsSubmitting(true);

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
        setError(
          data.message || "Registration failed."
        );
        return;
      }

      setSuccess("Account created successfully.");

      setName("");
      setEmail("");
      setPassword("");

      if (onRegistered) {
        onRegistered(data.user);
      }
    } catch (error) {
      console.error("REGISTER ERROR:", error);

      setError(
        "Something went wrong. Please try again."
      );
    } finally {
      setIsSubmitting(false);
    }
  }

  /*
   * Google registration
   */
  function handleGoogleClick() {
    setError("");
    setSuccess("");

    if (!window.google) {
      setError(
        "Google login is not available yet. Please try again."
      );

      return;
    }

    if (!process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID) {
      console.error(
        "NEXT_PUBLIC_GOOGLE_CLIENT_ID is missing."
      );

      setError(
        "Google registration is not configured."
      );

      return;
    }

    setIsSubmitting(true);

    window.google.accounts.id.initialize({
      client_id:
        process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID,

      callback: async (response) => {
        try {
          const result = await fetch(
            "/api/auth/google",
            {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
              },
              body: JSON.stringify({
                credential: response.credential,
              }),
            }
          );

          const data = await result.json();

          if (!result.ok) {
            setError(
              data.message ||
                "Google registration failed."
            );

            return;
          }

          setSuccess(
            "Google account created successfully."
          );

          if (onRegistered) {
            onRegistered(data.user);
          }
        } catch (error) {
          console.error(
            "GOOGLE REGISTER ERROR:",
            error
          );

          setError(
            "Something went wrong with Google registration."
          );
        } finally {
          setIsSubmitting(false);
        }
      },
    });

    /*
     * Open Google's authentication UI.
     */
    window.google.accounts.id.prompt();
  }

  return (
    <RegisterCard>
      <Title>Create Account</Title>

      <Intro>
        Create your Money Manager account.
      </Intro>

      <Form onSubmit={handleSubmit}>
        <Field>
          <Label htmlFor="name" className="hidden">
            Name
          </Label>

          <Input
            id="name"
            type="text"
            value={name}
            placeholder="Your Name"
            onChange={(event) =>
              setName(event.target.value)
            }
            required
          />
        </Field>

        <Field>
          <Label htmlFor="email" className="hidden">
            Email
          </Label>

          <Input
            id="email"
            type="email"
            value={email}
            placeholder="E-Mail"
            onChange={(event) =>
              setEmail(event.target.value)
            }
            required
          />
        </Field>

        <Field>
          <Label htmlFor="password" className="hidden">
            Password
          </Label>

          <Input
            id="password"
            type="password"
            value={password}
            placeholder="Password"
            onChange={(event) =>
              setPassword(event.target.value)
            }
            required
            minLength={8}
          />
        </Field>

        {error && (
          <ErrorMessage>
            {error}
          </ErrorMessage>
        )}

        {success && (
          <SuccessMessage>
            {success}
          </SuccessMessage>
        )}

        <SubmitButton
          type="submit"
          disabled={isSubmitting}
        >
          {isSubmitting
            ? "Creating account..."
            : "Create account"}
        </SubmitButton>

        <Divider>
          <span>or</span>
        </Divider>

        <GoogleButtonWrapper>
          <GoogleRegisterButton
            type="button"
            onClick={handleGoogleClick}
            disabled={isSubmitting}
          >
            Register with Google
          </GoogleRegisterButton>
        </GoogleButtonWrapper>
      </Form>
    </RegisterCard>
  );
}

const RegisterCard = styled.div`
  position: relative;

  width: 100%;
  max-width: 420px;

  background: #fff;
  border-radius: 1rem;
  box-sizing: border-box;
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

const Divider = styled.div`
  display: flex;
  align-items: center;
  gap: 1rem;

  color: #666;

  &::before,
  &::after {
    content: "";
    flex: 1;
    height: 1px;
    background: #ddd;
  }

  span {
    font-size: 0.875rem;
  }
`;

const GoogleButtonWrapper = styled.div`
  display: flex;
  width: 100%;
`;

const GoogleRegisterButton = styled.button`
  width: 100%;
  padding: 0.875rem 1rem;

  border: 2px solid #000;
  border-radius: 0.75rem;

  background: #fff;
  color: #000;

  font-size: 1rem;
  font-weight: 600;

  cursor: pointer;

  &:hover {
    background: #f5f5f5;
  }

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
  color: #797979;
`;

