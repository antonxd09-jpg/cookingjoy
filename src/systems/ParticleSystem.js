export class ParticleSystem {
  constructor() {
    this.container = document.getElementById('particle-container');
  }

  burst(x, y, color, count = 10) {
    for (let i = 0; i < count; i++) {
      const p = document.createElement('div');
      p.className = 'particle';
      const size = 6 + Math.random() * 10;
      const angle = (Math.PI * 2 * i) / count + Math.random() * 0.5;
      const dist = 60 + Math.random() * 100;
      const px = Math.cos(angle) * dist;
      const py = Math.sin(angle) * dist - 50;
      p.style.cssText = `
        width:${size}px; height:${size}px;
        background:${color};
        left:${x}px; top:${y}px;
        --px:${px}px; --py:${py}px;
        animation-duration:${0.6 + Math.random() * 0.5}s;
      `;
      this.container.appendChild(p);
      setTimeout(() => p.remove(), 1200);
    }
  }

  celebrate(x, y) {
    const colors = ['#ff6b35','#ffdd44','#44ff88','#44aaff','#ff44aa','#aa44ff'];
    colors.forEach(c => this.burst(x, y, c, 8));
  }

  foodParticles(x, y) {
    const colors = ['#ff9500','#ffdd44','#ff6b35'];
    colors.forEach(c => this.burst(x, y, c, 6));
  }
}
