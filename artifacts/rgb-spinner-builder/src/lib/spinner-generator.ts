export type SpinnerType = 'ring' | 'dots' | 'bars' | 'pulse';

export interface SpinnerConfig {
  type: SpinnerType;
  size: number;
  speed: number;
  strokeWidth: number;
  gapSize: number;
  direction: 'cw' | 'ccw';
  colors: [string, string, string];
}

export function generateSpinnerCode(config: SpinnerConfig): { html: string; css: string } {
  const { type, size, speed, strokeWidth, gapSize, direction, colors } = config;
  const dir = direction === 'ccw' ? 'reverse' : 'normal';

  let html = '';
  let css = '';

  if (type === 'ring') {
    const r = 50 - strokeWidth / 2;
    const c = 2 * Math.PI * r;
    // Map gapSize (0-40) to dash offset logic
    const gap = (gapSize / 40) * (c * 0.75); // up to 75% gap

    html = `<svg class="rgb-spinner" viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <linearGradient id="rgb-ring-grad" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="${colors[0]}" />
      <stop offset="50%" stop-color="${colors[1]}" />
      <stop offset="100%" stop-color="${colors[2]}" />
    </linearGradient>
  </defs>
  <circle cx="50" cy="50" r="${r}" />
</svg>`;

    css = `.rgb-spinner {
  width: ${size}px;
  height: ${size}px;
  animation: rgb-spin ${speed}s linear infinite ${dir};
}

.rgb-spinner circle {
  fill: none;
  stroke: url(#rgb-ring-grad);
  stroke-width: ${strokeWidth};
  stroke-linecap: round;
  stroke-dasharray: ${c};
  stroke-dashoffset: ${gap};
}

@keyframes rgb-spin {
  100% { transform: rotate(360deg); }
}`;
  } 
  else if (type === 'dots') {
    const dotSize = Math.max(4, size * 0.2);
    const radius = size / 2 - dotSize / 2;
    // Spread angle: gapSize 0 = 30deg apart, gapSize 40 = 120deg apart
    const angleSpread = 30 + (gapSize * 2.25); 

    html = `<div class="rgb-spinner">
  <div class="dot d1"></div>
  <div class="dot d2"></div>
  <div class="dot d3"></div>
</div>`;

    css = `.rgb-spinner {
  width: ${size}px;
  height: ${size}px;
  position: relative;
  animation: rgb-spin ${speed}s linear infinite ${dir};
}

.rgb-spinner .dot {
  position: absolute;
  width: ${dotSize}px;
  height: ${dotSize}px;
  border-radius: 50%;
  top: 50%;
  left: 50%;
  margin-top: -${dotSize / 2}px;
  margin-left: -${dotSize / 2}px;
}

.rgb-spinner .d1 {
  background: ${colors[0]};
  transform: rotate(0deg) translateY(-${radius}px);
}
.rgb-spinner .d2 {
  background: ${colors[1]};
  transform: rotate(${angleSpread}deg) translateY(-${radius}px);
}
.rgb-spinner .d3 {
  background: ${colors[2]};
  transform: rotate(${angleSpread * 2}deg) translateY(-${radius}px);
}

@keyframes rgb-spin {
  100% { transform: rotate(360deg); }
}`;
  } 
  else if (type === 'bars') {
    const barWidth = Math.max(4, size * 0.15);
    
    html = `<div class="rgb-spinner">
  <div class="bar b1"></div>
  <div class="bar b2"></div>
  <div class="bar b3"></div>
  <div class="bar b4"></div>
</div>`;

    css = `.rgb-spinner {
  display: flex;
  gap: ${gapSize}px;
  height: ${size}px;
  align-items: center;
  justify-content: center;
  ${direction === 'ccw' ? 'flex-direction: row-reverse;' : ''}
}

.rgb-spinner .bar {
  width: ${barWidth}px;
  height: 100%;
  border-radius: ${barWidth / 2}px;
  animation: rgb-pulse ${speed}s ease-in-out infinite;
}

.rgb-spinner .b1 { background: ${colors[0]}; animation-delay: -${speed * 0.4}s; }
.rgb-spinner .b2 { background: ${colors[1]}; animation-delay: -${speed * 0.2}s; }
.rgb-spinner .b3 { background: ${colors[2]}; animation-delay: 0s; }
.rgb-spinner .b4 { background: ${colors[0]}; animation-delay: ${speed * 0.2}s; }

@keyframes rgb-pulse {
  0%, 100% { transform: scaleY(0.3); opacity: 0.5; }
  50% { transform: scaleY(1); opacity: 1; }
}`;
  } 
  else if (type === 'pulse') {
    html = `<div class="rgb-spinner"></div>`;
    
    css = `.rgb-spinner {
  width: ${size}px;
  height: ${size}px;
  border-radius: 50%;
  animation: rgb-pulse-glow ${speed}s ease-out infinite ${dir};
}

@keyframes rgb-pulse-glow {
  0% { 
    transform: scale(0.8); 
    background: ${colors[0]}; 
    box-shadow: 0 0 20px ${colors[0]}; 
  }
  33% { 
    background: ${colors[1]}; 
    box-shadow: 0 0 30px ${colors[1]}, 0 0 0 ${gapSize}px rgba(0,0,0,0); 
  }
  50% { 
    transform: scale(1.3); 
  }
  66% { 
    background: ${colors[2]}; 
    box-shadow: 0 0 30px ${colors[2]}, 0 0 0 0px rgba(0,0,0,0); 
  }
  100% { 
    transform: scale(0.8); 
    background: ${colors[0]}; 
    box-shadow: 0 0 20px ${colors[0]}; 
  }
}`;
  }

  return { html, css };
}
