import { formatCurrency } from '../../utils/bundle';

interface PriceDisplayProps {
  price: number;
  compareAtPrice?: number;
  monthly?: boolean;
  size?: 'sm' | 'md' | 'lg';
  align?: 'left' | 'right';
  showFree?: boolean;
}

const sizeClasses = {
  sm: { compare: 'text-[11px]', price: 'text-sm font-semibold' },
  md: { compare: 'text-xs', price: 'text-base font-bold' },
  lg: { compare: 'text-sm', price: 'text-2xl font-bold' },
};

export function PriceDisplay({
  price,
  compareAtPrice,
  monthly = false,
  size = 'md',
  align = 'right',
  showFree = true,
}: PriceDisplayProps) {
  const classes = sizeClasses[size];
  const hasDiscount = compareAtPrice !== undefined && compareAtPrice > price;
  const isFree = showFree && price === 0;

  return (
    <div className={`flex flex-col ${align === 'right' ? 'items-end text-right' : 'items-start text-left'}`}>
      {hasDiscount ? (
        <span className={`${classes.compare} text-wyze-muted line-through`}>
          {formatCurrency(compareAtPrice, { monthly })}
        </span>
      ) : null}
      <span className={`${classes.price} ${isFree ? 'text-wyze-purple' : 'text-wyze-text'}`}>
        {formatCurrency(price, { monthly, free: showFree })}
      </span>
    </div>
  );
}

export function formatProductPrice(amount: number, monthly: boolean): string {
  return formatCurrency(amount, { monthly, free: false });
}
