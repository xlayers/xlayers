import { Directive, ElementRef, EventEmitter, HostListener, Injector, OnDestroy, OnInit, Output, Renderer2 } from '@angular/core';
import { SketchLayerComponent } from './sketch-layer.component';

@Directive({
  selector: '[sketchSelectedLayer]'
})
export class SketchSelectedLayerDirective implements OnInit, OnDestroy {
  @Output('selectedLayer') selectedLayer = new EventEmitter<SketchMSLayer>();

  constructor(private element: ElementRef<HTMLElement>, private renderer: Renderer2, private injector: Injector) {}

  ngOnInit() {
    this.renderer.setProperty(this.element.nativeElement, '__angular_injector__', this.injector as Injector);
  }

  @HostListener('click', ['$event'])
  onclick(event: MouseEvent) {
    const path = event.composedPath();
    let element: HTMLElement = null;
    for (let i = 0; i < path.length; i++) {
      element = path[i] as HTMLElement;
      if (element && element.nodeName === this.element.nativeElement.nodeName) {
        this.unselectSelectedLayer();
        this.highlightSelectedLayer(element);
        this.emitLayer(element);
        event.stopPropagation();
        break;
      }
    }
  }

  selectDomNode(layer: SketchMSLayer) {
    let element = null;
    if (layer) {
      element = document.querySelector(`sketch-layer[data-id="${layer.do_objectID}"]`);
    }

    this.unselectSelectedLayer();
    this.highlightSelectedLayer(element);
    this.emitLayer(element as HTMLElement);
  }

  highlightSelectedLayer(element: HTMLElement) {
    if (element) {
      element.classList.add('isCurrentLayer');
    }
  }

  private unselectSelectedLayer() {
    const element = document.querySelector('sketch-layer.isCurrentLayer');
    try {
      element.classList.remove('isCurrentLayer');
    } catch (e) {}
  }

  private emitLayer(element: HTMLElement) {
    try {
      const layerComponent = (element as any).__angular_injector__.get(SketchLayerComponent) as SketchLayerComponent;
      this.selectedLayer.emit(layerComponent.layer);
    } catch (e) {}
  }

  ngOnDestroy() {
    // gc
    this.renderer.setProperty(this.element.nativeElement, '__angular_injector__', null);
  }
}
