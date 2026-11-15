import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export type SettingValue = string | number | boolean;
export type SettingsSection = Record<string, SettingValue>;
export type SettingsState = Record<string, SettingsSection>;

export const SETTINGS_DEFAULTS: SettingsState = {
  company: {
    name: 'Career Creed HR',
    legalName: 'Career Creed HR Services Pvt Ltd',
    email: 'admin@careercreed.com',
    phone: '+91 80 4123 9000',
    website: 'https://careercreed.com',
    address: 'Prestige Tech Park, Bengaluru 560103',
    taxId: 'AACCC1234F',
    employees: 248,
  },
  branding: {
    primary: '#2b9cf2',
    accent: '#a78bfa',
    logoText: 'CC',
    loginHeadline: 'People operations, without the paperwork.',
    supportEmail: 'support@careercreed.com',
  },
  localization: {
    language: 'English',
    timezone: 'Asia/Kolkata',
    currency: 'INR',
    dateFormat: 'DD MMM YYYY',
    timeFormat: '24h',
    weekStart: 'Monday',
    numberFormat: '1,00,000.00',
  },
  email: {
    mailer: 'smtp',
    host: 'smtp.mailtrap.io',
    port: 587,
    username: 'careercreed',
    encryption: 'tls',
    fromName: 'Career Creed HR',
    fromEmail: 'no-reply@careercreed.com',
  },
  payments: {
    gateway: 'Stripe',
    currency: 'USD',
    taxPercent: 18,
    stripeKey: 'pk_test_••••••••',
    paypal: false,
    bankTransfer: true,
  },
  storage: {
    driver: 'S3',
    bucket: 'careercreed-hrms',
    region: 'ap-south-1',
    cdn: 'https://cdn.careercreed.com',
    maxUploadMb: 25,
  },
  notifications: {
    newUser: true,
    leave: true,
    payroll: true,
    recruitment: false,
    billing: true,
  },
  security: {
    twoFactor: true,
    sessionTimeout: 30,
    passwordMin: 10,
    recaptchaKey: '6Lc-demo-key',
    forceHttps: true,
  },
  seo: {
    metaTitle: 'Career Creed HRMS',
    metaDescription: 'Payroll, attendance, hiring and performance in one workspace.',
    keywords: 'hrms, payroll, recruitment, attendance',
    ogImage: '/og-image.png',
  },
  landing: {
    heroTitle: 'Run HR like a product team',
    heroSubtitle: 'Payroll, attendance, hiring and performance in one workspace.',
    cta: 'Start free trial',
    showPricing: true,
    showTestimonials: true,
    showFaq: true,
  },
  system: {
    cacheDriver: 'redis',
    cacheSize: '128 MB',
    queue: 'database',
    debug: false,
    maintenance: false,
  },
};

interface SettingsStore {
  values: SettingsState;
  save: (section: string, sectionValues: SettingsSection) => void;
  resetAll: () => void;
}

export const useSettingsStore = create<SettingsStore>()(
  persist(
    (set, get) => ({
      values: SETTINGS_DEFAULTS,
      save: (section, sectionValues) =>
        set({ values: { ...get().values, [section]: { ...get().values[section], ...sectionValues } } }),
      resetAll: () => set({ values: SETTINGS_DEFAULTS }),
    }),
    { name: 'hrms-settings-v1' },
  ),
);
