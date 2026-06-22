export type ReviewCategory = 'cameras' | 'sensors' | 'accessories' | 'plan';

export interface Variant {
  id: string;
  label: string;
  swatchColor: string;
  image: string;
}

export interface Product {
  badgeType: string;
  id: string;
  stepId: string;
  reviewCategory: ReviewCategory;
  name: string;
  description: string;
  image: string;
  price: number;
  compareAtPrice?: number;
  badge?: string;
  learnMoreUrl?: string;
  variants?: Variant[];
  maxQuantity?: number;
}

export interface Step {
  id: string;
  number: number;
  title: string;
  icon: 'camera' | 'plan' | 'sensor' | 'protection';
  nextLabel?: string;
  products: Product[];
}

export interface ReviewMeta {
  shippingLabel: string;
  shippingPrice: number;
  shippingCompareAtPrice?: number;
  shippingNote: string;
  financingLabel: string;
  financingNote: string;
  financingMonthly?: number;
  satisfactionText: string;
  returnsTitle?: string;
  returnsDescription?: string;
}

export interface Catalog {
  brandName: string;
  steps: Step[];
  review: ReviewMeta;
}

export interface SelectionEntry {
  productId: string;
  variantId: string | null;
  quantity: number;
}

export interface BundleState {
  quantities: Record<string, number>;
  activeVariants: Record<string, string>;
  activeStep: number;
}

export interface SavedBundle extends BundleState {
  savedAt: string;
}

export function selectionKey(productId: string, variantId?: string | null): string {
  return variantId ? `${productId}::${variantId}` : `${productId}::default`;
}

export function parseSelectionKey(key: string): { productId: string; variantId: string | null } {
  const [productId, variantPart] = key.split('::');
  return {
    productId,
    variantId: variantPart === 'default' ? null : variantPart,
  };
}
