import { cva } from 'class-variance-authority';

import { PayloadButtonLink } from '@/components/ui/payload-button-link';
import type { PayloadButtonLinkBlock } from '@/payload/payload-types';

const buttonLinkVariants = cva('my-6 flex first:mt-0 last:mb-0', {
  variants: {
    alignment: {
      center: 'justify-center',
      left: 'justify-start',
      right: 'justify-end',
    },
  },
});

export function ButtonLinkBlock({
  alignment,
  blockName: _blockName,
  blockType: _blockType,
  id,
  ...props
}: PayloadButtonLinkBlock) {
  return (
    <div className={buttonLinkVariants({ alignment })}>
      <PayloadButtonLink id={id || undefined} {...props} />
    </div>
  );
}
