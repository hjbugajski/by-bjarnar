'use client';

interface Props {
  error: Error & { digest?: string };
  retry: () => void;
}

/*
 * Catches failures in the root layout itself, which `(site)/error.tsx` cannot.
 * It replaces the root layout, so it renders its own document and cannot rely
 * on the layout's fonts, styles, or providers — hence the inline styles.
 */
export default function GlobalError({ error, retry }: Props) {
  return (
    <html lang="en">
      <body
        style={{
          margin: 0,
          minHeight: '100vh',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '1rem',
          backgroundColor: '#faf9f2',
          color: '#71624b',
          fontFamily: 'system-ui, sans-serif',
          textAlign: 'center',
        }}
      >
        <main>
          <h1 style={{ margin: '0 0 1rem', fontSize: '2.25rem', color: '#3b352b' }}>
            Something went wrong
          </h1>
          <p style={{ margin: '0 0 1.5rem' }}>
            We couldn&apos;t load this page. Trying again may fix it.
          </p>
          <button
            type="button"
            onClick={() => retry()}
            style={{
              height: '2.25rem',
              padding: '0 1rem',
              border: '1px solid #d8d0bf',
              borderRadius: '0.25rem',
              backgroundColor: '#f2f0e7',
              color: '#71624b',
              font: 'inherit',
              fontSize: '0.875rem',
              cursor: 'pointer',
            }}
          >
            Try again
          </button>
          {error.digest ? (
            <p style={{ margin: '1.5rem 0 0', fontSize: '0.875rem', color: '#978365' }}>
              Reference: {error.digest}
            </p>
          ) : null}
        </main>
      </body>
    </html>
  );
}
