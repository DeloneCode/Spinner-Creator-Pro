import React, { useState, useEffect } from 'react';
import { Settings2, Code, Copy, Check, Sparkles, RotateCw, RotateCcw } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { generateSpinnerCode, type SpinnerConfig, type SpinnerType } from '@/lib/spinner-generator';
import { Slider } from '@/components/ui/slider';
import { ColorPicker } from '@/components/ui/color-picker';
import { SegmentedControl } from '@/components/ui/segmented-control';

const PRESETS = [
  { name: 'Classic RGB', config: { type: 'ring', size: 80, speed: 1.2, strokeWidth: 6, gapSize: 8, direction: 'cw', colors: ['#FF0000', '#00FF00', '#0000FF'] } as SpinnerConfig },
  { name: 'Neon Glow', config: { type: 'ring', size: 100, speed: 0.8, strokeWidth: 4, gapSize: 15, direction: 'ccw', colors: ['#FF00FF', '#00FFFF', '#FFFF00'] } as SpinnerConfig },
  { name: 'Ocean Dots', config: { type: 'dots', size: 90, speed: 1.5, strokeWidth: 6, gapSize: 12, direction: 'cw', colors: ['#0066FF', '#00CCFF', '#00FFAA'] } as SpinnerConfig },
  { name: 'Fire Bars', config: { type: 'bars', size: 80, speed: 0.6, strokeWidth: 6, gapSize: 6, direction: 'cw', colors: ['#FF4400', '#FF8800', '#FFCC00'] } as SpinnerConfig },
  { name: 'Pulse Wave', config: { type: 'pulse', size: 120, speed: 1.8, strokeWidth: 6, gapSize: 8, direction: 'cw', colors: ['#AA00FF', '#FF0077', '#0077FF'] } as SpinnerConfig },
  { name: 'Minimal', config: { type: 'ring', size: 60, speed: 2.0, strokeWidth: 3, gapSize: 4, direction: 'cw', colors: ['#888888', '#AAAAAA', '#CCCCCC'] } as SpinnerConfig },
];

function highlightSyntax(code: string) {
  return code
    .replace(/([{}:;])/g, '<span class="token-punctuation">$1</span>')
    .replace(/([0-9]+(px|s|deg|%|)?)/g, '<span class="token-unit">$1</span>')
    .replace(/(#[A-Fa-f0-9]{3,6})/g, '<span class="token-value">$1</span>')
    .replace(/([a-z-]+)(?=:)/g, '<span class="token-property">$1</span>')
    .replace(/(\.[a-z0-9-]+)/g, '<span class="token-selector">$1</span>');
}

export default function Home() {
  const [config, setConfig] = useState<SpinnerConfig>(PRESETS[0].config);
  const [codeSnippet, setCodeSnippet] = useState({ html: '', css: '' });
  const [copied, setCopied] = useState(false);
  const [showCode, setShowCode] = useState(false);

  useEffect(() => {
    setCodeSnippet(generateSpinnerCode(config));
  }, [config]);

  const updateConfig = (key: keyof SpinnerConfig, value: any) => {
    setConfig(prev => ({ ...prev, [key]: value }));
  };

  const copyToClipboard = () => {
    const text = `<!-- HTML -->\n${codeSnippet.html}\n\n/* CSS */\n${codeSnippet.css}`;
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col md:flex-row font-sans">
      
      {/* LEFT PANEL: Controls */}
      <div className="w-full md:w-[420px] lg:w-[460px] bg-panel border-r border-panel-border h-screen flex flex-col shadow-2xl z-10">
        <div className="p-6 border-b border-panel-border bg-panel/50 backdrop-blur-md sticky top-0 z-20">
          <h1 className="text-2xl font-bold flex items-center gap-3">
            <Sparkles className="w-6 h-6 text-primary" />
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-white to-white/60">
              RGB Spinner
            </span>
          </h1>
          <p className="text-sm text-muted-foreground mt-2">Build stunning CSS-only loading animations.</p>
        </div>

        <div className="flex-1 overflow-y-auto p-6 space-y-8">
          
          {/* Spinner Type */}
          <section className="space-y-4">
            <h2 className="text-sm font-semibold text-foreground/80 uppercase tracking-widest flex items-center gap-2">
              <Settings2 className="w-4 h-4" /> Type
            </h2>
            <SegmentedControl<SpinnerType>
              options={[
                { label: 'Ring', value: 'ring' },
                { label: 'Dots', value: 'dots' },
                { label: 'Bars', value: 'bars' },
                { label: 'Pulse', value: 'pulse' },
              ]}
              value={config.type}
              onChange={(val) => updateConfig('type', val)}
            />
          </section>

          <hr className="border-panel-border" />

          {/* Properties */}
          <section className="space-y-6">
            <h2 className="text-sm font-semibold text-foreground/80 uppercase tracking-widest">Dimensions</h2>
            
            <Slider 
              label="Size" 
              value={config.size} 
              min={40} max={200} step={4} unit="px" 
              colorAccent={config.colors[0]}
              onChange={(v) => updateConfig('size', v)} 
            />
            
            <Slider 
              label="Speed" 
              value={config.speed} 
              min={0.3} max={5.0} step={0.1} unit="s" 
              colorAccent={config.colors[1]}
              onChange={(v) => updateConfig('speed', v)} 
            />

            <AnimatePresence>
              {config.type === 'ring' && (
                <motion.div 
                  initial={{ height: 0, opacity: 0 }} 
                  animate={{ height: 'auto', opacity: 1 }} 
                  exit={{ height: 0, opacity: 0 }}
                  className="overflow-hidden"
                >
                  <div className="pt-2">
                    <Slider 
                      label="Stroke Width" 
                      value={config.strokeWidth} 
                      min={2} max={20} step={1} unit="px" 
                      colorAccent={config.colors[2]}
                      onChange={(v) => updateConfig('strokeWidth', v)} 
                    />
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            <Slider 
              label="Gap Size / Spread" 
              value={config.gapSize} 
              min={0} max={40} step={1} unit="" 
              colorAccent={config.colors[0]}
              onChange={(v) => updateConfig('gapSize', v)} 
            />

            <div className="flex flex-col gap-3 w-full">
              <label className="text-sm font-medium text-foreground/90">Direction</label>
              <div className="flex gap-2">
                <button
                  onClick={() => updateConfig('direction', 'cw')}
                  className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl border transition-all ${config.direction === 'cw' ? 'bg-primary/10 border-primary text-primary' : 'border-panel-border text-muted-foreground hover:bg-muted'}`}
                >
                  <RotateCw className="w-4 h-4" /> Clockwise
                </button>
                <button
                  onClick={() => updateConfig('direction', 'ccw')}
                  className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl border transition-all ${config.direction === 'ccw' ? 'bg-primary/10 border-primary text-primary' : 'border-panel-border text-muted-foreground hover:bg-muted'}`}
                >
                  <RotateCcw className="w-4 h-4" /> Counter
                </button>
              </div>
            </div>
          </section>

          <hr className="border-panel-border" />

          {/* Colors */}
          <section className="space-y-4">
            <h2 className="text-sm font-semibold text-foreground/80 uppercase tracking-widest">Palette</h2>
            <div className="grid grid-cols-3 gap-4">
              <ColorPicker 
                label="Color 1" 
                value={config.colors[0]} 
                onChange={(c) => updateConfig('colors', [c, config.colors[1], config.colors[2]])} 
              />
              <ColorPicker 
                label="Color 2" 
                value={config.colors[1]} 
                onChange={(c) => updateConfig('colors', [config.colors[0], c, config.colors[2]])} 
              />
              <ColorPicker 
                label="Color 3" 
                value={config.colors[2]} 
                onChange={(c) => updateConfig('colors', [config.colors[0], config.colors[1], c])} 
              />
            </div>
          </section>

          <hr className="border-panel-border" />

          {/* Presets */}
          <section className="space-y-4 pb-10">
            <h2 className="text-sm font-semibold text-foreground/80 uppercase tracking-widest">Quick Presets</h2>
            <div className="grid grid-cols-2 gap-3">
              {PRESETS.map((preset) => (
                <button
                  key={preset.name}
                  onClick={() => setConfig(preset.config)}
                  className="relative group overflow-hidden rounded-xl bg-panel-border/30 border border-panel-border p-3 text-left hover:border-white/20 transition-all"
                >
                  <div 
                    className="absolute inset-0 opacity-20 group-hover:opacity-40 transition-opacity duration-500"
                    style={{ background: `linear-gradient(135deg, ${preset.config.colors[0]}, ${preset.config.colors[2]})` }}
                  />
                  <span className="relative z-10 text-sm font-medium">{preset.name}</span>
                </button>
              ))}
            </div>
          </section>

        </div>
      </div>

      {/* RIGHT PANEL: Preview & Export */}
      <div className="flex-1 flex flex-col min-h-screen relative overflow-hidden bg-background">
        
        {/* The Live Preview Arena */}
        <div className="flex-1 flex items-center justify-center relative bg-dot-pattern">
          
          {/* Radial blur behind the spinner */}
          <div 
            className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[300px] h-[300px] rounded-full blur-[100px] opacity-20 pointer-events-none transition-all duration-1000"
            style={{ background: `radial-gradient(circle, ${config.colors[0]}, transparent 70%)` }}
          />

          {/* The Actual Injected CSS & Spinner HTML */}
          <style>{codeSnippet.css}</style>
          <div 
            className="relative z-10 flex items-center justify-center p-12"
            dangerouslySetInnerHTML={{ __html: codeSnippet.html }}
          />
        </div>

        {/* Export Footer */}
        <div className="border-t border-panel-border bg-panel p-6 shadow-[0_-10px_40px_rgba(0,0,0,0.5)] z-20">
          <div className="max-w-3xl mx-auto space-y-4">
            
            <div className="flex justify-between items-center">
              <button 
                onClick={() => setShowCode(!showCode)}
                className="text-muted-foreground hover:text-white flex items-center gap-2 text-sm font-medium transition-colors"
              >
                <Code className="w-4 h-4" /> 
                {showCode ? 'Hide Source' : 'View Source'}
              </button>
              
              <button
                onClick={copyToClipboard}
                className={`
                  relative overflow-hidden px-8 py-3 rounded-xl font-semibold text-sm shadow-xl
                  transition-all duration-300 transform active:scale-95 flex items-center gap-2
                  ${copied ? 'bg-green-500 text-white shadow-green-500/25' : 'text-white'}
                `}
                style={{
                  background: copied ? undefined : `linear-gradient(135deg, ${config.colors[0]}, ${config.colors[2]})`
                }}
              >
                {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                {copied ? 'Copied to Clipboard!' : 'Copy CSS & HTML'}
              </button>
            </div>

            <AnimatePresence>
              {showCode && (
                <motion.div 
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: 'auto', opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  className="overflow-hidden"
                >
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                    <div className="bg-[#0A0A0A] border border-panel-border rounded-xl p-4 overflow-x-auto">
                      <div className="text-xs text-muted-foreground mb-2 font-semibold uppercase tracking-wider">HTML</div>
                      <pre className="text-sm font-mono leading-relaxed">
                        <code dangerouslySetInnerHTML={{ __html: highlightSyntax(codeSnippet.html).replace(/</g, '&lt;').replace(/>/g, '&gt;') }} />
                      </pre>
                    </div>
                    <div className="bg-[#0A0A0A] border border-panel-border rounded-xl p-4 overflow-x-auto h-[300px] overflow-y-auto">
                      <div className="text-xs text-muted-foreground mb-2 font-semibold uppercase tracking-wider">CSS</div>
                      <pre className="text-sm font-mono leading-relaxed">
                        <code dangerouslySetInnerHTML={{ __html: highlightSyntax(codeSnippet.css) }} />
                      </pre>
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

          </div>
        </div>

      </div>

    </div>
  );
}
