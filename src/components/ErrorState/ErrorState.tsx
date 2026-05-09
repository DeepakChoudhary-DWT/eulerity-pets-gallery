import styled from 'styled-components';

const Wrap = styled.div`
  padding: 32px 24px;
  text-align: center;
  border: 1px solid ${({ theme }) => theme.colors.border};
  background: ${({ theme }) => theme.colors.surface};
  border-radius: ${({ theme }) => theme.radii.lg};
`;

const Title = styled.h2`
  margin: 0 0 6px;
  font-size: 18px;
  color: ${({ theme }) => theme.colors.danger};
`;

const Detail = styled.p`
  margin: 0 0 16px;
  color: ${({ theme }) => theme.colors.textMuted};
  font-size: 14px;
  font-family: ui-monospace, SFMono-Regular, Menlo, monospace;
`;

const RetryButton = styled.button`
  border: 1px solid ${({ theme }) => theme.colors.accent};
  background: ${({ theme }) => theme.colors.accentSoft};
  color: ${({ theme }) => theme.colors.text};
  padding: 8px 16px;
  border-radius: ${({ theme }) => theme.radii.md};
  cursor: pointer;
  font-weight: 500;

  &:hover { background: ${({ theme }) => theme.colors.accent}; color: #fff; }
`;

interface Props {
  error: Error;
  onRetry: () => void;
}

export function ErrorState({ error, onRetry }: Props) {
  return (
    <Wrap role="alert">
      <Title>Something went wrong</Title>
      <Detail>{error.message}</Detail>
      <RetryButton onClick={onRetry}>Try again</RetryButton>
    </Wrap>
  );
}
