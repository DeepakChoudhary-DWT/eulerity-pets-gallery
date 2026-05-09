import { Link } from 'react-router-dom';
import styled from 'styled-components';

const Hero = styled.section`
  padding: 80px 16px;
  text-align: center;
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: ${({ theme }) => theme.radii.lg};
  background:
    radial-gradient(80% 120% at 50% 0%, ${({ theme }) => theme.colors.accentSoft} 0%, transparent 60%),
    ${({ theme }) => theme.colors.surface};
`;

const Title = styled.h1`
  margin: 0 0 12px;
  font-size: clamp(28px, 5vw, 48px);
  letter-spacing: -0.02em;
`;

const Sub = styled.p`
  margin: 0 auto 28px;
  max-width: 560px;
  color: ${({ theme }) => theme.colors.textMuted};
  font-size: 16px;
`;

const CTA = styled(Link)`
  display: inline-flex;
  align-items: center;
  gap: 8px;
  padding: 12px 22px;
  border-radius: ${({ theme }) => theme.radii.pill};
  background: ${({ theme }) => theme.colors.accent};
  color: #fff;
  font-weight: 600;

  &:hover { background: ${({ theme }) => theme.colors.accentHover}; color: #fff; }
`;

const Features = styled.div`
  margin-top: 32px;
  display: grid;
  gap: 16px;
  grid-template-columns: 1fr;
  @media ${({ theme }) => theme.bp.tablet} { grid-template-columns: repeat(3, 1fr); }
`;

const Feature = styled.div`
  border: 1px solid ${({ theme }) => theme.colors.border};
  background: ${({ theme }) => theme.colors.surface};
  border-radius: ${({ theme }) => theme.radii.lg};
  padding: 20px;
  text-align: left;
`;

const FeatureTitle = styled.h3`
  margin: 0 0 6px;
  font-size: 15px;
`;

const FeatureCopy = styled.p`
  margin: 0;
  font-size: 14px;
  color: ${({ theme }) => theme.colors.textMuted};
`;

export function HomePage() {
  return (
    <>
      <Hero>
        <Title>Browse, select & download adorable pets</Title>
        <Sub>
          A polished React + TypeScript front-end that talks to the Eulerity{' '}
          <code>/pets</code> API. Filter, sort, multi-select, and grab a ZIP of
          your favourites.
        </Sub>
        <CTA to="/gallery">Open the gallery →</CTA>
      </Hero>

      <Features>
        <Feature>
          <FeatureTitle>🔎 Search & sort</FeatureTitle>
          <FeatureCopy>
            Live filter by title or description. Sort A-Z, Z-A, newest, oldest.
          </FeatureCopy>
        </Feature>
        <Feature>
          <FeatureTitle>🗂️ Multi-select & download</FeatureTitle>
          <FeatureCopy>
            Pick any number of pets, see live count and approximate size,
            export as a single ZIP.
          </FeatureCopy>
        </Feature>
        <Feature>
          <FeatureTitle>📱 Fully responsive</FeatureTitle>
          <FeatureCopy>
            1 column on mobile, 2 on tablet, 4 on desktop, with infinite scroll.
          </FeatureCopy>
        </Feature>
      </Features>
    </>
  );
}
