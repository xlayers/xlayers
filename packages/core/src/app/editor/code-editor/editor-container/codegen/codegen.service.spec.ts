import { TestBed, inject } from '@angular/core/testing';
import { CodeGenService } from './codegen.service';
import { NgxsModule } from '@ngxs/store';
import { UiState } from '~core/src/app/core/state';
import { CodeGenState } from '~core/src/app/core/state/page.state';
import { MatSnackBarModule } from '@angular/material/snack-bar';

describe('CodeGenService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [CodeGenService],
      imports: [NgxsModule.forRoot([UiState, CodeGenState]), MatSnackBarModule]
    });
  });

  it('should be created', inject(
    [CodeGenService],
    (service: CodeGenService) => {
      expect(service).toBeTruthy();
    }
  ));
});
