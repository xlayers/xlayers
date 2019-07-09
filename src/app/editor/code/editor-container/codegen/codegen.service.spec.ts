import { HttpClientTestingModule } from '@angular/common/http/testing';
import { inject, TestBed } from '@angular/core/testing';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { UiState } from '@app/core/state';
import { CodeGenState } from '@app/core/state/page.state';
import { NgxsModule } from '@ngxs/store';
import { CodeGenService } from './codegen.service';

describe('CodeGenService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [CodeGenService],
      imports: [
        NgxsModule.forRoot([UiState, CodeGenState]),
        MatSnackBarModule,
        HttpClientTestingModule
      ]
    });
  });

  it('should be created', inject(
    [CodeGenService],
    (service: CodeGenService) => {
      expect(service).toBeTruthy();
    }
  ));
});
