import { Users } from 'lucide-react';
import { useCMS } from '@/context/CMSContext';
import CollectionManager from '@/components/admin/CollectionManager';
import { Avatar } from '@/components/site/ui';

export default function TeamAdmin() {
  const { data } = useCMS();
  return (
    <CollectionManager
      collection="team"
      title="Team"
      description="Team members shown on the About page, ordered by the Order field."
      singular="Member"
      icon={Users}
      searchText={(m) => `${m.name} ${m.role}`}
      sort={(a, b) => a.order - b.order}
      newItem={() => ({ name: '', role: '', bio: '', photo: '', order: data.team.length + 1 })}
      fields={[
        { key: 'name', label: 'Name', type: 'text', required: true },
        { key: 'role', label: 'Role', type: 'text', required: true },
        { key: 'order', label: 'Order', type: 'number', hint: 'Lower numbers appear first.' },
        { key: 'bio', label: 'Short bio', type: 'textarea' },
        { key: 'photo', label: 'Photo', type: 'image' },
      ]}
      columns={[
        { label: '#', className: 'w-12', render: (m) => <span className="text-pine-800/50">{m.order}</span> },
        {
          label: 'Member',
          render: (m) => (
            <div className="flex items-center gap-3">
              <Avatar src={m.photo} name={m.name} className="h-9 w-9 text-xs" />
              <div className="font-medium text-pine-950">{m.name}</div>
            </div>
          ),
        },
        { label: 'Role', render: (m) => <span className="text-pine-800/80">{m.role}</span> },
        { label: 'Bio', className: 'max-w-sm', render: (m) => <p className="line-clamp-2 text-pine-800/65">{m.bio}</p> },
      ]}
    />
  );
}
