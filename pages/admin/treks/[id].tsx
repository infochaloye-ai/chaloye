import Link from 'next/link';
import { useRouter } from 'next/router';
import { Map } from 'lucide-react';
import { useCMS } from '@/context/CMSContext';
import TrekForm from '@/components/admin/TrekForm';
import { EmptyState } from '@/components/admin/ui';

export default function EditTrek() {
  const { query, isReady } = useRouter();
  const { data, ready } = useCMS();
  const trek = data.treks.find((t) => t.id === query.id);

  if (!isReady || !ready) return null;
  if (!trek) {
    return (
      <EmptyState
        icon={Map}
        title="Trek not found"
        description="It may have been deleted."
        action={<Link href="/admin/treks" className="rounded-lg bg-pine-900 px-4 py-2.5 text-sm font-medium text-white">Back to treks</Link>}
      />
    );
  }
  // Keyed so switching between treks resets the form state.
  return <TrekForm key={trek.id} trek={trek} />;
}
