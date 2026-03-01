'use client';

import { useRef, useState } from 'react';

import isEmail from 'validator/lib/isEmail';
import isMobilePhone from 'validator/lib/isMobilePhone';
import { z } from 'zod';

import { submitForm } from '@/components/blocks/form/form.action';
import { RichText } from '@/components/rich-text';
import { Button } from '@/components/ui/button';
import {
  Field,
  FieldControl,
  FieldDescription,
  FieldError,
  FieldLabel,
} from '@/components/ui/field';
import { Form } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Spinner } from '@/components/ui/spinner';
import { Textarea } from '@/components/ui/textarea';
import { IconClose } from '@/icons/close';
import type { PayloadFormsCollection } from '@/payload/payload-types';

const REQUIRED_MESSAGE = 'Field is required';

function renderFieldControl(field: PayloadFormsCollection['fields'][number]) {
  switch (field.blockType) {
    case 'textarea':
      return <Textarea name={field.name} placeholder={field.placeholder || undefined} />;
    case 'email':
      return <Input name={field.name} type="email" placeholder={field.placeholder || undefined} />;
    case 'phoneNumber':
      return <Input name={field.name} type="tel" placeholder={field.placeholder || undefined} />;
    default:
      return <Input name={field.name} type="text" placeholder={field.placeholder || undefined} />;
  }
}

export const FormClient = ({
  confirmationMessage,
  fields,
  id,
  submitButtonLabel,
}: PayloadFormsCollection) => {
  const formRef = useRef<HTMLFormElement>(null);

  const [formErrors, setFormErrors] = useState({});
  const [formMessage, setFormMessage] = useState<string | null>(null);
  const [formState, setFormState] = useState<'idle' | 'pending' | 'error' | 'success'>('idle');

  const formSchema = z.object(
    fields.reduce(
      (schema, field) => {
        let fieldSchema;

        switch (field.blockType) {
          case 'text':
          case 'textarea': {
            if (field.required) {
              fieldSchema = z.string().min(1, { error: REQUIRED_MESSAGE });
            } else {
              fieldSchema = z.string().optional();
            }

            break;
          }
          case 'email': {
            const validator = (arg: string | undefined) => (arg ? isEmail(arg) : true);
            const message = 'Must be a valid email address';

            if (field.required) {
              fieldSchema = z.string().min(1, { error: REQUIRED_MESSAGE }).refine(validator, {
                error: message,
              });
            } else {
              fieldSchema = z.string().optional().refine(validator, { error: message });
            }

            break;
          }
          case 'phoneNumber': {
            const validator = (arg: string | undefined) => (arg ? isMobilePhone(arg) : true);
            const message = 'Must be a valid phone number';

            if (field.required) {
              fieldSchema = z
                .string()
                .min(1, { error: REQUIRED_MESSAGE })
                .refine(validator, { error: message });
            } else {
              fieldSchema = z.string().optional().refine(validator, { error: message });
            }

            break;
          }
        }

        return Object.assign(schema, { [field.name]: fieldSchema });
      },
      {} as Record<string, z.ZodType>,
    ),
  );

  async function onSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setFormState('pending');
    setFormErrors({});

    const formData = new FormData(event.currentTarget);
    const values: Record<PropertyKey, string> = {};

    formData.forEach((value, key) => {
      if (typeof value === 'string') {
        values[key] = value;
      }
    });

    try {
      const parsedValues = formSchema.parse(values) as Record<PropertyKey, string>;
      const formattedValues = fields.map((field) => ({
        label: field.label,
        name: field.name,
        value: parsedValues[field.name],
      }));

      await submitForm(id, formattedValues);
      formRef.current?.reset();
      setFormState('success');
      setFormMessage(confirmationMessage);
    } catch (e) {
      if (e instanceof z.ZodError) {
        setFormErrors(z.flattenError(e).fieldErrors);
        setFormState('idle');
      } else {
        setFormState('error');
        setFormMessage('An error occurred while submitting the form.');
      }
    }
  }

  return (
    <>
      {formMessage ? (
        <div
          data-form-state={formState}
          className="relative mb-4 gap-2 rounded border border-gold-6 bg-gold-3 py-2 pr-10 pl-3 data-[form-state=error]:border-tomato-6 data-[form-state=error]:bg-tomato-3 data-[form-state=error]:text-tomato-11 data-[form-state=success]:border-green-6 data-[form-state=success]:bg-green-3 data-[form-state=success]:text-green-11"
        >
          <p>{formMessage}</p>
          <button
            type="button"
            data-form-state={formState}
            onClick={() => setFormMessage(null)}
            className="absolute top-2 right-1.5 flex shrink-0 items-center justify-center rounded-xs p-1 transition hover:bg-gold-4 data-[form-state=error]:hover:bg-tomato-4 data-[form-state=success]:hover:bg-green-4"
          >
            <span className="sr-only">Close</span>
            <IconClose className="size-4" />
          </button>
        </div>
      ) : null}
      <Form ref={formRef} id={id} onSubmit={(e) => void onSubmit(e)} errors={formErrors}>
        {fields.map((field) => (
          <Field
            key={field.id || field.name}
            name={field.name}
            data-width={field.width}
            className="data-[width=full]:sm:col-span-2"
          >
            <FieldLabel>
              {field.label}
              {field.required ? null : ' (optional)'}
            </FieldLabel>
            <FieldControl render={renderFieldControl(field)} />
            {field.description ? (
              <FieldDescription>
                <RichText data={field.description} />
              </FieldDescription>
            ) : null}
            <FieldError />
          </Field>
        ))}
        <div className="flex justify-end sm:col-span-2">
          <Button
            type="submit"
            disabled={formState === 'pending'}
            iconPosition={formState === 'pending' ? 'left' : undefined}
          >
            {submitButtonLabel}
            {formState === 'pending' ? <Spinner /> : null}
          </Button>
        </div>
      </Form>
    </>
  );
};
