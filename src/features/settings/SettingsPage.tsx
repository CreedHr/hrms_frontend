import { useMemo, useState } from 'react';
import {
  Bot,
  Building2,
  CreditCard,
  Database,
  Globe,
  HardDrive,
  Mail,
  Palette,
  RefreshCw,
  Save,
  Search,
  Shield,
  Trash2,
  Webhook,
} from 'lucide-react';
import type { LucideIcon } from 'lucide-react';
import { PageHeader } from '@/components/layout/PageHeader';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useToast } from '@/components/ui/toast';
import { SETTINGS_DEFAULTS, useSettingsStore, type SettingValue } from '@/store/settings';

type FieldType = 'text' | 'email' | 'number' | 'select' | 'textarea' | 'toggle' | 'password';

interface FieldSpec {
  key: string;
  label: string;
  type: FieldType;
  options?: string[];
  help?: string;
  wide?: boolean;
}

interface SectionSpec {
  id: string;
  label: string;
  icon: LucideIcon;
  blurb: string;
  fields: FieldSpec[];
}

const SECTIONS: SectionSpec[] = [
  {
    id: 'company',
    label: 'Company',
    icon: Building2,
    blurb: 'Legal identity, contact details and defaults used across documents.',
    fields: [
      { key: 'name', label: 'Display name', type: 'text' },
      { key: 'legalName', label: 'Legal name', type: 'text' },
      { key: 'email', label: 'Billing email', type: 'email' },
      { key: 'phone', label: 'Phone', type: 'text' },
      { key: 'website', label: 'Website', type: 'text' },
      { key: 'taxId', label: 'Tax ID', type: 'text' },
      { key: 'address', label: 'Registered address', type: 'textarea', wide: true },
    ],
  },
  {
    id: 'branding',
    label: 'Branding',
    icon: Palette,
    blurb: 'Logo text, accent colours and login copy.',
    fields: [
      { key: 'primary', label: 'Primary colour', type: 'text' },
      { key: 'accent', label: 'Accent colour', type: 'text' },
      { key: 'logoText', label: 'Logo text', type: 'text' },
      { key: 'supportEmail', label: 'Support email', type: 'email' },
      { key: 'loginHeadline', label: 'Login headline', type: 'textarea', wide: true },
    ],
  },
  {
    id: 'localization',
    label: 'Localization',
    icon: Globe,
    blurb: 'Language, timezone and formatting used by every date and amount.',
    fields: [
      { key: 'language', label: 'Language', type: 'select', options: ['English', 'Hindi', 'French', 'Arabic'] },
      { key: 'timezone', label: 'Timezone', type: 'select', options: ['Asia/Kolkata', 'UTC', 'Europe/London', 'America/New_York'] },
      { key: 'currency', label: 'Currency', type: 'select', options: ['INR', 'USD', 'EUR', 'GBP'] },
      { key: 'dateFormat', label: 'Date format', type: 'select', options: ['DD MMM YYYY', 'MM/DD/YYYY', 'YYYY-MM-DD'] },
      { key: 'timeFormat', label: 'Time format', type: 'select', options: ['24h', '12h'] },
      { key: 'weekStart', label: 'Week starts on', type: 'select', options: ['Monday', 'Sunday'] },
    ],
  },
  {
    id: 'email',
    label: 'Email',
    icon: Mail,
    blurb: 'SMTP transport used for invitations, payslips and alerts.',
    fields: [
      { key: 'mailer', label: 'Mailer', type: 'select', options: ['smtp', 'mailgun', 'ses', 'postmark'] },
      { key: 'host', label: 'Host', type: 'text' },
      { key: 'port', label: 'Port', type: 'number' },
      { key: 'username', label: 'Username', type: 'text' },
      { key: 'encryption', label: 'Encryption', type: 'select', options: ['tls', 'ssl', 'none'] },
      { key: 'fromName', label: 'From name', type: 'text' },
      { key: 'fromEmail', label: 'From email', type: 'email' },
    ],
  },
  {
    id: 'payments',
    label: 'Payments',
    icon: CreditCard,
    blurb: 'Gateways used for subscription checkout (Stripe, PayPal, bank).',
    fields: [
      { key: 'gateway', label: 'Default gateway', type: 'select', options: ['Stripe', 'PayPal', 'Razorpay', 'Bank transfer'] },
      { key: 'currency', label: 'Billing currency', type: 'select', options: ['USD', 'INR', 'EUR'] },
      { key: 'taxPercent', label: 'Tax %', type: 'number' },
      { key: 'stripeKey', label: 'Publishable key', type: 'password' },
      { key: 'paypal', label: 'Enable PayPal', type: 'toggle' },
      { key: 'bankTransfer', label: 'Enable bank transfer', type: 'toggle' },
    ],
  },
  {
    id: 'storage',
    label: 'Storage',
    icon: HardDrive,
    blurb: 'Object storage for documents, receipts and media.',
    fields: [
      { key: 'driver', label: 'Driver', type: 'select', options: ['S3', 'Local', 'GCS'] },
      { key: 'bucket', label: 'Bucket', type: 'text' },
      { key: 'region', label: 'Region', type: 'text' },
      { key: 'cdn', label: 'CDN URL', type: 'text' },
      { key: 'maxUploadMb', label: 'Max upload (MB)', type: 'number' },
    ],
  },
  {
    id: 'notifications',
    label: 'Notifications',
    icon: Bot,
    blurb: 'Which events send an email or in-app notification.',
    fields: [
      { key: 'newUser', label: 'New user invited', type: 'toggle' },
      { key: 'leave', label: 'Leave decisions', type: 'toggle' },
      { key: 'payroll', label: 'Payroll closed', type: 'toggle' },
      { key: 'recruitment', label: 'Interview reminders', type: 'toggle' },
      { key: 'billing', label: 'Billing receipts', type: 'toggle' },
    ],
  },
  {
    id: 'security',
    label: 'Security',
    icon: Shield,
    blurb: 'Session policy, password rules and reCAPTCHA keys.',
    fields: [
      { key: 'twoFactor', label: 'Require 2FA for admins', type: 'toggle' },
      { key: 'sessionTimeout', label: 'Session timeout (min)', type: 'number' },
      { key: 'passwordMin', label: 'Minimum password length', type: 'number' },
      { key: 'recaptchaKey', label: 'reCAPTCHA site key', type: 'password' },
      { key: 'forceHttps', label: 'Force HTTPS', type: 'toggle' },
    ],
  },
  {
    id: 'seo',
    label: 'SEO',
    icon: Search,
    blurb: 'Metadata used by careers pages and the marketing site.',
    fields: [
      { key: 'metaTitle', label: 'Meta title', type: 'text' },
      { key: 'keywords', label: 'Keywords', type: 'text' },
      { key: 'ogImage', label: 'OG image', type: 'text' },
      { key: 'metaDescription', label: 'Meta description', type: 'textarea', wide: true },
    ],
  },
  {
    id: 'landing',
    label: 'Landing page',
    icon: Globe,
    blurb: 'Hero copy, sections and custom pages (nexhrms landing-page module).',
    fields: [
      { key: 'heroTitle', label: 'Hero title', type: 'text', wide: true },
      { key: 'heroSubtitle', label: 'Hero subtitle', type: 'textarea', wide: true },
      { key: 'cta', label: 'CTA label', type: 'text' },
      { key: 'showPricing', label: 'Show pricing section', type: 'toggle' },
      { key: 'showTestimonials', label: 'Show testimonials', type: 'toggle' },
      { key: 'showFaq', label: 'Show FAQ', type: 'toggle' },
    ],
  },
  {
    id: 'system',
    label: 'System',
    icon: Database,
    blurb: 'Cache, queue and maintenance switches.',
    fields: [
      { key: 'cacheDriver', label: 'Cache driver', type: 'select', options: ['redis', 'file', 'database'] },
      { key: 'queue', label: 'Queue driver', type: 'select', options: ['database', 'redis', 'sync'] },
      { key: 'debug', label: 'Debug mode', type: 'toggle' },
      { key: 'maintenance', label: 'Maintenance mode', type: 'toggle' },
    ],
  },
];

const CUSTOM_PAGES = [
  { title: 'About us', slug: '/page/about', status: 'Published' },
  { title: 'Contact', slug: '/page/contact', status: 'Published' },
  { title: 'Terms & conditions', slug: '/page/terms', status: 'Published' },
  { title: 'Refund policy', slug: '/page/refund', status: 'Draft' },
];

const WEBHOOKS = [
  { id: 'wh-1', event: 'employee.created', url: 'https://hooks.careercreed.com/hr/employee' },
  { id: 'wh-2', event: 'payroll.closed', url: 'https://hooks.careercreed.com/finance/payroll' },
];

export default function SettingsPage() {
  const values = useSettingsStore((s) => s.values);
  const save = useSettingsStore((s) => s.save);
  const resetAll = useSettingsStore((s) => s.resetAll);
  const { push } = useToast();
  const [active, setActive] = useState('company');
  const [draft, setDraft] = useState<Record<string, SettingValue>>(values.company ?? {});
  const [webhooks, setWebhooks] = useState(WEBHOOKS);
  const [hookEvent, setHookEvent] = useState('employee.created');
  const [hookUrl, setHookUrl] = useState('');

  const section = useMemo(() => SECTIONS.find((item) => item.id === active) ?? SECTIONS[0], [active]);

  const select = (id: string) => {
    setActive(id);
    setDraft({ ...(values[id] ?? {}) });
  };

  const currentDraft = active === 'company' && Object.keys(draft).length === 0 ? values.company : draft;

  return (
    <div>
      <PageHeader
        title="Settings"
        subtitle="System, brand, currency, email, payment, storage, security, SEO, landing page and cache — the same sections as nexhrms settings."
        actions={
          <>
            <Button
              variant="ghost"
              icon={<RefreshCw size={14} />}
              onClick={() => {
                resetAll();
                setDraft({ ...SETTINGS_DEFAULTS.company });
                push('Settings reset to defaults');
              }}
            >
              Reset all
            </Button>
            <Button
              icon={<Save size={14} />}
              onClick={() => {
                save(section.id, currentDraft);
                push(`${section.label} settings saved`);
              }}
            >
              Save changes
            </Button>
          </>
        }
      />

      <div style={{ display: 'grid', gridTemplateColumns: '210px minmax(0,1fr)', gap: 18, alignItems: 'start' }}>
        <Card style={{ padding: 8, position: 'sticky', top: 84 }}>
          <nav aria-label="Settings sections" style={{ display: 'grid', gap: 2 }}>
            {SECTIONS.map((item) => {
              const Icon = item.icon;
              return (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => select(item.id)}
                  className={`nav-link${item.id === active ? ' on' : ''}`}
                  style={{ padding: '8px 10px', fontSize: 12.5 }}
                >
                  <Icon />
                  <span>{item.label}</span>
                </button>
              );
            })}
          </nav>
        </Card>

        <div style={{ display: 'grid', gap: 16 }}>
          <Card title={section.label}>
            <p className="mut" style={{ fontSize: 12.5, marginBottom: 14 }}>
              {section.blurb}
            </p>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0 14px' }}>
              {section.fields.map((field) => {
                const id = `setting-${section.id}-${field.key}`;
                const value = currentDraft[field.key];
                const update = (next: SettingValue) => setDraft((current) => ({ ...current, [field.key]: next }));
                return (
                  <div className="field" key={field.key} style={field.wide || field.type === 'textarea' ? { gridColumn: 'span 2' } : undefined}>
                    <label htmlFor={id}>{field.label}</label>
                    {field.type === 'select' ? (
                      <select id={id} value={String(value ?? '')} onChange={(event) => update(event.target.value)}>
                        {(field.options ?? []).map((option) => (
                          <option key={option} value={option}>
                            {option}
                          </option>
                        ))}
                      </select>
                    ) : field.type === 'toggle' ? (
                      <label className="checkbox" htmlFor={id}>
                        <input
                          id={id}
                          type="checkbox"
                          checked={value === true}
                          onChange={(event) => update(event.target.checked)}
                        />
                        {value === true ? 'Enabled' : 'Disabled'}
                      </label>
                    ) : field.type === 'textarea' ? (
                      <textarea id={id} value={String(value ?? '')} onChange={(event) => update(event.target.value)} />
                    ) : (
                      <input
                        id={id}
                        type={field.type === 'number' ? 'number' : field.type === 'email' ? 'email' : field.type === 'password' ? 'password' : 'text'}
                        value={String(value ?? '')}
                        onChange={(event) =>
                          update(field.type === 'number' ? Number(event.target.value) : event.target.value)
                        }
                      />
                    )}
                  </div>
                );
              })}
            </div>
          </Card>

          {active === 'landing' ? (
            <Card title="Custom pages">
              <div className="tw">
                <table className="tbl">
                  <thead>
                    <tr>
                      <th>Page</th>
                      <th>Slug</th>
                      <th>Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {CUSTOM_PAGES.map((page) => (
                      <tr key={page.slug}>
                        <td>{page.title}</td>
                        <td className="mono mut">{page.slug}</td>
                        <td>
                          <span className={`badge ${page.status === 'Published' ? 'sg' : 'sy'}`}>{page.status}</span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </Card>
          ) : null}

          {active === 'system' ? (
            <>
              <Card title="Cache">
                <div className="stats-strip" style={{ border: 0, margin: 0 }}>
                  <div>
                    <small>Cache size</small>
                    <b>{String(values.system?.cacheSize ?? '128 MB')}</b>
                  </div>
                  <div>
                    <small>Driver</small>
                    <b>{String(values.system?.cacheDriver ?? 'redis')}</b>
                  </div>
                  <div style={{ borderRight: 0, display: 'flex', alignItems: 'center' }}>
                    <Button variant="ghost" size="sm" icon={<Trash2 size={13} />} onClick={() => push('Application cache cleared')}>
                      Clear cache
                    </Button>
                  </div>
                </div>
              </Card>

              <Card title="Webhooks">
                {webhooks.map((hook) => (
                  <div className="thread" key={hook.id}>
                    <div style={{ flex: 1 }}>
                      <b className="mono">{hook.event}</b>
                      <small>{hook.url}</small>
                    </div>
                    <button
                      className="x"
                      aria-label={`Delete webhook ${hook.event}`}
                      onClick={() => {
                        setWebhooks((current) => current.filter((item) => item.id !== hook.id));
                        push('Webhook removed');
                      }}
                    >
                      <Trash2 />
                    </button>
                  </div>
                ))}
                <div style={{ display: 'flex', gap: 8, marginTop: 12, flexWrap: 'wrap' }}>
                  <select
                    value={hookEvent}
                    onChange={(event) => setHookEvent(event.target.value)}
                    aria-label="Webhook event"
                    style={{ height: 38, background: 'var(--card)', border: '1px solid var(--bd)', borderRadius: 10, padding: '0 10px' }}
                  >
                    {['employee.created', 'employee.updated', 'leave.approved', 'payroll.closed', 'plan.order.paid'].map((event) => (
                      <option key={event} value={event}>
                        {event}
                      </option>
                    ))}
                  </select>
                  <input
                    value={hookUrl}
                    onChange={(event) => setHookUrl(event.target.value)}
                    placeholder="https://example.com/webhook"
                    aria-label="Webhook URL"
                    style={{ flex: 1, minWidth: 200, background: 'var(--card)', border: '1px solid var(--bd)', borderRadius: 10, padding: '0 12px', height: 38 }}
                  />
                  <Button
                    variant="ghost"
                    icon={<Webhook size={14} />}
                    onClick={() => {
                      if (!hookUrl.trim()) {
                        push('Enter a webhook URL', 'error');
                        return;
                      }
                      setWebhooks((current) => [...current, { id: `wh-${Date.now()}`, event: hookEvent, url: hookUrl }]);
                      setHookUrl('');
                      push('Webhook added');
                    }}
                  >
                    Add webhook
                  </Button>
                </div>
              </Card>
            </>
          ) : null}
        </div>
      </div>
    </div>
  );
}
