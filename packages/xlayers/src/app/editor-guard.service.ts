import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, CanActivateChild, RouterStateSnapshot } from '@angular/router';
import { UiState } from '@app/core/state';
import { Navigate } from '@ngxs/router-plugin';
import { Store } from '@ngxs/store';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class EditorGuardService implements CanActivateChild, CanActivate {
  constructor(private readonly store: Store) { }

  isValidSession() {
    return this.store.selectOnce(UiState.currentPage).pipe(map(page => {
      if (page) {
        return true;
      } else {
        this.store.dispatch(new Navigate(['/upload']));
        return false;
      }
    }));
  }

  canActivate(
    _route: ActivatedRouteSnapshot,
    _state: RouterStateSnapshot
  ): Observable<boolean> {
    return this.isValidSession();
  }

  canActivateChild(
    _route: ActivatedRouteSnapshot,
    _state: RouterStateSnapshot
  ): Observable<boolean> {
    return this.isValidSession();
  }
}
