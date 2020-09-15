import { Component, EventEmitter, Input, Output } from '@angular/core';
import { SketchService } from '../../core/sketch.service';

@Component({
  selector: 'xly-select-demo-files',
  templateUrl: './select-demo-files.component.html',
  styleUrls: ['./select-demo-files.component.css'],
})
export class SelectDemoFilesComponent {
  @Input() public error: boolean;
  @Output() private changed: EventEmitter<string> = new EventEmitter();

  constructor(public sketchService: SketchService) {}

  confirmSelectedDemoFile(file: string) {
    this.changed.emit(file);
  }
}
