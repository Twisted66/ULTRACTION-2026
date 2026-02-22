import React from "react";

type Emphasis = "primary" | "secondary" | "muted";

export type MagicBentoItem = {
  id: string;
  label: string;
  value?: string | number;
  meta?: string;
  emphasis?: Emphasis;
  colSpan?: 1 | 2;
  rowSpan?: 1 | 2;
};

export type MagicBentoProps = {
  items: MagicBentoItem[];
  className?: string;
};

function spanClass(colSpan?: 1 | 2, rowSpan?: 1 | 2) {
  const classes: string[] = [];

  if (colSpan === 2) {
    classes.push("md:col-span-2");
  }

  if (rowSpan === 2) {
    classes.push("md:row-span-2");
  }

  return classes.join(" ");
}

const MagicBento: React.FC<MagicBentoProps> = ({ items, className = "" }) => {
  if (!items || items.length === 0) return null;

  const visibleItems = items.slice(0, 6);

  return (
    <div className={`relative ${className}`}>
      {/* Subtle grid background */}
      <div className="pointer-events-none absolute inset-0 opacity-[0.15] dark:opacity-[0.25]">
        <div className="h-full w-full bg-[radial-gradient(circle_at_1px_1px,_rgba(0,0,0,0.16)_1px,_transparent_0)] [background-size:18px_18px]" />
      </div>

      <div className="relative grid grid-cols-1 md:grid-cols-4 auto-rows-[minmax(120px,1fr)] gap-4 md:gap-5">
        {visibleItems.map((item) => {
          if (!item.value && !item.meta) return null;

          return (
            <article
              key={item.id}
              className={[
                "group relative flex flex-col justify-between overflow-hidden rounded-none",
                "bg-card/90 dark:bg-card/95 border border-primary/35",
                "shadow-[0_0_0_1px_rgba(0,0,0,0.02)]",
                "transition-all duration-300 ease-out",
                "hover:-translate-y-1 hover:border-black hover:shadow-lg",
                "focus-within:ring-2 focus-within:ring-black/60 focus-within:ring-offset-2 focus-within:ring-offset-background",
                spanClass(item.colSpan, item.rowSpan),
              ]
                .filter(Boolean)
                .join(" ")}
            >
              {/* Accent strip */}
              <div
                className={[
                  "absolute inset-x-0 top-0 h-1.5 md:h-2 origin-left scale-x-75",
                  "group-hover:scale-x-100 group-hover:bg-black transition-all duration-300",
                  "bg-primary",
                ].join(" ")}
              />

              <div className="relative flex-1 p-5 md:p-6 lg:p-7 flex flex-col justify-between gap-3">
                <div className="space-y-2">
                  <div className="flex items-center justify-between gap-2 text-[0.65rem] md:text-[0.7rem] uppercase tracking-[0.18em] text-muted-foreground">
                    <span>{item.label}</span>
                      <span className="h-px w-10 bg-primary/50 group-hover:bg-black/80 transition-colors duration-300" />
                    </div>

                  {item.value && (
                    <p className="text-lg md:text-xl lg:text-2xl font-heading font-semibold text-foreground leading-tight">
                      {item.value}
                    </p>
                  )}
                </div>

                {item.meta && (
                  <p className="text-[0.7rem] md:text-xs text-muted-foreground/90 max-w-[20rem]">
                    {item.meta}
                  </p>
                )}
              </div>
            </article>
          );
        })}
      </div>
    </div>
  );
};

export default MagicBento;

