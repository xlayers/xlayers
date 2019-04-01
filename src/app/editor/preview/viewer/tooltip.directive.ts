import { Directive, ElementRef, HostListener, Input, Renderer2 } from '@angular/core';

@Directive({
  selector: '[xlyTooltilp]'
})
export class TooltilDirective {

  // tslint:disable-next-line:no-input-rename
  @Input('sketchTooltilp') name = '';
  tooltipInfo = '';

  constructor(private element: ElementRef<HTMLElement>, private render: Renderer2) {}

  @HostListener('mouseover', ['$event'])
  public onMouseOver(event: any): void {
    event.stopPropagation();

    const clientRect = this.element.nativeElement.getBoundingClientRect();

    this.tooltipInfo = `
      ${this.name} —
      top: ${clientRect.top | 0},
      left: ${clientRect.left | 0},
      width: ${clientRect.width | 0},
      height: ${clientRect.height | 0}`;

    this.render.setProperty(this.element.nativeElement, 'matTooltip', this.tooltipInfo);
  }
}
