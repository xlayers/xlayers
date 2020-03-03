import { NO_ERRORS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { XStore } from '@app/core/state/state.mock';
import { TranslateModule } from '@ngx-translate/core';
import { NgxsModule } from '@ngxs/store';
import { SettingsHtmlMapperComponent } from './settings-html-mapper.component';

describe('SettingsHtmlMapperComponent', () => {
  let component: SettingsHtmlMapperComponent;
  let fixture: ComponentFixture<SettingsHtmlMapperComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      schemas: [NO_ERRORS_SCHEMA],
      imports: [
        MatAutocompleteModule,
        NgxsModule.forRoot([XStore]),
        TranslateModule.forRoot()
      ],
      declarations: [SettingsHtmlMapperComponent]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SettingsHtmlMapperComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
