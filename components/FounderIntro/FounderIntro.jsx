import styled from "styled-components";
import Image from "next/image";


export default function FounderSection() {
  return (
    <Section id="founder">
      <FounderLayout>
        <FounderImage>
          {/* Add your own portrait here */}
          <Image
            src="/images/head-shot-julianejeske.jpg"
            alt="Juliane Jeske"
            width={400}
            height={400}
            sizes="(max-width: 600px) 100vw, 400px"
            style={{
              width: "100%",
              height: "auto",
            }}
          />
        </FounderImage>

        <FounderText>
          <Eyebrow>MONEO / THE FOUNDER</Eyebrow>

          <h2>Built with Purpose. Designed for Clarity.</h2>

          <Role>A note from the founder & CEO</Role>

          <p>
            I built MONEO to make managing money feel more
            structured, transparent, and accessible.
          </p>

          <p>
            As a Product Designer and developer, I believe
            good software should simplify complexity and help
            people make more informed financial decisions.
          </p>

          <FounderName>Juliane Jeske</FounderName>
          <FounderRole>
            Founder · Product Designer · Developer
          </FounderRole>
        </FounderText>
      </FounderLayout>
    </Section>
  );
}

const Section = styled.section`
  padding: 6rem 2rem;

  @media (max-width: 740px) {
    padding: 3rem 1rem;
  }
`;

const FounderLayout = styled.div`
  display: grid;
  grid-template-columns: minmax(0, 1fr) minmax(0, 1fr);
  align-items: center;
  gap: 4rem;
  max-width: 1200px;
  margin: 0 auto;

  @media (max-width: 740px) {
    grid-template-columns: 1fr;
    gap: 2rem;
  }
`;

const FounderImage = styled.div`
  width: 100%;
  aspect-ratio: 4 / 5;
  overflow: hidden;
  background: #f2f2f2;

  img {
    display: block;
    width: 100%;
    height: 100%;
    object-fit: cover;
  }
`;

const FounderText = styled.div`
  h2 {
    max-width: 560px;
    margin: 1rem 0;
    font-size: clamp(2rem, 4vw, 3.5rem);
    line-height: 1.1;
  }

  p {
    max-width: 520px;
    color: #666;
    line-height: 1.8;
  }
`;

const Eyebrow = styled.span`
  font-family: "IBM Plex Mono", monospace;
  font-size: 0.8rem;
  letter-spacing: 0.08em;
`;

const Role = styled.p`
  font-weight: 500;
  color: #111 !important;
`;

const FounderName = styled.p`
  margin: 2rem 0 0;
  font-weight: 600;
  color: #111 !important;
`;

const FounderRole = styled.p`
  margin-top: 0.25rem;
  font-size: 0.875rem;
`;
