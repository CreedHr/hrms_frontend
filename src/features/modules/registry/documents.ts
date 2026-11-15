import { BadgeCheck, FileStack, FileText, FolderTree } from 'lucide-react';
import { refModule, STATUS_ACTIVE, type ModuleConfig } from '@/features/modules/registry/types';

export const documentModules: ModuleConfig[] = [
  {
    key: 'documents',
    path: '/documents',
    title: 'HR Documents',
    group: 'documents',
    icon: FileText,
    idPrefix: 'DC-1',
    statuses: ['Signed', 'Published', 'Pending'],
    searchKeys: ['name', 'owner', 'status'],
    extra: 'documents',
    description: 'Company and employee documents with e-sign status.',
    fields: [
      { key: 'name', label: 'Document', type: 'text', required: true, inTable: true },
      { key: 'owner', label: 'Owner', type: 'select', options: ['HR', 'Legal', 'Finance'], inTable: true },
      { key: 'size', label: 'Size', type: 'text', inTable: true },
      { key: 'updated', label: 'Updated', type: 'date', inTable: true },
      { key: 'status', label: 'Status', type: 'select', options: ['Signed', 'Published', 'Pending'] },
    ],
  },
  refModule({ key: 'documentCategories', path: '/document-categories', title: 'Document Categories', group: 'documents', icon: FolderTree, prefix: 'DCAT-1' }),
  {
    key: 'documentAcknowledgments',
    path: '/document-acknowledgments',
    title: 'Acknowledgments',
    group: 'documents',
    icon: BadgeCheck,
    idPrefix: 'ACK-1',
    statuses: ['Acknowledged', 'Pending', 'Overdue'],
    searchKeys: ['document', 'employee', 'status'],
    description: 'Policy acknowledgment tracking per employee.',
    fields: [
      { key: 'document', label: 'Document', type: 'text', required: true, inTable: true },
      { key: 'employee', label: 'Employee', type: 'text', inTable: true },
      { key: 'due', label: 'Due', type: 'date', inTable: true },
      { key: 'acknowledgedOn', label: 'Acknowledged on', type: 'date', inTable: true },
      { key: 'status', label: 'Status', type: 'select', options: ['Acknowledged', 'Pending', 'Overdue'] },
    ],
  },
  refModule({ key: 'documentTemplates', path: '/document-templates', title: 'Document Templates', group: 'documents', icon: FileStack, prefix: 'DTMP-1', statuses: STATUS_ACTIVE }),
];
