import type { Catalog, Product, ReviewCategory } from '../types';
import { parseSelectionKey, selectionKey } from '../types';

export function getProductMap(catalog: Catalog): Map<string, Product> {
  const map = new Map<string, Product>();
  for (const step of catalog.steps) {
    for (const product of step.products) {
      map.set(product.id, product);
    }
  }
  return map;
}

export function getDefaultVariantId(product: Product): string | null {
  return product.variants?.[0]?.id ?? null;
}

export function getVariantLabel(product: Product, variantId: string | null): string | null {
  if (!variantId || !product.variants) return null;
  return product.variants.find((variant) => variant.id === variantId)?.label ?? null;
}

export function getProductImage(product: Product, variantId: string | null): string {
  if (variantId && product.variants) {
    const variant = product.variants.find((item) => item.id === variantId);
    if (variant?.image) return variant.image;
  }
  return product.image;
}

export function getLineName(product: Product, variantId: string | null): string {
  const variantLabel = getVariantLabel(product, variantId);
  return variantLabel ? `${product.name} — ${variantLabel}` : product.name;
}

export function countSelectedProductsInStep(
  stepId: string,
  quantities: Record<string, number>,
  productMap: Map<string, Product>,
): number {
  const selectedProductIds = new Set<string>();

  for (const [key, quantity] of Object.entries(quantities)) {
    if (quantity <= 0) continue;
    const { productId } = parseSelectionKey(key);
    const product = productMap.get(productId);
    if (product?.stepId === stepId) {
      selectedProductIds.add(productId);
    }
  }

  return selectedProductIds.size;
}

export function getProductTotalQuantity(
  productId: string,
  quantities: Record<string, number>,
): number {
  return Object.entries(quantities).reduce((total, [key, quantity]) => {
    const { productId: id } = parseSelectionKey(key);
    return id === productId ? total + quantity : total;
  }, 0);
}

export function getActiveQuantity(
  product: Product,
  quantities: Record<string, number>,
  activeVariantId: string | null,
): number {
  const variantId = product.variants ? activeVariantId : null;
  return quantities[selectionKey(product.id, variantId)] ?? 0;
}

export function isProductSelected(productId: string, quantities: Record<string, number>): boolean {
  return getProductTotalQuantity(productId, quantities) > 0;
}

export interface ReviewLineItem {
  key: string;
  productId: string;
  variantId: string | null;
  name: string;
  image: string;
  quantity: number;
  unitPrice: number;
  compareAtPrice?: number;
  category: ReviewCategory;
  maxQuantity: number;
  isMonthly: boolean;
}

const CATEGORY_ORDER: ReviewCategory[] = ['cameras', 'sensors', 'accessories', 'plan'];

const CATEGORY_LABELS: Record<ReviewCategory, string> = {
  cameras: 'CAMERAS',
  sensors: 'SENSORS',
  accessories: 'ACCESSORIES',
  plan: 'HOME MONITORING PLAN',
};

export function getCategoryLabel(category: ReviewCategory): string {
  return CATEGORY_LABELS[category];
}

export function buildReviewItems(
  quantities: Record<string, number>,
  productMap: Map<string, Product>,
): ReviewLineItem[] {
  const items: ReviewLineItem[] = [];

  for (const [key, quantity] of Object.entries(quantities)) {
    if (quantity <= 0) continue;
    const { productId, variantId } = parseSelectionKey(key);
    const product = productMap.get(productId);
    if (!product) continue;

    items.push({
      key,
      productId,
      variantId,
      name: getLineName(product, variantId),
      image: getProductImage(product, variantId),
      quantity,
      unitPrice: product.price,
      compareAtPrice: product.compareAtPrice,
      category: product.reviewCategory,
      maxQuantity: product.maxQuantity ?? 99,
      isMonthly: product.reviewCategory === 'plan',
    });
  }

  return items.sort((a, b) => {
    const categoryDiff = CATEGORY_ORDER.indexOf(a.category) - CATEGORY_ORDER.indexOf(b.category);
    if (categoryDiff !== 0) return categoryDiff;
    return a.name.localeCompare(b.name);
  });
}

export interface PricingSummary {
  hardwareSubtotal: number;
  hardwareCompareAtSubtotal: number;
  monthlyTotal: number;
  monthlyCompareAtTotal: number;
  displayTotal: number;
  displayCompareTotal: number;
  savings: number;
  itemCount: number;
}

export function calculatePricing(
  quantities: Record<string, number>,
  productMap: Map<string, Product>,
): PricingSummary {
  let hardwareSubtotal = 0;
  let hardwareCompareAtSubtotal = 0;
  let monthlyTotal = 0;
  let monthlyCompareAtTotal = 0;
  let itemCount = 0;

  for (const [key, quantity] of Object.entries(quantities)) {
    if (quantity <= 0) continue;
    const { productId } = parseSelectionKey(key);
    const product = productMap.get(productId);
    if (!product) continue;

    itemCount += quantity;
    const lineTotal = product.price * quantity;

    if (product.reviewCategory === 'plan') {
      monthlyTotal += lineTotal;
      monthlyCompareAtTotal += (product.compareAtPrice ?? product.price) * quantity;
      continue;
    }

    hardwareSubtotal += lineTotal;
    const compareAt = product.compareAtPrice ?? product.price;
    hardwareCompareAtSubtotal += compareAt * quantity;
  }

  const displayTotal = hardwareSubtotal + monthlyTotal;
  const displayCompareTotal = hardwareCompareAtSubtotal + monthlyCompareAtTotal;

  return {
    hardwareSubtotal,
    hardwareCompareAtSubtotal,
    monthlyTotal,
    monthlyCompareAtTotal,
    displayTotal,
    displayCompareTotal,
    savings: Math.max(displayCompareTotal - displayTotal, 0),
    itemCount,
  };
}

export function formatCurrency(amount: number, options?: { monthly?: boolean; free?: boolean }): string {
  if (options?.free && amount === 0) {
    return 'FREE';
  }

  const formatted = new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(amount);

  return options?.monthly ? `${formatted}/mo` : formatted;
}
