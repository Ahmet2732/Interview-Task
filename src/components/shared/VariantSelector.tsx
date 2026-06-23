import type { Variant } from '../../types';

interface VariantSelectorProps {
  variants: Variant[];
  activeVariantId: string;
  onSelect: (variantId: string) => void;
  productName: string;
}

export function VariantSelector({
  variants,
  activeVariantId,
  onSelect,
  productName,
}: VariantSelectorProps) {
  return (
    <div className="flex gap-1" role="radiogroup" aria-label={`${productName} color`}>
      {variants.map((variant) => {
        const isActive = variant.id === activeVariantId;
        return (
          <button
            key={variant.id}
            type="button"
            role="radio"
            aria-checked={isActive}
            className={`inline-flex items-center gap-1.5 rounded-full border px-1 text-xs font-medium transition-colors ${
              isActive
                ? 'border-wyze-purple bg-wyze-purple-light text-wyze-purple'
                : 'border-wyze-border bg-white text-wyze-muted hover:border-slate-300'
            }`}
            onClick={() => onSelect(variant.id)}
          >
            <span
              className="h-3.5 w-3.5 rounded-full border border-slate-300"
              style={{ backgroundColor: variant.swatchColor }}
              aria-hidden="true"
            />
            <span>{variant.label}</span>
          </button>
        );
      })}
    </div>
  );
}
