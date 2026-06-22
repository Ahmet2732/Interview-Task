interface QuantityStepperProps {
  value: number;
  onChange: (value: number) => void;
  min?: number;
  max?: number;
  size?: 'sm' | 'md';
  ariaLabel: string;
}

export function QuantityStepper({
  value,
  onChange,
  min = 0,
  max = 99,
  size = 'md',
  ariaLabel,
}: QuantityStepperProps) {
  const canDecrease = value > min;
  const canIncrease = value < max;

  const buttonSize = size === 'sm' ? 'h-7 w-7 text-sm' : 'h-8 w-8 text-base';
  const valueSize = size === 'sm' ? 'min-w-[28px] text-sm' : 'min-w-[32px] text-base';

  return (
    <div
      className="inline-flex items-center overflow-hidden rounded-md  bg-white"
      role="group"
      aria-label={ariaLabel}
    >
      <button
        type="button"
        className={`${buttonSize} flex items-center justify-center text-wyze-muted transition-colors hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-40`}
        onClick={() => onChange(value - 1)}
        disabled={!canDecrease}
        aria-label={`Decrease ${ariaLabel}`}
      >
        −
      </button>
      <span className={`${valueSize} px-1 text-center font-semibold text-wyze-text`} aria-live="polite">
        {value}
      </span>
      <button
        type="button"
        className={`${buttonSize} flex items-center justify-center text-wyze-muted transition-colors hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-40`}
        onClick={() => onChange(value + 1)}
        disabled={!canIncrease}
        aria-label={`Increase ${ariaLabel}`}
      >
        +
      </button>
    </div>
  );
}
