import { useMemo, useRef, useState } from 'react';
import { Copy, FileText, Film, Image as ImageIcon, Search, Trash2, Upload } from 'lucide-react';
import { PageHeader } from '@/components/layout/PageHeader';
import { Card } from '@/components/ui/card';
import { Button, Pill } from '@/components/ui/button';
import { useToast } from '@/components/ui/toast';

type MediaKind = 'image' | 'document' | 'video';

interface MediaItem {
  id: string;
  name: string;
  kind: MediaKind;
  folder: string;
  size: string;
  uploaded: string;
}

const SEED: MediaItem[] = [
  { id: 'm-1', name: 'career-creed-logo.png', kind: 'image', folder: 'Brand', size: '48 KB', uploaded: '2026-10-02' },
  { id: 'm-2', name: 'employee-handbook-2026.pdf', kind: 'document', folder: 'HR policies', size: '2.4 MB', uploaded: '2026-10-12' },
  { id: 'm-3', name: 'q3-townhall.mp4', kind: 'video', folder: 'Events', size: '184 MB', uploaded: '2026-11-06' },
  { id: 'm-4', name: 'offer-letter-template.docx', kind: 'document', folder: 'Recruitment', size: '96 KB', uploaded: '2026-09-24' },
  { id: 'm-5', name: 'office-bengaluru.jpg', kind: 'image', folder: 'Brand', size: '1.2 MB', uploaded: '2026-08-18' },
  { id: 'm-6', name: 'payroll-faq.pdf', kind: 'document', folder: 'HR policies', size: '310 KB', uploaded: '2026-11-04' },
  { id: 'm-7', name: 'diwali-celebration.jpg', kind: 'image', folder: 'Events', size: '2.8 MB', uploaded: '2026-11-09' },
  { id: 'm-8', name: 'onboarding-day.mp4', kind: 'video', folder: 'Recruitment', size: '64 MB', uploaded: '2026-07-21' },
];

const KIND_ICON = { image: ImageIcon, document: FileText, video: Film };

export default function MediaLibraryPage() {
  const { push } = useToast();
  const fileRef = useRef<HTMLInputElement>(null);
  const [items, setItems] = useState<MediaItem[]>(SEED);
  const [folder, setFolder] = useState('All');
  const [kind, setKind] = useState<'all' | MediaKind>('all');
  const [query, setQuery] = useState('');

  const folders = useMemo(() => ['All', ...new Set(SEED.map((item) => item.folder))], []);

  const visible = items.filter(
    (item) =>
      (folder === 'All' || item.folder === folder) &&
      (kind === 'all' || item.kind === kind) &&
      (!query || item.name.toLowerCase().includes(query.toLowerCase())),
  );

  const addFile = (file: File) => {
    const ext = file.name.split('.').pop()?.toLowerCase() ?? '';
    const nextKind: MediaKind = ['png', 'jpg', 'jpeg', 'webp', 'gif', 'svg'].includes(ext)
      ? 'image'
      : ['mp4', 'webm', 'mov'].includes(ext)
        ? 'video'
        : 'document';
    setItems((current) => [
      {
        id: `m-${Date.now()}`,
        name: file.name,
        kind: nextKind,
        folder: folder === 'All' ? 'Uploads' : folder,
        size: `${Math.max(1, Math.round(file.size / 1024))} KB`,
        uploaded: new Date().toISOString().slice(0, 10),
      },
      ...current,
    ]);
    push(`${file.name} uploaded`);
  };

  return (
    <div>
      <PageHeader
        title="Media library"
        subtitle="Uploads used across documents, the landing page and careers site."
        actions={
          <Button icon={<Upload size={14} />} onClick={() => fileRef.current?.click()}>
            Upload files
          </Button>
        }
      />
      <input
        ref={fileRef}
        type="file"
        hidden
        multiple
        onChange={(event) => {
          Array.from(event.target.files ?? []).forEach(addFile);
          event.target.value = '';
        }}
      />

      <div className="toolbar">
        <div className="input-wrap">
          <Search />
          <input
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Search media…"
            aria-label="Search media"
          />
        </div>
        {folders.map((item) => (
          <Pill key={item} active={folder === item} onClick={() => setFolder(item)}>
            {item}
          </Pill>
        ))}
        <div className="spacer" />
        {(['all', 'image', 'document', 'video'] as const).map((item) => (
          <Pill key={item} active={kind === item} onClick={() => setKind(item)}>
            {item === 'all' ? 'All types' : item.charAt(0).toUpperCase() + item.slice(1)}
          </Pill>
        ))}
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill,minmax(210px,1fr))', gap: 14 }}>
        {visible.map((item) => {
          const Icon = KIND_ICON[item.kind];
          return (
            <Card key={item.id} style={{ padding: 14 }}>
              <div
                style={{
                  height: 96,
                  borderRadius: 12,
                  display: 'grid',
                  placeItems: 'center',
                  background: 'linear-gradient(135deg, color-mix(in srgb, var(--ac) 22%, transparent), transparent)',
                  color: 'var(--ac)',
                  marginBottom: 10,
                }}
              >
                <Icon size={30} />
              </div>
              <b style={{ fontSize: 12.5, display: 'block', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                {item.name}
              </b>
              <small className="mut" style={{ fontSize: 11 }}>
                {item.folder} · {item.size} · {item.uploaded}
              </small>
              <div style={{ display: 'flex', gap: 4, marginTop: 8 }}>
                <button
                  className="x"
                  aria-label={`Copy link for ${item.name}`}
                  onClick={() => push(`Link copied for ${item.name}`)}
                >
                  <Copy />
                </button>
                <button
                  className="x"
                  aria-label={`Delete ${item.name}`}
                  onClick={() => {
                    setItems((current) => current.filter((entry) => entry.id !== item.id));
                    push(`${item.name} deleted`);
                  }}
                >
                  <Trash2 />
                </button>
              </div>
            </Card>
          );
        })}
        {visible.length === 0 ? (
          <Card style={{ gridColumn: '1/-1' }}>
            <div className="state">
              <ImageIcon />
              <b>No media matches these filters</b>
              <span style={{ fontSize: 12.5 }}>Upload a file or clear the filters.</span>
            </div>
          </Card>
        ) : null}
      </div>
    </div>
  );
}
