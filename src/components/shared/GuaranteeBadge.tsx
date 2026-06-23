interface GuaranteeBadgeProps {
  text: string;
}

export function GuaranteeBadge({ text }: GuaranteeBadgeProps) {
  return (
    <div className="relative flex  shrink-0 items-center justify-center">
    <img src="/images/Satisfaction Badge-05 1.svg" aria-valuetext="
    "/>
      <span className="relative z-10 max-w-[62px] text-center text-[9px] font-bold leading-tight text-white">
        {text}
      </span>
    </div>
  );
}
