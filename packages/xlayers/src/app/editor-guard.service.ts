import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, CanActivateChild, RouterStateSnapshot } from '@angular/router';
import { UiState } from '@app/core/state';
import { Store } from '@ngxs/store';
import { Observable } from 'rxjs';
import { filter, map, take, tap } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class EditorGuardService implements CanActivateChild, CanActivate {
  constructor(private readonly store: Store) {}

  isValidSession() {
    return this.store.select(UiState.currentPage).pipe(
      filter(page => !!page),
      take(1)
    );
  }

  canActivate(
    _route: ActivatedRouteSnapshot,
    _state: RouterStateSnapshot
  ): Observable<boolean> {
    return this.isValidSession().pipe(
      tap(x => console.log('canActivate', x)),
      map(page => {
        if (page) {
          return true;
        } else {
          // this.store.dispatch(new Navigate(['/upload']));
          return false;
        }
      })
    );
  }

  canActivateChild(
    _route: ActivatedRouteSnapshot,
    _state: RouterStateSnapshot
  ): Observable<boolean> {
    return this.isValidSession().pipe(
      tap(x => console.log('canActivateChild', x)),
      map(page => {
        if (page) {
          return true;
        } else {
          // this.store.dispatch(new Navigate(['/upload']));
          return false;
        }
      })
    );
  }
}
