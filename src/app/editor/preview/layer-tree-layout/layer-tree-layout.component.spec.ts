import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TreeViewComponent } from './layer-tree-layout.component';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { MatTreeModule } from '@angular/material/tree';
import { NgxsModule } from '@ngxs/store';
import { XStore } from '@app/core/state/state.mock';

describe('TreeViewComponent', () => {
  let component: TreeViewComponent;
  let fixture: ComponentFixture<TreeViewComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      schemas: [NO_ERRORS_SCHEMA],
      imports: [MatTreeModule, NgxsModule.forRoot([XStore])],
      declarations: [ TreeViewComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TreeViewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
