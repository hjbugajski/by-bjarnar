'use client';

import { Button } from '@/components/ui/button';

interface Props {
  error: Error & { digest?: string };
  retry: () => void;
}

export default function Error({ error, retry }: Props) {
  return (
    <section>
      <h1 className="mb-4 text-4xl xs:text-5xl">Something went wrong</h1>
      <p className="mb-6">We couldn&apos;t load this page. Trying again may fix it.</p>
      <Button variant="secondary" onClick={() => retry()}>
        Try again
      </Button>
      {error.digest ? <p className="mt-6 text-sm text-gold-9">Reference: {error.digest}</p> : null}
    </section>
  );
}
