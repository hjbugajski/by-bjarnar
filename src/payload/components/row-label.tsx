'use client';

import { useRowLabel } from '@payloadcms/ui';
import type { Data } from 'payload';

function isRecord(value: unknown): value is Record<string, unknown> {
  return value !== null && value !== undefined && typeof value === 'object';
}

export function RowLabel({ path, fallback }: { path: string; fallback: string }) {
  const { data, rowNumber } = useRowLabel<Data>();
  const fieldValue = path
    .split('.')
    .reduce<unknown>((value, part) => (isRecord(value) ? value[part] : undefined), data);
  const label = typeof fieldValue === 'string' ? fieldValue : `${fallback} ${rowNumber}`;

  return label;
}
