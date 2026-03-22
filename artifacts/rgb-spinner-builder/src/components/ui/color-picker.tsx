import React, { useRef } from 'react';

interface ColorPickerProps {
  label: string;
  value: string;
  onChange: (val: string) => void;
}

export function ColorPicker({ label, value, onChange }: ColorPickerProps) {
  const inputRef = useRef<HTMLInputElement>(null);

  return (
    <div className="flex flex-col gap-2">
      <label className="text-xs font-medium text-muted-foreground uppercase tracking-wider">{label}</label>
      <div 
        className="relative flex items-center gap-3 p-2 rounded-xl bg-panel-border/30 border border-panel-border hover:border-muted-foreground/50 transition-colors cursor-pointer group"
        onClick={() => inputRef.current?.click()}
      >
        <div 
          className="w-8 h-8 rounded-lg shadow-inner ring-1 ring-black/20"
          style={{ backgroundColor: value, boxShadow: `0 0 15px ${value}40` }}
        />
        <span className="font-mono text-sm uppercase text-foreground/80 group-hover:text-foreground transition-colors">
          {value}
        </span>
        <input 
          ref={inputRef}
          type="color" 
          value={value} 
          onChange={(e) => onChange(e.target.value)}
          className="absolute opacity-0 w-0 h-0"
        />
      </div>
    </div>
  );
}
