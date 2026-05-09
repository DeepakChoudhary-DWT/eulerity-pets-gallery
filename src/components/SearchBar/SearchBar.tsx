import styled from 'styled-components';

const Wrap = styled.label`
  position: relative;
  display: flex;
  align-items: center;
  flex: 1 1 240px;
  min-width: 0;
`;

const Input = styled.input`
  width: 100%;
  padding: 10px 36px 10px 38px;
  border-radius: ${({ theme }) => theme.radii.md};
  border: 1px solid ${({ theme }) => theme.colors.border};
  background: ${({ theme }) => theme.colors.surface};
  color: ${({ theme }) => theme.colors.text};
  font-size: 14px;
  outline: none;
  transition: border-color 120ms, box-shadow 120ms;

  &::placeholder { color: ${({ theme }) => theme.colors.textMuted}; }

  &:focus {
    border-color: ${({ theme }) => theme.colors.accent};
    box-shadow: ${({ theme }) => theme.shadow.accent};
  }
`;

const Icon = styled.span`
  position: absolute;
  left: 12px;
  top: 50%;
  transform: translateY(-50%);
  pointer-events: none;
  color: ${({ theme }) => theme.colors.textMuted};
  font-size: 14px;
`;

const ClearBtn = styled.button`
  position: absolute;
  right: 8px;
  top: 50%;
  transform: translateY(-50%);
  border: 0;
  background: transparent;
  color: ${({ theme }) => theme.colors.textMuted};
  cursor: pointer;
  padding: 4px 6px;
  border-radius: ${({ theme }) => theme.radii.sm};

  &:hover { color: ${({ theme }) => theme.colors.text}; }
`;

interface Props {
  value: string;
  onChange: (next: string) => void;
}

export function SearchBar({ value, onChange }: Props) {
  return (
    <Wrap>
      <Icon aria-hidden>🔍</Icon>
      <span className="sr-only">Search pets by title or description</span>
      <Input
        type="search"
        placeholder="Search by title or description…"
        value={value}
        onChange={(e) => onChange(e.target.value)}
      />
      {value && (
        <ClearBtn type="button" onClick={() => onChange('')} aria-label="Clear search">
          ✕
        </ClearBtn>
      )}
    </Wrap>
  );
}
