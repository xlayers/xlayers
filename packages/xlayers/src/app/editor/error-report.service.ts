import { ErrorHandler, Injectable, Injector } from '@angular/core';
import { Store } from '@ngxs/store';
import { InformUser } from '@app/core/state';

@Injectable()
export class ErrorReportService implements ErrorHandler {
  handleError(error: any): void {
    this.reportError(error);
  }

  private reportError(error: Error) {

    // As the errorhandler is important it needs to be imported first.
    // We use the Injector to get the Store for the user.
    const store = this.injector.get(Store);
    store.dispatch(new InformUser(error.message));
  }

  constructor(private injector: Injector) { }
}
