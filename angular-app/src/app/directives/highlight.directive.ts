import { Directive, ElementRef, Input, OnInit, OnChanges } from '@angular/core';

@Directive({
  selector: '[appHighlight]'
})
export class HighlightDirective implements OnInit, OnChanges {
  @Input() appHighlight: string = '#e3f2fd';

  constructor(private el: ElementRef) {}

  ngOnInit() {
    this.highlight();
  }

  ngOnChanges() {
    this.highlight();
  }

  private highlight() {
    this.el.nativeElement.style.backgroundColor = this.appHighlight;
    this.el.nativeElement.style.transition = 'background-color 0.3s ease';
    
    // Add hover effect
    this.el.nativeElement.addEventListener('mouseenter', () => {
      const currentColor = this.appHighlight;
      // Darken the color slightly on hover
      this.el.nativeElement.style.backgroundColor = this.darkenColor(currentColor, 0.1);
    });
    
    this.el.nativeElement.addEventListener('mouseleave', () => {
      this.el.nativeElement.style.backgroundColor = this.appHighlight;
    });
  }

  private darkenColor(color: string, amount: number): string {
    // Simple color darkening function
    if (color.startsWith('#')) {
      const hex = color.slice(1);
      const num = parseInt(hex, 16);
      const r = Math.max(0, (num >> 16) - Math.round(255 * amount));
      const g = Math.max(0, ((num >> 8) & 0x00FF) - Math.round(255 * amount));
      const b = Math.max(0, (num & 0x0000FF) - Math.round(255 * amount));
      return `#${((r << 16) | (g << 8) | b).toString(16).padStart(6, '0')}`;
    }
    return color;
  }
}