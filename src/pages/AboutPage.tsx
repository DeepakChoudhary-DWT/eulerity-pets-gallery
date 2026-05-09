import styled from 'styled-components';

const Wrap = styled.section`
  max-width: 720px;
  margin: 0 auto;
`;

const Title = styled.h1`
  margin: 0 0 16px;
  font-size: 32px;
  letter-spacing: -0.01em;
`;

const Para = styled.p`
  color: ${({ theme }) => theme.colors.textMuted};
  font-size: 15px;
  line-height: 1.65;
`;

const SubTitle = styled.h2`
  margin: 32px 0 8px;
  font-size: 18px;
`;

const List = styled.ul`
  padding-left: 18px;
  color: ${({ theme }) => theme.colors.textMuted};
  font-size: 15px;
  line-height: 1.7;
`;

export function AboutPage() {
  return (
    <Wrap>
      <Title>About this project</Title>
      <Para>
        This is the Eulerity Web take-home challenge — a small front-end built
        in React + TypeScript that fetches pets from the public{' '}
        <code>/pets</code> endpoint and lets you browse, search, sort,
        multi-select, and download.
      </Para>

      <SubTitle>Stack</SubTitle>
      <List>
        <li>Vite + React 19 + TypeScript (strict)</li>
        <li>react-router-dom for routing</li>
        <li>styled-components for theming and styles</li>
        <li>JSZip + file-saver for ZIP downloads</li>
      </List>

      <SubTitle>Architecture</SubTitle>
      <List>
        <li>
          <strong>Data layer</strong> — all fetching lives in{' '}
          <code>api/pets.ts</code>; the <code>usePets</code> custom hook
          exposes <code>loading / error / empty / success</code> plus a{' '}
          <code>refetch</code> for the retry button.
        </li>
        <li>
          <strong>Selection</strong> — a <code>SelectionProvider</code> at the
          router root keeps selected ids in a <code>Set</code>, so navigation
          between gallery and detail never drops the user’s picks.
        </li>
        <li>
          <strong>UI</strong> — small composable components per concern:
          search, sort, selection bar, pet card, grid, skeleton, empty/error
          states.
        </li>
      </List>

      <SubTitle>Notes on CORS</SubTitle>
      <Para>
        Some image hosts disallow cross-origin reads, which means HEAD
        requests for file size and direct ZIP downloads can fail. The UI
        handles this gracefully: file size shows as “—” when unknown, and the
        ZIP flow reports exactly how many images were skipped.
      </Para>
    </Wrap>
  );
}
