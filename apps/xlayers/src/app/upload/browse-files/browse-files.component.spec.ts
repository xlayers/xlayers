import { waitForAsync, ComponentFixture, TestBed } from '@angular/core/testing';

import { BrowseFilesComponent } from './browse-files.component';
import { TranslateModule } from '@ngx-translate/core';

describe('BrowseFilesComponent', () => {
  let component: BrowseFilesComponent;
  let fixture: ComponentFixture<BrowseFilesComponent>;

  beforeEach(
    waitForAsync(() => {
      TestBed.configureTestingModule({
        imports: [TranslateModule.forRoot()],
        declarations: [BrowseFilesComponent],
      }).compileComponents();
    })
  );

  beforeEach(() => {
    fixture = TestBed.createComponent(BrowseFilesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
