import { Directive, ElementRef, Input, OnChanges } from '@angular/core';

/**
 * Set backgroundColor for the attached element to highlight color
 * Set the element's customProperty to true (for no reason other than to show that it can)
 */

@Directive({ selector: '[highlight]' })
export class HighlightDirective implements OnChanges {
  @Input('highlight') bgColor: string;
  private readonly defaultColor = 'rgb(211, 211, 211)';

  constructor(private el: ElementRef) {}

  ngOnChanges() {
    this.setStyle('backgroundColor', this.bgColor);
  }

  private setStyle(property: string, value: string) {
    const host = this.el.nativeElement;
    host.style[property] = value ? value : this.defaultColor;
  }
}
