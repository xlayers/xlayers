import { Component, Input } from '@angular/core';

@Component({
  selector: 'xly-stackblitz-container',
  templateUrl: './stackblitz-container.component.html',
  styleUrls: ['./stackblitz-container.component.css'],
})
export class StackblitzContainerComponent {
  constructor() { }

  @Input() hidden: boolean;
}
