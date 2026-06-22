import { useBundle } from '../../context/BundleContext';
import type { Step } from '../../types';
import { ChevronIcon, StepIcon } from '../shared';
import { ProductCard } from '../ProductCard/ProductCard';

interface AccordionStepProps {
  step: Step;
}

export function AccordionStep({ step }: AccordionStepProps) {
  const { state, setActiveStep, goToNextStep, getStepSelectedCount } = useBundle();
  const isOpen = state.activeStep === step.number;
  const selectedCount = getStepSelectedCount(step.id);
  const panelId = `step-panel-${step.id}`;
  const headerId = `step-header-${step.id}`;

  return (
    <section className={`bg-[#EDF4FF] ${isOpen ? '' : 'border-b border-wyze-border last:border-b-0'}`}>
      <button
        id={headerId}
        type="button"
        className="flex w-full items-center justify-between gap-4 px-5 py-4 text-left transition-colors hover:bg-slate-50/60 lg:px-6 lg:py-5"
        aria-expanded={isOpen}
        aria-controls={panelId}
        onClick={() => setActiveStep(step.number)}
      >
        <div className="min-w-0 flex-1">
          <span className="mb-1 block text-[11px] font-semibold uppercase tracking-[0.08em] text-wyze-muted">
            STEP {step.number} OF 4
          </span>
          <div className="flex items-center gap-3">
            <span className="flex h-8 w-8 shrink-0 items-center justify-center text-wyze-text">
              <StepIcon icon={step.icon} />
            </span>
            <span className="text-base font-bold text-wyze-text lg:text-lg">{step.title}</span>
          </div>
        </div>

        <div className="flex shrink-0 items-center gap-2">
          {selectedCount > 0 ? (
            <span className="text-sm font-semibold text-wyze-purple">
              {selectedCount} selected
            </span>
          ) : null}
          <ChevronIcon direction={isOpen ? 'up' : 'down'} />
        </div>
      </button>

      {isOpen ? (
        <div id={panelId} role="region" aria-labelledby={headerId} className="border-t border-wyze-border px-5 pb-6 pt-2 lg:px-6">
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-2">
            {step.products.map((product, index) => (
              <div
                key={product.id}
                className={
                  step.id === 'cameras' && index === step.products.length - 1
                    ? 'sm:col-span-2'
                    : ''
                }
              >
                <ProductCard product={product} featured={step.id === 'cameras' && index === step.products.length - 1} />
              </div>
            ))}
          </div>

          {step.nextLabel ? (
            <button
              type="button"
              className="mx-auto mt-6 flex w-full max-w-md items-center justify-center rounded-lg border-2 border-wyze-purple bg-white px-6 py-3 text-sm font-bold text-wyze-purple transition-colors hover:bg-wyze-purple-light sm:w-auto"
              onClick={() => goToNextStep(step.number)}
            >
              Next: {step.nextLabel}
            </button>
          ) : null}
        </div>
      ) : null}
    </section>
  );
}
