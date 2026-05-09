import styled from 'styled-components';
import type { ReactNode } from 'react';

const Wrap = styled.div`
  padding: 64px 16px;
  text-align: center;
  border: 1px dashed ${({ theme }) => theme.colors.border};
  border-radius: ${({ theme }) => theme.radii.lg};
  background: ${({ theme }) => theme.colors.surface};
`;

const Title = styled.h2`
  margin: 0 0 6px;
  font-size: 18px;
  color: ${({ theme }) => theme.colors.text};
`;

const Sub = styled.p`
  margin: 0;
  color: ${({ theme }) => theme.colors.textMuted};
  font-size: 14px;
`;

interface Props {
  title: string;
  message?: string;
  action?: ReactNode;
}

export function EmptyState({ title, message, action }: Props) {
  return (
    <Wrap>
      <Title>{title}</Title>
      {message && <Sub>{message}</Sub>}
      {action && <div style={{ marginTop: 16 }}>{action}</div>}
    </Wrap>
  );
}
