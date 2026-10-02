import { HelpCircle } from 'lucide-react';
import { useCMS } from '@/context/CMSContext';
import CollectionManager from '@/components/admin/CollectionManager';

export default function FaqsAdmin() {
  const { data } = useCMS();
  return (
    <CollectionManager
      collection="faqs"
      title="FAQs"
      description="Questions shown on the homepage and contact page, ordered by the Order field."
      singular="FAQ"
      icon={HelpCircle}
      publishKey="published"
      searchText={(f) => `${f.question} ${f.answer}`}
      sort={(a, b) => a.order - b.order}
      newItem={() => ({ question: '', answer: '', order: data.faqs.length + 1, published: true })}
      fields={[
        { key: 'question', label: 'Question', type: 'text', required: true, full: true },
        { key: 'answer', label: 'Answer', type: 'textarea', required: true },
        { key: 'order', label: 'Order', type: 'number', hint: 'Lower numbers appear first.' },
        { key: 'published', label: 'Visible on site', type: 'toggle' },
      ]}
      columns={[
        { label: '#', className: 'w-12', render: (f) => <span className="text-pine-800/50">{f.order}</span> },
        { label: 'Question', render: (f) => <span className="font-medium text-pine-950">{f.question}</span> },
        { label: 'Answer', className: 'max-w-md', render: (f) => <p className="line-clamp-2 text-pine-800/65">{f.answer}</p> },
      ]}
    />
  );
}
