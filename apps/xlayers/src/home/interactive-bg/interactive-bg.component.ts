import { Component, OnInit, Input, ElementRef } from '@angular/core';
import { Renderer2 } from '@angular/core';

@Component({
  selector: 'xly-interactive-bg',
  templateUrl: './interactive-bg.component.html',
  styleUrls: ['./interactive-bg.component.css'],
})
export class InteractiveBgComponent implements OnInit {
  @Input() width: string;
  @Input() height: string;
  @Input() src: string;
  @Input() sections: any[];

  backgroundImageSrc;

  lastUiSection: HTMLDivElement;
  lastbtn: HTMLButtonElement;

  constructor(private renderer: Renderer2) {}

  ngOnInit() {
    this.backgroundImageSrc = {
      'background-image': `url( ${this.src} )`,
      width: 'calc(100vw - 20px)',
      height: `calc((100vw - 20px) / (${parseInt(this.width, 0)} / ${parseInt(
        this.height,
        0
      )}))`,
      'max-width': this.width,
      'max-height': this.height,
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

  show(event: MouseEvent, uiSectionRef: HTMLDivElement) {
    this.reset();

    this.lastUiSection = uiSectionRef;
    this.lastbtn = event.currentTarget as HTMLButtonElement;

    this.renderer.removeClass(this.lastUiSection, 'xly-ui-hidden');
    this.renderer.addClass(this.lastbtn, 'xly-ui-hidden');
  }
}
