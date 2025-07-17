import { Directive, Input, TemplateRef, ViewContainerRef, OnChanges } from '@angular/core';

@Directive({
  selector: '[appShowHide]'
})
export class ShowHideDirective implements OnChanges {
  @Input() appShowHide: boolean = true;

  constructor(
    private templateRef: TemplateRef<any>,
    private viewContainer: ViewContainerRef
  ) {}

  ngOnChanges() {
    if (this.appShowHide) {
      // Show the element with a fade-in animation
      this.viewContainer.clear();
      const embeddedView = this.viewContainer.createEmbeddedView(this.templateRef);
      
      // Add fade-in animation
      const element = embeddedView.rootNodes[0];
      if (element && element.style) {
        element.style.opacity = '0';
        element.style.transition = 'opacity 0.3s ease-in-out';
        
        // Trigger animation on next frame
        requestAnimationFrame(() => {
          element.style.opacity = '1';
        });
      }
    } else {
      // Hide the element with a fade-out animation
      const element = this.viewContainer.element.nativeElement.nextSibling;
      if (element && element.style) {
        element.style.opacity = '0';
        
        // Remove from DOM after animation
        setTimeout(() => {
          this.viewContainer.clear();
        }, 300);
      } else {
        this.viewContainer.clear();
      }
    }
  }
}