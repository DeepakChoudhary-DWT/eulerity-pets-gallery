import { NavLink } from 'react-router-dom';
import styled from 'styled-components';

const Bar = styled.header`
  position: sticky;
  top: 0;
  z-index: 10;
  height: ${({ theme }) => theme.layout.headerHeight};
  background: ${({ theme }) => theme.colors.surface};
  border-bottom: 1px solid ${({ theme }) => theme.colors.border};
  backdrop-filter: blur(8px);
`;

const Inner = styled.div`
  max-width: ${({ theme }) => theme.layout.maxWidth};
  height: 100%;
  margin: 0 auto;
  padding: 0 16px;
  display: flex;
  align-items: center;
  gap: 24px;
`;

const Brand = styled(NavLink)`
  display: inline-flex;
  align-items: center;
  gap: 8px;
  font-weight: 700;
  font-size: 18px;
  color: ${({ theme }) => theme.colors.text};
  &:hover { color: ${({ theme }) => theme.colors.text}; }
`;

const Dot = styled.span`
  width: 10px;
  height: 10px;
  border-radius: 50%;
  background: ${({ theme }) => theme.colors.accent};
  box-shadow: 0 0 12px ${({ theme }) => theme.colors.accent};
`;

const Nav = styled.nav`
  display: flex;
  gap: 4px;
  margin-left: auto;
`;

const NavItem = styled(NavLink)`
  padding: 8px 12px;
  border-radius: ${({ theme }) => theme.radii.md};
  color: ${({ theme }) => theme.colors.textMuted};
  font-weight: 500;
  font-size: 14px;
  transition: background 120ms, color 120ms;

  &:hover { color: ${({ theme }) => theme.colors.text}; }

  &.active {
    color: ${({ theme }) => theme.colors.text};
    background: ${({ theme }) => theme.colors.accentSoft};
  }
`;

export function Header() {
  return (
    <Bar>
      <Inner>
        <Brand to="/">
          <Dot />
          Eulerity Pets
        </Brand>
        <Nav>
          <NavItem to="/" end>Home</NavItem>
          <NavItem to="/gallery">Gallery</NavItem>
          <NavItem to="/about">About</NavItem>
        </Nav>
      </Inner>
    </Bar>
  );
}
