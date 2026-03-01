import Image from 'next/image';

import type { PayloadImagesCollection } from '@/payload/payload-types';
import { cn } from '@/utils/cn';

export type PayloadImageProps = PayloadImagesCollection & {
  className?: string;
};

export function PayloadImage({
  alt,
  className,
  createdAt: _createdAt,
  dataUrl,
  displayOriginal,
  filename: _filename,
  filesize: _filesize,
  focalX: _focalX,
  focalY: _focalY,
  height: propsHeight,
  mimeType: _mimeType,
  sizes,
  thumbnailURL: _thumbnailURL,
  updatedAt: _updatedAt,
  url,
  width: propsWidth,
  ...props
}: PayloadImageProps) {
  const src = displayOriginal ? url : sizes?.preview?.url || url;
  const width = displayOriginal ? propsWidth : sizes?.preview?.width || propsWidth;
  const height = displayOriginal ? propsHeight : sizes?.preview?.height || propsHeight;

  if (!src || !width || !height) {
    return null;
  }

  return (
    <Image
      {...props}
      src={src}
      width={width}
      height={height}
      placeholder="blur"
      blurDataURL={dataUrl ?? undefined}
      alt={alt}
      className={cn('rounded-sm border border-gold-6', className)}
    />
  );
}
