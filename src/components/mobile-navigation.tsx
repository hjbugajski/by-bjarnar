'use client';

import { useState } from 'react';

import { Dialog } from '@base-ui/react/dialog';
import Link from 'next/link';

import { Button } from '@/components/ui/button';
import { IconClose } from '@/icons/close';
import { IconMenu } from '@/icons/menu';
import type { PayloadNavigationGlobal } from '@/payload/payload-types';
import { linkProps } from '@/utils/link';

interface MobileNavigationProps {
  links: PayloadNavigationGlobal['links'];
}

export function MobileNavigation({ links }: MobileNavigationProps) {
  const [open, setOpen] = useState(false);

  return (
    <Dialog.Root open={open} onOpenChange={setOpen}>
      <Dialog.Trigger
        render={
          <Button iconPosition="center" size="sm" variant="secondary" className="md:hidden">
            {open ? <IconClose className="size-4" /> : <IconMenu className="size-4" />}
            <span className="sr-only">Open navigation menu</span>
          </Button>
        }
      />
      <Dialog.Portal>
        <Dialog.Backdrop className="fixed inset-x-0 top-15 bottom-0 bg-gold-2/50 backdrop-blur-lg transition-all duration-200 data-ending-style:opacity-0 data-starting-style:opacity-0" />
        <Dialog.Popup className="fixed inset-x-4 top-20 z-50 overflow-y-auto transition-all duration-200 data-ending-style:scale-95 data-ending-style:opacity-0 data-starting-style:scale-95 data-starting-style:opacity-0">
          <ul className="flex flex-col gap-4">
            {links?.map((link) => (
              <li key={link.id}>
                <Dialog.Close
                  render={
                    <Link {...linkProps(link)} className="text-2xl font-medium text-gold-11">
                      {link.text}
                    </Link>
                  }
                />
              </li>
            ))}
          </ul>
        </Dialog.Popup>
      </Dialog.Portal>
    </Dialog.Root>
  );
}
