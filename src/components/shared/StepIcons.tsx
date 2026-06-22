import type { Step } from '../../types';

interface StepIconProps {
  icon: Step['icon'];
  className?: string;
}

export function StepIcon({ icon, className = 'h-6 w-6' }: StepIconProps) {
  switch (icon) {
    case 'camera':
      return (
        <svg viewBox="0 0 24 24" aria-hidden="true" className={className}>
          <path
            d="M4 7.5A2.5 2.5 0 0 1 6.5 5h2.1l1.2-1.5h4.4L15.4 5H17.5A2.5 2.5 0 0 1 20 7.5v9A2.5 2.5 0 0 1 17.5 19h-11A2.5 2.5 0 0 1 4 16.5v-9Z"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.5"
          />
          <circle cx="12" cy="12" r="3.25" fill="none" stroke="currentColor" strokeWidth="1.5" />
        </svg>
      );
    case 'plan':
      return (
        <svg viewBox="0 0 24 24" aria-hidden="true" className={className}>
          <path
            d="M12 3.5 19 7v5.2c0 4.1-2.8 7.4-7 9.3-4.2-1.9-7-5.2-7-9.3V7l7-3.5Z"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinejoin="round"
          />
        </svg>
      );
    case 'sensor':
      return (
        <svg viewBox="0 0 24 24" aria-hidden="true" className={className}>
          <rect x="5" y="4" width="14" height="16" rx="2" fill="none" stroke="currentColor" strokeWidth="1.5" />
          <circle cx="12" cy="10" r="2.5" fill="none" stroke="currentColor" strokeWidth="1.5" />
          <path d="M8 16h8" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
        </svg>
      );
    case 'protection':
      return (
        <svg viewBox="0 0 24 24" aria-hidden="true" className={className}>
          <rect x="4" y="4" width="7" height="7" rx="1.5" fill="none" stroke="currentColor" strokeWidth="1.5" />
          <rect x="13" y="4" width="7" height="7" rx="1.5" fill="none" stroke="currentColor" strokeWidth="1.5" />
          <rect x="4" y="13" width="7" height="7" rx="1.5" fill="none" stroke="currentColor" strokeWidth="1.5" />
          <rect x="13" y="13" width="7" height="7" rx="1.5" fill="none" stroke="currentColor" strokeWidth="1.5" />
        </svg>
      );
    default:
      return null;
  }
}

export function ChevronIcon({ direction, className }: { direction: 'up' | 'down'; className?: string }) {
  return (
    <svg
      viewBox="0 0 20 20"
      aria-hidden="true"
      className={`h-5 w-5 text-wyze-purple transition-transform ${direction === 'up' ? 'rotate-180' : ''} ${className ?? ''}`}
    >
      <path
        d="M5 7.5 10 12.5 15 7.5"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.75"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export function TruckIcon({ className = 'h-5 w-5' }: { className?: string }) {
  return (
    <svg viewBox="0 0 20 20" aria-hidden="true" className={className}>
      <path
        d="M2 13h1.5a2 2 0 1 0 4 0H2v-5.5A1.5 1.5 0 0 1 3.5 6H11v7Zm9 0h1.07a2 2 0 1 0 4 0H11V3.5A1.5 1.5 0 0 1 12.5 2H16l2 3.5V13Z"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.3"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export function ShieldPlusIcon({ className = 'h-4 w-4' }: { className?: string }) {
  return (
    <svg viewBox="0 0 16 16" aria-hidden="true" className={className}>
      <path
        d="M8 1.5 13 4v3.5c0 2.8-2 5.1-5 6-3-0.9-5-3.2-5-6V4l5-2.5Z"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.2"
      />
      <path d="M8 5v4M6 7h4" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" />
    </svg>
  );
}
