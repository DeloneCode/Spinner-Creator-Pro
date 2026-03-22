import React from 'react';
import { motion } from 'framer-motion';
import { clsx } from 'clsx';

interface SegmentedControlProps<T extends string> {
  options: { label: string; value: T }[];
  value: T;
  onChange: (val: T) => void;
}

export function SegmentedControl<T extends string>({ options, value, onChange }: SegmentedControlProps<T>) {
  return (
    <div className="flex p-1 bg-muted rounded-xl relative z-0">
      {options.map((opt) => {
        const isActive = value === opt.value;
        return (
          <button
            key={opt.value}
            onClick={() => onChange(opt.value)}
            className={clsx(
              "relative flex-1 py-2 px-3 text-sm font-medium rounded-lg transition-colors z-10",
              isActive ? "text-white" : "text-muted-foreground hover:text-foreground/80"
            )}
          >
            {isActive && (
              <motion.div
                layoutId="segmented-active"
                className="absolute inset-0 bg-panel-border rounded-lg shadow-sm border border-white/5 -z-10"
                transition={{ type: 'spring', stiffness: 400, damping: 30 }}
              />
            )}
            <span className="relative z-20">{opt.label}</span>
          </button>
        );
      })}
    </div>
  );
}
