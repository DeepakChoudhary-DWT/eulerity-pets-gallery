import styled from 'styled-components';
import type { SortKey } from '@/types/pet';

const Select = styled.select`
  padding: 10px 12px;
  border-radius: ${({ theme }) => theme.radii.md};
  border: 1px solid ${({ theme }) => theme.colors.border};
  background: ${({ theme }) => theme.colors.surface};
  color: ${({ theme }) => theme.colors.text};
  font-size: 14px;
  cursor: pointer;
  outline: none;

  &:focus {
    border-color: ${({ theme }) => theme.colors.accent};
    box-shadow: ${({ theme }) => theme.shadow.accent};
  }
`;

interface Props {
  value: SortKey;
  onChange: (next: SortKey) => void;
}

const OPTIONS: { value: SortKey; label: string }[] = [
  { value: 'name-asc', label: 'Name · A → Z' },
  { value: 'name-desc', label: 'Name · Z → A' },
  { value: 'date-newest', label: 'Date · Newest first' },
  { value: 'date-oldest', label: 'Date · Oldest first' },
];

export function SortDropdown({ value, onChange }: Props) {
  return (
    <>
      <span className="sr-only">Sort pets</span>
      <Select value={value} onChange={(e) => onChange(e.target.value as SortKey)}>
        {OPTIONS.map((o) => (
          <option key={o.value} value={o.value}>
            {o.label}
          </option>
        ))}
      </Select>
    </>
  );
}
