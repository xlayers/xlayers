import { ErrorHandler, Injectable, Injector } from '@angular/core';
import bugsnag from '@bugsnag/js';
import { Store } from '@ngxs/store';
import { BugsnagErrorHandler } from '@bugsnag/plugin-angular';
import { InformUser } from '@app/core/state';
const bugsnagClient = bugsnag('74a971bd894eea48c5d692078e969c39');

@Injectable()
export class ErrorReportService implements ErrorHandler {
  public bugsnagClient: BugsnagErrorHandler;
  handleError(error: any): void {
    try {
      this.bugsnagClient.handleError(error);
    } catch {
      this.reportError(error);
    }
    this.reportError(error);
  }

  private reportError(error: Error) {

    // As the errorhandler is important it needs to be imported first.
    // We use the Injector to get the Store for the user.
    const store = this.injector.get(Store);
    store.dispatch(new InformUser(error.message));
  }

  constructor(private injector: Injector) {
    this.bugsnagClient = new BugsnagErrorHandler(bugsnagClient);
  }
}
