import { Directive, HostListener } from '@angular/core';

@Directive({
  selector: '[xlyStopEventPropagation]'
})
export class StopEventPropagationDirective {
  @HostListener('click', ['$event'])
  public onClick(event: any): void {
    // event.stopPropagation();
  }

  @HostListener('mouseover', ['$event'])
  public onMouseover(event: any): void {
    event.stopPropagation();
  }
}
