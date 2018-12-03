import { Injectable } from '@angular/core';
import { CodeGenFacade } from '../codegen.service';
import { NgxEditorModel } from 'ngx-monaco-editor';

@Injectable({
  providedIn: 'root'
})
export class AngularCodeGenService implements CodeGenFacade {
  static TYPE = {
    MODULE: 1,
    COMPONENT: 2,
    COMPONENT_SPEC: 3
  };

  constructor() {}

  generate(): Array<NgxEditorModel> {
    return [{
      uri: 'xlayers.module.ts',
      value: this.generateModule(),
      language: 'typescript'
    }, {
      uri: 'xlayers.component.ts',
      value: this.generateComponent(),
      language: 'typescript'
    }, {
      uri: 'xlayers.component.spec.ts',
      value: this.generateComponentSpec(),
      language: 'typescript'
    }];
  }

  /**
   * @todo make this dynamic
   */
  private generateModule() {
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

  /**
   * @todo make this dynamic
   */
  private generateComponent() {
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

  /**
   * @todo make this dynamic
   */
  private generateComponentSpec() {
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
