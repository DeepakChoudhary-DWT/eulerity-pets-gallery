import { Link, useParams } from 'react-router-dom';
import styled from 'styled-components';
import { usePets } from '@/hooks/usePets';
import { useSelection } from '@/context/SelectionContext';
import { SkeletonCard } from '@/components/Skeleton/SkeletonCard';
import { ErrorState } from '@/components/ErrorState/ErrorState';
import { EmptyState } from '@/components/EmptyState/EmptyState';
import { formatBytes } from '@/utils/fileSize';

const Wrap = styled.article`
  display: grid;
  gap: 24px;
  grid-template-columns: 1fr;

  @media ${({ theme }) => theme.bp.desktop} {
    grid-template-columns: minmax(0, 2fr) minmax(0, 1fr);
  }
`;

const Hero = styled.div`
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: ${({ theme }) => theme.radii.lg};
  overflow: hidden;
  background: ${({ theme }) => theme.colors.surfaceAlt};
`;

const Img = styled.img`
  width: 100%;
  height: auto;
  display: block;
`;

const Side = styled.aside`
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: ${({ theme }) => theme.radii.lg};
  background: ${({ theme }) => theme.colors.surface};
  padding: 24px;
  display: flex;
  flex-direction: column;
  gap: 16px;
`;

const Title = styled.h1`
  margin: 0;
  font-size: 24px;
  letter-spacing: -0.01em;
`;

const Description = styled.p`
  margin: 0;
  color: ${({ theme }) => theme.colors.textMuted};
  font-size: 15px;
  line-height: 1.55;
`;

const Meta = styled.dl`
  margin: 0;
  display: grid;
  grid-template-columns: max-content 1fr;
  gap: 6px 16px;
  font-size: 14px;

  dt { color: ${({ theme }) => theme.colors.textMuted}; }
  dd { margin: 0; color: ${({ theme }) => theme.colors.text}; word-break: break-word; }
`;

const Actions = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  margin-top: 8px;
`;

const Btn = styled.button<{ $primary?: boolean }>`
  padding: 10px 14px;
  font-size: 14px;
  font-weight: 600;
  border-radius: ${({ theme }) => theme.radii.md};
  cursor: pointer;
  transition: background 120ms, border-color 120ms, color 120ms;

  ${({ theme, $primary }) =>
    $primary
      ? `background: ${theme.colors.accent}; border: 1px solid ${theme.colors.accent}; color: #fff;
         &:hover { background: ${theme.colors.accentHover}; border-color: ${theme.colors.accentHover}; }`
      : `background: transparent; border: 1px solid ${theme.colors.border}; color: ${theme.colors.text};
         &:hover { border-color: ${theme.colors.accent}; color: ${theme.colors.accent}; }`}
`;

const Back = styled(Link)`
  display: inline-block;
  font-size: 13px;
  margin-bottom: 16px;
`;

export function PetDetailPage() {
  const { id } = useParams<{ id: string }>();
  const { pets, status, error, refetch } = usePets();
  const { isSelected, toggle } = useSelection();

  if (status === 'loading') {
    return (
      <>
        <Back to="/gallery">← Back to gallery</Back>
        <SkeletonCard />
      </>
    );
  }

  if (status === 'error' && error) {
    return <ErrorState error={error} onRetry={refetch} />;
  }

  const pet = pets.find((p) => p.id === id);

  if (!pet) {
    return (
      <EmptyState
        title="Pet not found"
        message="The pet you’re looking for doesn’t exist or has been removed."
        action={<Link to="/gallery">Back to gallery</Link>}
      />
    );
  }

  const selected = isSelected(pet.id);
  const created = (() => {
    const d = new Date(pet.created);
    return Number.isNaN(d.getTime())
      ? pet.created
      : d.toLocaleString(undefined, { dateStyle: 'long', timeStyle: 'short' });
  })();

  return (
    <>
      <Back to="/gallery">← Back to gallery</Back>
      <Wrap>
        <Hero>
          <Img src={pet.url} alt={pet.title} />
        </Hero>
        <Side>
          <Title>{pet.title}</Title>
          <Description>{pet.description}</Description>
          <Meta>
            <dt>Created</dt>
            <dd>{created}</dd>
            <dt>Size</dt>
            <dd>{formatBytes(pet.sizeBytes)}</dd>
            <dt>Source</dt>
            <dd>
              <a href={pet.url} target="_blank" rel="noreferrer noopener">
                Open original ↗
              </a>
            </dd>
          </Meta>
          <Actions>
            <Btn $primary onClick={() => toggle(pet.id)}>
              {selected ? '✓ Selected — click to remove' : 'Add to selection'}
            </Btn>
            <Btn as="a" href={pet.url} target="_blank" rel="noreferrer noopener">
              Open image
            </Btn>
          </Actions>
        </Side>
      </Wrap>
    </>
  );
}
