import { Star } from 'lucide-react';

export function Rating({
  value,
  size = 'sm',
  showValue = false,
  count,
}: {
  value: number;
  size?: 'sm' | 'md' | 'lg';
  showValue?: boolean;
  count?: number;
}) {
  const sizes = { sm: 'w-3.5 h-3.5', md: 'w-4 h-4', lg: 'w-5 h-5' };
  const text = { sm: 'text-xs', md: 'text-sm', lg: 'text-base' };
  return (
    <div className="flex items-center gap-1">
      <div className="flex items-center">
        {[1, 2, 3, 4, 5].map((i) => (
          <Star
            key={i}
            className={`${sizes[size]} ${
              i <= Math.round(value) ? 'text-accent-400 fill-accent-400' : 'text-slate-300'
            }`}
          />
        ))}
      </div>
      {showValue && (
        <span className={`${text[size]} font-semibold text-slate-700`}>{value.toFixed(1)}</span>
      )}
      {count !== undefined && (
        <span className={`${text[size]} text-slate-400`}>({count})</span>
      )}
    </div>
  );
}
