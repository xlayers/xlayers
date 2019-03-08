import { Component, OnInit, Input, ElementRef } from '@angular/core';
import { Renderer2 } from '@angular/core';

@Component({
  selector: 'sketch-interactive-bg',
  templateUrl: './interactive-bg.component.html',
  styleUrls: ['./interactive-bg.component.css']
})
export class InteractiveBgComponent implements OnInit {
  @Input() width: string;
  @Input() height: string;
  @Input() src: string;
  @Input() sections: any[];

  backgroundImageSrc;

  lastUiSection: ElementRef;
  lastbtn: HTMLButtonElement;

  constructor(private readonly renderer: Renderer2) {}

  ngOnInit() {
    this.backgroundImageSrc = {
      'background-image': `url( ${this.src} )`,
      width: this.width,
      height: this.height
    };
  }

  reset() {
    if (this.lastUiSection) {
      this.renderer.addClass(this.lastUiSection, 'xly-ui-hidden');
      this.renderer.removeClass(this.lastbtn, 'xly-ui-hidden');

      this.lastUiSection = null;
      this.lastbtn = null;
    }
  }

  show(event: MouseEvent, uiSectionRef: ElementRef) {
    this.reset();

    this.lastUiSection = uiSectionRef;
    this.lastbtn = event.currentTarget as HTMLButtonElement;

    this.renderer.removeClass(this.lastUiSection, 'xly-ui-hidden');
    this.renderer.addClass(this.lastbtn, 'xly-ui-hidden');
  }
}
