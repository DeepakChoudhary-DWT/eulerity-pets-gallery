import { useState } from 'react';
import styled from 'styled-components';
import type { Pet } from '@/types/pet';
import { useSelection } from '@/context/SelectionContext';
import { downloadAsZip } from '@/utils/download';
import { formatBytes } from '@/utils/fileSize';
import { Spinner } from '@/components/Spinner/Spinner';

interface Props {
  // The full pet list currently in view (already filtered/sorted). Used so
  // "Select All" matches what the user actually sees.
  visiblePets: Pet[];
  // The full unfiltered pet list. Selections are derived from this so the
  // counts/sizes are correct even if the user hides some via search.
  allPets: Pet[];
}

const Bar = styled.section`
  position: sticky;
  top: ${({ theme }) => theme.layout.headerHeight};
  z-index: 5;
  background: ${({ theme }) => theme.colors.surface};
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: ${({ theme }) => theme.radii.lg};
  padding: 12px 14px;
  margin-bottom: 16px;
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 12px;
`;

const Stats = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 16px;
  font-size: 14px;
  color: ${({ theme }) => theme.colors.textMuted};

  strong { color: ${({ theme }) => theme.colors.text}; font-weight: 600; }
`;

const Group = styled.div`
  display: flex;
  gap: 8px;
  margin-left: auto;
  flex-wrap: wrap;
`;

const Btn = styled.button<{ $variant?: 'primary' | 'ghost' }>`
  padding: 8px 14px;
  border-radius: ${({ theme }) => theme.radii.md};
  font-size: 13px;
  font-weight: 600;
  cursor: pointer;
  display: inline-flex;
  align-items: center;
  gap: 8px;
  transition: background 120ms, border-color 120ms, color 120ms;

  ${({ theme, $variant = 'ghost' }) =>
    $variant === 'primary'
      ? `
        background: ${theme.colors.accent};
        border: 1px solid ${theme.colors.accent};
        color: #fff;
        &:hover:not(:disabled) { background: ${theme.colors.accentHover}; border-color: ${theme.colors.accentHover}; }
      `
      : `
        background: transparent;
        border: 1px solid ${theme.colors.border};
        color: ${theme.colors.text};
        &:hover:not(:disabled) { border-color: ${theme.colors.accent}; color: ${theme.colors.accent}; }
      `}

  &:disabled {
    opacity: 0.45;
    cursor: not-allowed;
  }
`;

const Notice = styled.p<{ $kind?: 'info' | 'warn' }>`
  width: 100%;
  margin: 0;
  font-size: 12px;
  color: ${({ theme, $kind = 'info' }) =>
    $kind === 'warn' ? theme.colors.warn : theme.colors.textMuted};
`;

export function SelectionBar({ visiblePets, allPets }: Props) {
  const { selectedIds, selectAll, clear, totalSize } = useSelection();
  const [downloading, setDownloading] = useState(false);
  const [message, setMessage] = useState<{ kind: 'info' | 'warn'; text: string } | null>(null);

  const count = selectedIds.size;
  const { knownBytes, unknownCount } = totalSize(allPets);
  // Approximation prefix when some sizes were not measurable (CORS / no
  // content-length header).
  const sizeLabel =
    count === 0
      ? '—'
      : `${unknownCount > 0 ? '≈ ' : ''}${formatBytes(knownBytes || (unknownCount ? null : 0))}`;

  const allVisibleSelected =
    visiblePets.length > 0 && visiblePets.every((p) => selectedIds.has(p.id));

  function handleSelectAll() {
    selectAll(visiblePets.map((p) => p.id));
  }

  async function handleDownload() {
    setMessage(null);
    setDownloading(true);
    try {
      const selected = allPets.filter((p) => selectedIds.has(p.id));
      const result = await downloadAsZip(selected);
      if (result.zipped === 0) {
        setMessage({
          kind: 'warn',
          text:
            'No images could be downloaded — the image host blocked the request (CORS). Try opening individual pets to download via the browser instead.',
        });
      } else if (result.skipped > 0) {
        setMessage({
          kind: 'warn',
          text: `Downloaded ${result.zipped} of ${result.total} (${result.skipped} skipped due to CORS).`,
        });
      } else {
        setMessage({ kind: 'info', text: `Downloaded ${result.zipped} image(s) as ZIP.` });
      }
    } catch (err) {
      setMessage({
        kind: 'warn',
        text: err instanceof Error ? err.message : 'Download failed.',
      });
    } finally {
      setDownloading(false);
    }
  }

  return (
    <Bar aria-label="Selection toolbar">
      <Stats>
        <span><strong>{count}</strong> selected</span>
        <span>Total size: <strong>{sizeLabel}</strong></span>
      </Stats>
      <Group>
        <Btn
          type="button"
          onClick={handleSelectAll}
          disabled={visiblePets.length === 0 || allVisibleSelected}
          title="Select every pet currently visible"
        >
          Select All
        </Btn>
        <Btn type="button" onClick={clear} disabled={count === 0}>
          Clear Selection
        </Btn>
        <Btn
          $variant="primary"
          type="button"
          onClick={handleDownload}
          disabled={count === 0 || downloading}
        >
          {downloading && <Spinner $size={14} />}
          {downloading ? 'Zipping…' : `Download ZIP (${count})`}
        </Btn>
      </Group>
      {message && <Notice $kind={message.kind}>{message.text}</Notice>}
    </Bar>
  );
}
