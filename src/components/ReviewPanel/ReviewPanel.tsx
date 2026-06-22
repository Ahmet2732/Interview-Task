import { useMemo, useState } from 'react';
import { useBundle, useReviewQuantityUpdater } from '../../context/BundleContext';
import type { ReviewCategory } from '../../types';
import { formatCurrency, getCategoryLabel } from '../../utils/bundle';
import {
  GuaranteeBadge,
  PriceDisplay,
  QuantityStepper,
  ShieldPlusIcon,

} from '../shared';

const CATEGORY_ORDER: ReviewCategory[] = ['cameras', 'sensors', 'accessories', 'plan'];

export function ReviewPanel() {
  const { catalog, reviewItems, pricing, saveForLater } = useBundle();
  const updateQuantity = useReviewQuantityUpdater();
  const [checkoutMessage, setCheckoutMessage] = useState<string | null>(null);
  const [saveMessage, setSaveMessage] = useState<string | null>(null);

  const groupedItems = useMemo(() => {
    return CATEGORY_ORDER.map((category) => ({
      category,
      label: getCategoryLabel(category),
      items: reviewItems.filter((item) => item.category === category),
    })).filter((group) => group.items.length > 0);
  }, [reviewItems]);

  const handleCheckout = () => {
    setCheckoutMessage('Your system is ready. Checkout is a placeholder in this prototype.');
    window.setTimeout(() => setCheckoutMessage(null), 4000);
  };

  const handleSave = () => {
    saveForLater();
    setSaveMessage('System saved. Reload the page to confirm it restores.');
    window.setTimeout(() => setSaveMessage(null), 4000);
  };

  return (
    <aside className="lg:sticky lg:top-6" aria-label="Your security system">
      <div className="overflow-hidden rounded-2xl bg-wyze-review shadow-sm">
        <header className="border-b border-wyze-border/60 px-5 py-5 lg:px-6">
          <p className="mb-1 text-[11px] font-semibold uppercase tracking-[0.08em] text-wyze-muted">
            Review
          </p>
          <h2 className="text-xl font-bold text-wyze-text lg:text-2xl">Your security system</h2>
          <p className="mt-1 text-sm leading-relaxed text-wyze-muted">
            Review your personalized protection system designed to keep what matters most safe.
          </p>
        </header>

        <div className="space-y-5 px-5 py-5 lg:px-6">
          {groupedItems.map((group) => (
            <section key={group.category}>
              <h3 className="mb-3 text-[11px] font-semibold uppercase tracking-[0.08em] text-wyze-muted">
                {group.label}
              </h3>
              <ul className="space-y-4">
                {group.items.map((item) => (
                  <li key={item.key} className="flex items-center gap-3">
                    <div className="flex h-11 w-11 shrink-0 items-center justify-center overflow-hidden rounded-lg border border-wyze-border bg-white p-1">
                      <img src={item.image} alt="" className="h-full w-full object-contain" />
                    </div>

                    <div className="min-w-0 flex-1">
                      <div className="flex items-start gap-1.5">
                        {item.category === 'plan' ? (
                          <ShieldPlusIcon className="mt-0.5 h-4 w-4 shrink-0 text-wyze-blue" />
                        ) : null}
                        <span className="text-sm font-semibold leading-snug text-wyze-text">{item.name}</span>
                      </div>
                      <div className="mt-2">
                        <QuantityStepper
                          size="sm"
                          value={item.quantity}
                          onChange={(quantity) => updateQuantity(item.key, quantity)}
                          max={item.maxQuantity}
                          ariaLabel={item.name}
                        />
                      </div>
                    </div>

                    <PriceDisplay
                      size="sm"
                      price={item.unitPrice * item.quantity}
                      compareAtPrice={
                        item.compareAtPrice !== undefined && item.compareAtPrice > item.unitPrice
                          ? item.compareAtPrice * item.quantity
                          : undefined
                      }
                      monthly={item.isMonthly}
                    />
                  </li>
                ))}
              </ul>
            </section>
          ))}

          <div className="flex items-center gap-3 border-t border-wyze-border/60 pt-4">
 
            <img src='/images/Wyze Sense Keypad.svg' alt='' className=" shrink-0 text-wyze-green"/>
            <span className="flex-1 text-sm font-semibold text-wyze-text">{catalog.review.shippingLabel}</span>
            <PriceDisplay
              size="sm"
              price={catalog.review.shippingPrice}
              compareAtPrice={catalog.review.shippingCompareAtPrice}
            />
          </div>
        </div>

        <div className="border-t border-wyze-border/60 px-5 py-5 lg:px-6">
          <div className="flex flex-col  sm:flex-row sm:items-start sm:justify-between">
            <GuaranteeBadge />

            <div className="flex-1 sm:text-right">
            

              {catalog.review.financingNote ? (
                <span className="mb-3 inline-flex rounded-md bg-wyze-purple px-3 py-1  font-bold text-white">
                  {catalog.review.financingLabel} {catalog.review.financingNote}
                </span>
              ) : null}

              <div className="flex items-end justify-end gap-2">
                {pricing.displayCompareTotal > pricing.displayTotal ? (
                  <span className="pb-0.5 font-bold text-wyze-muted line-through">
                    {formatCurrency(pricing.displayCompareTotal)}
                  </span>
                ) : null}
                <span className="text-3xl font-bold text-wyze-purple">
                  {formatCurrency(pricing.displayTotal)}
                </span>
              </div>
            </div>
          </div>

          {pricing.savings > 0 ? (
            <p className="mt-4 text-center text-sm font-semibold text-wyze-green">
              Congrats! You&apos;re saving {formatCurrency(pricing.savings)} on your security bundle!
            </p>
          ) : null}

          <button
            type="button"
            className="mt-5 w-full rounded-lg bg-wyze-purple py-3.5 text-base font-bold text-white transition-colors hover:bg-wyze-purple-hover"
            onClick={handleCheckout}
          >
            Checkout
          </button>

          <button
            type="button"
            className="mt-3 w-full text-center text-sm text-wyze-muted underline transition-colors hover:text-wyze-text"
            onClick={handleSave}
          >
            Save my system for later
          </button>

          {checkoutMessage ? (
            <p className="mt-3 text-center  text-wyze-muted">{checkoutMessage}</p>
          ) : null}
          {saveMessage ? (
            <p className="mt-3 text-center  font-medium text-wyze-green">{saveMessage}</p>
          ) : null}
        </div>
      </div>
    </aside>
  );
}
