import styled, { keyframes } from 'styled-components';

const shimmer = keyframes`
  0%   { background-position: -400px 0; }
  100% { background-position: 400px 0; }
`;

const Card = styled.div`
  background: ${({ theme }) => theme.colors.surface};
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: ${({ theme }) => theme.radii.lg};
  overflow: hidden;
`;

const Block = styled.div<{ $h: number }>`
  height: ${({ $h }) => $h}px;
  background: linear-gradient(
    90deg,
    ${({ theme }) => theme.colors.surfaceAlt} 0%,
    ${({ theme }) => theme.colors.border} 50%,
    ${({ theme }) => theme.colors.surfaceAlt} 100%
  );
  background-size: 800px 100%;
  animation: ${shimmer} 1.4s linear infinite;
`;

const Body = styled.div`
  padding: 14px 16px 18px;
  display: flex;
  flex-direction: column;
  gap: 8px;
`;

export function SkeletonCard() {
  return (
    <Card aria-hidden="true">
      <Block $h={200} />
      <Body>
        <Block $h={14} />
        <Block $h={12} />
        <Block $h={12} />
      </Body>
    </Card>
  );
}
