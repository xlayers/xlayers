import { Component, ViewChild, ElementRef, Renderer2, Input, ViewChildren, AfterContentInit, OnChanges } from '@angular/core';

@Component({
  selector: 'sketch-layer',
  template: `
    <sketch-layer
      *ngFor="let layer of layer?.layers"
      [layer]="layer"
      [wireframe]="wireframe"
      class="layer"
      [attr.data-id]="layer.do_objectID"
      [attr.data-name]="layer.name"
      [attr.data-class]="layer._class"
      [matTooltip]="tooltipInfo"></sketch-layer>
  `,
  styles: [
    `
    :host {
      display: block;
      border: 1px solid transparent;
      position: absolute;
      box-sizing: border-box;
      transition: border-color 0.2s linear;
    }

    :host(:hover) {
      border-color: #51C1F8 !important;
    }
    :host(.wireframe) {
      border-color: gray;
    }
  `
  ]
})
export class SketchLayerComponent implements AfterContentInit, OnChanges {
  @Input() layer: SketchMSSymbolMaster;
  @Input() wireframe = true;
  artboardFactor = 1;
  borderWidth = 1;

  tooltipInfo = '';

  constructor(private renderer: Renderer2, private el: ElementRef<HTMLElement>) {}

  ngOnChanges(record) {
    if (record.wireframe && record.wireframe.currentValue !== 'undefined') {
      if (record.wireframe.currentValue === true) {
        this.el.nativeElement.classList.add('wireframe');
      } else {
        this.el.nativeElement.classList.remove('wireframe');
      }
    }
  }

  ngAfterContentInit() {
    if (!this.layer) {
      return;
    }

    const ne = this.el.nativeElement;

    this.renderer.setStyle(ne, 'border-width', `${this.borderWidth}px`);
    this.renderer.setStyle(ne, 'left', `${this.layer.frame.x * this.artboardFactor - this.borderWidth}px`);
    this.renderer.setStyle(ne, 'top', `${this.layer.frame.y * this.artboardFactor - this.borderWidth}px`);
    this.renderer.setStyle(ne, 'width', `${this.layer.frame.width * this.artboardFactor}px`);
    this.renderer.setStyle(ne, 'height', `${this.layer.frame.height * this.artboardFactor}px`);
    this.renderer.setStyle(ne, 'visibility', this.layer.isVisible ? 'visibile' : 'hidden');

    this.tooltipInfo = `
      ${this.layer.name} —
      top: ${this.layer.frame.y | 0},
      left: ${this.layer.frame.x | 0},
      width: ${this.layer.frame.width | 0},
      height: ${this.layer.frame.height | 0}`;
  }
}
