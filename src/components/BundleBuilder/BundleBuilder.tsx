import { useBundle } from '../../context/BundleContext';
import { AccordionStep } from '../AccordionStep/AccordionStep';
import { ReviewPanel } from '../ReviewPanel/ReviewPanel';

export function BundleBuilder() {
  const { catalog } = useBundle();

  return (
    <div className="mx-auto w-full  px-4 py-6 lg:px-6 lg:py-8">
      <h1 className="mb-6 text-center text-2xl font-bold text-wyze-text lg:hidden">
        Let&apos;s get started!
      </h1>

      <div className="grid grid-cols-1 items-start gap-6 lg:grid-cols-[minmax(0,1.15fr)_minmax(300px,0.85fr)] lg:gap-8">
        <div className="overflow-hidden rounded-2xl bg-white shadow-sm" aria-label="Bundle builder steps">
          {catalog.steps.map((step) => (
            <AccordionStep key={step.id} step={step} />
          ))}
        </div>

        <ReviewPanel />
      </div>
    </div>
  );
}
