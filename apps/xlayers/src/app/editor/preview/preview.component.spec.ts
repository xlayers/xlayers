import { NO_ERRORS_SCHEMA } from '@angular/compiler/src/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { MatMenuModule } from '@angular/material/menu';
import { NgxsModule } from '@ngxs/store';
import { PreviewComponent } from './preview.component';
import { TranslateModule } from '@ngx-translate/core';
import { XStore } from '../../core/state/state.mock';

describe('PreviewComponent', () => {
  let component: PreviewComponent;
  let fixture: ComponentFixture<PreviewComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [PreviewComponent],
      imports: [
        MatMenuModule,
        NgxsModule.forRoot([XStore]),
        TranslateModule.forRoot(),
      ],
      schemas: [NO_ERRORS_SCHEMA],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PreviewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
