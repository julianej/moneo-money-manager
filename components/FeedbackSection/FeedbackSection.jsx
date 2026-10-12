import { useState } from "react";
import styled from "styled-components";

const FEEDBACK_EMAIL = "mail@julianejeske.com";

export default function FeedbackSection() {
  const [type, setType] = useState("Feedback");
  const [message, setMessage] = useState("");
  const [email, setEmail] = useState("");

  function handleSubmit(event) {
    event.preventDefault();

    const subject = `MONEO — ${type}`;
    const body = [
      `Type: ${type}`,
      "",
      message,
      "",
      `Reply email: ${email || "Not provided"}`,
    ].join("\n");

    const mailto = `mailto:${FEEDBACK_EMAIL}?subject=${encodeURIComponent(
      subject
    )}&body=${encodeURIComponent(body)}`;

    window.location.href = mailto;
  }

  return (
    <Section id="feedback">
      <FeedbackLayout>
        <Intro>
          <Eyebrow>MONEO / GET IN TOUCH</Eyebrow>

          <h2>Lets make MONEO a better product for you, and for your finance management.</h2>

          <p>
            Your feedback matters. Found a bug, have an idea,
            or want to share your experience? We always want to improve.
          </p>

          <ContactLink href={`mailto:${FEEDBACK_EMAIL}`}>
            {FEEDBACK_EMAIL}
          </ContactLink>
        </Intro>

        <FeedbackForm onSubmit={handleSubmit}>
          <label htmlFor="feedback-type">
            What would you like to share?
          </label>

          <Select
            id="feedback-type"
            value={type}
            onChange={(event) => setType(event.target.value)}
          >
            <option>Feedback</option>
            <option>Feature request</option>
            <option>Bug report</option>
            <option>Other enquiry</option>
          </Select>

          <label htmlFor="feedback-message">Your message</label>

          <Message
            id="feedback-message"
            value={message}
            onChange={(event) => setMessage(event.target.value)}
            placeholder="Tell me what you think..."
            required
            rows={5}
          />

          <label htmlFor="feedback-email">Email (optional)</label>

          <Input
            id="feedback-email"
            type="email"
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            placeholder="you@example.com"
          />

          <SubmitButton type="submit">
            Send feedback ↗
          </SubmitButton>

          <SmallText>
            Your email app will open with your message prepared.
          </SmallText>
        </FeedbackForm>
      </FeedbackLayout>
    </Section>
  );
}

const Section = styled.section`
  padding: 6rem 2rem;
  border-top: 1px solid #e5e5e5;

  @media (max-width: 740px) {
    padding: 3rem 1rem;
  }
`;

const FeedbackLayout = styled.div`
  display: grid;
  grid-template-columns: 1fr;
  gap: 4rem;
  align-items: start;
  margin: 0 auto;

  @media (min-width: 740px) {
    grid-template-columns: 1fr;
    gap: 2rem;
    padding: 4rem;
    grid-template-columns: minmax(0, 1fr) minmax(0, 1fr);

  }
`;

const Intro = styled.div`
  h2 {
    margin: 1rem 0;
    font-size: clamp(2rem, 4vw, 4rem);
    line-height: 1.1;
  }

  p {
    max-width: 440px;
    color: #666;
    line-height: 1.8;
  }
`;

const Eyebrow = styled.span`
  font-family: "IBM Plex Mono", monospace;
  font-size: 0.8rem;
  letter-spacing: 0.08em;
`;

const ContactLink = styled.a`
  display: inline-block;
  margin-top: 1rem;
  color: #111;
  text-underline-offset: 4px;
  overflow-wrap: anywhere;
`;

const FeedbackForm = styled.form`
  display: flex;
  flex-direction: column;
  gap: 0.75rem;

  label {
    margin-top: 0.5rem;
    font-size: 0.875rem;
    font-weight: 500;
  }
`;

const fieldStyles = `
  width: 100%;
  box-sizing: border-box;
  padding: 0.9rem 1rem;
  border: 1px solid #ccc;
  border-radius: 0;
  background: #fff;
  color: #111;
  font: inherit;

  &:focus-visible {
    outline: 2px solid #111;
    outline-offset: 2px;
  }
`;

const Select = styled.select`
  ${fieldStyles}
`;

const Message = styled.textarea`
  ${fieldStyles}
  resize: vertical;
  line-height: 1.6;
`;

const Input = styled.input`
  ${fieldStyles}
`;

const SubmitButton = styled.button`
  margin-top: 0.75rem;
  padding: 1rem 1.25rem;
  border: 1px solid #111;
  border-radius: 0;
  background: #111;
  color: #fff;
  font: inherit;
  cursor: pointer;
  transition: background 0.2s ease, color 0.2s ease;

  &:hover {
    background: #fff;
    color: #111;
  }

  &:focus-visible {
    outline: 2px solid #555;
    outline-offset: 3px;
  }
`;

const SmallText = styled.p`
  margin: 0.25rem 0 0;
  color: #777;
  font-size: 0.8rem;
  line-height: 1.5;
`;