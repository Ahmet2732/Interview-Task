import { useBundle } from '../../context/BundleContext';
import type { Product } from '../../types';
import { getActiveQuantity, getProductImage, isProductSelected } from '../../utils/bundle';
import { formatProductPrice, QuantityStepper, VariantSelector } from '../shared';

interface ProductCardProps {
  product: Product;
  featured?: boolean;
}

export function ProductCard({ product, featured = false }: ProductCardProps) {
  const { state, setActiveVariant, setQuantity } = useBundle();
  const activeVariantId = product.variants
    ? state.activeVariants[product.id] ?? product.variants[0].id
    : null;
  const quantity = getActiveQuantity(product, state.quantities, activeVariantId);
  const selected = isProductSelected(product.id, state.quantities);
  const displayImage = getProductImage(product, activeVariantId);
  const maxQuantity = product.maxQuantity ?? 99;
  const isPlan = product.reviewCategory === 'plan';

  return (
  <div
      className={`relative flex h-43.25 w-[361.5px] overflow-hidden rounded-xl border bg-white transition-shadow hover:shadow-md sm:flex-row sm:items-stretch ${
        selected ? 'border-2 border-wyze-purple' : 'border-wyze-border'
      } ${featured ? 'sm:col-span-2' : ''}`}
    >
      {product.badge ? (
        <span className="absolute left-3 top-3 z-10 rounded-full bg-wyze-purple px-2.5 py-0.5 text-[11px] font-bold text-white">
          {product.badge}
        </span>
      ) : null}

      <div className="flex shrink-0 items-center justify-center bg-slate-50 p-3 sm:border-r sm:border-wyze-border ">
        <img src={displayImage} alt="" className="h-20 w-20 object-contain  " />
      </div>

      <div className="flex min-w-0 flex-1 flex-col gap-2 p-2 sm:gap-3">
        <div>
          <h3 className="text-sm font-bold leading-snug text-wyze-text lg:text-[15px]">{product.name}</h3>
          <p className="mt-0.5 text-xs leading-relaxed text-wyze-muted">{product.description}  <a
            href={product.learnMoreUrl}
            className="text-xs font-semibold text-wyze-blue hover:underline"
            onClick={(event) => event.preventDefault()}
          >
            Learn More
          </a></p>
        </div>

     
        {product.variants ? (
          <VariantSelector
            variants={product.variants}
            activeVariantId={activeVariantId!}
            onSelect={(variantId) => setActiveVariant(product.id, variantId)}
            productName={product.name}
          />
        ) : null}

        <div className="mt-auto flex items-end justify-between gap-3 pt-1">
          <QuantityStepper
            value={quantity}
            onChange={(next) => setQuantity(product.id, activeVariantId, next)}
            max={maxQuantity}
            ariaLabel={product.name}
          />

          <div className="text-right">
            {product.compareAtPrice !== undefined && product.compareAtPrice > product.price ? (
              <span className="block text-xs text-wyze-red line-through">
                {formatProductPrice(product.compareAtPrice, isPlan)}
              </span>
            ) : null}
            <span className="block text-base font-bold text-wyze-text">
              {formatProductPrice(product.price, isPlan)}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
