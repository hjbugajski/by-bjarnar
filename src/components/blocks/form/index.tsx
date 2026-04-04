import type { ComponentType, ReactNode } from 'react';

import { FormClient } from '@/components/blocks/form/form.client';
import type { PayloadFormBlock, PayloadFormsCollection } from '@/payload/payload-types';

interface FormBlockProps extends PayloadFormBlock {
  RichText: ComponentType<{ data?: PayloadFormsCollection['description'] }>;
}

export function FormBlock({ form, RichText }: FormBlockProps) {
  if (!form || typeof form === 'string') {
    // TODO: make alert component
    return <p>There was an error rendering the form. Please reload the page and try again.</p>;
  }

  const fieldDescriptions: Record<string, ReactNode> = {};

  for (const field of form.fields) {
    if (field.description) {
      fieldDescriptions[field.name] = <RichText data={field.description} />;
    }
  }

  return (
    <section className="mx-auto my-10 w-full max-w-3xl first:mt-0 last:mb-0">
      {form.formOnly ? null : (
        <>
          <h1 className="mt-10 mb-8 text-3xl first:mt-0 last:mb-0 xs:text-5xl">{form?.title}</h1>
          <RichText data={form.description} />
        </>
      )}
      <FormClient {...form} fieldDescriptions={fieldDescriptions} />
    </section>
  );
}
