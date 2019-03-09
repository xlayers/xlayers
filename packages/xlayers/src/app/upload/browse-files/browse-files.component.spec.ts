import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { BrowseFilesComponent } from './browse-files.component';

describe('BrowseFilesComponent', () => {
  let component: BrowseFilesComponent;
  let fixture: ComponentFixture<BrowseFilesComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ BrowseFilesComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BrowseFilesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
