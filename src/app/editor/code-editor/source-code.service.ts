import { Injectable, Component } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class SourceCodeService {
  static TYPE = {
    MODULE: 1,
    COMPONENT: 2,
    COMPONENT_SPEC: 3
  };

  constructor() {}

  generate(type: number) {
    switch (type) {
      case SourceCodeService.TYPE.MODULE:
        return this.generateModule();
      case SourceCodeService.TYPE.COMPONENT:
        return this.generateComponent();
      case SourceCodeService.TYPE.COMPONENT_SPEC:
        return this.generateComponentSpec();
    }
  }

  generateModule() {
    return `
    import { NgModule } from '@angular/core';
    import { CommonModule } from '@angular/common';
    import { XLayersComponent } from './xlayers.component';

    @NgModule({
      imports: [
        CommonModule,
      ],
      declarations: [XLayersComponent]
    })
    export class XLayersModule { }
    `;
  }
  generateComponent() {
    return `
    import { Component, OnInit } from '@angular/core';

    @Component({
      selector: 'xly-component',
      template: \`
        <span *ngIf="textContent">{{textContent}}</span>
        <sketch-layer
          (selectedLayer)="selectLayer($event)"
          *ngFor="let layer of layer?.layers"
          class="layer"
          [layer]="layer"
          [level]="level + 1"
          [wireframe]="wireframe"
          [ngClass]="{ 'wireframe': wireframe }"
          [attr.data-id]="layer?.do_objectID"
          [attr.data-name]="layer?.name"
          [attr.data-class]="layer?._class"></sketch-layer>
      \`,
      styles: []
    })
    export class XLayersComponent implements OnInit {

      constructor() {}

      ngOnInit() {}
    }
`;
  }
  generateComponentSpec() {
    return `
    import { async, ComponentFixture, TestBed } from '@angular/core/testing';
    import { XLayersComponent } from './xlayers.component';

    describe('XLayersComponent', () => {
      let component: XLayersComponent;
      let fixture: ComponentFixture<XLayersComponent>;

      beforeEach(async(() => {
        TestBed.configureTestingModule({
          declarations: [ XLayersComponent ]
        })
        .compileComponents();
      }));

      beforeEach(() => {
        fixture = TestBed.createComponent(XLayersComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
      });

      it('should create', () => {
        expect(component).toBeTruthy();
      });
    });

    `;
  }
}
