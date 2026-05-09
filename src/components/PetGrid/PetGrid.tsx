import styled from 'styled-components';

// Required responsive grid: 1 col mobile, 2 col tablet, 4 col desktop.
export const PetGrid = styled.div`
  display: grid;
  gap: 16px;
  grid-template-columns: 1fr;

  @media ${({ theme }) => theme.bp.tablet} {
    grid-template-columns: repeat(2, 1fr);
  }
  @media ${({ theme }) => theme.bp.desktop} {
    grid-template-columns: repeat(4, 1fr);
  }
`;
