import styled from 'styled-components';
import { Link } from 'react-router-dom';
import type { Pet } from '@/types/pet';
import { formatBytes } from '@/utils/fileSize';

interface Props {
  pet: Pet;
  selected: boolean;
  onToggle: (id: string) => void;
}

const Card = styled.article<{ $selected: boolean }>`
  position: relative;
  background: ${({ theme }) => theme.colors.surface};
  border: 1px solid
    ${({ theme, $selected }) =>
      $selected ? theme.colors.accent : theme.colors.border};
  border-radius: ${({ theme }) => theme.radii.lg};
  overflow: hidden;
  display: flex;
  flex-direction: column;
  transition: transform 160ms ease, border-color 120ms, box-shadow 160ms ease;
  box-shadow: ${({ theme, $selected }) =>
    $selected ? theme.shadow.accent : 'none'};

  &:hover { transform: translateY(-2px); box-shadow: ${({ theme }) => theme.shadow.md}; }
`;

const ImageLink = styled(Link)`
  position: relative;
  display: block;
  aspect-ratio: 4 / 3;
  background: ${({ theme }) => theme.colors.surfaceAlt};
  overflow: hidden;
`;

const Img = styled.img`
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 400ms ease;

  ${ImageLink}:hover & { transform: scale(1.04); }
`;

const Body = styled.div`
  padding: 14px 16px 16px;
  display: flex;
  flex-direction: column;
  gap: 6px;
`;

const Title = styled.h3`
  margin: 0;
  font-size: 15px;
  font-weight: 600;
  color: ${({ theme }) => theme.colors.text};
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
`;

const Desc = styled.p`
  margin: 0;
  font-size: 13px;
  color: ${({ theme }) => theme.colors.textMuted};
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
`;

const Meta = styled.div`
  margin-top: 6px;
  display: flex;
  justify-content: space-between;
  font-size: 12px;
  color: ${({ theme }) => theme.colors.textMuted};
`;

const SelectChip = styled.label<{ $selected: boolean }>`
  position: absolute;
  top: 10px;
  left: 10px;
  z-index: 2;
  display: inline-flex;
  align-items: center;
  gap: 6px;
  padding: 6px 10px;
  border-radius: ${({ theme }) => theme.radii.pill};
  background: ${({ theme, $selected }) =>
    $selected ? theme.colors.accent : 'rgba(0,0,0,0.55)'};
  color: #fff;
  font-size: 12px;
  font-weight: 600;
  backdrop-filter: blur(6px);
  cursor: pointer;
  user-select: none;
  border: 1px solid ${({ theme, $selected }) =>
    $selected ? theme.colors.accent : 'rgba(255,255,255,0.15)'};

  input { position: absolute; opacity: 0; pointer-events: none; }
`;

function formatDate(input: string): string {
  // Eulerity returns dates like "Mar 24, 2018, 7:24:31 PM" — feed straight to Date.
  const d = new Date(input);
  return Number.isNaN(d.getTime())
    ? input
    : d.toLocaleDateString(undefined, { year: 'numeric', month: 'short', day: 'numeric' });
}

export function PetCard({ pet, selected, onToggle }: Props) {
  return (
    <Card $selected={selected} aria-label={pet.title}>
      <SelectChip $selected={selected} onClick={(e) => e.stopPropagation()}>
        <input
          type="checkbox"
          checked={selected}
          onChange={() => onToggle(pet.id)}
          aria-label={`Select ${pet.title}`}
        />
        {selected ? '✓ Selected' : 'Select'}
      </SelectChip>

      <ImageLink to={`/pets/${pet.id}`} aria-label={`View details for ${pet.title}`}>
        <Img src={pet.url} alt={pet.title} loading="lazy" />
      </ImageLink>

      <Body>
        <Title title={pet.title}>{pet.title}</Title>
        <Desc>{pet.description}</Desc>
        <Meta>
          <span>{formatDate(pet.created)}</span>
          <span>{formatBytes(pet.sizeBytes)}</span>
        </Meta>
      </Body>
    </Card>
  );
}
