import styled from 'styled-components';

const Wrap = styled.footer`
  border-top: 1px solid ${({ theme }) => theme.colors.border};
  padding: 24px 16px;
  margin-top: 48px;
  color: ${({ theme }) => theme.colors.textMuted};
  font-size: 13px;
  text-align: center;
`;

export function Footer() {
  return (
    <Wrap>
      Built for the Eulerity take-home challenge · React + TypeScript + styled-components
    </Wrap>
  );
}
