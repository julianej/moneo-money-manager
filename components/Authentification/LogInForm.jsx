import styled from "styled-components";
import { useEffect, useState } from "react";

const Form = styled.form`
  display: flex;
  flex-direction: column;
  gap: 1rem;
`;

const Input = styled.input`
  width: 100%;
  padding: 0.75rem;

  border: 1px solid #000;
  border-radius: 8px;

  font: inherit;
`;

const SubmitButton = styled.button`
  width: 100%;
  padding: 0.75rem 1rem;

  border: 1px solid #000;
  border-radius: 8px;

  background: #000;
  color: #fff;

  font: inherit;
  cursor: pointer;

  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
`;

const GoogleLoginButton = styled.button`
  width: 100%;
  padding: 0.75rem 1rem;

  border: 1px solid #000;
  border-radius: 8px;

  background: #fff;
  color: #000;

  font: inherit;
  cursor: pointer;

  &:hover {
    background: #f5f5f5;
  }

  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
`;

const Divider = styled.div`
  display: flex;
  align-items: center;
  gap: 1rem;

  margin: 0.5rem 0;

  color: #666;

  &::before,
  &::after {
    content: "";
    flex: 1;
    height: 1px;
    background: #ddd;
  }
`;

const ErrorMessage = styled.p`
  margin: 0;
  color: #d00;
`;

export default function LogInForm({ onLoggedIn }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  /*
   * Load Google Identity Services once.
   */
  useEffect(() => {
    const existingScript = document.querySelector(
      'script[src="https://accounts.google.com/gsi/client"]'
    );

    if (existingScript) {
      return;
    }

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
   * Normal email/password login.
   */
  async function handleSubmit(event) {
    event.preventDefault();

    setError("");
    setIsSubmitting(true);

    try {
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
        setError(
          data.message || "Invalid email or password."
        );
        return;
      }

      if (onLoggedIn) {
        onLoggedIn(data.user);
      }
    } catch (error) {
      console.error("LOGIN ERROR:", error);

      setError(
        "Something went wrong. Please try again."
      );
    } finally {
      setIsSubmitting(false);
    }
  }

  /*
   * Google login.
   *
   * We use Google's OAuth popup and receive
   * the credential through the callback.
   */
  function handleGoogleClick() {
    setError("");

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
        "Google login is not configured."
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
                "Google login failed."
            );

            return;
          }

          if (onLoggedIn) {
            onLoggedIn(data.user);
          }
        } catch (error) {
          console.error(
            "GOOGLE LOGIN ERROR:",
            error
          );

          setError(
            "Something went wrong with Google login."
          );
        } finally {
          setIsSubmitting(false);
        }
      },
    });

    /*
     * Trigger Google's authentication UI.
     */
    window.google.accounts.id.prompt();
  }

  return (
    <>
      <Form onSubmit={handleSubmit}>
        {error && (
          <ErrorMessage>
            {error}
          </ErrorMessage>
        )}

        <Input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(event) =>
            setEmail(event.target.value)
          }
          required
        />

        <Input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(event) =>
            setPassword(event.target.value)
          }
          required
        />

        <SubmitButton
          type="submit"
          disabled={isSubmitting}
        >
          {isSubmitting
            ? "Logging in..."
            : "Log in"}
        </SubmitButton>

        <Divider>
          <span>or</span>
        </Divider>

        <GoogleLoginButton
          type="button"
          onClick={handleGoogleClick}
          disabled={isSubmitting}
        >
          Continue with Google
        </GoogleLoginButton>
      </Form>
    </>
  );
}