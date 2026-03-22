import React from 'react';
import { motion } from 'framer-motion';

interface SliderProps {
  label: string;
  value: number;
  min: number;
  max: number;
  step?: number;
  unit?: string;
  onChange: (val: number) => void;
  colorAccent?: string;
}

export function Slider({ label, value, min, max, step = 1, unit = '', onChange, colorAccent = '#6366f1' }: SliderProps) {
  const percentage = ((value - min) / (max - min)) * 100;

  return (
    <div className="flex flex-col gap-3 w-full">
      <div className="flex justify-between items-center">
        <label className="text-sm font-medium text-foreground/90">{label}</label>
        <span className="text-xs font-mono text-muted-foreground bg-muted px-2 py-1 rounded-md">
          {value}{unit}
        </span>
      </div>
      <div className="relative h-6 flex items-center group cursor-pointer" 
           onPointerDown={(e) => {
             const rect = e.currentTarget.getBoundingClientRect();
             const p = Math.max(0, Math.min(1, (e.clientX - rect.left) / rect.width));
             onChange(Math.round((p * (max - min) + min) / step) * step);
           }}>
        
        {/* Track */}
        <div className="absolute w-full h-1.5 bg-muted rounded-full overflow-hidden">
          <motion.div 
            className="h-full rounded-full"
            style={{ backgroundColor: colorAccent }}
            initial={false}
            animate={{ width: `${percentage}%` }}
            transition={{ type: 'spring', stiffness: 400, damping: 30 }}
          />
        </div>
        
        {/* Native range input overlay (invisible but functional) */}
        <input 
          type="range" 
          min={min} 
          max={max} 
          step={step} 
          value={value}
          onChange={(e) => onChange(parseFloat(e.target.value))}
          className="absolute w-full opacity-0 cursor-pointer h-full"
        />
        
        {/* Thumb */}
        <motion.div 
          className="absolute w-4 h-4 bg-white rounded-full shadow-[0_0_10px_rgba(255,255,255,0.5)] pointer-events-none"
          initial={false}
          animate={{ left: `calc(${percentage}% - 8px)` }}
          transition={{ type: 'spring', stiffness: 400, damping: 30 }}
          style={{ boxShadow: `0 0 12px ${colorAccent}` }}
        />
      </div>
    </div>
  );
}
