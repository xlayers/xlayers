import { Directive, HostListener } from '@angular/core';

@Directive({
  selector: '[sketchStopEventPropagation]'
})
export class SketchStopEventPropagationDirective {
  @HostListener('click', ['$event'])
  public onClick(event: any): void {
    // event.stopPropagation();
  }

  @HostListener('mouseover', ['$event'])
  public onMouseover(event: any): void {
    event.stopPropagation();
  }
}
