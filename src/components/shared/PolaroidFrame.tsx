import { cn } from '../../lib/utils';

interface PolaroidFrameProps {
  src: string;
  alt: string;
  caption?: string;
  className?: string;
  rotate?: number; // initial rotation in degrees
  scale?: number; // initial scale
  children?: React.ReactNode;
}

export function PolaroidFrame({ 
  src, 
  alt, 
  caption, 
  className, 
  rotate = 3, 
  scale = 1.1,
  children
}: PolaroidFrameProps) {
  return (
    <div
      className={cn(
        'polaroid-frame relative bg-surface p-4 pb-12 shadow-xl rounded-sm transition-transform duration-300 hover:scale-105 hover:rotate-0 hover:z-10 cursor-pointer',
        className
      )}
      style={{
        transform: `rotate(${rotate}deg) scale(${scale})`,
      }}
    >
      <div className="absolute -top-3 left-1/2 -translate-x-1/2 w-16 h-6 bg-amber-100/80 backdrop-blur-xs shadow-xs rotate-[-2deg] border border-amber-200/50 z-10" aria-hidden="true" />
      <div className="relative overflow-hidden aspect-[4/3] rounded-xs mb-2">
        <img
          src={src}
          alt={alt}
          className="w-full h-full object-cover"
        />
        {children}
      </div>
      {caption && (
        <p className="font-handwriting text-on-surface absolute bottom-3 left-4 text-sm font-medium tracking-wide">
          {caption}
        </p>
      )}
    </div>
  );
}
