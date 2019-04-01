import {
  AfterContentInit,
  ContentChild,
  Directive,
  ElementRef,
  HostListener,
  Input,
  SimpleChanges,
  OnChanges
} from '@angular/core';
import { ViewerCanvasComponent } from './canvas/canvas.component';

@Directive({
  selector: '[xly3dRotation]'
})
export class Xly3dRotationDirective implements AfterContentInit, OnChanges {
  // TODO: update this type when https://github.com/Microsoft/TypeScript/issues/15480 gets approved
  readonly REFRESH_RATE: 10 = 10;

  // TODO: update this type when https://github.com/Microsoft/TypeScript/issues/15480 gets approved
  readonly ROTATION_SENSIVITY: 100 = 100;

  // In deg
  readonly ROTATION_MAX_DEG = 65;

  private timestamp = 0;
  private isKeyPressed = false;

  @Input() enabled = false;

  mouseCurrentPosition = {
    x: 0,
    y: 0
  };
  mouseOriginPosition = {
    x: 0,
    y: 0
  };

  @ContentChild(ViewerCanvasComponent, { read: ElementRef }) canvas: ElementRef;

  constructor() {}

  ngAfterContentInit() {
    this.setMouseOrigin(this.canvas.nativeElement);
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes.enabled && changes.enabled.currentValue === false) {
      this.canvas.nativeElement.style.transform = '';
    }
  }

  @HostListener('window:keydown.shift', ['$event'])
  public onMouseDown(_event: KeyboardEvent): void {
    this.isKeyPressed = true;
  }

  @HostListener('window:keyup.shift', ['$event'])
  public onMouseUp(_event: KeyboardEvent): void {
    this.isKeyPressed = false;
  }

  @HostListener('window:mouseenter', ['$event'])
  public onMouseEnter(event: MouseEvent): void {
    this.apply3dRotation();
  }

  @HostListener('window:mousemove', ['$event'])
  public onMouseMove(event: any): void {
    if (this.enabled && this.isKeyPressed && this.shouldUpdate3DRotation()) {
      this.updateMouseCurrentPosition(event);
      this.apply3dRotation();
    }
  }

  @HostListener('window:mouseleave', ['$event'])
  public onMouseLeave(_event: any): void {}

  private apply3dRotation() {
    const { width, height } = this.canvas.nativeElement.getBoundingClientRect();
    this.updateTransformStyle(
      (this.mouseCurrentPosition.x / ((width / 2) | 0)) *
        this.ROTATION_SENSIVITY,
      (this.mouseCurrentPosition.y / ((height / 2) | 0)) *
        this.ROTATION_SENSIVITY
    );
  }

  // make sure to invert x and y params to match the mouse invert axis
  private updateTransformStyle(y: number, x: number) {
    // limit constraints
    x = Math.max(x, -this.ROTATION_MAX_DEG);
    y = Math.max(y, -this.ROTATION_MAX_DEG);
    x = Math.min(x, this.ROTATION_MAX_DEG);
    y = Math.min(y, this.ROTATION_MAX_DEG);

    const style = `translateZ(20px) rotateX(${x}deg) rotateY(${y}deg)`;
    this.canvas.nativeElement.style.transform = style;
  }

  private shouldUpdate3DRotation() {
    return this.timestamp++ % this.REFRESH_RATE === 0;
  }

  private updateMouseCurrentPosition(event: MouseEvent) {
    this.mouseCurrentPosition.x = event.clientX - this.mouseOriginPosition.x;
    this.mouseCurrentPosition.y =
      (event.clientY - this.mouseOriginPosition.y) * -1;
  }

  private setMouseOrigin(element: HTMLElement) {
    const { width, height, left, top } = element.getBoundingClientRect();
    this.mouseOriginPosition.x = left + ((width / 2) | 0);
    this.mouseOriginPosition.y = top + ((height / 2) | 0);
  }
}
