import { MessageSquareQuote } from 'lucide-react';
import { useCMS } from '@/context/CMSContext';
import CollectionManager from '@/components/admin/CollectionManager';
import { Avatar, Stars } from '@/components/site/ui';

export default function TestimonialsAdmin() {
  const { data } = useCMS();
  return (
    <CollectionManager
      collection="testimonials"
      title="Testimonials"
      description="Reviews shown on the homepage and sign-in pages. The first visible one is featured large."
      singular="Testimonial"
      icon={MessageSquareQuote}
      publishKey="published"
      searchText={(t) => `${t.name} ${t.trekName} ${t.quote}`}
      newItem={() => ({ name: '', location: '', trekName: data.treks[0]?.name ?? '', rating: 5, quote: '', avatar: '', published: true })}
      fields={[
        { key: 'name', label: 'Name', type: 'text', required: true },
        { key: 'location', label: 'City', type: 'text' },
        { key: 'trekName', label: 'Trek', type: 'select', options: data.treks.map((t) => t.name) },
        { key: 'rating', label: 'Rating', type: 'rating' },
        { key: 'quote', label: 'Quote', type: 'textarea', required: true },
        { key: 'avatar', label: 'Photo', type: 'image', hint: 'Optional. Initials are shown if empty.' },
        { key: 'published', label: 'Visible on site', type: 'toggle' },
      ]}
      columns={[
        {
          label: 'Person',
          render: (t) => (
            <div className="flex items-center gap-3">
              <Avatar src={t.avatar} name={t.name} className="h-9 w-9 text-xs" />
              <div>
                <div className="font-medium text-pine-950">{t.name}</div>
                <div className="text-xs text-pine-800/50">{t.location}</div>
              </div>
            </div>
          ),
        },
        { label: 'Quote', className: 'max-w-xs', render: (t) => <p className="line-clamp-2 text-pine-800/70">{t.quote}</p> },
        { label: 'Trek', render: (t) => <span className="text-pine-800/80">{t.trekName}</span> },
        { label: 'Rating', render: (t) => <Stars rating={t.rating} /> },
      ]}
    />
  );
}
