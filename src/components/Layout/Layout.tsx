import { Outlet } from 'react-router-dom';
import styled from 'styled-components';
import { Header } from './Header';
import { Footer } from './Footer';

const Main = styled.main`
  max-width: ${({ theme }) => theme.layout.maxWidth};
  margin: 0 auto;
  padding: 24px 16px 48px;
`;

export function Layout() {
  return (
    <>
      <Header />
      <Main>
        <Outlet />
      </Main>
      <Footer />
    </>
  );
}
