import { Link } from 'react-router-dom';
import { EmptyState } from '@/components/EmptyState/EmptyState';

export function NotFoundPage() {
  return (
    <EmptyState
      title="404 — Page not found"
      message="That route doesn’t exist."
      action={<Link to="/">Back to home</Link>}
    />
  );
}
