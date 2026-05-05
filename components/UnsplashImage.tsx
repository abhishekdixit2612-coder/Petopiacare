import Link from 'next/link';
import type { UnsplashImage as UnsplashImageType } from '@/types/unsplash';
import { getAttribution, getUnsplashImageUrl } from '@/lib/unsplash';

interface Props {
  image: UnsplashImageType;
  alt?: string;
  quality?: 'low' | 'medium' | 'high';
  className?: string;
  showCredit?: boolean;
  creditPosition?: 'overlay' | 'below';
}

export default function UnsplashImage({
  image,
  alt,
  quality = 'medium',
  className = 'w-full h-full object-cover',
  showCredit = true,
  creditPosition = 'below',
}: Props) {
  const src = getUnsplashImageUrl(image, quality);
  const credit = getAttribution(image);
  const imgAlt = alt ?? image.alt_description ?? image.description ?? 'Dog photo';

  return (
    <div className="relative">
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img src={src} alt={imgAlt} className={className} loading="lazy" />

      {showCredit && creditPosition === 'overlay' && (
        <div className="absolute bottom-0 left-0 right-0 bg-black/40 text-white text-[10px] px-2 py-1 flex items-center justify-end gap-1">
          <span>Photo by</span>
          <Link href={credit.profileUrl} target="_blank" rel="noopener noreferrer" className="underline hover:text-neutral-200">
            {credit.name}
          </Link>
          <span>on</span>
          <Link href={credit.unsplashUrl} target="_blank" rel="noopener noreferrer" className="underline hover:text-neutral-200">
            Unsplash
          </Link>
        </div>
      )}

      {showCredit && creditPosition === 'below' && (
        <p className="text-[10px] text-neutral-400 mt-1">
          Photo by{' '}
          <Link href={credit.profileUrl} target="_blank" rel="noopener noreferrer" className="underline hover:text-neutral-600">
            {credit.name}
          </Link>{' '}
          on{' '}
          <Link href={credit.unsplashUrl} target="_blank" rel="noopener noreferrer" className="underline hover:text-neutral-600">
            Unsplash
          </Link>
        </p>
      )}
    </div>
  );
}
